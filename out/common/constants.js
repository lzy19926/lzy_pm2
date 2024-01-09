"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAEMON_LOG_FILE_PATH = void 0;
const path_1 = __importDefault(require("path"));
exports.DAEMON_LOG_FILE_PATH = path_1.default.resolve(__dirname, "../../cache/0_logFile.json");
