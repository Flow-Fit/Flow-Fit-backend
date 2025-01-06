const {
    proposeScheduleByTrainer,
    acceptScheduleByTrainer,
    rejectScheduleByTrainer,
    cancelScheduleByTrainer,
} = require("../services/trainerService");

const asyncHandler = require('../utils/asyncHandler');

// 스케줄 제안 (트레이너)
const proposeScheduleByTrainerController = asyncHandler(async (req, res) => {
    const { memberId, date, location } = req.body;
    const trainer= req.role; 
    const schedule = await proposeScheduleByTrainer(trainer.id, memberId, new Date(date), location);
    res.status(201).json(schedule);
});

// 스케줄 수락 (트레이너)
const acceptScheduleByTrainerController = asyncHandler(async (req, res) => {
    const trainer= req.role; 
    const { scheduleId } = req.params;
    const schedule = await acceptScheduleByTrainer(trainer.id, parseInt(scheduleId));
    res.status(200).json(schedule);
});

// 스케줄 거절 (트레이너)
const rejectScheduleByTrainerController = asyncHandler(async (req, res) => {
    const trainer= req.role; 
    const { scheduleId } = req.params;
    const schedule = await rejectScheduleByTrainer(trainer.id, parseInt(scheduleId));
    res.status(200).json(schedule);
});

// 스케줄 취소/삭제 (트레이너)
const cancelScheduleByTrainerController = asyncHandler(async (req, res) => {
    const trainer= req.role; 
    const { scheduleId } = req.params;
    const result = await cancelScheduleByTrainer(trainer.id, parseInt(scheduleId));
    res.status(200).json(result);
});

module.exports = {
    proposeScheduleByTrainerController,
    acceptScheduleByTrainerController,
    rejectScheduleByTrainerController,
    cancelScheduleByTrainerController,
};