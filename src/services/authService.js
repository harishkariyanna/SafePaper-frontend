import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (credentials, role) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      credentials,
      role,
    });
    return {
      token: response.data.token,
      user: {
        role: credentials.role,
        ...response.data.user,
      },
    };
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
