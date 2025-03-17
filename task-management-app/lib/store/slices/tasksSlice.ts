import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, TaskDTO } from "@/lib/types";
import { tasks } from "@/lib/api";
interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await tasks.getAll();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: Omit<TaskDTO, "_id">, { rejectWithValue }) => {
    try {
      const data = await tasks.create(taskData);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    { id, updates }: { id: string; updates: Partial<Task> },
    { rejectWithValue }
  ) => {
    try {
      const data = await tasks.update(id, updates);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string, { rejectWithValue }) => {
    try {
      await tasks.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        if (Array.isArray(state.tasks)) {
          state.tasks.push(action.payload);
        } else {
          state.tasks = [action.payload];
        }
      })

      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        console.log("🔄 Updating task:", action.payload);

        if (!Array.isArray(state.tasks)) {
          console.error(
            "❌ state.tasks was not an array, resetting to empty array."
          );
          state.tasks = [];
        }

        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        } else {
          console.warn("⚠️ Task not found in state, adding it.");
          state.tasks.push(action.payload);
        }

      })

      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        if (!Array.isArray(state.tasks)) {
          state.tasks = [];
        }
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
