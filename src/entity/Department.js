const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Department",
    tableName: "department",
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
    },
    relations:{
        employee:{
            type: "one-to-many",
            target: "Employee",
            inverseSide: "department",
        }
    }
})