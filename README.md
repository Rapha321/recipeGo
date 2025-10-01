## recipeGO

This is the final project for Harvard [CS50's Web Programming with Python and Javascript](https://cs50.harvard.edu/web/). **recipeGo** is a full-stack web application designed to allow users to create, share, and manage recipes. It features user authentication, a recipe creation form, and a dedicated profile page.

------------------------------

#### Distinctiveness and Complexity
recipeGO stands distinctly apart from the other projects in this course in several key ways. Unlike the Commerce project (an auction site) or the Network project (a social media platform), recipeGO is a specialized recipe management application that focuses on culinary content creation and organization rather than general e-commerce or social networking.

The complexity of this project is demonstrated through multiple layers of functionality. First, the application implements a comprehensive recipe management system with full CRUD operations, allowing users to create, read, update, and delete recipes with detailed ingredient lists. The recipe model handles complex data structures including multiple ingredients, detailed cooking instructions, and user relationships.

The technical architecture showcases advanced full-stack development practices. The backend utilizes Django REST Framework to create a robust RESTful API with JWT-based authentication for secure user sessions, custom serializers for handling complex recipe data, and proper relationship management between users and their recipes. The frontend demonstrates modern React development with Context API for global authentication state management, efficient API communication patterns, and Material-UI for a professional, responsive design system.

The user experience layer adds another dimension of complexity through features like persistent user authentication, dynamic recipe creation forms, comprehensive user profile management, and a favorites system that allows users to bookmark their preferred recipes. The application maintains clean separation of concerns with dedicated components for authentication, recipe management, and user profiles, while ensuring seamless navigation and state persistence across the entire application.

Furthermore, the mobile-responsive design ensures seamless functionality across all device types, with optimized layouts for recipe viewing and creation on both desktop and mobile platforms. The state management system maintains user authentication across page refreshes and handles data relationships between users, recipes, and favorites efficiently through proper React Context implementation.


-------------------------------

#### Features

 - **User Authentication**: Secure user registration, login, and logout with JWT tokens.
 - **Recipe Management**: A complete CRUD (Create, Read, Update, Delete) system for managing recipes.
 - **Favorite Recipes**: Users can save and manage their favorite recipes with one-click functionality.
 - **Recipe Organization**: Categorize recipes using tags for better organization.
 - **User Profiles**: A dedicated profile page to view and edit user-specific information.
 - **Global State**: Seamless user authentication state management across the application using React context (global state).
 - **Secure API**: Communication between the frontend and backend using a RESTful API with JWT authentication.
 - **Mobile Responsive**: Fully optimized for mobile devices with responsive design patterns.

-------------------------------

#### Technologies

**1. Backend**
 - **Python**: The primary programming language.
 - **Django**: A high-level Python web framework for rapid development.
 - **Django REST Framework (DRF)**: A powerful toolkit for building Web APIs.
 - **JWT (JSON Web Tokens)**: Used for secure user authentication.
 - **DQLite/PostgreSQL**: Database for storing recipes, users/profiles, tags, comments and relationships.

**2. Frontend**
 - **React**: A JavaScript library for building user interfaces.
 - **React Context API**: Used for global state management to handle the user's authentication status.
 - **MUI (Material-UI)**: A popular React UI framework for building beautiful and responsive user interfaces.
 - **Vite**: A fast frontend build tool.
 - **Axios**: HTTP client for API communications.

-------------------------------

#### File Structure

**Backend (/backend/backend)**
 - `urls.py`: URL routing for all API endpoints
 - `settings.py`: Django configuration including CORS, JWT, and database settings
 - `manage.py`: Django management script for running commands
 - `requirements.txt`: Python package dependencies

**API (/backend/api)**
 - `models.py`: Contains the Recipe, User/Profile, Tag and Comment models with their relationships
 - `serializers.py`: Django REST Framework serializers for API data transformation
 - `views.py`: API views handling CRUD operations for recipes and user management
 - `serializers.py`: API serializers for data conversion between JSON and Python objects
 - `signals.py`: Handling of profile creation when a user register
 - `urls.py`: API URL routing and endpoint definitions
 - `tests.py`: Test api endpoints
 - `apps.py`: API application configuration
 - `admin.py`: Django admin configuration for managing models through admin interface


**Frontend (/frontend/src)**
Components:
 - `AllRecipes.jsx`: Component displaying all recipes in a list/grid format
 - `Comment.jsx`: Individual comment component for recipe discussions
 - `CreateRecipe.jsx`: Form component for creating new recipes
 - `DeleteConfirmation.jsx`: Modal component for confirming recipe deletions
 - `Form.jsx`: Reusable authentication form for login and registration
 - `LoadingIndicator.jsx`: Loading spinner component
 - `LoginRegister.jsx`: Combined login and registration interface
 - `MyFavorites.jsx`: User's favorite recipes display component
 - `MyRecipes.jsx`: User's personal recipes management component
 - `Navbar.jsx`: Navigation bar with authentication controls
 - `Profile.jsx`: User profile management interface
 - `ProtectedRoute.jsx`: Route protection component for authenticated users
 - `RecipeDialog.jsx`: Modal for detailed recipe viewing
 - `RecipeSecondaryActions.jsx`: Recipe action buttons (favorite, tag, edit, delete)
 - `Tag.jsx`: Recipe tag component for categorization

Pages:
 - `Home.jsx`: Main landing page component
 - `Login.jsx`: Login page wrapper
 - `NotFound.jsx`: 404 error page component
 - `Register.jsx`: Registration page wrapper

Core Files:
 - `App.jsx`: Main application component with routing
 - `AuthContext.jsx`: React Context for global authentication state management
 - `api.js`: Centralized API configuration and request handlers
 - `constants.js`: Application constants including token storage keys
 - `main.jsx`: React application entry point

-------------------------------

#### Installation and Setup

**1. Backend**
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


**2. Frontend**
 - Navigate into the frontend directory:
    `cd frontend`

 - Install npm dependencies:
    `npm install`

 - Start the development server:
    `npm run dev`


Your React app will now be running on `http://localhost:5173` and communicating with the Django backend on `http://localhost:8000`

**Demo Account**
If you want to skip the registration process and test the application immediately, you can use the following demo account:

 - Username: `bob`
 - Password: `bobPassword`

This account comes pre-loaded with sample recipes to demonstrate the application's features.


-------------------------------

#### Features Demo

**Unregistered user**
![Unregistered user](https://github.com/Rapha321/recipeGo/blob/main/recipeGo/backend/media/demo_gif/Unregistered_user.gif)

**User Registration**
![Registration](https://github.com/Rapha321/recipeGo/blob/main/recipeGo/backend/media/demo_gif/Registration.gif)

**Create Recipe**
![Create Recipe](https://github.com/Rapha321/recipeGo/blob/main/recipeGo/backend/media/demo_gif/CreateRecipe.gif)

**Add Tag and Edit recipe**
![Add Tag and Edit recipe](https://github.com/Rapha321/recipeGo/blob/main/recipeGo/backend/media/demo_gif/TagEdit.gif)

**Responsive Design**
![Responsive](https://github.com/Rapha321/recipeGo/blob/main/recipeGo/backend/media/demo_gif/Responsive.gif)