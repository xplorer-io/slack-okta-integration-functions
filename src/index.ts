import { HttpFunction } from "@google-cloud/functions-framework";
import { handleSlackEvent } from "handlers/slackHandler";
import dotenv from "dotenv";
dotenv.config({ path: "../.env.local" });

// Main Google Cloud Function entry point
export const slackEventHandler: HttpFunction = async (req, res) => {
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
