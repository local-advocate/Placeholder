import { Product, ProductArgs, ProductCreateOutput, UUID, UpdateProductArgs } from "./index"
import {pool} from '../db';
//const fs = require('fs');

export class ProductService {
  public async getAll(user_id: string|undefined): Promise<Product[]> {
    let select = "SELECT (p.product || jsonb_build_object('id', p.product_id) || jsonb_build_object('seller', p.seller) || jsonb_build_object('images', images.arr)) as product FROM " +
    "product p, (SELECT jsonb_agg(i.img ORDER BY i.data->>'order') as arr, i.product_id  FROM image i GROUP BY(i.product_id)) images WHERE p.product_id = images.product_id";
    
    if(user_id) select += ` AND p.seller = '${user_id}'`;
    const query = {
      text: select,
      values: [],
    }

    const {rows} = await pool.query(query);
    const product = [];
    for(const ele of rows) {
      ele['product'].mainImage = ele['product']['images'][0];
      product.push(ele['product'])
    }
    return product;
  }

  public async getAllFiltered(filters: string): Promise<Product[]> {
    const parsed = JSON.parse(filters);

    let select = "SELECT (p.product || jsonb_build_object('id', p.product_id) || jsonb_build_object('seller', p.seller) || jsonb_build_object('images', images.arr)) as product FROM " +
    "product p, (SELECT jsonb_agg(i.img ORDER BY i.data->>'order') as arr, i.product_id  FROM image i GROUP BY(i.product_id)) images WHERE p.product_id = images.product_id";
    for(const key of Object.keys(parsed)){
      const value = parsed[key] as string
      if('subcategoryprice_minprice_maxq'.includes(key)){
        continue;
      }
      if(key.substring(0,4) === 'min_'){
        select += ` AND ((product->>'attributes')::jsonb->>'${key.substring(4)}')::int >= ${parseInt(value)}`;
      }else if(key.substring(0,4) === 'max_'){
        select += ` AND ((product->>'attributes')::jsonb->>'${key.substring(4)}')::int <= ${parseInt(value)}`;
      }else{
        select += ` AND ((product->>'attributes')::jsonb->>'${key}') = '${value}'`;
      }
    }
    
    // base filters
    if (parsed.category) select += ` AND p.category = '${parsed.category}'`;
    if (parsed.subcategory) select += ` AND p.subcategory = '${parsed.subcategory}'`;
    if (parsed.q) select += ` AND product->>'name' ~* '${parsed.q}'`;
    if (parsed.price_min) select += ` AND (product->>'price')::int >= ${parseInt(parsed.price_min)}`;
    if (parsed.price_max) select += ` AND (product->>'price')::int <= ${parseInt(parsed.price_max)}`;

    const query = {
      text: select,
      values: [],
    }
    const {rows} = await pool.query(query);
    const product = [];
    for(const ele of rows) {
      ele['product'].mainImage = ele['product']['images'][0];
      product.push(ele['product'])
    }
    return product;
  }

  public async getOne(id: UUID) : Promise<Product|undefined> {
    const select = "SELECT (p.product || jsonb_build_object('id', p.product_id) || jsonb_build_object('seller', p.seller) || jsonb_build_object('images', images.arr) || "+
    "jsonb_build_object('category', p.category) ||  jsonb_build_object('subcategory', p.subcategory))" +
		" as product FROM product p," +
    "(SELECT jsonb_agg(i.img ORDER BY i.data->>'order') as arr, i.product_id  FROM image i GROUP BY(i.product_id)) images WHERE p.product_id = images.product_id AND p.product_id=$1 ";
    const query = {
      text: select,
      values: [`${id}`],
    }

    const {rows} = await pool.query(query);
    if(rows.length) {
      rows[0]['product'].mainImage = rows[0]['product']['images'][0];
      rows[0].product.attributes = JSON.stringify(rows[0].product.attributes)
      return rows[0].product
    }
    return undefined;
  }

  // https://urlregex.com
  // https://regexpattern.com/phone-number/
  public async createProduct(user_id: UUID, productJSON: ProductArgs): Promise<ProductCreateOutput> {
    const urlregex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/; //eslint-disable-line
    const numregex = /\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/; //eslint-disable-line

    const {category, subcategory, ...rest} = productJSON;
    rest.attributes = JSON.parse(rest.attributes)
    const newprod = JSON.parse(JSON.stringify(rest));
    if (urlregex.test(productJSON.description)) {
      newprod.flagged = "true";
      newprod.reason = "URL in product";
    } else if (numregex.test(productJSON.description)) {
      newprod.flagged = "true";
      newprod.reason = "Personal information";
    } else {
      newprod.flagged = "false";
      newprod.reason = "";
    }
    const insert = 'INSERT INTO product(seller, product, category, subcategory) VALUES ($1, $2, $3, $4) RETURNING product_id, seller';
    const query = {
      text: insert,
      values: [user_id, newprod, category, subcategory],
    };
    const {rows} = await pool.query(query);
    const ret: ProductCreateOutput = JSON.parse(JSON.stringify(rest));
    ret['id'] = rows[0].product_id;
    ret['seller'] = rows[0].seller;
    //   fs.writeFileSync('data.sql', `INSERT INTO product(product_id, seller, product, category, subcategory) VALUES ('${ret['id']}', '${user_id}', '${JSON.stringify(newprod)}', '${category}', '${subcategory}');\n`,  {'flag':'a'},  function(err: string) {
    //     if (err) {
    //         return console.error(err);
    //     }
    // });
    return ret;
  }

  public async getFlagged(): Promise<Product[]> {
    const select = "SELECT (p.product || jsonb_build_object('id', p.product_id) || " + 
      "jsonb_build_object('seller', p.seller)) as product FROM " +
      "product p WHERE p.product->>'flagged' = 'true'"; //eslint-disable-line
    const query = {text: select};
    const {rows} = await pool.query(query);
    const products = [];
    for(const row of rows) {
      row.product.attributes = JSON.stringify(row.product.attributes);
      products.push(row.product)
    }
    return products;
  }

  public async updateProduct(product_id: UUID, productJSON: UpdateProductArgs): Promise<string|undefined> {
    const newprod = JSON.parse(JSON.stringify(productJSON));
    newprod.flagged = "false";
    newprod.reason = "";
    const insert = `UPDATE product SET product = product || jsonb_build_object('name', $1::text) || jsonb_build_object('description', $2::text) ||
      jsonb_build_object('flagged', $3::text) || jsonb_build_object('reason', $4::text) 
      WHERE product_id = $5 RETURNING product_id, seller`;
    const query = {
      text: insert,
      values: [newprod.name, newprod.description, newprod.flagged, newprod.reason, product_id],
    };
    const {rows} = await pool.query(query);
    if (rows.length!=1) return undefined;
    return product_id;
  }

  public async deleteOne(id: UUID) : Promise<string|undefined> {
    const select = "DELETE FROM product WHERE $1=product_id RETURNING *";
    const query = {
      text: select,
      values: [`${id}`],
    }

    const {rows} = await pool.query(query);
    return rows.length == 1 ? rows[0].product_id : undefined;
  }

  public async approveProduct(product_id: UUID): Promise<string|undefined> {
    const insert = `UPDATE product SET product = product || jsonb_build_object('flagged', 'false') || jsonb_build_object('reason', '') 
      WHERE product_id = $1 RETURNING product_id`;
    const query = {
      text: insert,
      values: [product_id],
    };
    const {rows} = await pool.query(query);
    if (rows.length!=1) return undefined;
    return product_id;
  }  
}

export class ImageService {
  public async upload(data: string, product: UUID, order: number): Promise<string>{
    const insert = `INSERT INTO image (data, product_id, img) VALUES ($1, $2, $3) RETURNING id`
    const blob = {
      order: order
    }
    const query = {
      text: insert,
      values: [blob, product, data],
    }
    //   fs.writeFileSync('data.sql', `INSERT INTO image (data, product_id, img) VALUES ('${JSON.stringify(blob)}', '${product}', '${data}');\n`,  {'flag':'a'},  function(err: string) {
    //     if (err) {
    //         return console.error(err);
    //     }
    // });
    const {rows} = await pool.query(query)
    return rows[0].id
  }
}