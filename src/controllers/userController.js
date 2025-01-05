const {
    createUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser,} = require('../services/userService');

const asyncHandler = require('../utils/asyncHandler')

// 사용자 생성
const createUserController = asyncHandler( async (req, res, next) => {
    const user = await createUser(req.body);
    res.status(201).json(user);
});
  
// 사용자 로그인
const loginUserController = asyncHandler( async (req, res, next) => {
    const { username, password } = req.body;
    const { token, user } = await loginUser(username, password);
    res.status(200).json({ token, user });
});

// 사용자 조회
const getUserByIdController = asyncHandler( async (req, res, next) => {
    const user = await getUserById(req.params.id);
    res.status(200).json(user);
});

// 사용자 수정
const updateUserController = asyncHandler( async (req, res, next) => {
    const user = await updateUser(req.params.id, req.body);
    res.status(200).json(user);
});

// 사용자 삭제
const deleteUserController = asyncHandler( async (req, res, next) => {
    await deleteUser(req.params.id);
    res.status(204).json({message: "삭제 성공"});
});

module.exports = {
    createUserController,
    loginUserController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
};