DELETE FROM category;
INSERT INTO category(category_id, category) VALUES ('7f14a85c-4277-4ff7-971f-6b8e4858695c', '{"name": "Electronics & Media"}');
INSERT INTO category(category_id, category) VALUES ('0cdbcb06-bf02-4354-b756-ed33b95f65f8', '{"name": "Clothing & Accessories"}');
INSERT INTO category(category_id, category) VALUES ('efe1fd79-a9d0-404b-9242-5e6962271374', '{"name": "Toys"}');
INSERT INTO category(category_id, category) VALUES ('84805ebd-58d4-441a-87e4-8ce14df50006', '{"name": "Sports & Outdoors"}');
INSERT INTO category(category_id, category) VALUES ('a5b19a61-0f3f-478c-81bf-639a533b2804', '{"name": "Beauty Products"}');
INSERT INTO category(category_id, category) VALUES ('31a8fb5f-cbec-4cbc-bed4-bdc7fcf97f58', '{"name": "Vehicles"}');
INSERT INTO category(category_id, category) VALUES ('43cc8389-481a-43b9-abf3-e428f5b15a7e', '{"name": "Home & Garden Tools"}');

DELETE FROM subcategory;

INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('628a2def-7df5-472e-9c45-7cdf6cf5cc64', '7f14a85c-4277-4ff7-971f-6b8e4858695c', '{"name": "Cell Phones & Accessories", "attributes": {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('78cc2d90-32e8-4c92-a659-a73aef0a6cfe', '7f14a85c-4277-4ff7-971f-6b8e4858695c', '{"name": "Cameras & Photography", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('c914dedf-30cc-4bcd-ab51-eed2616571a7', '7f14a85c-4277-4ff7-971f-6b8e4858695c', '{"name": "Laptops & PCs", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('635e3b84-2ccf-4704-9a56-1a6cb1853b8a', '7f14a85c-4277-4ff7-971f-6b8e4858695c', '{"name": "Video Games & Consoles", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('3cf37e1b-1e88-401e-b93b-3cb4a8140aec', '7f14a85c-4277-4ff7-971f-6b8e4858695c', '{"name": "Audio & Speakers", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('b48cffb9-c126-4afd-8539-a44419435550', '7f14a85c-4277-4ff7-971f-6b8e4858695c', '{"name": "Other", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');

-- Clothing & Accessories
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('54c5baa6-1207-4df3-8285-f0d472b02c74', '0cdbcb06-bf02-4354-b756-ed33b95f65f8', '{"name": "Women''s Clothing", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('22f4c978-1390-4a1c-af01-23755351f064', '0cdbcb06-bf02-4354-b756-ed33b95f65f8', '{"name": "Men''s Clothing", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('05d9c9a3-4398-431f-a916-93ce03522810', '0cdbcb06-bf02-4354-b756-ed33b95f65f8', '{"name": "Women''s Shoes", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('44659ab5-6273-40a3-b96b-d2c9487b6ec9', '0cdbcb06-bf02-4354-b756-ed33b95f65f8', '{"name": "Men''s Shoes", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('0e321c44-98f4-4606-bc48-fd62f59429ba', '0cdbcb06-bf02-4354-b756-ed33b95f65f8', '{"name": "Kid''s Section", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('c0b2bff1-56a6-4976-83b8-d3b80daee6a5', '0cdbcb06-bf02-4354-b756-ed33b95f65f8', '{"name": "Other", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');

-- Toys
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('73175218-62dd-4d46-951c-09c6f19014ae', 'efe1fd79-a9d0-404b-9242-5e6962271374', '{"name": "Games & Puzzles", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('443b71f4-4a43-4db1-9de7-19a9228aab71', 'efe1fd79-a9d0-404b-9242-5e6962271374', '{"name": "Outdoor Toys", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('58136fd7-6c37-4235-9f75-c56ede474de4', 'efe1fd79-a9d0-404b-9242-5e6962271374', '{"name": "Musical Instruments", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('829442c9-d7d0-486d-b148-931457e91fda', 'efe1fd79-a9d0-404b-9242-5e6962271374', '{"name": "Other", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');

-- Sports & Outdoors
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('d19308ed-48f6-4dcc-b6ba-19da987d9e18', '84805ebd-58d4-441a-87e4-8ce14df50006', '{"name": "Bikes & Cycling", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('783ebae7-909d-4c6e-897e-adffc6138278', '84805ebd-58d4-441a-87e4-8ce14df50006', '{"name": "Snowboarding", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('9fbf5b9d-6d18-46a6-b0f5-a32d19e9a4bb', '84805ebd-58d4-441a-87e4-8ce14df50006', '{"name": "Sports Equipments", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('d19e0d05-6fee-4f40-87d5-f115135e138d', '84805ebd-58d4-441a-87e4-8ce14df50006', '{"name": "Camping & Hiking", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('2cd1b462-292b-409b-ab25-4bf96cd27552', '84805ebd-58d4-441a-87e4-8ce14df50006', '{"name": "Yoga & Pilates", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('8cc73e52-1686-46b8-808f-20a6bf98f071', '84805ebd-58d4-441a-87e4-8ce14df50006', '{"name": "Other", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');

-- Beauty Products
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('bbe82243-751b-4c1e-a409-ab7d3e75e7f7', 'a5b19a61-0f3f-478c-81bf-639a533b2804', '{"name": "Makeup & Cosmetics", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('a49bd28d-0078-43a6-bb70-d546519d874c', 'a5b19a61-0f3f-478c-81bf-639a533b2804', '{"name": "Hair Care", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('7990a4d9-208c-4217-a170-4d9af9d76e24', 'a5b19a61-0f3f-478c-81bf-639a533b2804', '{"name": "Bath & Body", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('98d00858-e45a-4881-9010-ef8c0f8edf4f', 'a5b19a61-0f3f-478c-81bf-639a533b2804', '{"name": "Skincare", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('20c284b3-59dc-486b-be75-f9827799194e', 'a5b19a61-0f3f-478c-81bf-639a533b2804', '{"name": "Fragrance", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('5e798c30-8e45-465c-a46a-7045c1cb565e', 'a5b19a61-0f3f-478c-81bf-639a533b2804', '{"name": "Other", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');

-- Vehicles
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('1bcc3828-f988-404d-9408-51b85c5ededd', '31a8fb5f-cbec-4cbc-bed4-bdc7fcf97f58', '{"name": "Cars & Trucks", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"], "Mileage": 0, "Title-Status": ["clean", "salvage", "rebuilt", "lost"], "Drive": ["rwd","fwd","awd","4x4"], "Transmission": ["manual", "automatic"], "Fuel": ["gas","diesel","hybrid","electric"], "Year":0}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('b22b8bc9-27a7-41c7-b388-c9fc62b59805', '31a8fb5f-cbec-4cbc-bed4-bdc7fcf97f58', '{"name": "Motorcycles", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"], "Mileage": 0, "Title-Status": ["clean", "salvage", "rebuilt", "lost"], "Year":0}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('00c723c8-a687-4e3b-b662-14d34a3f3aff', '31a8fb5f-cbec-4cbc-bed4-bdc7fcf97f58', '{"name": "Campers & RVs", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"], "Mileage": 0, "Title-Status": ["clean", "salvage", "rebuilt", "lost"], "Drive": ["rwd","fwd","awd","4x4"], "Transmission": ["manual", "automatic"], "Fuel": ["gas","diesel","hybrid","electric"], "Year":0}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('9407bc1d-70d3-405d-978a-83ad786c3643', '31a8fb5f-cbec-4cbc-bed4-bdc7fcf97f58', '{"name": "Accessories & Parts", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('97ef472e-e20e-4b5b-a578-4e50c7279d40', '31a8fb5f-cbec-4cbc-bed4-bdc7fcf97f58', '{"name": "Other", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');

-- Home & Garden Tools
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('a472862e-b252-4d7b-aec0-f121010545d6', '43cc8389-481a-43b9-abf3-e428f5b15a7e', '{"name": "Furniture", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('65069485-ce38-4827-bdc5-3e3b7259bb9c', '43cc8389-481a-43b9-abf3-e428f5b15a7e', '{"name": "Appliances", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('dd3678f8-ae0e-417d-b684-e5c0f7d0b05b', '43cc8389-481a-43b9-abf3-e428f5b15a7e', '{"name": "Lawn & Garden", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('266f0f51-abf4-42e0-a553-27763a163311', '43cc8389-481a-43b9-abf3-e428f5b15a7e', '{"name": "Tools & Machinery", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
INSERT INTO subcategory(subcategory_id, category, subcategory) VALUES ('64c63c02-79fe-451a-9517-20a1062318e1', '43cc8389-481a-43b9-abf3-e428f5b15a7e', '{"name": "Other", "attributes":  {"Condition": ["New", "Like new","Excellent","Good","Fair","Poor"]}}');
