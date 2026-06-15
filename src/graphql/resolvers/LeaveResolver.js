const { ILike } = require("typeorm")
const { AppDataSource } = require("../../database/db")
const Employee = require("../../entity/Employee")
const LeaveRequest = require("../../entity/LeaveRequest")
const LeaveType = require("../../entity/LeaveType")

const LeaveResolver = {
    createLeaveRequest: async(_, {employeeId, startDate, endDate, reason, leaveType}, context) => {
        if(Number(context.user.id) !== Number(employeeId)){
            throw new Error("UnAuthenticated Access")
        }

        if(!employeeId || !startDate || !endDate || !reason || !leaveType){
            throw new Error("Every field is mandatory")
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();

        today.setHours(0,0,0,0)

        if (start < today) {
            throw new Error("Start date cannot be in the past");
        }

        if (end < start) {
            throw new Error("End date cannot be before the start date");
        }

        const leaveTypeResult = await AppDataSource.query(
            `select * from leave_type where name = $1`, [leaveType]
        )

        let leaveTypeData
        if (leaveTypeResult.length == 0) {
            const newLeaveTypeResult = await AppDataSource.query(
                `insert into leave_type(name) values($1) returning *`, [leaveType]
            )
            leaveTypeData = newLeaveTypeResult[0]
        }else{
            leaveTypeData = leaveTypeResult[0]
        }

        const leaveRequestResult = await AppDataSource.query(
            `insert into leave_request("startDate", "endDate", reason, "employeeId", "leaveTypeId") values($1, $2, $3, $4, $5) returning *`,
            [new Date(startDate), new Date(endDate), reason, employeeId, leaveTypeData.id]
        )

        const leaveRequest = leaveRequestResult[0]

        return leaveRequest
    },

    viewLeaveRequest: async(_, {employeeId}, context) => {
        if(!employeeId){
            throw new Error("employee id is required")
        }

        if(Number(context.user.id) !== Number(employeeId)){
            throw new Error("UnAuthenticated Access")
        }

        const result = await AppDataSource.query(
            `select 
                l.id as "leave_id", 
                l."startDate" as "leave_startDate",
                l."endDate" as "leave_endDate",
                l.reason as "leave_reason", 
                l.status as "leave_status",
                lt.id as "leave_type_id",
                lt.name as "leaveType_name",
                e.id as "empployee_id",
                e."firstName" as "employee_firstName",
                e."lastName" as "employee_lastName",
                e.email as "employee_email",
                d.id as "department_id",
                d.name as "department_name"
                from leave_request l 
                left join leave_type lt on l."leaveTypeId" = lt.id 
                left join employee e on l."employeeId" = e.id
                left join department d on e."departmentId" = d.id
                where l."employeeId" = $1`,
                [employeeId]
        );

        return result.map(row => ({
            id: row.leave_id,
            startDate: row.leave_startDate,
            endDate: row.leave_endDate,
            reason: row.leave_reason,
            status: row.leave_status,
            leaveType: {
                id: row.leave_type_id,
                name: row.leaveType_name
            },
            employee: {
                id: row.employee_id,
                firstName: row.employee_firstName,
                lastName: row.employee_lastName,
                department: {
                    id: row.department_id,
                    name: row.department_name
                }
            }
        }));
    },

    approveLeaveRequest: async(_, {id}, context) => {
        if(!id){
            throw new Error("leave id is required")
        }

        if(!context.user){
            throw new Error("UnAuthenticated Access")
        }

        if(context.user.role !== 'Manager'){
            throw new Error("You are not allowed to perform this action")
        }

        const leaveRequestResult = await AppDataSource.query(
            `select * from leave_request where id = $1`, [id]
        );

        if (leaveRequestResult.length === 0) {
            throw new Error("leave request not exist");
        }

        const leaveRequest = leaveRequestResult[0];

        await AppDataSource.query(
            `update leave_request set status = $1 where id = $2`, ["APPROVED", id]
        )

        return leaveRequest
    },

    rejectLeaveRequest: async(_, {id}, context) => {
        if(!id){
            throw new Error("leave id is required")
        }

        if(!context.user){
            throw new Error("UnAuthenticated Access")
        }

        if(context.user.role !== 'Manager'){
            throw new Error("You are not allowed to perform this action")
        }

        const leaveRequestResult = await AppDataSource.query(
            `select * from leave_request where id = $1`, [id]
        );

        if (leaveRequestResult.length === 0) {
            throw new Error("leave request not exist");
        }

        const leaveRequest = leaveRequestResult[0];

        await AppDataSource.query(
            `update leave_request set status = $1 where id = $2`, ["REJECTED", id]
        )

        return leaveRequest
    },

    serachEmployee: async(_, {searchTerm}, context) => {
        if(!context.user){
            throw new Error("UnAuthenticated Access")
        }

        const employees = await AppDataSource.query(
            `select e.* from employee e 
            join 
            department d 
            on d.id = e."departmentId" 
            where e."firstName" ILIKE $1 OR d.name ILIKE $1 `,
            [`%${searchTerm}%`]
        )

        for (let employee of employees) {
            const deptResult = await AppDataSource.query(
                `select id, name from department where id = $1`,
                [employee.departmentId]
            );
            employee.department = deptResult[0] 
            const leavesResult = await AppDataSource.query(
                `select * from leave_request where "employeeId" = $1`,
                [employee.id]
            );
            employee.leaveRequest = leavesResult
        }

        return employees
    }
}

module.exports = {LeaveResolver}