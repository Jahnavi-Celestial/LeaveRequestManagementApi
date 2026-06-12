import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType("department")
export class Department{
    @PrimaryGeneratedColumn()
    id!: number

    @Column(()=>String)
    @Field(()=>String,{nullable: false})
    name!: string
}