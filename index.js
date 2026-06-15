require("reflect-metadata")
const express = require("express")
const { ApolloServer } = require("apollo-server-express")
const { AppDataSource } = require("./src/database/db")
const { startStandaloneServer } = require("@apollo/server/standalone")
const { typeDefs } = require("./src/graphql/schema")
const { UserResolver } = require("./src/graphql/resolvers/UserResolver")
const User = require("./src/entity/User")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const { LeaveResolver } = require("./src/graphql/resolvers/LeaveResolver")

dotenv.config();

async function main(){
    try{
        await AppDataSource.initialize()
        console.log("Connected to DB")
    }
    catch(err){
        console.log(err.message)
    }

    const app = express()

    const resolvers = {
        Query: {
            viewLeaveRequest: LeaveResolver.viewLeaveRequest,

            serachEmployee: LeaveResolver.serachEmployee,
        },
        Mutation: {
            register: UserResolver.register,
            login: UserResolver.login,

            createLeaveRequest: LeaveResolver.createLeaveRequest,

            approveLeaveRequest: LeaveResolver.approveLeaveRequest,
            rejectLeaveRequest: LeaveResolver.rejectLeaveRequest,
        }
    }

    const server = new ApolloServer({
        typeDefs,
        resolvers: resolvers,
        context: async({req}) => {
            try{
                const token = req.headers.authorization?.split(" ")[1];
                if(!token) return { user: null };

                const decoded = jwt.verify(token, String(process.env.JWT_SECRET));
                const user = await AppDataSource.getRepository(User).findOneBy({id: decoded.id})

                return {user};
            }
            catch(err){
                console.log("error in authorization", err.message)
            }
        }
    })

    await server.start()
    server.applyMiddleware({app})

    app.listen({port: 4000}, ()=>{
        console.log(`Server running at http://localhost:4000${server.graphqlPath}`);
    })
}

main()