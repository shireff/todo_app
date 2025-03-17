import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';
import { TasksService } from './tasks.service';

const mockTask = {
  _id: 'some-test-id',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.PENDING,
  userId: 'user-123',
  save: jest.fn().mockResolvedValue(this),
};

const mockTaskModel = {
  new: jest.fn().mockResolvedValue(mockTask),
  constructor: jest.fn().mockResolvedValue(mockTask),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  exec: jest.fn(),
};

describe('TasksService', () => {
  let service: TasksService;
  let model: Model<TaskDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    model = module.get<Model<TaskDocument>>(getModelToken(Task.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTasks', () => {
    it('should return tasks when found', async () => {
      const userId = 'user-123';
      const tasks = [mockTask];

      mockTaskModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(tasks),
      });

      const result = await service.getTasks(userId);

      expect(mockTaskModel.find).toHaveBeenCalledWith({ userId });
      expect(result).toEqual({ data: tasks });
    });

    it('should return empty array with message when no tasks found', async () => {
      const userId = 'user-123';

      mockTaskModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([]),
      });

      const result = await service.getTasks(userId);

      expect(mockTaskModel.find).toHaveBeenCalledWith({ userId });
      expect(result).toEqual({
        message: 'No tasks found. Create one to get started!',
        data: [],
      });
    });
  });

  describe('getTaskById', () => {
    it('should return a task when found', async () => {
      const taskId = 'task-123';
      const userId = 'user-123';

      mockTaskModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockTask),
      });

      const result = await service.getTaskById(taskId, userId);

      expect(mockTaskModel.findOne).toHaveBeenCalledWith({
        _id: taskId,
        userId,
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      const taskId = 'nonexistent-task';
      const userId = 'user-123';

      mockTaskModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.getTaskById(taskId, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockTaskModel.findOne).toHaveBeenCalledWith({
        _id: taskId,
        userId,
      });
    });
  });

  describe('updateTask', () => {
    it('should update and return the task when found', async () => {
      const taskId = 'task-123';
      const userId = 'user-123';
      const updateData = {
        title: 'Updated Title',
        status: TaskStatus.COMPLETED,
      };
      const updatedTask = { ...mockTask, ...updateData };

      mockTaskModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(updatedTask),
      });

      const result = await service.updateTask(taskId, updateData, userId);

      expect(mockTaskModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: taskId, userId },
        updateData,
        { new: true },
      );
      expect(result).toEqual(updatedTask);
    });

    it('should throw NotFoundException when task not found for update', async () => {
      const taskId = 'nonexistent-task';
      const userId = 'user-123';
      const updateData = { title: 'Updated Title' };

      mockTaskModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(
        service.updateTask(taskId, updateData, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw error when invalid status is provided', async () => {
      const taskId = 'task-123';
      const userId = 'user-123';
      const updateData = { status: 'INVALID_STATUS' as TaskStatus };

      await expect(
        service.updateTask(taskId, updateData, userId),
      ).rejects.toThrow(`Invalid status: ${updateData.status}`);
    });
  });

  describe('deleteTask', () => {
    it('should delete and return success message when task found', async () => {
      const taskId = 'task-123';
      const userId = 'user-123';

      mockTaskModel.findOneAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockTask),
      });

      const result = await service.deleteTask(taskId, userId);

      expect(mockTaskModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: taskId,
        userId,
      });
      expect(result).toEqual({ message: 'Task deleted successfully' });
    });

    it('should throw NotFoundException when task not found for deletion', async () => {
      const taskId = 'nonexistent-task';
      const userId = 'user-123';

      mockTaskModel.findOneAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.deleteTask(taskId, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockTaskModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: taskId,
        userId,
      });
    });
  });
});
