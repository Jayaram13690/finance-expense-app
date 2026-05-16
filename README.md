# Finance App - Full Stack Setup





A complete finance management application with React frontend and FastAPI backend.





## Quick Start





### Run the complete application with Docker





```bash


docker-compose up -d --build


```





This will start:


- PostgreSQL database (port 5432)


- FastAPI backend (port 8000)


- React frontend (port 3000)





Access the application at: http://localhost:3000





### Stop the application





```bash

docker-compose down


```





## Development Setup





### Backend (FastAPI)





Navigate to the backend directory:


```bash


cd finance-app-backend


```





Create a virtual environment and install dependencies:


```bash


python -m venv venv


source venv/bin/activate  # On Windows: venv\Scripts\activate


pip install -r requirements.txt


```





Run the backend:


```bash


uvicorn app.main:app --reload


```





### Frontend (React)





Navigate to the frontend directory:


```bash


cd finance-app-frontend


```





Install dependencies:


```bash


npm install


```





Run the frontend:


```bash


npm start


```





## Features


- User authentication (JWT)


- Transaction management (income/expense)


- Budget tracking


- Savings pots


- Dashboard with financial overview


- Responsive design





## Architecture





- **Frontend**: React 18, Tailwind CSS, Zustand state management


- **Backend**: FastAPI, SQLAlchemy, PostgreSQL


- **Containerization**: Docker with multi-stage builds


- **Proxy**: Nginx for frontend with API proxy to backend





## Environment Variables





### Backend (.env in finance-app-backend)


```


DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/finance_db


SECRET_KEY=your-secret-key-min-32-chars


DEBUG=True


```





### Frontend (.env in finance-app-frontend)


```


REACT_APP_API_URL=/api/v1


```





## API Documentation





Once running, access the backend API documentation at:


- Swagger UI: http://localhost:8000/docs


- ReDoc: http://localhost:8000/redoc





## Database





The application uses PostgreSQL. With Docker, the database data is persisted in a volume.





To reset the database (loses all data):


```bash


docker-compose down -v


docker-compose up -d


```





## Troubleshooting





### Port conflicts


If you get port conflicts, you can:


1. Stop other services using those ports


2. Modify the ports in docker-compose.yml


3. Use different port mappings





### Database connection issues


Ensure PostgreSQL is running and the connection string is correct.





### Frontend API issues


The frontend is configured to proxy API requests to the backend through Nginx. If you're running frontend separately (not through Docker), update the `.env` file:


```


REACT_APP_API_URL=http://localhost:8000/api/v1


```





## License





MIT