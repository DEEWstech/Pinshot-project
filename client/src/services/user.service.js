import { connect, authHeader } from "@config";

const login = async (userName, password) => {
  return await connect.post("/auth/login", { userName, password });
};
const signup = async (userName, email, password) => {
  return await connect.post("/auth/signup", { userName, email, password });
};

const authUser = async () => {
  return connect.get("/auth", { headers: authHeader() });
};

const logout = () => {
  localStorage.removeItem("userToken");
  window.location.reload();
};

export default {
  login,
  signup,
  authUser,
  logout,
};
