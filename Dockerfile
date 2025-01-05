# 베이스 이미지 설정
FROM node:16

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 앱 포트 설정
EXPOSE 3000

# 앱 실행 명령어
CMD ["npm", "start"]