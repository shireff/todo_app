import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: string,
  ): Promise<Category> {
    const newCategory = new this.categoryModel({
      ...createCategoryDto,
      userId,
    });
    return newCategory.save();
  }

  async findAll(
    userId: string,
  ): Promise<{ message?: string; data: Category[] }> {
    const categories = await this.categoryModel.find({ userId }).exec();
    if (categories.length === 0) {
      return {
        message: 'No categories found. Create one to get started!',
        data: [],
      };
    }

    return { data: categories };
  }

  async findOne(id: string, userId: string): Promise<Category> {
    const category = await this.categoryModel
      .findOne({ _id: id, userId })
      .exec();
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findOneAndUpdate({ _id: id, userId }, updateCategoryDto, { new: true })
      .exec();
    if (!updatedCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return updatedCategory;
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const deletedCategory = await this.categoryModel
      .findOneAndDelete({ _id: id, userId })
      .exec();

    if (!deletedCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return { message: 'Category deleted successfully' };
  }
}
