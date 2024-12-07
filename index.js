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
const slackService_1 = require("./slackService");
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
        yield (0, oktaService_1.onboardToOkta)(userEmail, firstName, lastName);
    }
    else if ((event === null || event === void 0 ? void 0 : event.type) === "user_change" && event.user.deleted) {
        // User removed from Slack group
        const userEmail = event.user.profile.email;
        console.log(`User left the Slack group: ${userEmail}`);
        const activeSlackUsers = yield (0, slackService_1.fetchActiveSlackUsers)();
        const oktaUsers = yield (0, oktaService_1.fetchOktaUsers)();
        // Find corresponding Okta user
        const oktaUser = oktaUsers.find((oktaUser) => oktaUser.profile.email === userEmail);
        if (oktaUser) {
            yield (0, oktaService_1.removeFromOkta)(oktaUser.id);
        }
        else {
            console.error(`Okta user not found for email: ${userEmail}`);
        }
    }
});
// Main Google Cloud Function entry point
const slackEventHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
