import axios from "axios";
export const loginService = async (email, password) => {
  console.log("HIT => loginService")
  return await axios.post("/api/auth/login", { email, password });
};
