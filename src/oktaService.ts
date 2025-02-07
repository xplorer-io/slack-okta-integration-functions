import axios from "axios";
import type { OktaUser } from "./interfaceTypes";

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
    const response = await oktaApi.post("/users", {
      profile: {
        firstName,
        lastName,
        email,
        login: email,
      },
    });

    // response from okta
    console.log("Response from Okta: ", JSON.stringify(response.data, null, 2));

    console.log(
      `Onboarded user to Okta: ${firstName} ${lastName} , email :  (${email})`
    );
  } catch (error: any) {
    console.error(
      `Error onboarding user ${email}: ${
        error.response?.statusText || error.message
      }`
    );

    // log full error detials
    if (error.response?.data) {
      console.error(
        "Error Response data : ",
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error("No response data. Full Error: ", error);
    }
    throw new Error(`Failed to onboard user ${email} to Okta`);
  }
};

//Deactivate from Okta
export const deactivateOktaUser = async (oktaUser: OktaUser): Promise<void> => {
  try {
    await oktaApi.post(`/users/${oktaUser.id}/lifecycle/deactivate`);
    console.log(
      `Successfully deactivated User: ${oktaUser.profile.firstName} ${oktaUser.profile.lastName} , id: ${oktaUser.id}`
    );
  } catch (error: any) {
    console.error(
      `Error deactivating user ${oktaUser.id} : ${
        error.response?.statusText || error.message
      }`
    );
    throw new Error(
      `Failed to deactivate user ${oktaUser.profile.firstName} ${oktaUser.profile.lastName} , id: ${oktaUser.id}`
    );
  }
};

// Delete user from Okta
export const removeFromOkta = async (oktaUser: OktaUser): Promise<void> => {
  try {
    await deactivateOktaUser(oktaUser);
    const response = await oktaApi.delete(`/users/${oktaUser.id}`);
    console.log(
      `Response from Okta for deleting user: ${oktaUser.profile.firstName} ${oktaUser.profile.lastName}, id: ${oktaUser.id} : Status code: ${response.status}`
    );
    console.log(
      `Removed Okta user: ${oktaUser.profile.firstName} ${oktaUser.profile.lastName}, with Id: ${oktaUser.id}`
    );
  } catch (error: any) {
    console.error(
      `Error removing user with ${oktaUser.profile.firstName} ${
        oktaUser.profile.lastName
      } ,ID: ${oktaUser.id}: ${error.response?.statusText || error.message}`
    );

    //Log full error details
    if (error.response?.data) {
      console.error(
        "Error Response data: ",
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error("No response data. Full Error:", error);
    }
    throw new Error(
      `Failed to remove user with ${oktaUser.profile.firstName} ${oktaUser.profile.lastName} ,ID: ${oktaUser.id}`
    );
  }
};
