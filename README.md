# cbs-backend
the Unified Dashboard for CBS Team for Various Modules

## Welcome Message

The application includes a welcome message endpoint:

- **GET** `/api/welcome` - Returns a welcome message
- **GET** `/` - Returns API information and available endpoints

### Example Response

```json
{
  "message": "Welcome to CBS Backend - The Unified Dashboard for CBS Team for Various Modules",
  "status": "success"
}
```

## Running the Application

The application runs on port `8085` by default. After starting the application, you can access:

- Welcome endpoint: http://localhost:8085/api/welcome
- Root endpoint: http://localhost:8085/
