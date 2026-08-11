import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE } from "../../../../api/client.js";

export const fetchUserProfileDataThunk = createAsyncThunk(
  "fetchUserProfileData",
  async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("access token require");
      }
      const userProfileDataApi = `${API_BASE}/api/user/getUserProfileData`;
      const response = await axios.get(userProfileDataApi, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.msg ||
          error.message ||
          "Unable to fetch the user data"
      );
    }
  }
);
