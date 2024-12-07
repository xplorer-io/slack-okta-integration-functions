import axios from "axios";
import { OktaUser } from "./types";

// Axios instance for Okta API
const oktaApi = axios.create({
  baseURL: `https://${process.env.OKTA_DOMAIN}/api/v1`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `SSWS ${process.env.OKTA_TOKEN}`,
  },
});

// List users from Okta
export const fetchOktaUsers = async (): Promise<OktaUser[]> => {
  try {
    const response = await oktaApi.get("/users");

    return response.data as OktaUser[];
  } catch (error: any) {
    console.error(
      `Error fetching Okta users: ${
        error.response?.statusText || error.message
      }`
    );
    throw new Error("Failed to fetch Okta users");
  }
};

// Create user in Okta
export const onboardToOkta = async (
  email: string,
  firstName: string,
  lastName: string
): Promise<void> => {
  try {
    const response = await oktaApi.post(
      "/users",
      {
        profile: {
          firstName,
          lastName,
          email,
          login: email,
        },
      },
      {
        params: {
          activate: "true",
          provider: "false",
          nextLogin: "changePassword",
        },
      }
    );

    console.log(
      `Onboarded user: ${firstName} ${lastName} , email :  (${email})`
    );
  } catch (error: any) {
    console.error(
      `Error onboarding user ${email}: ${
        error.response?.statusText || error.message
      }`
    );
    throw new Error(`Failed to onboard user ${email}`);
  }
};

// Delete user from Okta
export const removeFromOkta = async (userId: string): Promise<void> => {
  try {
    await oktaApi.delete(`/users/${userId}`);
    console.log(`Removed user with ID: ${userId}`);
  } catch (error: any) {
    console.error(
      `Error removing user with ID ${userId}: ${
        error.response?.statusText || error.message
      }`
    );
    throw new Error(`Failed to remove user with ID ${userId}`);
  }
};
