const express = require("express");
const {
    addMemberToTrainerController,
    getTrainerMembersController,
    getTrainerSchedulesByMonthController,
    getMemberByTrainerController,
    proposeScheduleByTrainerController,
    acceptScheduleByTrainerController,
    rejectScheduleByTrainerController,
    cancelScheduleByTrainerController,
} = require("../controllers/trainerController");
const { authenticateToken } = require("../middlewares/jwtMiddlewares");
const { trainerMiddleware } = require("../middlewares/roleMiddlewares");

const router = express.Router();

/**
 * @swagger
 * /api/trainer/members/{memberId}:
 *   post:
 *     summary: "트레이너가 멤버를 관리 목록에 추가"
 *     tags: [Trainer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: integer
 *         required: true
 *         description: "추가할 멤버 ID"
 *         example: 1
 *     responses:
 *       201:
 *         description: "멤버가 관리 목록에 추가됨"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "멤버가 트레이너의 관리 목록에 추가되었습니다."
 *       404:
 *         description: "트레이너 또는 멤버를 찾을 수 없음"
 *       409:
 *         description: "이미 관리 목록에 있는 멤버"
 */
router.post('/members/:memberId', authenticateToken, trainerMiddleware, addMemberToTrainerController);

/**
 * @swagger
 * /api/trainer/members:
 *   get:
 *     summary: "트레이너가 관리하는 모든 회원 리스트"
 *     tags: [Trainer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: "페이지 번호 (옵션, 기본값: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: "한 페이지에 표시할 회원 수 (옵션, 기본값: 10)"
 *     responses:
 *       200:
 *         description: "트레이너가 관리하는 회원 리스트 반환"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: "회원 ID"
 *                       user:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: "회원 이름"
 *                           email:
 *                             type: string
 *                             description: "회원 이메일"
 *                           phoneNumber:
 *                             type: string
 *                             description: "회원 전화번호"
 *                 total:
 *                   type: integer
 *                   description: "총 회원 수"
 */
router.get("/members", authenticateToken, trainerMiddleware, getTrainerMembersController);

/**
 * @swagger
 * /api/trainer/members/{memberId}:
 *   get:
 *     summary: "트레이너가 관리하는 특정 회원 조회"
 *     tags: [Trainer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: integer
 *         required: true
 *         description: "조회할 회원의 ID"
 *     responses:
 *       200:
 *         description: "특정 회원 정보 반환"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: "회원 ID"
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: "회원 이름"
 *                     email:
 *                       type: string
 *                       description: "회원 이메일"
 *                     phoneNumber:
 *                       type: string
 *                       description: "회원 전화번호"
 *       403:
 *         description: "트레이너의 관리 대상이 아님"
 *       404:
 *         description: "회원이 존재하지 않음"
 */
router.get("/members/:memberId", authenticateToken, trainerMiddleware, getMemberByTrainerController);

/**
 * @swagger
 * /api/trainer/schedules:
 *   get:
 *     summary: "트레이너의 모든 스케줄 (특정 한 달)"
 *     tags: [Trainer]
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
 *         description: "스케줄 리스트 반환"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Schedule"
 */
router.get("/schedules", authenticateToken, trainerMiddleware, getTrainerSchedulesByMonthController);

/**
 * @swagger
 * /api/trainer/schedules/propose:
 *   post:
 *     summary: "트레이너가 멤버에게 스케줄 제안"
 *     tags: [Trainer]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: integer
 *                 description: "멤버 ID"
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
router.post("/schedules/propose", authenticateToken, trainerMiddleware, proposeScheduleByTrainerController);

/**
 * @swagger
 * /api/trainer/schedules/{scheduleId}/accept:
 *   put:
 *     summary: "트레이너가 멤버가 제안한 스케줄 수락"
 *     tags: [Trainer]
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
router.put( "/schedules/:scheduleId/accept", authenticateToken, trainerMiddleware, acceptScheduleByTrainerController);

/**
 * @swagger
 * /api/trainer/schedules/{scheduleId}/reject:
 *   put:
 *     summary: "트레이너가 멤버가 제안한 스케줄 거절"
 *     tags: [Trainer]
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
router.put( "/schedules/:scheduleId/reject", authenticateToken, trainerMiddleware, rejectScheduleByTrainerController );

/**
 * @swagger
 * /api/trainer/schedules/{scheduleId}/cancel:
 *   delete:
 *     summary: "트레이너가 스케줄 취소 또는 삭제"
 *     tags: [Trainer]
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
router.delete( "/schedules/:scheduleId/cancel", authenticateToken, trainerMiddleware, cancelScheduleByTrainerController );

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
 *           example: "TRAINER_PROPOSED"
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