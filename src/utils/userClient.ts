// src/utils/userClient.ts (Auth Service)
import axios from "axios";

export const registerNewUser = async (nickname: string, email: string) => {
  try {
    console.log("Calling User Service at:", `${process.env.USER_SERVICE_URL}/register`);

    const response = await axios.post(`${process.env.USER_SERVICE_URL}/register`, {
      nickname,
      email,
    });
    console.log("User Service response:", response.data);
    return response.data;
  } catch (error) {
    throw new Error("User service fetch failed");
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const response = await axios.get(`${process.env.USER_SERVICE_URL}/email/${email}`);
    return response.data;
  } catch (error) {
    throw new Error("User service fetch failed");
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await axios.get(`${process.env.USER_SERVICE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error("User service fetch failed");
  }
};
