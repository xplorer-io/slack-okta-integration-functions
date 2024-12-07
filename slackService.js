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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchActiveSlackUsers = void 0;
const web_api_1 = require("@slack/web-api");
// initialize slack client
const slackClient = new web_api_1.WebClient(process.env.SLACK_TOKEN);
const fetchActiveSlackUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //get all slack users
    const result = yield slackClient.users.list({});
    const activeSlackUsers = (_a = result.members) === null || _a === void 0 ? void 0 : _a.filter((user) => { var _a; return !user.deleted && !user.is_bot && ((_a = user.profile) === null || _a === void 0 ? void 0 : _a.email); });
    return activeSlackUsers;
});
exports.fetchActiveSlackUsers = fetchActiveSlackUsers;
