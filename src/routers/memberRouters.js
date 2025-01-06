const express = require("express");
const {
    getMemberSchedulesByMonthController,
    getRelatedTrainersController,
    proposeScheduleByMemberController,
    acceptScheduleByMemberController,
    rejectScheduleByMemberController,
    cancelScheduleByMemberController,
} = require("../controllers/memberController");
const { authenticateToken } = require("../middlewares/jwtMiddlewares");
const { memberMiddleware } = require("../middlewares/roleMiddlewares");

const router = express.Router();
/**
 * @swagger
 * /api/member/schedules:
 *   get:
 *     summary: "멤버가 자신의 스케줄 조회 (특정 한 달)"
 *     tags: [Member]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           format: date
 *         description: "조회할 달 (YYYY-MM)"
 *         required: true
 *     responses:
 *       200:
 *         description: "멤버의 스케줄 리스트 반환"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Schedule"
 */
router.get('/schedules', authenticateToken, memberMiddleware, getMemberSchedulesByMonthController);

/**
 * @swagger
 * /api/member/trainers:
 *   get:
 *     summary: "멤버가 자신과 관련 있는 트레이너 조회"
 *     tags: [Member]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "멤버와 관련된 트레이너 리스트 반환"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: "트레이너 ID"
 *                   name:
 *                     type: string
 *                     description: "트레이너 이름"
 *                   email:
 *                     type: string
 *                     description: "트레이너 이메일"
 *                   phoneNumber:
 *                     type: string
 *                     description: "트레이너 전화번호"
 */
router.get('/trainers', authenticateToken, memberMiddleware, getRelatedTrainersController);

/**
 * @swagger
 * /api/member/schedules/propose:
 *   post:
 *     summary: "멤버가 트레이너에게 스케줄 제안"
 *     tags: [Member]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trainerId:
 *                 type: integer
 *                 description: "트레이너 ID"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: "스케줄 날짜와 시간"
 *               location:
 *                 type: string
 *                 description: "스케줄 장소"
 *     responses:
 *       201:
 *         description: "스케줄 생성 성공"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Schedule"
 *       400:
 *         description: "잘못된 요청"
 *       401:
 *         description: "인증 실패"
 */
router.post("schedules/propose", authenticateToken, memberMiddleware, proposeScheduleByMemberController );

/**
 * @swagger
 * /api/member/schedules/{scheduleId}/accept:
 *   put:
 *     summary: "멤버가 트레이너가 제안한 스케줄 수락"
 *     tags: [Member]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: scheduleId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "스케줄 ID"
 *     responses:
 *       200:
 *         description: "스케줄 수락 성공"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Schedule"
 *       400:
 *         description: "잘못된 요청"
 *       401:
 *         description: "인증 실패"
 *       403:
 *         description: "권한 없음"
 */
router.put( "/schedules/:scheduleId/accept", authenticateToken, memberMiddleware, acceptScheduleByMemberController );

/**
 * @swagger
 * /api/member/schedules/{scheduleId}/reject:
 *   put:
 *     summary: "멤버가 트레이너가 제안한 스케줄 거절"
 *     tags: [Member]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: scheduleId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "스케줄 ID"
 *     responses:
 *       200:
 *         description: "스케줄 거절 성공"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Schedule"
 *       400:
 *         description: "잘못된 요청"
 *       401:
 *         description: "인증 실패"
 *       403:
 *         description: "권한 없음"
 */
router.put(
    "/schedules/:scheduleId/reject", authenticateToken, memberMiddleware, rejectScheduleByMemberController
);

/**
 * @swagger
 * /api/member/schedules/{scheduleId}/cancel:
 *   delete:
 *     summary: "멤버가 스케줄 취소 또는 삭제"
 *     tags: [Member]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: scheduleId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "스케줄 ID"
 *     responses:
 *       200:
 *         description: "스케줄 취소 또는 삭제 성공"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Schedule"
 *       400:
 *         description: "잘못된 요청"
 *       401:
 *         description: "인증 실패"
 *       403:
 *         description: "권한 없음"
 */
router.delete( "/schedules/:scheduleId/cancel", authenticateToken, memberMiddleware, cancelScheduleByMemberController );

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: "스케줄 ID"
 *           example: 1
 *         date:
 *           type: string
 *           format: date-time
 *           description: "스케줄 날짜 및 시간"
 *           example: "2025-01-01T10:00:00Z"
 *         location:
 *           type: string
 *           description: "스케줄 장소"
 *           example: "Gym A"
 *         status:
 *           type: string
 *           enum:
 *             - MEMBER_PROPOSED
 *             - TRAINER_PROPOSED
 *             - SCHEDULED
 *             - REJECTED
 *             - CANCELED
 *           description: "스케줄 상태"
 *           example: "MEMBER_PROPOSED"
 *         memberId:
 *           type: integer
 *           description: "멤버 ID"
 *           example: 1
 *         trainerId:
 *           type: integer
 *           description: "트레이너 ID"
 *           example: 2
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
