# Slack-Okta-Integration

### Purpose

This automation script is to sync our users between two platforms (i.e. Slack and Okta) by consuming thier REST API.

### Scenario

When someone new joins our slack channel we would like them to be also added into Okta to get access to our hashicorp vault and other platforms.

## Testing locally

### Prerequisite

To perform test on individual services files to see what response we expect from the API. You can run the following command

1. ` pnpm install`
2. For requesting users from Slack

```
pnpm run fetchSlackUsers
```

3. For requesting users from Okta

```
pnpm run fetchOktaUsers
```

> Since `ts-node` is giving out too much of issue [1](https://stackoverflow.com/questions/62096269/unknown-file-extension-ts-for-a-typescript-file), [2](https://github.com/TypeStrong/ts-node/issues/2100) while trying to run it, we will be using tsx.

## Okta API

We need to consume 3 API's from okta to achieve our goals.

1. List all users
   https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/listUsers

2. Create a user
   https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/createUser

3. Delete a user
   https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/deleteUser

## Slack API

Consume API [users.list](https://api.slack.com/methods/users.list)

- Since slack does not provide with only active users list, we have to filter out the result (bot users, deactived/deleted users)
