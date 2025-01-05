const express = require("express");
const {
  createUserController,
  loginUserController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} = require("../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: "사용자 생성"
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateUser"
 *     responses:
 *       201:
 *         description: "사용자 생성 성공"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */
router.post("/user", createUserController);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: "사용자 로그인"
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginUser"
 *     responses:
 *       200:
 *         description: "로그인 성공 및 토큰 반환"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: "JWT 토큰"
 *                 user:
 *                   $ref: "#/components/schemas/User"
 */
router.post("/login", loginUserController);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: "특정 사용자 조회"
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "사용자 ID"
 *     responses:
 *       200:
 *         description: "사용자 정보 반환"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */
router.get("/user/:id", getUserByIdController);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: "특정 사용자 수정"
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "사용자 ID"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateUser"
 *     responses:
 *       200:
 *         description: "수정된 사용자 정보 반환"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */
router.put("/user/:id", updateUserController);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: "특정 사용자 삭제"
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "사용자 ID"
 *     responses:
 *       204:
 *         description: "삭제 성공"
 */
router.delete("/user/:id", deleteUserController);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: "사용자 ID"
 *         username:
 *           type: string
 *           description: "사용자 고유 이름"
 *         email:
 *           type: string
 *           description: "사용자 이메일"
 *         name:
 *           type: string
 *           description: "사용자 이름"
 *         role:
 *           type: string
 *           enum: [MEMBER, TRAINER]
 *           description: "사용자 역할"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: "사용자 생성 날짜"
 *     CreateUser:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: "사용자 고유 이름"
 *         password:
 *           type: string
 *           description: "사용자 비밀번호"
 *         email:
 *           type: string
 *           description: "사용자 이메일"
 *         name:
 *           type: string
 *           description: "사용자 이름"
 *         role:
 *           type: string
 *           enum: [MEMBER, TRAINER]
 *           description: "사용자 역할"
 *       required:
 *         - username
 *         - password
 *         - email
 *         - name
 *         - role
 *     LoginUser:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: "사용자 고유 이름"
 *         password:
 *           type: string
 *           description: "사용자 비밀번호"
 *       required:
 *         - username
 *         - password
 *     UpdateUser:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: "사용자 고유 이름 (선택)"
 *         email:
 *           type: string
 *           description: "사용자 이메일 (선택)"
 *         name:
 *           type: string
 *           description: "사용자 이름 (선택)"
 */