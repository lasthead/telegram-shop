import {Column, Model, Table, DataType, ForeignKey, BelongsTo, BelongsToMany} from "sequelize-typescript";
import {Brand} from "../brands/brands.model";
import {Collection} from "../collections/collections.model";
import {Size} from "../sizes/sizes.model";
import {ProductSizes} from "./product-sizes.model";

@Table({tableName: 'products'})
export class Product extends Model<Product> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number

  @ForeignKey(() => Brand)
  @Column({ type: DataType.INTEGER })
  brand_id: number

  @ForeignKey(() => Collection)
  @Column({ type: DataType.INTEGER })
  collection_id: number

  @BelongsTo(() => Brand)
  brand: Brand

  @BelongsTo(() => Collection)
  collection: Collection

  @BelongsToMany(() => Size, () => ProductSizes)
  sizes: Size[]

  @Column({ type: DataType.STRING, allowNull: true })
  name: string

  @Column({ type: DataType.STRING, allowNull: true, unique: true, })
  article: string

  @Column({ type: DataType.INTEGER, allowNull: true })
  price: number

  @Column({ type: DataType.INTEGER, allowNull: true })
  discount?: number

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_active?: boolean
}