const { PrismaClient } = require('@prisma/client');
const { ErrorCodes, CustomError } = require("../middlewares/errorHandler");

const prisma = new PrismaClient();

const checkOrCreateMember = async (user) => {
    if (user.role === 'MEMBER') {
        // 회원(Member) 엔트리 확인
        let member = await prisma.member.findUnique({
            where: { userId: user.id },
        });

        // 존재하지 않으면 생성
        if (!member) {
            member = await prisma.member.create({
                data: { userId: user.id },
            });
        }

        return member
    } else if (user.role === 'TRAINER') {
        // 트레이너(Trainer) 엔트리 확인
        throw new CustomError(ErrorCodes.Forbidden,"잘못된 접근입니다. ")
    }
};

const getMemberSchedulesByMonth = async (memberId, month) => {
    const startOfMonth = new Date(month);
    startOfMonth.setDate(1); // 달의 첫 날
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); // 다음 달의 첫 날

    const schedules = await prisma.schedule.findMany({
        where: {
            memberId,
            date: { gte: startOfMonth, lt: endOfMonth },
        },
        orderBy: { date: 'asc' },
    });

    return schedules;
};

const getRelatedTrainers = async (memberId) => {
    const trainers = await prisma.trainer.findMany({
        where: {
            members: { some: { id: memberId } },
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true,
                },
            },
        },
    });

    return trainers.map((trainer) => ({
        id: trainer.id,
        name: trainer.user.name,
        email: trainer.user.email,
        phoneNumber: trainer.user.phoneNumber,
    }));
};

// 스케줄 상태 열거형
const ScheduleStatus = {
    MEMBER_PROPOSED: "MEMBER_PROPOSED",
    TRAINER_PROPOSED: "TRAINER_PROPOSED",
    SCHEDULED: "SCHEDULED",
    REJECTED: "REJECTED",
    CANCELED: "CANCELED",
};

// 멤버가 스케줄 제안
const proposeScheduleByMember = async (memberId, trainerId, date, location) => {
    return await prisma.schedule.create({
        data: {
            date,
            location,
            status: ScheduleStatus.MEMBER_PROPOSED,
            memberId,
            trainerId,
        },
    });
};

// 멤버가 스케줄 수락
const acceptScheduleByMember = async (memberId, scheduleId) => {
    const schedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
    });

    if (!schedule) {
        throw new CustomError(ErrorCodes.NotFound, "해당 Schedule이 없습니다.");
    }

    if (schedule.memberId !== memberId) {
        throw new CustomError(ErrorCodes.Forbidden, "Schedule의 대상이 아닙니다.");
    }

    if (schedule.status === ScheduleStatus.TRAINER_PROPOSED) {
        return await prisma.schedule.update({
            where: { id: scheduleId },
            data: {
                status: ScheduleStatus.SCHEDULED,
            },
        });
    } else {
        throw new CustomError(ErrorCodes.BadRequest, "Schedule 수락 대상이 아닙니다.");
    }
};

// 멤버가 스케줄 거절
const rejectScheduleByMember = async (memberId, scheduleId) => {
    const schedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
    });

    if (!schedule) {
        throw new CustomError(ErrorCodes.NotFound, "해당 Schedule이 없습니다.");
    }

    if (schedule.memberId !== memberId) {
        throw new CustomError(ErrorCodes.Forbidden, "Schedule의 대상이 아닙니다.");
    }

    if (schedule.status === ScheduleStatus.TRAINER_PROPOSED) {
        return await prisma.schedule.update({
            where: { id: scheduleId },
            data: {
                status: ScheduleStatus.REJECTED,
            },
        });
    } else {
        throw new CustomError(ErrorCodes.BadRequest, "Schedule 거절 대상이 아닙니다.");
    }
};

// 멤버가 스케줄 취소, 삭제
const cancelSchedule = async (memberId, scheduleId) => {
    const schedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
    });

    if (!schedule) {
        throw new CustomError(ErrorCodes.NotFound, "Schedule not found.");
    }

    if (schedule.memberId !== memberId) {
        throw new CustomError(ErrorCodes.Forbidden, "Schedule의 대상이 아닙니다.");
    }

    // 취소
    if (schedule.status === ScheduleStatus.SCHEDULED) {
        return await prisma.schedule.update({
            where: { id: scheduleId },
            data: {
                status: ScheduleStatus.CANCELED,
            },
        });
    } 
    // 삭제
    else if (
        schedule.status === ScheduleStatus.MEMBER_PROPOSED ||
        schedule.status === ScheduleStatus.REJECTED
    ) {
        return await prisma.schedule.delete({
            where: { id: scheduleId },
        });
    } else {
        throw new CustomError(ErrorCodes.BadRequest, "Schedule 취소가 불가능합니다.");
    }
};

module.exports = {
    checkOrCreateMember,
    getMemberSchedulesByMonth, 
    getRelatedTrainers ,
    proposeScheduleByMember,
    acceptScheduleByMember,
    rejectScheduleByMember,
    cancelSchedule,
};