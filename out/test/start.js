"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const API_1 = __importDefault(require("../lib/API"));
const path_1 = __importDefault(require("path"));
// 测试
const scriptPath = path_1.default.resolve(__dirname, "./child_process.js");
new API_1.default().start(`${scriptPath} --json --format`);
