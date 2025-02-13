// not being used right now
import { WebClient } from "@slack/web-api";
import type { Slackuser } from "./interfaceTypes";

// initialize slack client
const slackClient = new WebClient(process.env.SLACK_YASH_TOKEN);

export const fetchActiveSlackUsers = async (): Promise<Slackuser[]> => {
  //get all slack users
  const result = await slackClient.users.list({});
  const activeSlackUsers = result.members?.filter(
    (user) => !user.deleted && !user.is_bot && user.profile?.email
  ) as Slackuser[];
  return activeSlackUsers;
};
