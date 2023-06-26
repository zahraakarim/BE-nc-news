# Northcoders News API

## Cloning the repository

1. Fork and clone this repository locally.
2. Run `npm install` to install all required dependencies, but note that as the `.env` files are added to `gitignore`, you will not be able to access this locally when cloned.
3. To create the environment variables, you'll need to create two new files, one called `.env.development` and the other called `.env.test`. Within `.env.development` you'll need to connect to the database by adding `PGDATABASE=nc_news`, and within `.env.test` you'll need to connect to the database by adding `PGDATABASE=nc_news_test`.

