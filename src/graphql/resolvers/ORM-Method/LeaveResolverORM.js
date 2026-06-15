const { ILike } = require("typeorm")
const { AppDataSource } = require("../../database/db")
const Employee = require("../../entity/Employee")
const LeaveRequest = require("../../entity/LeaveRequest")
const LeaveType = require("../../entity/LeaveType")

const LeaveResolverORM = {
    createLeaveRequest: async(_, {employeeId, startDate, endDate, reason, leaveType}, context) => {
        if(Number(context.user.id) !== Number(employeeId)){
            throw new Error("UnAuthenticated Access")
        }

        const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest)
        const leaveTypeRepo = AppDataSource.getRepository(LeaveType)

        let leaveTypeData = await leaveTypeRepo.findOne({
            where: { name: leaveType }
        });

        if (!leaveTypeData) {
            leaveTypeData = await leaveTypeRepo.save({
                name: leaveType
            });
        }

        const leaveRequest = await leaveRequestRepo.save({
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            employee: { id: Number(employeeId) },
            leaveType: leaveTypeData
        })

        return leaveRequest
    },

    viewLeaveRequest: async(_, {employeeId}, context) => {
        if(Number(context.user.id) !== Number(employeeId)){
            throw new Error("UnAuthenticated Access")
        }

        const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest)

        const allRequests = await leaveRequestRepo.find({
            where: {
                employee: {id: employeeId}
            },
            relations: {
                leaveType: true,
                employee: {
                    department: true
                }
            }
        })

        return allRequests
    },

    approveLeaveRequest: async(_, {id}, context) => {
        if(!context.user){
            throw new Error("UnAuthenticated Access")
        }

        if(context.user.role !== 'Manager'){
            throw new Error("You are not allowed to perform this action")
        }

        const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest)

        const leaveRequest = await leaveRequestRepo.findOne({
            where: {id: id}
        })

        if(!leaveRequest){
            throw new Error("leave request not exist")
        }

        await leaveRequestRepo.update(id, {status: "APPROVED"})

        return leaveRequest
    },

    rejectLeaveRequest: async(_, {id}, context) => {
        if(!context.user){
            throw new Error("UnAuthenticated Access")
        }

        if(context.user.role !== 'Manager'){
            throw new Error("You are not allowed to perform this action")
        }

        const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest)

        const leaveRequest = await leaveRequestRepo.findOne({
            where: {id: id}
        })

        if(!leaveRequest){
            throw new Error("leave request not exist")
        }

        await leaveRequestRepo.update(id, {status: "REJECTED"})

        return leaveRequest
    },

    serachEmployee: async(_, {searchTerm}, context) => {
        if(!context.user){
            throw new Error("UnAuthenticated Access")
        }

        const empRepo = AppDataSource.getRepository(Employee)

        const employees = await empRepo.find({
            where: [
                { 
                    firstName: ILike(`%${searchTerm}%`) 
                },
                { 
                    department: { 
                        name: ILike(`%${searchTerm}%`) 
                    } 
                }
            ],
            relations: {
                department: true,
                leaveRequest: true
            }
        })

        return employees;
    }

}

module.exports = {LeaveResolverORM}