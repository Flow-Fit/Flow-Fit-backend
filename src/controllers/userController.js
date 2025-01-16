const {
    createUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser,
} = require('../services/userService');

const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/responseHelper');

// 사용자 생성
const createUserController = asyncHandler(async (req, res) => {
    const user = await createUser(req.body);
    res.status(201).json(successResponse(user, "사용자 생성 성공"));
});

// 사용자 로그인
const loginUserController = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const { token, user } = await loginUser(username, password);
    res.status(200).json(successResponse({ token, user }, "로그인 성공"));
});

// 사용자 조회
const getUserByIdController = asyncHandler(async (req, res) => {
    const user = await getUserById(req.user.id);
    res.status(200).json(successResponse(user, "사용자 조회 성공"));
});

// 사용자 수정
const updateUserController = asyncHandler(async (req, res) => {
    const user = await updateUser(req.user.id, req.body);
    res.status(200).json(successResponse(user, "사용자 수정 성공"));
});

// 사용자 삭제
const deleteUserController = asyncHandler(async (req, res) => {
    await deleteUser(req.user.id);
    res.status(204).json(successResponse(null, "사용자 삭제 성공"));
});

module.exports = {
    createUserController,
    loginUserController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
};