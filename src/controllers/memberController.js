const {
    getMemberSchedulesByMonth, 
    getRelatedTrainers,
    proposeScheduleByMember,
    acceptScheduleByMember,
    rejectScheduleByMember,
    cancelScheduleByMember,
} = require("../services/memberService");

const asyncHandler = require('../utils/asyncHandler');
 
// 멤버가 자신의 스케줄 조회 (특정 한 달)
const getMemberSchedulesByMonthController = asyncHandler(async (req, res) => {
    const { month } = req.query;
    const member = req.role;

    if (!month) {
        throw new CustomError(ErrorCodes.BadRequest, 'month는 필수입니다. 형식: YYYY-MM');
    }

    const monthDate = new Date(`${month}-01`); // YYYY-MM 형식에서 Date 객체 생성
    if (isNaN(monthDate)) {
        throw new CustomError(ErrorCodes.BadRequest, '올바른 month 형식이 아닙니다. 예: 2025-01');
    }

    const schedules = await getMemberSchedulesByMonth(member.id, monthDate);

    res.status(200).json(schedules);
});

// 멤버가 자신과 관련 있는 트레이너 조회
const getRelatedTrainersController = asyncHandler(async (req, res) => {
    const member = req.role;
    const trainers = await getRelatedTrainers(member.id);
    res.status(200).json(trainers);
});

// 스케줄 제안 (멤버)
const proposeScheduleByMemberController = asyncHandler(async (req, res) => {
    const { trainerId, date, location } = req.body;
    const member = req.role; 
    const schedule = await proposeScheduleByMember(trainerId, member.id, new Date(date), location);
    res.status(201).json(schedule);
});

// 스케줄 수락 (멤버)
const acceptScheduleByMemberController = asyncHandler(async (req, res) => {
    const member = req.role; 
    const { scheduleId } = req.params;
    const schedule = await acceptScheduleByMember(member.id, parseInt(scheduleId));
    res.status(200).json(schedule);
});

// 스케줄 거절 (멤버)
const rejectScheduleByMemberController = asyncHandler(async (req, res) => {
    const member = req.role; 
    const { scheduleId } = req.params;
    const schedule = await rejectScheduleByMember(member.id, parseInt(scheduleId));
    res.status(200).json(schedule);
});

// 스케줄 취소/삭제 (멤버)
const cancelScheduleByMemberController = asyncHandler(async (req, res) => {
    const member = req.role; 
    const { scheduleId } = req.params;
    const result = await cancelScheduleByMember(member.id, parseInt(scheduleId));
    res.status(200).json(result);
});

module.exports = {
    getMemberSchedulesByMonthController,
    getRelatedTrainersController,
    proposeScheduleByMemberController,
    acceptScheduleByMemberController,
    rejectScheduleByMemberController,
    cancelScheduleByMemberController,
};