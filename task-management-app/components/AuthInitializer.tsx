import { getProfile } from "@/lib/store/slices/authSlice";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

function AuthInitializer() {
  const dispatch = useDispatch();

  const initializeAuth = useCallback(() => {
    const token = Cookies.get("access_token");
    if (token) {
      dispatch(getProfile() as any);
    }
  }, [dispatch]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return null;
}

export default AuthInitializer;
