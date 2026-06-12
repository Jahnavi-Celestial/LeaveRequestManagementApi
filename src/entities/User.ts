import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType("user")
export class User{
    @PrimaryGeneratedColumn()
    id!: number

    @Field(()=>String,{nullable: false})
    @Column(()=>String)
    name!: string

    @Field(()=>String,{nullable: false})
    @Column(()=>String)
    email!:string

    @Field(()=>String,{nullable: false})
    @Column(()=>String)
    password!: string

    @Field(()=>String,{nullable: false})
    @Column(()=>String)
    role!: string
}