const express = require("express");
const router = express.Router();
const testRouters = require("./testRouters");
const userRouters = require("./userRouters");
const memberRouters = require("./memberRouters");
const trainerRouters = require("./trainerRouters");

/**
 * @swagger
 * tags:
 *   name: Test
 *   description: 테스트 API 관련 엔드포인트
 */
router.use("", testRouters);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 기본 유저 관련 엔드포인트
 */
router.use("", userRouters);

/**
 * @swagger
 * tags:
 *   name: Member
 *   description: 회원 관련 엔드포인트
 */
router.use("member/", memberRouters);

/**
 * @swagger
 * tags:
 *   name: Trainer
 *   description: 트레이너 관련 엔드포인트
 */
router.use("trainer/", trainerRouters);

module.exports = router;