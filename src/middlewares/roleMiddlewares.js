const asyncHandler = require("../utils/asyncHandler");
const { checkOrCreateMember } = require("../services/memberService");
const { checkOrCreateTrainer } = require("../services/trainerService");

// 역할 미들웨어
const memberMiddleware = asyncHandler(async (req, res, next) => {
    // 로그인한 사용자의 역할(Member 또는 Trainer)에 따라 엔터티 조회
    const roleEntity = await checkOrCreateMember(req.user);

    req.role = roleEntity; // 역할 정보를 req.role에 추가
    next();
});

// 역할 미들웨어
const trainerMiddleware = asyncHandler(async (req, res, next) => {
    // 로그인한 사용자의 역할(Member 또는 Trainer)에 따라 엔터티 조회
    const roleEntity = await checkOrCreateTrainer(req.user);

    req.role = roleEntity; // 역할 정보를 req.role에 추가
    next();
});

module.exports = { memberMiddleware , trainerMiddleware};