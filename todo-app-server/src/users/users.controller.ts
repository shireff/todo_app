import {
  Controller,
  Get,
  UseGuards,
  Request,
  NotFoundException,
  Post,
  UploadedFile,
  UseInterceptors,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user._id,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage
    };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user details' })
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.updateUserDetails(
      req.user.userId,
      updateUserDto,
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User profile updated successfully',
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        linkedinUrl: updatedUser.linkedinUrl || '',
      },
    };
  }

  @Post('profile/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload profile image' })
  async uploadProfileImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Request Body:', req.body);
    console.log('Received File:', file);

    if (!file) {
      throw new NotFoundException('No file uploaded');
    }

    const imageUrl = await this.cloudinaryService.uploadImage(file);
    const updatedUser = await this.usersService.updateProfileImage(
      req.user.userId,
      imageUrl,
    );

    if (!updatedUser) {
      throw new NotFoundException('Failed to update profile image');
    }

    return {
      message: 'Profile image updated successfully',
      profileImage: updatedUser.profileImage,
    };
  }

  @Post('linkedin/scrape/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Scrape LinkedIn profile and update user details' })
  async scrapeLinkedInAndUpdateProfile(
    @Param('userId') userId: string,
    @Body('linkedInUrl') linkedInUrl: string,
  ) {
    if (!linkedInUrl) {
      throw new NotFoundException('LinkedIn URL is required');
    }

    const result = await this.usersService.scrapeLinkedInAndUpdateProfile(
      linkedInUrl,
      userId,
    );

    if (!result) {
      throw new NotFoundException(
        'Failed to update user profile from LinkedIn',
      );
    }

    if (!result) {
      throw new NotFoundException(
        'Failed to update user profile from LinkedIn',
      );
    }

    return {
      message: 'User profile updated with LinkedIn information successfully',
      user: {
        _id: result._id,
        username: result.username,
        email: result.email,
        linkedInName: result.linkedInName,
        linkedInProfileUrl: result.linkedInProfileUrl,
        linkedInProfileImage: result.linkedInProfileImage,
      },
    };
  }
}
