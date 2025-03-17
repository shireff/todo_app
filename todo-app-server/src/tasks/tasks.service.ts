import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async createTask(task: Partial<Task>, userId: string): Promise<Task> {
    console.log('Received task:', task);
    console.log('Received userId:', userId);

    if (!task || typeof task !== 'object') {
      throw new Error('Invalid task data received');
    }

    if (!task.status) {
      task.status = TaskStatus.PENDING;
    }

    const newTask = new this.taskModel({
      ...task,
      userId,
      status: task.status || TaskStatus.PENDING,
    });
    return newTask.save();
  }

  async getTasks(userId: string): Promise<{ message?: string; data: Task[] }> {
    const tasks = await this.taskModel.find({ userId }).exec();

    if (tasks.length === 0) {
      return {
        message: 'No tasks found. Create one to get started!',
        data: [],
      };
    }

    return { data: tasks };
  }

  async getTaskById(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: id, userId }).exec();
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  async updateTask(
    id: string,
    taskData: Partial<Task>,
    userId: string,
  ): Promise<Task> {
    if (
      taskData.status &&
      !Object.values(TaskStatus).includes(taskData.status)
    ) {
      throw new Error(`Invalid status: ${taskData.status}`);
    }
    const updatedTask = await this.taskModel
      .findOneAndUpdate({ _id: id, userId }, taskData, { new: true })
      .exec();
    if (!updatedTask) {
      throw new NotFoundException(
        `Task with id ${id} not found or unauthorized`,
      );
    }
    return updatedTask;
  }

  async deleteTask(id: string, userId: string): Promise<{ message: string }> {
    const deletedTask = await this.taskModel
      .findOneAndDelete({ _id: id, userId })
      .exec();
    if (!deletedTask) {
      throw new NotFoundException(
        `Task with id ${id} not found or unauthorized`,
      );
    }
    return { message: 'Task deleted successfully' };
  }
}
