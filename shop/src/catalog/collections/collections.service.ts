import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Collection} from "./collections.model";
import {Repository} from "sequelize-typescript";
import {where} from "sequelize";
import {Brand} from "../brands/brands.model";

@Injectable()
export class CollectionsService {
  constructor(@InjectModel(Collection) private collectionRepository: Repository<Collection>) {}

  async getAllCollection() {
    try {
      return await this.collectionRepository.findAll({raw: true})
    } catch (e) {
      return e
    }
  }

  async getCollectionByBrand(brand_id) {
    try {
      return await this.collectionRepository.findAll({
        where: { brand_id },
        raw: true
      })
    } catch (e) {
      return e
    }
  }
}
