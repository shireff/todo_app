import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/lib/types";
import { auth } from "@/lib/api";
import Cookies from "js-cookie";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }) => {
    const response = await auth.login(credentials);
    if (response.access_token) {
      Cookies.set("access_token", response.access_token, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
      });
    }
    return response;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data: {
    email: string;
    password: string;
    name: string;
    linkedinUrl?: string;
  }) => {
    const response = await auth.register(data);
    return response;
  }
);

export const getProfile = createAsyncThunk("auth/getProfile", async () => {
  const token = Cookies.get("access_token");
  if (!token) {
    throw new Error("No token found");
  }
  const response = await auth.getProfile();
  return response;
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    data: { username: string; email: string; linkedinUrl?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await auth.updateProfile(data);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

export const scrapeLinkedInProfile = createAsyncThunk(
  "auth/scrapeLinkedInProfile",
  async (
    { linkedInUrl, userId }: { linkedInUrl: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await auth.scrapeLinkedInProfile(linkedInUrl, userId);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to scrape LinkedIn profile"
      );
    }
  }
);
export const updateProfileImage = createAsyncThunk(
  "auth/updateProfileImage",
  async (file: FormData, { rejectWithValue }) => {
    try {
      const response = await auth.updateProfileImage(file);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update profile image");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      auth.logout();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      });

    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Registration failed";
      });

    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch profile";
        state.isAuthenticated = false;
      });

    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(scrapeLinkedInProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scrapeLinkedInProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(scrapeLinkedInProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.profileImage = action.payload.profileImage;
        }
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
