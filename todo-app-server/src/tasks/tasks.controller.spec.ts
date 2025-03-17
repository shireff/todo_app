import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './schemas/task.schema';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    createTask: jest.fn(),
    getTasks: jest.fn(),
    getTaskById: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  const mockTask: Task = {
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      dueDate: new Date(),
      status: TaskStatus.PENDING,
      userId: ''
  };

  const mockUserId = 'user123';
  const mockTaskId = 'task123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task for the authenticated user', async () => {
      mockTasksService.createTask.mockResolvedValue(mockTask);
      
      const req = { user: { userId: mockUserId } };
      const result = await controller.createTask(mockTask, req);
      
      expect(service.createTask).toHaveBeenCalledWith(mockTask, mockUserId);
      expect(result).toEqual(mockTask);
    });
    
    it('should pass the correct user ID from the request', async () => {
      const customUserId = 'custom123';
      const req = { user: { userId: customUserId } };
      
      await controller.createTask(mockTask, req);
      
      expect(service.createTask).toHaveBeenCalledWith(mockTask, customUserId);
    });
  });

  describe('getTasks', () => {
    it('should return all tasks for the authenticated user', async () => {
      const mockTasks = [mockTask, mockTask];
      mockTasksService.getTasks.mockResolvedValue(mockTasks);
      
      const req = { user: { userId: mockUserId } };
      const result = await controller.getTasks(req);
      
      expect(service.getTasks).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockTasks);
    });
    
    it('should handle empty task list', async () => {
      mockTasksService.getTasks.mockResolvedValue([]);
      
      const req = { user: { userId: mockUserId } };
      const result = await controller.getTasks(req);
      
      expect(service.getTasks).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual([]);
    });
  });

  describe('getTaskById', () => {
    it('should return a specific task by ID for the authenticated user', async () => {
      mockTasksService.getTaskById.mockResolvedValue(mockTask);
      
      const req = { user: { userId: mockUserId } };
      const result = await controller.getTaskById(mockTaskId, req);
      
      expect(service.getTaskById).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should update a task for the authenticated user', async () => {
      const updateData: Partial<Task> = { 
        title: 'Updated Title',
        completed: true
      };
      
      const updatedTask = { ...mockTask, ...updateData };
      mockTasksService.updateTask.mockResolvedValue(updatedTask);
      
      const req = { user: { userId: mockUserId } };
      const result = await controller.updateTask(mockTaskId, updateData, req);
      
      expect(service.updateTask).toHaveBeenCalledWith(mockTaskId, updateData, mockUserId);
      expect(result).toEqual(updatedTask);
    });
    
    it('should handle partial updates', async () => {
      const partialUpdate: Partial<Task> = { completed: true };
      const updatedTask = { ...mockTask, ...partialUpdate };
      
      mockTasksService.updateTask.mockResolvedValue(updatedTask);
      
      const req = { user: { userId: mockUserId } };
      const result = await controller.updateTask(mockTaskId, partialUpdate, req);
      
      expect(service.updateTask).toHaveBeenCalledWith(mockTaskId, partialUpdate, mockUserId);
      expect(result).toEqual(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task for the authenticated user', async () => {
      const deleteResult = { deleted: true, id: mockTaskId };
      mockTasksService.deleteTask.mockResolvedValue(deleteResult);
      
      const req = { user: { userId: mockUserId } };
      const result = await controller.deleteTask(mockTaskId, req);
      
      expect(service.deleteTask).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(result).toEqual(deleteResult);
    });
  });
});
