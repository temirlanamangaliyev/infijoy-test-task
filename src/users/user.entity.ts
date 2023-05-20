import { Friends } from 'src/friends/friends.entity';
import { Relationships } from 'src/relationships/relationships.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  OneToMany,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  dob: Date;

  @Column()
  address: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Relationships, (relationship) => relationship.follower)
  followers: Relationships[];

  @OneToMany(() => Relationships, (relationship) => relationship.following)
  following: Relationships[];

  @OneToMany(() => Friends, (friend) => friend.user)
  friends: Friends[];

  @OneToMany(() => Friends, (friend) => friend.friend)
  friendOf: Friends[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }
}
