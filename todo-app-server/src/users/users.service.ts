import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import puppeteer from 'puppeteer';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async updateUserDetails(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .exec();
  }

  async updateProfileImage(
    userId: string,
    imageUrl: string,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { profileImage: imageUrl }, { new: true })
      .exec();
  }

  async scrapeLinkedInAndUpdateProfile(linkedInUrl: string, userId: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(linkedInUrl, { waitUntil: 'load' });

      // Check if we hit an authentication wall
      if (page.url().includes('authwall')) {
        await browser.close();
        // Return a normal User object instead of throwing an error
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
          throw new Error('User not found');
        }
        // Add a note to the user object that LinkedIn scraping was blocked
        user.linkedInName = 'Authentication required';
        user.linkedInProfileUrl = linkedInUrl;
        user.linkedInProfileImage = '';

        await user.save();

        return user;
      }

      await page.waitForSelector('h1');

      const profileData = await page.evaluate(() => {
        const name = document.querySelector('h1')?.innerText ?? 'N/A';
        const profileImage =
          document
            .querySelector('img.pv-top-card-profile-picture__image')
            ?.getAttribute('src') ?? '';
        const profileUrl = window.location.href;

        return { name, profileImage, profileUrl };
      });

      await browser.close();

      // Update user profile in the database
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            linkedInName: profileData.name,
            linkedInProfileUrl: profileData.profileUrl,
            linkedInProfileImage: profileData.profileImage,
          },
          { new: true },
        )
        .exec();

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    } catch (error) {
      await browser.close();
      throw new ConflictException(
        'Error scraping LinkedIn profile: ' + error.message,
      );
    }
  }
}
