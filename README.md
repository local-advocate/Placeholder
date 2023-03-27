:warning::warning:  
&emsp;&emsp;**This is just a clone of the original, private group project repository**: Scroll at the end for collaborators!  
&emsp;&emsp;**Commit history, CI/CD logs, Workflows, and Project(s) are excluded from this repository**: Only available inside the original!  
:warning::warning:  

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
YouTube Link: https://www.youtube.com/watch?v=kDQxidw6oag  
[![Placeholder Demonstration](https://github.com/local-advocate/Placeholder/blob/main/Placeholder.PNG)](https://www.youtube.com/watch?v=kDQxidw6oag "Placeholder Demonstration")

## Scripts
The following scripts are meant to be run from the most parent directory of this repository.
```bash
# Install the required modules
npm run installs
```
```bash
# Start the databases (uses ports 5432-5436, by default)
npm run dockers-up
```
```bash
# Run the development servers (uses ports 3000-3002, by default)
npm run dev
```
```bash
# Containerise the application
npm run containerised
```
```bash
npm run tests  # Run the tests (either one)
npm run lint   # Run lint
npm run zip    # Zip the project
```

## Collaborators
1. [Arthur Foy](https://github.com/FoyArthur)
1. [Hang Xian](https://github.com/hsxian2277)
1. [Michelle Hernandez](https://github.com/mhern199)
1. [Ruchit Patel](https://github.com/local-advocate)
1. [Timothy Vermeersch](https://github.com/Timothy-Vermeersch)
