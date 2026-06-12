import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { LeaveRequest } from "../entities/LeaveRequest.ts";
import { AppDataSource } from "../database/db.ts";
import { LeaveType } from "../entities/LeaveType.ts";
import { Employee } from "../entities/Employee.ts";
import type { MyContext } from "../middleware/authMiddleware.ts";
import { ILike } from "typeorm";

@Resolver()
export class LeaveResolver{
    @Mutation(()=>String)
    async createLeaveRequest(
        @Arg("emp_id", ()=>Number) emp_id: number,
        @Arg("start_date", ()=>String) start_date: string,
        @Arg("end_date", ()=>String) end_date: string,
        @Arg("reason", ()=>String) reason: string,
        @Arg("status", ()=>String) status: string,
        @Arg("leave_type", ()=>String) leaveType: string
    ){
        const leaverequestRepo = AppDataSource.getRepository(LeaveRequest)

        const request = leaverequestRepo.create({
            startDate: start_date,
            endDate: end_date,
            reason: reason,
            status: status,
            emp_id: emp_id
        })

        const leaveTypeRepo = AppDataSource.getRepository(LeaveType)

        await leaveTypeRepo.save({
            name: leaveType,
            emp_id: emp_id
        })

        leaverequestRepo.save(request)

        return "Request created successfully"
    }

    @Query()
    async viewLeaveRequest(
        @Arg("emp_id", ()=>Number) emp_id: number,
        @Arg("leaveRequestId", ()=>Number) LeaveRequestId: number
    ){
        const empRepo = AppDataSource.getRepository(Employee)
        const leaveTypeRepo = AppDataSource.getRepository(LeaveType)
        const leaverequestRepo = AppDataSource.getRepository(LeaveRequest)

        const leaverequest = await leaverequestRepo.findOne({where: {id: LeaveRequestId, emp_id: emp_id}})
        if(!leaverequest){
            throw new Error("No leave request found")
        }

        const employee = await empRepo.findOne({
            where: {id: emp_id},
            relations: {
                department: true
            }
        })

        if(!employee){
            throw new Error("employee not found")
        }

        const leaveType = await leaveTypeRepo.findOne({
            where: {emp_id: emp_id}
        })

        return {
            leaverequest: leaverequest,
            emp_name: employee.firstName,
            dept_name: employee.department.name,
            leaveType: leaveType
        }
    }

    @Mutation(()=>Boolean)
    async approveLeaveRequest(
        @Arg("leaveRequestId", ()=>Number) leaveRequestId: number,
        @Ctx() ctx: MyContext
    ){
        let userRole = ctx?.user?.role

        if(userRole != 'Manager'){
            throw new Error("Unauthorized")
        }

        const leaverequestRepo = AppDataSource.getRepository(LeaveRequest)

        const leaverequest = await leaverequestRepo.findOne({
            where: {id: leaveRequestId}
        })

        if(!leaverequest){
            throw new Error("Leave Request not exist")
        }

        await leaverequestRepo.update(leaverequest.id, {status: 'Approved'})

        return true
    }

    @Mutation(()=>Boolean)
    async rejectLeaveRequest(
        @Arg("leaveRequestId", ()=>Number) leaveRequestId: number,
        @Ctx() ctx: MyContext
    ){
        let userRole = ctx?.user?.role

        if(userRole != 'Manager'){
            throw new Error("Unauthorized")
        }

        const leaverequestRepo = AppDataSource.getRepository(LeaveRequest)

        const leaverequest = await leaverequestRepo.findOne({
            where: {id: leaveRequestId}
        })

        if(!leaverequest){
            throw new Error("Leave Request not exist")
        }

        await leaverequestRepo.update(leaverequest.id, {status: 'Rejected'})

        return true
    }

    @Query(()=>Employee)
    async searchEmployee(
        @Arg("serachBy", ()=>String) serachBy: string,
        @Arg("searchTerm", ()=>String) searchTerm: string
    ){
        const empRepo = AppDataSource.getRepository(Employee)

        if(serachBy === "Employee Name"){
            const employee = await empRepo.findOne({
                where: {
                    firstName: ILike(`%${searchTerm}%`)
                },
                relations: {
                    department: true
                }
            })
            if(!employee){
                throw new Error("Employee not found")
            }

            return employee
        }
        else if(serachBy === "Department Name"){
            const employee = await empRepo.findOne({
                where: {
                    department: {
                        name: ILike(`%${searchTerm}%`)
                    }
                },
                relations: {
                    department: true
                }
            })
            if(!employee){
                throw new Error("Employee not found")
            }

            return employee
        }
    }
}