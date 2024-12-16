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
    const slackFullName = event.user.profile.real_name.toLowerCase();
    console.log(`User left the Slack group: ${slackFullName}`);

    try {
      // fetch all okta users
      const oktaUsers: OktaUser[] = await fetchOktaUsers();

      // Find corresponding Okta user
      const matchedUser = oktaUsers.find((oktaUser) => {
        const oktaFullName =
          `${oktaUser.profile.firstName} ${oktaUser.profile.lastName}`.trim();
        return oktaFullName.toLowerCase() === slackFullName;
      });

      if (matchedUser) {
        console.log(
          `Matched Slack user ${slackFullName} with okta user ID: ${matchedUser.id}`
        );

        await removeFromOkta(matchedUser.id);
      } else {
        console.error(
          `No matching okta user found for slack user : ${slackFullName}`
        );
      }
    } catch (error: any) {
      console.error(
        `Error while processing user_change event for slack User ${slackFullName} :`,
        error.message
      );
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
