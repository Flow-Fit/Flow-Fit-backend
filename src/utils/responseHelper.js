// utils/responseHelper.js
exports.successResponse = (data, message = '성공적으로 응답') => {
    return {
      success: true,
      message,
      data
    };
};

exports.errorResponse = (code, message = '오류가 발생했습니다', data) => {
    return {
      success: false,
      code,
      message,
      data
    };
};
  