import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { hash } from 'bcrypt'

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 80, nullable: false })
  @MinLength(2)
  @IsNotEmpty()
  name: string

  @Column({ length: 80, nullable: false, unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Column({ nullable: false })
  @MinLength(8)
  @IsNotEmpty()
  password: string

  @Column({ default: false })
  deleted: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await hash(this.password, 10)
  }

  toJSON() {
    return { ...this, id: undefined, password: undefined, deleted: undefined }
  }
}
