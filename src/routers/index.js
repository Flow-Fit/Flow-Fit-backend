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
router.use("/member", memberRouters);

/**
 * @swagger
 * tags:
 *   name: Trainer
 *   description: 트레이너 관련 엔드포인트
 */
router.use("/trainer", trainerRouters);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: "요청 성공 여부"
 *           example: true
 *         message:
 *           type: string
 *           description: "응답 메시지"
 *           example: "요청이 성공적으로 처리되었습니다."
 *         data:
 *           type: object
 *           description: "응답 데이터"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         errorCode:
 *           type: integer
 *           description: "에러 코드"
 *           example: 400
 *         message:
 *           type: string
 *           description: "에러 메시지"
 *           example: "요청이 잘못되었습니다."
 */
