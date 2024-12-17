# Slack-Okta User Management

This project is a **Node.js app** that automates user management between **Slack** and **Okta**. It listens to Slack events and synchronizes user accounts in Okta, including:

- **Onboarding users to Okta** when they join Slack.
- **Removing users from Okta** when they are deleted or deactivated in Slack.

The project is deployed as a **Google Cloud Run Function**, triggered via Slack events.

---

## Features

- **Slack Event Handling**:

  - Detects when a new user joins a Slack workspace (`team_join` event).
  - Detects user profile updates and deletions (`user_change` event).

- **Okta Integration**:

  - Onboards users into Okta with their **email, first name, and last name**.
  - Removes users from Okta when they are deleted from Slack.

- **Robust Error Handling**:
  - Logs Slack event details.
  - Logs responses and errors from Okta API calls.

---

## Architecture Overview

The application listens to Slack events via the Slack Events API, processes them, and performs corresponding operations in Okta using Okta's API.

![Okta User Provisioning Diagram](https://github.com/user-attachments/assets/bdae8ac1-e264-4160-af7b-14c820b90191)

---

## Prerequisites

- Node.js (v16 or later)
- Slack Workspace and Admin Access
- Okta Developer Account with API Token
- Google Cloud Platform Account

---
