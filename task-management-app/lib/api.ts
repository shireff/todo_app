import axios from "axios";
import Cookies from "js-cookie";
import { ApiEndpoints } from "./apiEndpoints";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: async (data: {
    email: string;
    password: string;
    name: string;
    linkedinUrl?: string;
  }) => {
    const response = await api.post(ApiEndpoints.AUTH_REGISTER, data);
    Cookies.set("access_token", response.data.token, { expires: 7 });
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post(ApiEndpoints.AUTH_LOGIN, data);
    Cookies.set("access_token", response.data.token, { expires: 7 });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get(ApiEndpoints.USER_PROFILE);
    return response.data;
  },
  updateProfile: async (data: {
    username: string;
    email: string;
    linkedinUrl?: string;
  }) => {
    const response = await api.patch(ApiEndpoints.USER_PROFILE_UPDATE, {
      username: data.username,
      email: data.email,
    });
    return response.data;
  },
  updateProfileImage: async (file: FormData) => {
    const response = await api.post(ApiEndpoints.USER_PROFILE_UPLOAD, file, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  scrapeLinkedInProfile: async (linkedInUrl: string, userId: string) => {
    const response = await api.post(
      `${ApiEndpoints.USER_LINKEDIN_SCRAPE}/${userId}`,
      {
        linkedInUrl,
      }
    );
    return response.data;
  },
  logout: () => {
    Cookies.remove("access_token");
  },
};

export const categories = {
  getAll: async () => {
    const response = await api.get(ApiEndpoints.CATEGORIES);
    return response.data;
  },
  create: async (data: { name: string; description: string }) => {
    const response = await api.post(ApiEndpoints.CATEGORY_CREATE, data);
    return response.data;
  },
  update: async (
    id: string,
    categoryData: { name: string; description: string }
  ) => {
    const response = await api.patch(
      `${ApiEndpoints.CATEGORY_UPDATE}${id}`,
      categoryData
    );
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`${ApiEndpoints.CATEGORY_DELETE}${id}`);
    return response.data;
  },
};

export const tasks = {
  getAll: async () => {
    const response = await api.get(ApiEndpoints.TASKS);
    return response.data;
  },
  create: async (data: {
    title: string;
    description: string;
    reminder?: string;
  }) => {
    const response = await api.post(ApiEndpoints.TASK_CREATE, data);
    return response.data;
  },
  update: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      dueDate?: string;
      categoryId?: string;
      reminder?: string;
      assignedToId?: string;
    }
  ) => {
    const response = await api.patch(`${ApiEndpoints.TASK_UPDATE}${id}`, data);
    return response.data;
  },
  updateStatus: async (id: string, completed: boolean) => {
    const response = await api.patch(
      `${ApiEndpoints.TASK_UPDATE_STATUS}${id}/status`,
      { completed }
    );
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`${ApiEndpoints.TASK_DELETE}${id}`);
    return response.data;
  },
};

export default api;
