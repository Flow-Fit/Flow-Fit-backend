const { PrismaClient } = require('@prisma/client');
const { assert } = require('superstruct');
const { createUserStruct,updateUserStruct } = require('../struct/userStruct');
const { hashPassword, comparePassword , removePasswordField } = require("../utils/password");
const { ErrorCodes, CustomError } = require("../middlewares/errorHandler");
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// 사용자 생성
const createUser = async (data) => {
    assert(data, createUserStruct);

    // 비밀번호 암호화
    const hashedPassword = await hashPassword(data.password);
    
    data.password = hashedPassword

    const user = await prisma.user.create({
        data
    })

    if(user.role == 'MEMBER'){
        const member = await prisma.member.create({
            data: { userId: user.id },
        })
    }

    if(user.role == 'TRAINER'){
        const trainer = await prisma.trainer.create({
            data: { userId: user.id },
        })
    }


    return removePasswordField(user);
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
    // JWT_SECRET 확인
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET 환경 변수가 설정되지 않았습니다.");
    }

    // JWT 생성
    const token = jwt.sign(
        { id: user.id, role: user.role },
        secret,
        { expiresIn: '1h' }
    );

    return { token, user: removePasswordField(user) };
};

// 사용자 조회
const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
    });

    return removePasswordField(user);
};

// 사용자 수정
const updateUser = async (id, data) => {
    assert(data, updateUserStruct);

    const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data,
    });

    return removePasswordField(user);
};

// 사용자 삭제
const deleteUser = async (id) => {
    const user = await prisma.user.delete({
        where: { id: parseInt(id) },
    });
    
    return removePasswordField(user);
};

// 사용자의 정보

module.exports = { createUser, loginUser, getUserById, updateUser, deleteUser };