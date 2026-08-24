# Contact Book


#### Description:

Contact Book is a full-stack web application that I built as my CS50x final project. The application gives users a simple way to save and manage their contacts.

Users can create an account using an email address and password. After logging in, each user gets their own private contact book. Users cannot see or manage contacts or groups created by other users.

The application allows users to create, edit, delete, and favorite contacts. Each contact has a required first name and optional last name, email address, and phone number. Contacts can also be organized into groups.

Users can also create their own custom groups. Custom groups can be renamed or deleted. If a custom group is deleted, the contacts inside that group are not deleted. Instead, the group is removed from those contacts.

The application also includes search and filtering. Users can view all contacts, only favorite contacts, or contacts from a specific group. The search feature works together with the selected filter. For example, if the user is viewing the Work group, searching for a name will only search through contacts in the Work group.

The project uses a Python and Flask backend, a React frontend, and SQLite as the database.

## Features

The main features of Contact Book are:

- User registration and login
- User-specific contacts and groups
- Create, edit, and delete contacts
- Favorite and unfavorite contacts
- Search contacts by name
- Filter contacts by group
- Create, edit, and delete custom groups
- Private data so users can only access and manage their own contacts and groups

## Tech Stack

### Backend

The backend uses:

- Python
- Flask
- Flask-SQLAlchemy
- Flask-CORS
- SQLite

Flask is used to create the API and handle requests from the frontend. Flask-SQLAlchemy is used to work with the database using Python models. SQLite was chosen because it is simple and works well for the needs of this project.

### Frontend

The frontend uses:

- React
- JavaScript
- Vite
- CSS

React is used to build the user interface. Vite is used to run and build the frontend application. Custom CSS is used for the styling instead of using a CSS framework.

## Project Files

The project is divided into a backend and frontend.

### Backend Files

#### `config.py`

This file contains the configuration for the Flask application. It is responsible for setting up the database connection and other application settings.

#### `models.py`

This file contains the database models for the application. The project has three main models: User, Contact, and Group.

A User can have multiple contacts and groups. Every contact belongs to a specific user, which is how the application keeps each user's contacts private. A group also belongs to a specific user.

#### `main.py`

This file contains the main Flask application and API routes.

It handles user registration, login, logout, and checking the currently logged-in user. It also contains the routes for creating, reading, updating, and deleting contacts and groups.

The backend checks which user is currently logged in before allowing access to contacts or groups. The backend also checks that the requested contact or group belongs to the current user.

Passwords are securely hashed instead of being stored directly in the database.

### Frontend Files

#### `App.jsx`

`App.jsx` is the main component of the React application.

It manages the main state of the application, including the current user, contacts, groups, search term, selected filter, and the contact being edited or viewed.

It also displays the login and registration screen when the user is not logged in. After logging in, it displays the main Contact Book interface.

#### `ContactForm.jsx`

This component is used for creating and editing contacts.

The same form is used for both actions to avoid unnecessary duplicate code. When editing a contact, the existing information is shown in the form. When creating a new contact, the form starts empty.

#### `ContactList.jsx`

This component displays the list of contacts.

It allows the user to select a contact to view its details and provides actions for editing, deleting, and favoriting contacts.

#### `api.js`

This file contains the helper function used to communicate with the Flask backend.

Instead of writing the same fetch request code in every React component, the API helper is used to make requests and handle responses in one place.

#### `App.css` and `index.css`

These files contain the styling for the application.

I decided to keep the design simple and minimalist. The goal was to make the application easy to use without adding unnecessary design elements.

#### `main.jsx`

This file is the entry point for the React application. It renders the main `App` component.

## Authentication and Privacy

Users can register using an email address and password. Passwords are hashed before being stored in the database, so the actual password is not stored directly.

After logging in, the application keeps track of the current user using a session.

Contacts and groups are connected to the user who created them. The backend checks ownership before returning or changing data. For example, if two users have accounts, one user cannot use the application to access the other user's contacts.

## Design Decisions

While developing the project, I tried to keep the application focused instead of adding too many features.

I decided that a contact should initially belong to only one group. A system where contacts can belong to multiple groups would require a more complex database relationship. Since this was not necessary for the project, I chose the simpler design.

Another decision was to make All and Favorites filters instead of actual database groups. All contacts and favorite contacts can be found by filtering the existing contact data, so there is no reason to store them as separate groups in the database.

For custom groups, I decided that deleting a group should not delete the contacts inside it. Instead, the contacts remain in the user's contact book and simply no longer have a group assigned to them. This prevents users from accidentally losing contact information.

AI tools were used productively during development to help with coding, debugging, reviewing code, and improving code organization.

### Frontend

The frontend uses:

- React
- JavaScript
- Vite
- CSS

React is used to build the user interface. Vite is used to run and build the frontend application. Custom CSS is used for the styling instead of using a CSS framework.

## Project Files

The project is divided into a backend and frontend.

### Backend Files

#### `config.py`

This file contains the configuration for the Flask application. It is responsible for setting up the database connection and other application settings.

#### `models.py`

This file contains the database models for the application. The project has three main models: User, Contact, and Group.

A User can have multiple contacts and groups. Every contact belongs to a specific user, which is how the application keeps each user's contacts private. A group also belongs to a specific user.


#### `main.py`

This file contains the main Flask application and API routes.

It handles user registration, login, logout, and checking the currently logged-in user. It also contains the routes for creating, reading, updating, and deleting contacts and groups.

The backend checks which user is currently logged in before allowing access to contacts or groups. The backend also checks that the requested contact or group belongs to the current user.

Passwords are securely hashed instead of being stored directly in the database.

### Frontend Files

#### `App.jsx`

`App.jsx` is the main component of the React application.

It manages the main state of the application, including the current user, contacts, groups, search term, selected filter, and the contact being edited or viewed.

It also displays the login and registration screen when the user is not logged in. After logging in, it displays the main Contact Book interface.

#### `ContactForm.jsx`

This component is used for creating and editing contacts.

The same form is used for both actions to avoid unnecessary duplicate code. When editing a contact, the existing information is shown in the form. When creating a new contact, the form starts empty.

#### `ContactList.jsx`

This component displays the list of contacts.

It allows the user to select a contact to view its details and provides actions for editing, deleting, and favoriting contacts.

#### `api.js`

This file contains the helper function used to communicate with the Flask backend.

Instead of writing the same fetch request code in every React component, the API helper is used to make requests and handle responses in one place.

#### `App.css` and `index.css`

These files contain the styling for the application.

I decided to keep the design simple and minimalist. The goal was to make the application easy to use without adding unnecessary Designs.

#### `main.jsx`

This file is the entry point for the React application. It renders the main `App` component.

## Authentication and Privacy


Users can register using an email address and password. Passwords are hashed before being stored in the database, so the actual password is not stored directly.

After logging in, the application keeps track of the current user using a session.

Contacts and groups are connected to the user who created them. The backend checks ownership before returning or changing data. For example, if two users have accounts, one user cannot use the application to access the other user's contacts.

## Design Decisions

While developing the project, I tried to keep the application focused instead of adding too many features.

I also decided that a contact should initially belong to only one group. A system where contacts can belong to multiple groups would require a more complex database relationship. Since this was not necessary for the project, I chose the simpler design.

Another decision was to make All and Favorites filters instead of actual database groups. All contacts and favorite contacts can be found by filtering the existing contact data, so there is no reason to store them as separate groups in the database.

For custom groups, I decided that deleting a group should not delete the contacts inside it. Instead, the contacts remain in the user's contact book and simply no longer have a group assigned to them. This prevents users from accidentally losing contact information.

AI tools were used productively during development to help with debugging, reviewing code, and improving code organization.

## How to Run the Project

### Backend Setup

First, open a terminal and navigate to the backend directory:

```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend Setup

Now open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite in your terminal
