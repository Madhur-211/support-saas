import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { Business } from '../businesses/business.model';

@Table({
  tableName: 'users',
  schema: 'public',
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare role: 'ADMIN' | 'AGENT';

  @ForeignKey(() => Business)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare business_id: number;

  @BelongsTo(() => Business)
  declare business: Business;

  @CreatedAt
  declare created_at: Date;
}
