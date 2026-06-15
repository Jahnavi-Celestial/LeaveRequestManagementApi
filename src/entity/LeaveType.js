const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "LeaveType",
    tableName: "leave_type",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
            length: 100,
            nullable: false
        },
    }
})