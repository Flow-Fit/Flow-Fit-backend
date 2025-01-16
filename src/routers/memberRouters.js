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
 *               $ref: "#/components/schemas/ScheduleArrayResponse"
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
 *               $ref: "#/components/schemas/TrainersResponse"
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
 *               $ref: "#/components/schemas/ScheduleResponse"
 *       errorCode:
 *         description: "오류 응답"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/schedules/propose', authenticateToken, memberMiddleware, proposeScheduleByMemberController);

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
 *               $ref: "#/components/schemas/ScheduleResponse"
 *       errorCode:
 *         description: "오류 응답"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put('/schedules/:scheduleId/accept', authenticateToken, memberMiddleware, acceptScheduleByMemberController);

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
 *               $ref: "#/components/schemas/ScheduleResponse"
 *       errorCode:
 *         description: "오류 응답"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put('/schedules/:scheduleId/reject', authenticateToken, memberMiddleware, rejectScheduleByMemberController);

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
 *               $ref: "#/components/schemas/ScheduleResponse"
 *       errorCode:
 *         description: "오류 응답"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/schedules/:scheduleId/cancel', authenticateToken, memberMiddleware, cancelScheduleByMemberController);

module.exports = router;