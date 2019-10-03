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

@Entity('post')
export default class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(type => Plant, plant => plant.post, {
    cascade: true
  })
  plants: Plant[];

  @Column('url')
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
