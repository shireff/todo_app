import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    const createUserDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    };

    const hashedPassword = 'hashedPassword';
    const createdUser = {
      _id: 'userId',
      email: 'test@example.com',
      username: 'testuser',
      password: hashedPassword,
    };

    beforeEach(() => {
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUsersService.create.mockResolvedValue(createdUser);
    });

    it('should register a new user successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.findByUsername.mockResolvedValue(null);

      const result = await authService.register(createUserDto);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith(createUserDto.username);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockUsersService.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(result).toEqual({
        id: createdUser._id,
        email: createdUser.email,
        username: createdUser.username,
      });
    });

    it('should throw ConflictException if email is already registered', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ email: createUserDto.email });
      mockUsersService.findByUsername.mockResolvedValue(null);

      await expect(authService.register(createUserDto)).rejects.toThrow(
        new ConflictException('Email is already registered'),
      );
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if username is already taken', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.findByUsername.mockResolvedValue({ username: createUserDto.username });

      await expect(authService.register(createUserDto)).rejects.toThrow(
        new ConflictException('Username is already taken'),
      );
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const user = {
      _id: 'userId',
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashedPassword',
    };

    const token = 'jwt-token';

    beforeEach(() => {
      mockJwtService.sign.mockReturnValue(token);
    });

    it('should login successfully and return access token', async () => {
      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(loginDto);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, user.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: user._id, email: user.email });
      expect(result).toEqual({
        access_token: token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, user.password);
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });
});
