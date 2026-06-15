const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "text",
            nullable: false
        },
        email: {
            type: "text",
            unique: true,
            nullable: false
        },
        password: {
            type: "text",
            nullable: false
        },
        role: {
            type: 'text',
            nullable: false
        }
    }
})