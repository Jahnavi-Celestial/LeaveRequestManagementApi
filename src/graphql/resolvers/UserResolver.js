const { AppDataSource } = require("../../database/db");
const User = require("../../entity/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Employee = require("../../entity/Employee");
const Department = require("../../entity/Department");

dotenv.config();

const UserResolver = {
  register: async (_, { email, password, firstName, lastName, role, deptName }) => {
    const isEmailExist = await AppDataSource.query(
        `select * from users where email = $1`, [email]
    )

    if (isEmailExist.length > 0) {
      throw new Error("User already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = await AppDataSource.query(
        `insert into users(name, email, password, role) values($1, $2, $3, $4) returning *`, [firstName, email, hashedPassword, role]
    )

    const user = userData[0]

    let deptData = await AppDataSource.query(
        `select * from department where name = $1`, [deptName]
    )

    let department;
    if(deptData.length == 0){
        const newDeptData = await AppDataSource.query(
            `insert into department(name) values($1) returning *`, [deptName]
        )
        department = newDeptData[0]
    }else{
        department = deptData[0]
    }

    const employee = await AppDataSource.query(
        `insert into employee("firstName", "lastName", email, "departmentId") values($1,$2,$3,$4) returning *`, [firstName, lastName, email, department.id]
    )

    return user
  },

  login: async (_, { email, password }) => {
    const isEmailExistData = await AppDataSource.query(
        `select * from users where email = $1`, [email]
    )

    if (isEmailExistData.length == 0) {
      throw new Error("Invalid Credentials");
    }

    const isEmailExist = isEmailExistData[0]

    const isPasswordMatched = await bcrypt.compare(
      password,
      isEmailExist.password,
    );

    if (!isPasswordMatched) {
      throw new Error("Invalid Credentials");
    }

    const token = jwt.sign(
      {
        id: isEmailExist.id,
        email: isEmailExist.email,
        role: isEmailExist.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    return token;
  },
};

module.exports = { UserResolver };
