import {
  onboardToOkta,
  removeFromOkta,
  fetchOktaUsers,
} from "../services/oktaService";
import { fetchActiveSlackUsers } from "../services/slackService";
import { OktaUser, Slackuser } from "../types";

export const handleSlackEvent = async (event: any) => {
  if (event?.type === "team_join") {
    // New user joined Slack
    const userEmail = event.user.profile.email;
    const firstName = event.user.profile.first_name;
    const lastName = event.user.profile.last_name;

    console.log(`New user joined: ${userEmail}`);
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
