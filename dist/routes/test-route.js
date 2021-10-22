"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_client_1 = __importDefault(require("../prisma-client"));
const router = (0, express_1.Router)();
router.get('/test/random', async (req, res) => {
    const testsCount = await prisma_client_1.default.test.count();
    const skip = Math.floor(Math.random() * testsCount);
    return prisma_client_1.default.test.findMany({
        take: 1,
        skip,
        orderBy: {
            id: 'desc',
        },
    })[0];
});
router.get('/test/:id', async (req, res) => {
    return prisma_client_1.default.test.findFirst({
        where: {
            id: req.params.id,
        },
    });
});
router.post('/test/:id', async (req, res) => {
    const answers = req.body.answers;
    console.log(answers);
    // DO SOMETHING WITH ANSWERS
});
exports.default = router;
