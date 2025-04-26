"use client";
import axios from "axios";

let token;

if (typeof window !== "undefined") {
  token = localStorage.getItem("auth_token");
}

const headers = {
  Auth: `Bearer ${token}`,
};

export const LogIn = async (data: { email: string; password: string }) => {
  try {
    const response = await axios({
      method: "POST",
      url: "/login",
      data,
    });

    return response;
  } catch (err) {
    return err;
  }
};

export const createTask = async (data: {
  title: string;
  description: string;
}) => {
  try {
    const response = await axios({
      method: "POST",
      url: "/api/tasks",
      data,
      headers,
    });

    return response?.data;
  } catch (err) {
    return err;
  }
};

export const fetchTasks = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: "/api/tasks",
      headers,
    });

    return response?.data;
  } catch (err) {
    return err;
  }
};

export const removeTask = async (id: number) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: `/api/tasks/${id}`,
      headers,
    });

    return response?.data;
  } catch (err) {
    return err;
  }
};

export const editTask = async (data: any) => {
  try {
    const response = await axios({
      method: "PUT",
      url: `/api/tasks`,
      data,
      headers,
    });

    return response?.data;
  } catch (err) {
    return err;
  }
};
