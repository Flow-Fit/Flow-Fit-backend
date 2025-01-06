const {
    proposeScheduleByMember,
    acceptScheduleByMember,
    rejectScheduleByMember,
    cancelScheduleByMember,
} = require("../services/memberService");

const asyncHandler = require('../utils/asyncHandler');

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
    proposeScheduleByMemberController,
    acceptScheduleByMemberController,
    rejectScheduleByMemberController,
    cancelScheduleByMemberController,
};