# Library Management System (Django Backend)

## Introduction
This is a backend-only Django application for a simplified Library Management System. It provides user authentication, book CRUD operations, search functionality, and book borrowing/returning actions via RESTful APIs.

## Features
- User registration, login, and logout
- CRUD operations for books
- List and search books by title or author
- Borrow and return books
- Uses Django REST Framework (DRF) for API endpoints

## Technologies Used
- **Python 3.9+**
- **Django 4.x**
- **Django REST Framework**
- **SQLite (default, can be changed to PostgreSQL/MySQL)**

## Installation & Setup

### Prerequisites
Ensure you have **Python 3.9+** and **pip** installed.

### Clone the Repository
```sh
git clone https://github.com/yourusername/library-management.git
cd library-management
```

### Create a Virtual Environment
```sh
python -m venv .venv
source .venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Install Dependencies
```sh
pip install -r requirements.txt
```

### Init the .env file
```sh
mv .env.example .env
```

### Configure the Database
Apply migrations:
```sh
python manage.py migrate
```

### Create a Superuser
```sh
python manage.py createsuperuser
```
Follow the prompts to create an admin user.

### Run the Development Server
```sh
python manage.py runserver
```

Now, the API is available at `http://127.0.0.1:8000/`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Login and get authentication token |
| GET | `/api/auth/me/` | Get the authenticated user |

### Books (requires authentication)
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/books/` | List all books |
| GET | `/api/books/?search=<query>` | Search books by title or author |
| POST | `/api/books/` | Add a new book (superuser only) |
| GET | `/api/books/{id}/` | Retrieve a specific book (superuser only) |
| PUT | `/api/books/{id}/` | Update a book (superuser only) |
| DELETE | `/api/books/{id}/` | Delete a book (superuser only) |

### Borrow & Return Books (requires authentication)
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/books/{id}/borrow/` | Borrow a book |
| POST | `/api/books/{id}/return/` | Return a borrowed book |

## Running Tests
Tests are included for book borrowing and returning functionality.
Run the tests using:
```sh
python manage.py test
```

## Design Pattern: Decorator (Gang of Four)
This project uses the **Decorator Pattern** to enforce authentication before allowing book borrowing or returning.

- `IBookOperation`: Interface for book operations
- `BasicBookOperation`: Concrete implementation of borrowing/returning books
- `AuthenticatedBookOperationDecorator`: Adds authentication checks before performing the book operations

## Deployment
To deploy on **Heroku**, **AWS**, or **Docker**, modify `settings.py` accordingly and follow respective deployment guides.

## License
MIT License. Feel free to use and modify.

## Author
Developed by Simone Squillace

