import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Brand} from "./brands.model";
import {Repository} from "sequelize-typescript";
import {Collection} from "../collections/collections.model";

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand) private brandRepository: Repository<Brand>) {}

  async getAllBrands() {
    try {
      return await this.brandRepository.findAll()
    } catch (e) {
      return e
    }
  }
  
  async getBrandCollections(id) {
    // const brand = new Brand({ id: id })

    try {
      return await this.brandRepository.findOne({
        where: { id },
        include: {
          model: Collection,
        },
        // mapToModel: true
        // raw: true,
        // nest: true,
      })
    } catch (e) {
      console.warn(e)
    }
  }
}
