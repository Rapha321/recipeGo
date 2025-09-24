## recipeGO

This is the final project for Harvard CS50's Web Programming with Python and Javascript. recipeGo is a full-stack web application designed to allow users to create, share, and manage recipes. It features user authentication, a recipe creation form, and a dedicated profile page.


-------------------------------

#### Features

 - **User Authentication**: Secure user registration, login, and logout.
 - **Recipe Management**: A complete CRUD (Create, Read, Update, Delete) system for managing recipes.
 - **Favorite Recipes**: Users can save and manage their favorite recipes.
 - **Recipe Organization**: Categorize and find recipes using tags.
 - **User Profiles**: A dedicated profile page to view and edit user-specific information.
 - **Global State**: Seamless user authentication state management across the application.
 - **Secure API**: Communication between the frontend and backend using a RESTful API.

-------------------------------
#### Technologies

**1. Backend**
 - **Python**: The primary programming language.
 - **Django**: A high-level Python web framework for rapid development.
 - **Django REST Framework (DRF)**: A powerful toolkit for building Web APIs.
 - **JWT (JSON Web Tokens)**: Used for secure user authentication.

**2. Frontend**
 - **React**: A JavaScript library for building user interfaces.
 - **React Context API**: Used for global state management to handle the user's authentication status.
 - **MUI (Material-UI)**: A popular React UI framework for building beautiful and responsive user interfaces.
 - **Vite**: A fast frontend build tool.

-------------------------------

#### Installation and Setup

1. Backend
 - Clone the repository:
    `git clone` [https://github.com/Rapha321/recipeGo.git](https://github.com/Rapha321/recipeGo.git)
    `cd to "recipeGo" folder`

 - Create and activate a virtual environment:
    `python -m venv venv`
    `source venv/bin/activate  # On Windows, use venv\Scripts\activate`

 - Install dependencies:
    `cd backend`
    `pip install -r requirements.txt`
 - Run database migrations:
    `python manage.py makemigrations`
    `python manage.py migrate`

 - Start the Django development server:
    `python manage.py runserver`


2. Frontend
 - Navigate into the frontend directory:
    `cd frontend`

 - Install npm dependencies:
    `npm install`

 - Start the development server:
    `npm run dev`


Your React app will now be running and communicating with the Django backend.