-- -- Your schema DDL (create table statements) goes here 

DROP TABLE IF EXISTS product CASCADE;
CREATE TABLE product (product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), seller UUID, category UUID, subcategory UUID, product jsonb);

DROP TABLE IF EXISTS image CASCADE;
CREATE TABLE image(id UUID PRIMARY KEY DEFAULT gen_random_uuid(), product_id UUID REFERENCES product(product_id) ON DELETE CASCADE, img BYTEA, data jsonb);