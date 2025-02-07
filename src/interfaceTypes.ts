export interface Slackuser {
  id: string;
  deleted: boolean;
  is_bot: boolean;
  profile: {
    email: string;
    first_name: string;
    last_name: string;
    image_original: string;
  };
}

export interface OktaUser {
  id: string;
  status: string;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface SlackEvent {
  type: string;
  token: string;
  team_id: string;
  api_app_id: string;
  event: {
    type: string;
    event_ts: string;
    user: string;
  };
}
