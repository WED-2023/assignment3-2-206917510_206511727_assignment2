[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/WkLPf7o5)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=11168133&assignment_repo_type=AssignmentRepo)

# CookingAi - Recipe Sharing API

A full-featured Node.js RESTful API for searching, viewing, saving, and managing recipes — including family recipes passed down generations. Built with Express, MySQL, and the Spoonacular API.

## Id:
Yehonatan Yamin - 206511727

Ido Badash - 206917510

Sahar Eitam - 318283116

## Features

- User registration, login, and logout with session support
- Search recipes from Spoonacular API
- Save and view favorite recipes
- Track last viewed recipes (FIFO, 3 max)
- Add custom personal recipes
- Retrieve full details and ingredient info
- Authorization middleware to protect user-specific endpoints
- Documented in OpenAPI 3.0.3 (Swagger)

## Project Structure

```
project/
├── routes/
│   ├── auth.js          # Login, Register, Logout
│   ├── recipes.js       # Spoonacular recipes
│   ├── user.js          # Favorites, viewed, and user recipes
│
├── utils/
│   ├── DButils.js       # MySQL query handler
│   ├── MySql.js         # MySQL connection
│   ├── recipes_utils.js # External API logic
│   └── user_utils.js    # Logic for user data actions
│
├── main.js              # Express server entry point
├── .env                 # API keys and DB config
├── idoandyehonatan-Recipes-1.0.0-resolved.yaml  # OpenAPI spec
```

## Tech Stack

- Node.js + Express
- MySQL (via MySQL2)
- Spoonacular API
- dotenv
- bcrypt
- express-session
- Swagger (OpenAPI 3.0)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/savta-recipes-api.git
cd savta-recipes-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```
spooncular_apiKey=YOUR_SPOONACULAR_API_KEY
bcrypt_saltRounds=10
```

### 4. Setup the MySQL Database

Make sure you create the following tables:

```sql
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  country VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE FavoriteRecipes (
  user_id INT NOT NULL,
  recipe_id INT NOT NULL,
  PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE LastWatchedRecipes (
  user_id INT PRIMARY KEY,
  recipe_id1 INT,
  recipe_id2 INT,
  recipe_id3 INT
);

CREATE TABLE userrecipes (
  recipe_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255),
  image TEXT,
  readyInMinutes INT,
  popularity INT,
  vegan BOOLEAN,
  vegetarian BOOLEAN,
  glutenFree BOOLEAN,
  instructions TEXT,
  ingredients TEXT
);

CREATE TABLE ViewedRecipes (
  user_id INT NOT NULL,
  recipeId INT NOT NULL,
  PRIMARY KEY (user_id, recipeId)
);
```

### 5. Run the App or go into our web

```bash
node main.js
```
local:
Server starts at: `http://localhost:3000`

Our global server(web):
CookingAi.cs.bgu.ac.il

## API Reference

Full Swagger docs in `idoandyehonatan-Recipes-1.0.0-resolved.yaml`

You can import it into:
- Swagger Editor (https://editor.swagger.io/)
- Postman (https://www.postman.com/)
- Or generate docs using Swagger UI.

## Example Requests

### Login

```http
POST /auth/Login
{
  "username": "ido",
  "password": "123456"
}
```

### Add Custom Recipe

```http
POST /users/add-recipes
{
  "title": "Grandma's Soup",
  "ingredients": "water, carrots, celery",
  "instructions": "Boil everything",
  "vegan": true
}
```

## Contributors

- Ido & Yehonatan & Sahar
- Spoonacular for the food data

## License

This project is for educational use. Do not redistribute without permission.
