import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType("leavetype")
export class LeaveType{
    @PrimaryGeneratedColumn()
    id!: number

    @Field(()=>String,{nullable: false})
    @Column(()=>String)
    name!: string
    
    @Column(()=>Number)
    @Field(()=>Number)
    emp_id!: number
}