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
exports.removeFromOkta = exports.onboardToOkta = exports.fetchOktaUsers = void 0;
const axios_1 = __importDefault(require("axios"));
// Axios instance for Okta API
const oktaApi = axios_1.default.create({
    baseURL: `https://${process.env.OKTA_DOMAIN}/api/v1`,
    headers: {
        "Content-Type": "application/json",
        Authorization: `SSWS ${process.env.OKTA_TOKEN}`,
    },
});
// List users from Okta
const fetchOktaUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield oktaApi.get("/users");
        return response.data;
    }
    catch (error) {
        console.error(`Error fetching Okta users: ${((_a = error.response) === null || _a === void 0 ? void 0 : _a.statusText) || error.message}`);
        throw new Error("Failed to fetch Okta users");
    }
});
exports.fetchOktaUsers = fetchOktaUsers;
// Create user in Okta
const onboardToOkta = (email, firstName, lastName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const response = yield oktaApi.post("/users", {
            profile: {
                firstName,
                lastName,
                email,
                login: email,
            },
            credentials: {
                password: { value: "tlpWENT2m" },
            },
        }, {
            params: {
                activate: "true",
                provider: "false",
                nextLogin: "changePassword",
            },
        });
        // response from okta
        console.log("Response from Okta: ", JSON.stringify(response.data, null, 2));
        console.log(`Onboarded user: ${firstName} ${lastName} , email :  (${email})`);
    }
    catch (error) {
        console.error(`Error onboarding user ${email}: ${((_a = error.response) === null || _a === void 0 ? void 0 : _a.statusText) || error.message}`);
        // log full error detials
        if ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) {
            console.error("Error Response data : ", JSON.stringify(error.response.data, null, 2));
        }
        else {
            console.error("No response data. Full Error: ", error);
        }
        throw new Error(`Failed to onboard user ${email}`);
    }
});
exports.onboardToOkta = onboardToOkta;
// Delete user from Okta
const removeFromOkta = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const response = yield oktaApi.delete(`/users/${userId}`);
        console.log(`Response from Okta for deleting user  ${userId} : Status code: ${response.status}`);
        console.log(`Removed Okta user with ID: ${userId}`);
    }
    catch (error) {
        console.error(`Error removing user with ID ${userId}: ${((_a = error.response) === null || _a === void 0 ? void 0 : _a.statusText) || error.message}`);
        //Log full error details
        if ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) {
            console.error("Error Response data: ", JSON.stringify(error.response.data, null, 2));
        }
        else {
            console.error("No response data. Full Error:", error);
        }
        throw new Error(`Failed to remove user with ID ${userId}`);
    }
});
exports.removeFromOkta = removeFromOkta;
