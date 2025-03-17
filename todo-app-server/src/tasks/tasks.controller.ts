import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './schemas/task.schema';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard) 
@ApiBearerAuth()
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  async createTask(@Body() body: Task, @Request() req) {
    return this.tasksService.createTask(body, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for the authenticated user' })
  async getTasks(@Request() req) {
    return this.tasksService.getTasks(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task (user-specific)' })
  async getTaskById(@Param('id') id: string, @Request() req) {
    return this.tasksService.getTaskById(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task (user-specific)' })
  async updateTask(@Param('id') id: string, @Body() body: Partial<Task>, @Request() req) {
    return this.tasksService.updateTask(id, body, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task (user-specific)' })
  async deleteTask(@Param('id') id: string, @Request() req) {
    return this.tasksService.deleteTask(id, req.user.userId);
  }
}