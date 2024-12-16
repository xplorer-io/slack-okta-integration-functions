"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slackEventHandler = void 0;
const oktaService_1 = require("./oktaService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./env.local" });
// logic for handling slack events
const handleSlackEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if ((event === null || event === void 0 ? void 0 : event.type) === "team_join") {
        // New user joined Slack
        const userEmail = event.user.profile.email;
        const firstName = event.user.profile.first_name;
        const lastName = event.user.profile.last_name;
        console.log(`New user joined: ${userEmail}`);
        console.log(`New user first name: ${firstName}`);
        console.log(`New user last name: ${lastName}`);
        yield (0, oktaService_1.onboardToOkta)(userEmail, firstName, lastName);
    }
    else if ((event === null || event === void 0 ? void 0 : event.type) === "user_change" && event.user.deleted) {
        // User removed from Slack group
        const slackFullName = event.user.profile.real_name.toLowerCase();
        console.log(`User left the Slack group: ${slackFullName}`);
        try {
            // fetch all okta users
            const oktaUsers = yield (0, oktaService_1.fetchOktaUsers)();
            // Find corresponding Okta user
            const matchedUser = oktaUsers.find((oktaUser) => {
                const oktaFullName = `${oktaUser.profile.firstName} ${oktaUser.profile.lastName}`.trim();
                return oktaFullName.toLowerCase() === slackFullName;
            });
            if (matchedUser) {
                console.log(`Matched Slack user ${slackFullName} with okta user ID: ${matchedUser.id}`);
                yield (0, oktaService_1.removeFromOkta)(matchedUser.id);
            }
            else {
                console.error(`No matching okta user found for slack user : ${slackFullName}`);
            }
        }
        catch (error) {
            console.error(`Error while processing user_change event for slack User ${slackFullName} :`, error.message);
        }
    }
});
// Main Google Cloud Function entry point
const slackEventHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received slack event: ", JSON.stringify(req.body, null, 2));
    try {
        // Handle URL verification
        if (req.body.type === "url_verification") {
            return res.status(200).send({ challenge: req.body.challenge });
        }
        // Handle Slack events
        yield handleSlackEvent(req.body.event);
        res.status(200).send("Event processed successfully");
    }
    catch (error) {
        console.error("Error processing event:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.slackEventHandler = slackEventHandler;
