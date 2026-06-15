
const typeDefs = `#graphql
    type User{
        id: ID!,
        name: String!,
        email: String!,
        role: String!
    }

    type Employee{
        id: ID!,
        firstName: String!,
        lastName: String,
        email: String!,
        department: Department,
        leaveRequest: [LeaveRequest]
    }

    type Department{
        id: ID!,
        name: String!,
        employee: [Employee]
    }

    type LeaveType{
        id: ID!,
        name: String!
    }

    type LeaveRequest{
        id: ID!,
        startDate: String!,
        endDate: String!,
        reason: String!,
        status: String,
        employee: Employee,
        leaveType: LeaveType
    }

    type Query{
        viewLeaveRequest(employeeId: ID!): [LeaveRequest]
        serachEmployee(searchTerm: String): [Employee]
    }

    type Mutation{
        register(email: String!, password: String!, firstName: String!, lastName: String!, role: String!, deptName: String!): User
        login(email: String!, password: String!): String

        createLeaveRequest(employeeId: ID!, startDate: String!, endDate: String!, reason: String!, leaveType: String!): LeaveRequest

        approveLeaveRequest(id: ID!): LeaveRequest
        rejectLeaveRequest(id: ID!): LeaveRequest
    }
`

module.exports = {typeDefs}