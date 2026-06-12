import "reflect-metadata";
import { AppDataSource } from "./database/db.ts"
import {ApolloServer} from "@apollo/server"
import { buildSchema } from 'type-graphql';
import { startStandaloneServer } from '@apollo/server/standalone';
import { UserResolver } from "./resolvers/UserResolver.ts";
import { LeaveResolver } from "./resolvers/LeaveResolver.ts";
import type { MyContext } from "./middleware/authMiddleware.ts";

async function main(){
    try{
        await AppDataSource.initialize()
        console.log('connected to database')
    }
    catch(err){
        console.log("error in database connection", err.message)
    }

    const schema = await buildSchema({
        resolvers: [UserResolver, LeaveResolver]
    })

    const server = new ApolloServer({
        schema,
    })

    const {url} = await startStandaloneServer(server,{
            listen: 4000,
            context: async ({ req, res }: { req: any; res: any }): Promise<MyContext> => ({ req, res})
        }
    )

    console.log(`Server running at ${url}`)
}

main()