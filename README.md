# Jr_Nodejs_Assignment

# File Upload and Authentication App

This application provides functionalities for user authentication and file upload/storage. It allows users to register, login securely, upload files, and manage their uploaded files.

## Getting Started

To use this application locally, follow these steps:

1. Clone this repository to your local machine:

git clone https://github.com/gabhishekrao/Jr_Nodejs_Assignment.git


2. Navigate to the project directory:

cd Jr_Nodejs_Assignment


3. Install dependencies:

npm install


4. Create a `.env` file in the root directory and add the necessary environment variables:

PORT = 5000
MONGO_DB_URL = Your MongoDB URI
JWT_SECRET_KEY = SecretKey


5. Start the server:

npm start


## Authentication

### User Registration

- Endpoint: `POST /signup`
- Description: Allows users to register by providing their first name, last name, email, phone number, username, password and confirm password.
- Request Body:
```json
{
    "firstName": "G",
    "lastName": "Abhishek",
    "email": "abhi@gmail.com",
    "phoneNumber": 9876543200,
    "username": "Abhi",
    "password": "Example@123",
    "confirmPassword": "Example@123"
}

Response: Upon successful registration, user details will display and JSON Web Token (JWT) will set in cookies.


### User Login
- Endpoint: POST /login
- Description: Allows registered users to log in securely using their username and password.
- Request Body:
```json
{
    "username" : "abhi",
    "password" : "Example@123"
}

Response: Upon successful login, user details will display and JSON Web Token (JWT) will set in cookies.

## User Logout

- **Endpoint**: `POST /logout`
- **Description**: Allows authenticated users to log out and clear JWT from cookies.

## File Upload and Storage

### File Upload

- **Endpoint**: `POST /upload`
- **Description**: Allows authenticated users to upload files to the server.
- **Request Body**: FormData with files attached.
- **Response**: Upon successful upload, a success message is returned with file details.

### Get Uploaded Files

- **Endpoint**: `GET /getfiles`
- **Description**: Allows authenticated users to view their uploaded files.
- **Response**: An array of uploaded file objects is returned.

### Delete Uploaded File

- **Endpoint**: `DELETE /deletefiles/:nameOfFile`
- **Description**: Allows authenticated users to delete a specific uploaded file.
- **Response**: Upon successful deletion, a success message is returned.

## Error Handling

- The application includes proper error handling and validation throughout the authentication and file upload/storage processes.
- Multer middleware is used to handle file upload errors, such as maximum file count and file size exceeded.
- JWT authentication is implemented to protect certain routes and functionalities, and unauthorized access is handled appropriately.
