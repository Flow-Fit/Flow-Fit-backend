const { PrismaClient } = require('@prisma/client');
const { assert } = require('superstruct');
const { createUserStruct,updateUserStruct } = require('../struct/userStruct');
const { hashPassword, comparePassword } = require("../utils/password");
const { ErrorCodes, CustomError } = require("../middlewares/errorHandler");
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// 사용자 생성
const createUser = async (data) => {
    assert(data, createUserStruct);

    // 비밀번호 암호화
    const hashedPassword = await hashPassword(data.password);
    
    data.password = hashedPassword

    return await prisma.user.create({
        data
    });
};

// 사용자 로그인
const loginUser = async (username, password) => {
    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        throw new CustomError(ErrorCodes.BadRequest,'존재하지 않는 아이디입니다.');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new CustomError(ErrorCodes.BadRequest,'비밀번호가 틀렸습니다.');
    }

    // JWT 생성
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { token, user };
};

// 사용자 조회
const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id: parseInt(id) },
    });
};

// 사용자 수정
const updateUser = async (id, data) => {
    assert(data, updateUserStruct);

    return await prisma.user.update({
        where: { id: parseInt(id) },
        data,
    });
};

// 사용자 삭제
const deleteUser = async (id) => {
    return await prisma.user.delete({
        where: { id: parseInt(id) },
    });
};

module.exports = { createUser, loginUser, getUserById, updateUser, deleteUser };