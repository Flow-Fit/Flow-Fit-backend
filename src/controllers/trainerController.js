const {
    addMemberToTrainer,
    getTrainerMembers,
    getMemberByTrainer,
    getTrainerSchedulesByMonth,
    proposeScheduleByTrainer,
    acceptScheduleByTrainer,
    rejectScheduleByTrainer,
    cancelScheduleByTrainer,
} = require("../services/trainerService");

const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/responseHelper');
const { CustomError, ErrorCodes } = require('../utils/error');

// 멤버를 트레이너의 관리 목록에 추가
const addMemberToTrainerController = asyncHandler(async (req, res) => {
    const { memberId } = req.params; // 경로 파라미터에서 memberId 추출
    const trainer = req.role; // 로그인한 트레이너 정보

    const result = await addMemberToTrainer(trainer.id, parseInt(memberId));
    res.status(201).json(successResponse(result, "멤버 추가 성공"));
});

// 트레이너가 관리하는 모든 회원 리스트
const getTrainerMembersController = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const trainer = req.role; 

    const result = await getTrainerMembers(trainer.id, parseInt(page), parseInt(limit));
    res.status(200).json(successResponse(result, "회원 리스트 조회 성공"));
});

// 트레이너의 모든 스케줄 (특정 한 달)
const getTrainerSchedulesByMonthController = asyncHandler(async (req, res) => {
    const { month } = req.query;
    const trainer = req.role;

    if (!month) {
        throw new CustomError(ErrorCodes.BadRequest, 'month는 필수입니다. 형식: YYYY-MM');
    }

    const monthDate = new Date(`${month}-01`); // YYYY-MM 형식에서 Date 객체 생성
    if (isNaN(monthDate)) {
        throw new CustomError(ErrorCodes.BadRequest, '올바른 month 형식이 아닙니다. 예: 2025-01');
    }

    const schedules = await getTrainerSchedulesByMonth(trainer.id, monthDate);
    res.status(200).json(successResponse(schedules, "스케줄 리스트 조회 성공"));
});

// 관리하는 특정 회원 조회
const getMemberByTrainerController = asyncHandler(async (req, res) => {
    const { memberId } = req.params;
    const trainer = req.role;

    const Member = await getMemberByTrainer(trainer.id, parseInt(memberId));
    res.status(200).json(successResponse(Member, "회원 조회 성공"));
});

// 스케줄 제안 (트레이너)
const proposeScheduleByTrainerController = asyncHandler(async (req, res) => {
    const { memberId, date, location, trainingTarget } = req.body;
    const trainer = req.role; 
    const schedule = await proposeScheduleByTrainer(trainer.id, memberId, new Date(date), location, trainingTarget);
    res.status(201).json(successResponse(schedule, "스케줄 제안 성공"));
});

// 스케줄 수락 (트레이너)
const acceptScheduleByTrainerController = asyncHandler(async (req, res) => {
    const trainer = req.role; 
    const { scheduleId } = req.params;
    const schedule = await acceptScheduleByTrainer(trainer.id, parseInt(scheduleId));
    res.status(200).json(successResponse(schedule, "스케줄 수락 성공"));
});

// 스케줄 거절 (트레이너)
const rejectScheduleByTrainerController = asyncHandler(async (req, res) => {
    const trainer = req.role; 
    const { scheduleId } = req.params;
    const schedule = await rejectScheduleByTrainer(trainer.id, parseInt(scheduleId));
    res.status(200).json(successResponse(schedule, "스케줄 거절 성공"));
});

// 스케줄 취소/삭제 (트레이너)
const cancelScheduleByTrainerController = asyncHandler(async (req, res) => {
    const trainer = req.role; 
    const { scheduleId } = req.params;
    const result = await cancelScheduleByTrainer(trainer.id, parseInt(scheduleId));
    res.status(200).json(successResponse(result, "스케줄 취소 성공"));
});

module.exports = {
    addMemberToTrainerController,
    getTrainerMembersController,
    getTrainerSchedulesByMonthController,
    getMemberByTrainerController,
    proposeScheduleByTrainerController,
    acceptScheduleByTrainerController,
    rejectScheduleByTrainerController,
    cancelScheduleByTrainerController,
};