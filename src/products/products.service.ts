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

  async findAll(categoryName: string, page = 1, limit = 10) {
    const filter: any = {};
    if (categoryName) {
      const category = await this.categoryModel
        .findOne({
          category_name: categoryName,
        })
        .lean();

      if (!category) return { products: [], totalPages: 0, currentPage: page };
      filter.category_id = category._id;
    }

    const total = await this.productModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const products = await this.productModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category_id')
      .lean()
      .exec();

    return {
      products,
      totalPages,
      currentPage: page,
      total,
    };
  }

  findOne(id: string) {
    return this.productModel.findById(id).populate('category_id').lean();
  }
}
