import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './schemas/product.schema';
import { Category } from 'src/category/schemas/category.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    return this.productModel.create({
      ...createProductDto,
      category_id: new Types.ObjectId(createProductDto.category_id),
    });
  }

  async findAll(categoryName: string) {
    const filter: any = {};
    if (categoryName) {
      const category = await this.categoryModel.findOne({
        category_name: categoryName,
      });

      if (!category) return [];
      filter.category_id = category._id;
    }

    return this.productModel.find(filter).populate('category_id').exec();
  }

  findOne(id: string) {
    return this.productModel.findById(id).populate('category_id').exec();
  }
}
