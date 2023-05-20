import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
} from 'typeorm';

@Entity()
export class Relationships {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  follower_id: number;

  @Column()
  following_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @AfterInsert()
  logInsert() {
    console.log('Inserted Relation with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed Relation with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated Relation with id', this.id);
  }
}
