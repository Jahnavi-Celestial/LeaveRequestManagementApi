import { Field, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Department } from "./Department.ts";


@Entity()
@ObjectType("employee")
export class Employee{
    @PrimaryGeneratedColumn()
    id!: number

    @Column(()=>String)
    @Field(()=>String,{nullable: false})
    firstName!: string

    @Column(()=>String)
    @Field(()=>String,{nullable: false})
    lastName!: string

    @Column(()=>String)
    @Field(()=>String,{nullable: false})
    email!: string

    @ManyToOne(()=>Department)
    @JoinColumn()
    department!: Department
}