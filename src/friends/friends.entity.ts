import { Users } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Friends {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  friend_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Users, (user) => user.friends)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Users, (user) => user.friendOf)
  @JoinColumn({ name: 'friend_id' })
  friend: Users;

  @AfterInsert()
  logInsert() {
    console.log('Inserted Friend with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed Friend with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated Friend with id', this.id);
  }
}
