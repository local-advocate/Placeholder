DROP TABLE IF EXISTS category CASCADE;
CREATE TABLE category(category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), category jsonb);
CREATE UNIQUE INDEX category_idx ON category((category->>'name'));

DROP TABLE IF EXISTS subcategory CASCADE;
CREATE TABLE subcategory(subcategory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), category UUID REFERENCES category(category_id) ON DELETE CASCADE, subcategory jsonb);
