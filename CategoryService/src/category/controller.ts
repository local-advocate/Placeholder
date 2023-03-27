import type { CategoryInput, CategoryList, Category, CategoryDetail } from './index';
import {
  Body,
  Controller,
  Post,
  Route,
  Get,
  Path,
} from 'tsoa';
import { CategoryService } from './service';
// import { send } from 'process';

@Route('category')
export class CategoryController extends Controller {
    @Get('list')
  public async get(

  ): Promise<CategoryList[]> {
    return new CategoryService().getAll()
  }

    // subcategory id
    @Get('subcategory/{id}')
    public async getSubcategory(
        @Path() id: string,
    ): Promise<CategoryDetail | undefined> {
      const res = await new CategoryService().getSubcategory(id);
      if (res) {
        return res;
      } else {
        this.setStatus(404);
      }
    }

    @Post('create')
    public async create(
        @Body() category: CategoryInput,
    ): Promise<CategoryList> {
      console.log(category)
      const res = await new CategoryService().create(category.name, category.subcategories)
      this.setStatus(201);
      console.log(res);
      return res as CategoryList
    }
    @Get('delete/{id}')
    public async delete(
        @Path() id: string,
    ): Promise<Category| undefined> {
      try{
        const res = await new CategoryService().delete(id)
        return res
      } catch {
        this.setStatus(404)
      }
    }
}