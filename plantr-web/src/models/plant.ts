import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne
} from 'typeorm';

import { Length, IsEmail } from 'class-validator';
import Post from './post';

@Entity('plant')
export default class Plant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => Post, post => post.plants, {
    cascade: true
  })
  post: Post;

  @Column('text')
  userName: string;

  @Column('bool')
  donationMade: boolean;

  @Column('text')
  @Length(5, 100)
  @IsEmail()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
