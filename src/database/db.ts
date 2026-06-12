import "reflect-metadata";
import {DataSource} from "typeorm"
import { User } from "../entities/User.ts"
import { Employee } from "../entities/Employee.ts"
import { LeaveRequest } from "../entities/LeaveRequest.ts"
import { LeaveType } from "../entities/LeaveType.ts"
import { Department } from "../entities/Department.ts"

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Cel@Jg#2026',
    database: 'leaveRequestDb',
    entities: [User, Employee, LeaveRequest, LeaveType, Department],
    synchronize: true
})