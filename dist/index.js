"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const os_1 = require("os");
const server_1 = require("./server");
const numCpus = (0, os_1.cpus)().length;
if (cluster_1.default.isPrimary) {
    for (let cpu = 0; cpu < numCpus; cpu += 1) {
        cluster_1.default.fork();
    }
}
else {
    (0, server_1.server)();
}
