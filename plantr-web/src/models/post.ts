import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne
} from 'typeorm';

import Plant from './plant';
import { PostType } from 'common/postType';

@Entity('post')
export default class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(type => Plant, plant => plant.post)
  plants: Plant[];

  @Column('text')
  url: string;

  @Column('text')
  type: PostType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
