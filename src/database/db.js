const { DataSource } = require("typeorm");
const Employee = require("../entity/Employee");
const Department = require("../entity/Department");
const LeaveRequest = require("../entity/LeaveRequest");
const LeaveType = require("../entity/LeaveType");
const User = require("../entity/User");
const dotenv = require("dotenv")

dotenv.config();

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: "leaveRequestDb",
    entities: [User, Employee, Department, LeaveRequest, LeaveType],
    synchronize: true,
})

module.exports =  {AppDataSource}