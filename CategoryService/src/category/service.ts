import { CategoryList, Category, CategoryDetail, SubcategoryInput } from "./index"
import {pool} from '../db';
//import { toNamespacedPath } from "path";

export class CategoryService {
  public async getAll(): Promise<CategoryList[]> {
    const select = "" +
    "SELECT (c.category || jsonb_build_object('id', c.category_id)) as category, subcategories FROM category c " +
    "FULL JOIN "+
    "(SELECT category, jsonb_agg(subcategory::jsonb || jsonb_build_object('id', subcategory.subcategory_id)) as subcategories FROM subcategory GROUP BY category) sc " +
    "ON c.category_id=sc.category";
    const query = {
      text: select,
      values: [],
    }
    const {rows} = await pool.query(query);
    const categories: CategoryList[] = [];
    for(const ele of rows) {
      for(const sub of ele.subcategories){
        sub.attributes = JSON.stringify(sub.attributes)
      }
      categories.push(ele)
    }
    return categories;
  }

  public async getSubcategory(id: string): Promise<CategoryDetail | undefined> {
    const select = "SELECT (jsonb_build_object('id', s.subcategory_id) || jsonb_build_object('name', s.subcategory->>'name') ||  jsonb_build_object('attributes', s.subcategory->>'attributes')) as subcategory, "+
    "(jsonb_build_object('id', c.category_id) ||  jsonb_build_object('name', c.category->>'name')) as category " +
		"FROM subcategory s, category c " +
    "WHERE s.subcategory_id=$1 AND s.category=c.category_id";
    const query = {
      text: select,
      values: [id],
    }
    const {rows} = await pool.query(query);
    return rows.length == 1 ? rows[0] : undefined;
  }

  public async create(name: string, subcategories: SubcategoryInput[],): Promise<CategoryList| undefined> {
    const insert = "INSERT INTO category(category) VALUES ($1) RETURNING category_id;"
    const query = {
      text: insert,
      values: [JSON.stringify({name: name})]
    }
    let {rows} = await pool.query(query);
    const id = rows[0].category_id;
    console.log(rows);

    let values = "";
    for(let i = 0; i < subcategories.length; i++) {
      subcategories[i].attributes = JSON.parse((subcategories[i].attributes));
      values += `('${id}', '${JSON.stringify(subcategories[i])}')`;
      if(i + 1 !== subcategories.length) {
        values += ", ";
      }
    }

    const insert2 = "INSERT INTO subcategory(category, subcategory) VALUES " + values + " RETURNING subcategory_id;";
    const query2 = {
      text: insert2,
      values: []
    };

    ({rows} = await pool.query(query2));
    console.log(rows);
    const subcat = [];
    for(let i = 0; i < rows.length; i++) {
      subcat.push({name: subcategories[i].name, attributes: subcategories[i].attributes, id: rows[i]['subcategory_id']});
    }
    const category = {name: name, id: id};
    if(rows.length) {
      return {category: category, subcategories: subcat};
    }
  }

  public async delete(id: string): Promise<Category> {
    const del = "DELETE FROM category WHERE category_id = $1 RETURNING category->>'name' as name";
    const query = {
      text: del,
      values: [`${id}`]
    }
    const {rows} = await pool.query(query);
    if(rows.length) {
      return {id: id, name: rows[0].name};
    }
    throw Error('Category doesn\'t exist')
  }
}