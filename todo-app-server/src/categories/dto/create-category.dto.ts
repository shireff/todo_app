import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Work' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Tasks related to my job', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
