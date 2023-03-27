:warning: **This is just a clone of the original group project repository**: Original is kept private! :warning:
# Placeholder

A responsive and internationalized eCommerce application where users can browse, buy, and sell products.  

* This group project consists of three Web Applications—_Administration App, Moderation App, and Web App_—which communicate with four different microservices, namely  Account Service, Category Service, Message Service, and Product Service.    
* In the Web App, users can browse, search, and filter products in general or in specific categories and subcategories. 
* Filters are subcategory specific. For example, a user can filter by Mileage if they are browsing the “Cars & Trucks” subcategory but they will be unable to do so inside the Toys subcategory. 
* Searching and Filtering share a context such that a search will automatically filter results based on current category, subcategory, and all other applied filters.
* If logged in, users will be able to sell products. Users need to upload images, choose from a list category and a subcategory, and provide all the required subcategory specific attributes in order to post their product.  
* If logged in, users will also be able to start conversations and communicate with other sellers.  
* In the Administration App, administrators are able to create categories, subcategories, and attributes inside each subcategory.  
* In the Moderation App, moderators are able to edit, approve, or deny flagged uploaded products.  
* All the data is stored inside the PostgreSQL database. The project also supports CI/CD and it is able to create a deployable docker image of the website. Languages supported: English and French.  
* Technology stack: TypeScript, TypeGraphQL, NextJS, ExpressJS, React, PostgreSQL.  

## Demonstration
YouTube Link: https://www.youtube.com/watch?v=aLGYRiAF4z0 
[![Placeholder Demonstration](https://github.com/local-advocate/Placeholder/blob/main/Placeholder.PNG)](https://www.youtube.com/watch?v=aLGYRiAF4z0 "Placeholder Demonstration")
