const { PrismaClient } = require('@prisma/client');
const { ErrorCodes, CustomError } = require("../utils/error");

const prisma = new PrismaClient();

const checkOrCreateTrainer = async (user) => {
    if (user.role === 'TRAINER') {
        // 회원(trainer) 엔트리 확인
        let trainer = await prisma.trainer.findUnique({
            where: { userId: user.id },
        });

        // 존재하지 않으면 생성
        if (!trainer) {
            trainer = await prisma.trainer.create({
                data: { userId: user.id },
            });
        }

        return trainer
    } else if (user.role === 'MEMBER') {
        // 트레이너(Trainer) 엔트리 확인
        throw new CustomError(ErrorCodes.Forbidden,"잘못된 접근입니다. ")
    }
};

//트레이너가 멤버 추가
const addMemberToTrainer = async (trainerId, memberId) => {
    // 멤버와 트레이너가 존재하는지 확인
    const [trainer, member] = await Promise.all([
        prisma.trainer.findUnique({
            where: { id: trainerId },
        }),
        prisma.member.findUnique({
            where: { id: memberId },
        }),
    ]);

    if (!trainer) {
        throw new CustomError(ErrorCodes.NotFound, '트레이너를 찾을 수 없습니다.');
    }

    if (!member) {
        throw new CustomError(ErrorCodes.NotFound, '멤버를 찾을 수 없습니다.');
    }

    // 멤버가 이미 트레이너의 관리 목록에 있는지 확인
    const existingRelation = await prisma.trainerMember.findFirst({
        where: {
            trainerId: trainerId,
            memberId: memberId,
        },
    });

    if (existingRelation) {
        throw new CustomError(ErrorCodes.Conflict, '해당 멤버는 이미 트레이너의 관리 목록에 있습니다.');
    }

    // 멤버를 트레이너의 관리 목록에 추가
    await prisma.trainerMember.create({
        data: {
            trainerId: trainerId,
            memberId: memberId,
            ptStartDate: new Date(), // PT 시작일은 현재 날짜로 설정 (필요 시 변경 가능)
        },
    });

    return { message: '멤버가 트레이너의 관리 목록에 추가되었습니다.' };
};

// 트레이너가 관리하는 모든 회원 리스트 (페이지네이션 포함)
const getTrainerMembers = async (trainerId, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const [members, total] = await Promise.all([
        prisma.member.findMany({
            where: { trainers: { some: { trainerId: trainerId } } },
            skip: offset,
            take: limit,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phoneNumber: true,
                    },
                },
            },
        }),
        prisma.member.count({
            where: { trainers: { some: { id: trainerId } } },
        }),
    ]);

    return { members, total, page, totalPages: Math.ceil(total / limit) };
};


// 트레이너가 관리하는 회원 정보
const getMemberByTrainer = async (trainerId, memberId) => {
    // 해당 회원이 트레이너의 관리 하에 있는지 확인
    const member = await prisma.member.findFirst({
        where: {
            id: memberId,
            trainers: { some: { trainerId: trainerId } }},
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    phoneNumber: true,
                },
            },
        }
    });

    if (!member) {
        throw new CustomError(ErrorCodes.Forbidden, "해당 회원은 트레이너의 관리 대상이 아닙니다.");
    }

    // 회원의 모든 스케줄 조회
    const schedules = await prisma.schedule.findMany({
        where: { memberId },
        orderBy: { date: 'asc' },
    });

    const data = {
        name : member.user.name,
        schedules : schedules
    }
    return data;
};

// 트레이너의 스켸줄 조회 (한달 치)
const getTrainerSchedulesByMonth = async (trainerId, month) => {
    const startOfMonth = new Date(month);
    startOfMonth.setDate(1); // 달의 첫 날
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); // 다음 달의 첫 날

    const schedules = await prisma.schedule.findMany({
        where: {
            trainerId,
            date: { gte: startOfMonth, lt: endOfMonth },
        },
        orderBy: { date: 'asc' },
    });

    return schedules;
};

// 스케줄 상태 열거형
const ScheduleStatus = {
    MEMBER_PROPOSED: "MEMBER_PROPOSED",
    TRAINER_PROPOSED: "TRAINER_PROPOSED",
    SCHEDULED: "SCHEDULED",
    REJECTED: "REJECTED",
    CANCELED: "CANCELED",
};

// 트레이너가 스케줄 제안
const proposeScheduleByTrainer = async (trainerId, memberId, date, location, trainingTarget) => {
    return await prisma.schedule.create({
        data: {
            date,
            location,
            status: ScheduleStatus.TRAINER_PROPOSED,
            trainingTarget,
            trainerId,
            memberId,
        },
    });
};

// 트레이너가 스케줄 수락
const acceptScheduleByTrainer = async (trainerId, scheduleId) => {
    const schedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
    });

    if (!schedule) {
        throw new CustomError(ErrorCodes.NotFound, "해당 Schedule이 없습니다.");
    }

    if (schedule.trainerId !== trainerId) {
        throw new CustomError(ErrorCodes.Forbidden, "Schedule의 대상이 아닙니다.");
    }

    if (schedule.status === ScheduleStatus.trainer_PROPOSED) {
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

// 트레이너가 스케줄 거절
const rejectScheduleByTrainer = async (trainerId, scheduleId) => {
    const schedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
    });

    if (!schedule) {
        throw new CustomError(ErrorCodes.NotFound, "해당 Schedule이 없습니다.");
    }

    if (schedule.trainerId !== trainerId) {
        throw new CustomError(ErrorCodes.Forbidden, "Schedule의 대상이 아닙니다.");
    }

    if (schedule.status === ScheduleStatus.trainer_PROPOSED) {
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

// 트레이너가 스케줄 취소, 삭제
const cancelScheduleByTrainer = async (trainerId, scheduleId) => {
    const schedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
    });

    if (!schedule) {
        throw new CustomError(ErrorCodes.NotFound, "Schedule not found.");
    }

    if (schedule.trainerId !== trainerId) {
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
        schedule.status === ScheduleStatus.TRAINER_PROPOSED ||
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
    checkOrCreateTrainer,
    addMemberToTrainer,
    getTrainerMembers,
    getMemberByTrainer,
    getTrainerSchedulesByMonth,
    proposeScheduleByTrainer,
    acceptScheduleByTrainer,
    rejectScheduleByTrainer,
    cancelScheduleByTrainer,
};