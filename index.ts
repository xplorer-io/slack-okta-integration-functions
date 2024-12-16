import { HttpFunction } from "@google-cloud/functions-framework";
import { onboardToOkta, removeFromOkta, fetchOktaUsers } from "./oktaService";
import { fetchActiveSlackUsers } from "./slackService";
import { OktaUser, Slackuser } from "./types";
import dotenv from "dotenv";
dotenv.config({ path: "./env.local" });

// logic for handling slack events
const handleSlackEvent = async (event: any) => {
  if (event?.type === "team_join") {
    // New user joined Slack
    const userEmail = event.user.profile.email;
    const firstName = event.user.profile.first_name;
    const lastName = event.user.profile.last_name;

    console.log(`New user joined: ${userEmail}`);
    console.log(`New user first name: ${firstName}`);
    console.log(`New user last name: ${lastName}`);
    await onboardToOkta(userEmail, firstName, lastName);
  } else if (event?.type === "user_change" && event.user.deleted) {
    // User removed from Slack group
    const userEmail = event.user.profile.email;

    console.log(`User left the Slack group: ${userEmail}`);
    const activeSlackUsers: Slackuser[] = await fetchActiveSlackUsers();
    const oktaUsers: OktaUser[] = await fetchOktaUsers();

    // Find corresponding Okta user
    const oktaUser = oktaUsers.find(
      (oktaUser) => oktaUser.profile.email === userEmail
    );

    if (oktaUser) {
      await removeFromOkta(oktaUser.id);
    } else {
      console.error(`Okta user not found for email: ${userEmail}`);
    }
  }
};

// Main Google Cloud Function entry point
export const slackEventHandler: HttpFunction = async (req, res) => {
  console.log("Received slack event: ", JSON.stringify(req.body, null, 2));
  try {
    // Handle URL verification
    if (req.body.type === "url_verification") {
      return res.status(200).send({ challenge: req.body.challenge });
    }

    // Handle Slack events
    await handleSlackEvent(req.body.event);

    res.status(200).send("Event processed successfully");
  } catch (error) {
    console.error("Error processing event:", error);
    res.status(500).send("Internal Server Error");
  }
};
