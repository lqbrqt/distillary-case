"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('test');
});
const server = () => {
    app.listen(process.env.PORT || 4000, () => {
        // eslint-disable-next-line no-console
        console.log(`Server started at: http://localhost:${process.env.PORT}`);
    });
};
exports.server = server;
