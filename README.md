# Slack-Okta User Management

This project is a **Node.js application** that automates user management between **Slack** and **Okta**. It listens to Slack events and synchronizes user accounts in Okta, including:

- **Onboarding users to Okta** when they join Slack.
- **Removing users from Okta** when they are deleted or deactivated in Slack.

The project is deployed as a **Google Cloud Run Function**, triggered via Slack events.

---

## Table of Contents

1. [Features](#features)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Environment Configuration](#environment-configuration)
6. [How It Works](#how-it-works)
7. [Deployment](#deployment)
8. [Usage](#usage)

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


**Workflow**:

1. **Slack Event Trigger**:

   - Slack sends events to a Google Cloud Run Function endpoint.

2. **Event Handling**:

   - For `team_join`, the app onboards users to Okta.
   - For `user_change` (when `user.deleted` is `true`), it removes the user from Okta.

3. **Okta API**:
   - Uses Okta's REST API to create and delete users.

---

## Prerequisites

- Node.js (v16 or later)
- Slack Workspace and Admin Access
- Okta Developer Account with API Token
- Google Cloud Platform Account

---

## Installation

## How It Works

**Event Types Handled:**

1. User Onboarding (`team_join`):

   - Slack sends user details when a user member joins.
   - The app calls the Okta API to create the user.

2. User deletion (`user_change` with `deleted: true`):
   - Slack sends the updated user details.
   - The app matches the user in Okta based on full name and removes them.

## Deployment

**Deploy to Google Cloud Run Functions:**

1. Login to GCP:

```bash
gcloud auth login
```

2. Deploy function:

```bash
pnpm run dev
```

3. Get the Function URL and configure slack's event subscriptions:
   - Add the URL to Slack's "Event Subscriptions" settings in your Slack workspace.

## Usage

1. Slack Events Configuration:
   - Enable Slack's Events API.
   - Add the following event types:
     - `team_join`
     - `user_change`
   - set the request URL to your deployed Google Cloud Run Function.
2. Triggeing Events:
   - Add a user to Slack -> Onboards the users to Okta.
   - Removes a user from Slack -> Deletes the user from Okta.
