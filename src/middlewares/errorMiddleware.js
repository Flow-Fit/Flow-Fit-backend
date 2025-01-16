const { ErrorCodes, CustomError } = require('../utils/error')
const { errorResponse } = require('../utils/responseHelper');
const { Prisma } = require("@prisma/client");

const errorMiddleware = (err, req, res, next) => {
  try {
    console.error(err);

    // 커스텀 에러 처리
    if (err instanceof CustomError) {
      return res.status(err.code).json(errorResponse(err.code, err.message));
    }

    // StructError 처리
    if (err.name === "StructError") {
      return res.status(400).json(
        errorResponse(400, err.message.split('--')[1].trim())
      );
    }

    // Prisma의 Known Request Error 처리
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2002":
          return res.status(ErrorCodes.Conflict.code).json(
            errorResponse(
              ErrorCodes.Conflict.code,
              ErrorCodes.Conflict.message,
              err.meta || null
            )
          );
        case "P2025":
          return res.status(ErrorCodes.NotFound.code).json(
            errorResponse(
              ErrorCodes.NotFound.code,
              ErrorCodes.NotFound.message,
              err.meta || null
            )
          );
        default:
          return res.status(ErrorCodes.BadRequest.code).json(
            errorResponse(
              ErrorCodes.BadRequest.code,
              err.message,
              err.meta || null
            )
          );
      }
    }

    // Prisma의 Validation Error 처리
    if (err instanceof Prisma.PrismaClientValidationError) {
      return res.status(ErrorCodes.BadRequest.code).json(
        errorResponse(
          ErrorCodes.BadRequest.code,
          "데이터 유효성 검증 오류가 발생했습니다"
        )
      );
    }

    // 예상치 못한 에러 처리
    return res.status(ErrorCodes.InternalServerError.code).json(
      errorResponse(
        ErrorCodes.InternalServerError.code,
        ErrorCodes.InternalServerError.message
      )
    );
  } catch {
    // 에러 처리 중 예상치 못한 에러 처리
    return res.status(ErrorCodes.InternalServerError.code).json(
      errorResponse(
        ErrorCodes.InternalServerError.code,
        "에러 처리 중 예상치 못한 오류가 발생했습니다"
      )
    );
  }
};

module.exports = { errorMiddleware };