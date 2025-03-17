export interface User {
  id: string;
  email: string;
  username: string;
  linkedinUrl?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  categoryId: string;
  userId: string;
  status?: string;
  reminder?: string;
  createdAt: string;
  updatedAt: string;
}
export interface TaskDTO {
  _id: string;
  title: string;
  description: string;
  status?: string;
  dueDate: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
