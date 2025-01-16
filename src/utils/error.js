// 에러 코드 및 기본 메시지
const ErrorCodes = {
    BadRequest: {
        code: 400,
        message: "잘못된 요청입니다",
    },
    NotFound: {
        code: 404,
        message: "존재하지 않습니다",
    },
    InternalServerError: {
        code: 500,
        message: "서버 내부 오류가 발생했습니다",
    },
    Unauthorized: {
        code: 401,
        message: "인증되지 않은 요청입니다",
    },
    Forbidden: {
        code: 403,
        message: "접근 권한이 없습니다",
    },
    Conflict: {
        code: 409,
        message: "충돌이 발생했습니다.",
    },
};

// 커스텀 에러 클래스
class CustomError extends Error {
    constructor(errorCode, message) {
        super(message || errorCode.message);
        this.code = errorCode.code;
    }
}

module.exports = { ErrorCodes, CustomError }