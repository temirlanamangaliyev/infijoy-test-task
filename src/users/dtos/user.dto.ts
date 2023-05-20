import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  dob: Date;

  @Expose()
  address: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;
}
