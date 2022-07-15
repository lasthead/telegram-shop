import {Column, Model, Table, DataType, HasMany} from "sequelize-typescript";
import {Collection} from "../collections/collections.model";

@Table({tableName: 'brands'})
export class Brand extends Model<Brand> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number

  @Column({ type: DataType.STRING, unique: false })
  name: string

  @HasMany(() => Collection)
  collection: Collection[]

  @Column({ type: DataType.STRING, unique: true })
  alias: string

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active: boolean
}