import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType("leaverequest")
export class LeaveRequest{
    @PrimaryGeneratedColumn()
    id!: number 

    @Column(()=>Date)
    @Field(()=>Date)
    startDate!: string

    @Column(()=>Date)
    @Field(()=>Date)
    endDate!: string

    @Column(()=>String)
    @Field(()=>String)
    reason!: string

    @Column(()=>String)
    @Field(()=>String, {defaultValue: 'Pending'})
    status!: string

    @Column(()=>Number)
    @Field(()=>Number)
    emp_id!: number
}