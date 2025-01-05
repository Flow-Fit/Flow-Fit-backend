const jwt = require("jsonwebtoken");
const { ErrorCodes, CustomError } = require("./errorHandler")

SECRET_KEY = env.SECRET_KEY

// JWT 검증 미들웨어
const authenticateToken = async (req, res, next) => {
    let token;

    const authHeader = req.headers["authorization"];
    if (authHeader) {
        token = authHeader.split(" ")[1];
    } else if (req.query.token) {
        token = req.query.token;
    }

    if (!token) 
        throw new CustomError( ErrorCodes.Forbidden ,'Unauthorized: 토큰이 없습니다.'); // 토큰 없음

    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded Token:", decoded);
    const user = await User.findById(decoded.id);

    if (!user) {
        throw new CustomError( ErrorCodes.NotFound , "Unauthorized: 사용자가 없습니다.");
    }

    req.user = user; // 이 이후에는 req.user가 데이터베이스의 user
    
    next();
};

module.exports = authenticateToken;