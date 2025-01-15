const jwt = require("jsonwebtoken");
const { ErrorCodes, CustomError } = require("./errorHandler");
const asyncHandler = require("../utils/asyncHandler");
const { getUserById } = require("../services/userService");

require('dotenv').config(); // 환경 변수 로드

const SECRET_KEY = process.env.JWT_SECRET; // 환경 변수에서 SECRET_KEY 로드

// JWT 검증 미들웨어
const authenticateToken = asyncHandler(async (req, res, next) => {
    let token;

    // 헤더 또는 쿼리에서 토큰 가져오기
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        token = authHeader.split(" ")[1];
    } else if (req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        throw new CustomError(ErrorCodes.Unauthorized, 'Unauthorized: 토큰이 없습니다.'); // 토큰 없음
    }
    
    let decoded;
    
    try {
        decoded = jwt.verify(token, SECRET_KEY); // 토큰 검증
        console.log("Decoded Token:", decoded);
    } catch (error) {
        // 토큰 만료 에러 처리
        if (error.name === "TokenExpiredError") {
            throw new CustomError(ErrorCodes.Unauthorized, "Unauthorized: 토큰이 만료되었습니다.");
        }

        // 기타 토큰 검증 실패 에러 처리
        throw new CustomError(ErrorCodes.Unauthorized, "Unauthorized: 유효하지 않은 토큰입니다.");
    }

    const user = await getUserById(decoded.id);

    if (!user) {
        throw new CustomError(ErrorCodes.NotFound, "Unauthorized: 사용자가 없습니다.");
    }

    req.user = user; // 검증된 사용자 데이터를 req.user에 저장
    
    next();
});

module.exports = { authenticateToken };