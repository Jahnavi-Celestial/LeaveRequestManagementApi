const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "LeaveRequest",
    tableName: "leave_request",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        startDate:{
            type: "timestamptz",
            nullable: false,
        },
        endDate:{
            type: "timestamptz",
            nullable: false,
        },
        reason:{
            type: "text",
            nullable: false
        },
        status: {
            type: "text",
            default: "PENDING"
        }
    },
    relations:{
        employee: {
            type: "many-to-one",
            target: "Employee",
            joinColumn: true,
        },
        leaveType: {
            type: "many-to-one",
            target: "LeaveType",
            joinColumn: true,
        }
    }
})