"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ping_controller_1 = require("../../controllers/ping.controller");
const submission_Route_1 = __importDefault(require("./submission.Route"));
const V1Router = express_1.default.Router();
V1Router.get('/ping-check', ping_controller_1.pingCheck);
V1Router.use('/submissions', submission_Route_1.default);
exports.default = V1Router;
