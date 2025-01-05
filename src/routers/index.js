const express = require("express");
const router = express.Router();
const testRouters = require("./testRouters");
const userRouters = require("./userRouters")

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

module.exports = router;