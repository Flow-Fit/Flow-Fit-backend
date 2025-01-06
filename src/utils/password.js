const bcrypt = require("bcrypt");

// 비밀번호 해싱 함수
// 해싱 작업은 CPU 집약적 작업, 비동기로 처리해야 함
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// 비밀번호 비교 함수
// 처음이 plain
async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// 비밀번호 필드 제거 유틸리티 함수
function removePasswordField(user) {
  const { password, ...safeUser } = user;
  return safeUser;
};

module.exports = { hashPassword, comparePassword , removePasswordField};