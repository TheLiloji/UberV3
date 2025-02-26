# Project Title: Backend Project

## Description
This is a backend project that provides two endpoints for demonstration purposes. It is built using Node.js and follows a modular structure for better maintainability.

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd backend-project
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Environment Variables
Create a `.env` file in the root directory and add the necessary environment variables. Example:
```
PORT=3000
```

## Usage
To start the server, run:
```
npm start
```
The server will run on the port specified in the `.env` file or default to port 3000.

## Endpoints
### GET /endpoint1
- Description: This endpoint returns a response from the first controller.
- Controller: `Endpoint1Controller`
- Method: `getEndpoint1`

### GET /endpoint2
- Description: This endpoint returns a response from the second controller.
- Controller: `Endpoint2Controller`
- Method: `getEndpoint2`

## Contributing
Feel free to submit issues or pull requests for improvements or bug fixes.

## License
This project is licensed under the MIT License.