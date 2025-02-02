# Node.js 18.18.0 이미지를 사용
FROM node:18.18.0

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# Prisma CLI 설치 (글로벌 또는 프로젝트 내 설치에 따라 조정)
RUN npx prisma --version

# Prisma schema 파일 복사 (Prisma CLI 실행 전에 필요)
COPY prisma ./prisma

# Prisma 명령어 실행 (예: generate와 migrate)
RUN npx prisma generate

# 애플리케이션 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# Prisma 마이그레이션 및 앱 실행
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]