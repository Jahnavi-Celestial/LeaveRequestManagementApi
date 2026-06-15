const { EntitySchema, JoinColumn } = require("typeorm");


module.exports = new EntitySchema({
    name: "Employee",
    tableName: "employee",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        firstName: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        lastName: {
            type: "varchar",
            length: 100,
            nullable: true
        },
        email: {
            type: "varchar",
            length: 100,
            nullable: false
        }
    },
    relations:{
        department: {
            type: "many-to-one",
            target: "Department",
            joinColumn: true,
        },
        leaveRequest: {
            type: "one-to-many",
            target: "LeaveRequest",
            inverseSide: "employee"
        }
    },
})