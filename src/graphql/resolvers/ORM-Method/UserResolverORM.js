const { AppDataSource } = require("../../database/db");
const User = require("../../entity/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Employee = require("../../entity/Employee");
const Department = require("../../entity/Department");

dotenv.config();

const UserResolverORM = {
  register: async (_, { email, password, firstName, lastName, role, deptName }) => {
    const userRepo = AppDataSource.getRepository(User);

    const isEmailExist = await userRepo.findOne({
      where: { email: email },
    });

    if (isEmailExist) {
      throw new Error("User already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepo.save({
      name: firstName,
      email,
      password: hashedPassword,
      role,
    });

    const deptRepo = AppDataSource.getRepository(Department);
    let department = await deptRepo.findOne({
      where: { name: deptName },
    });

    if (!department) {
      department = await deptRepo.save({
        name: deptName,
      });
    }

    const empRepo = AppDataSource.getRepository(Employee);
    const employee = await empRepo.save({
      firstName,
      lastName,
      email,
      department: department,
    });

    return user;
  },

  login: async (_, { email, password }) => {
    const userRepo = AppDataSource.getRepository(User);

    const isEmailExist = await userRepo.findOne({
      where: { email: email },
    });

    if (!isEmailExist) {
      throw new Error("Invalid Credentials");
    }

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

module.exports = { UserResolverORM };
