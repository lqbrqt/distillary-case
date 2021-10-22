"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_client_1 = __importDefault(require("../prisma-client"));
const router = (0, express_1.Router)();
router.get('/question/:id', (req, res) => {
    return prisma_client_1.default.question.findFirst({
        where: {
            id: req.params.id,
        },
    });
});
exports.default = router;
