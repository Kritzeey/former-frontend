### Prerequisites

Ensure the following tools are installed
* Docker
* Docker Compose

### Expected Directory Structure

```text
ristek/
├── former-frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── former-backend/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── docker-compose.yml
└── nginx.conf
```

### Environment Variables

**Database (`db`)**

* `POSTGRES_USER`: Database username
* `POSTGRES_PASSWORD`: Database password
* `POSTGRES_DB`: Target database name

**Backend (`backend`)**

* `DATABASE_URL`: Connection string formatted as `postgres://<user>:<password>@db:5432/<dbname>`
* `PORT`: Internal port for the Node.js application (must match the Express listen port)
* `JWT_SECRET`: Secret key for cryptographic token signing

**Frontend (`frontend`)**

* `PORT`: Internal port for the frontend server

### Configuration Files

Create the following files in the root `ristek-project/` directory alongside the cloned repositories.

**docker-compose.yml**

```yaml
services:
  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: valhize
      POSTGRES_PASSWORD: password_that_is_very_secret_wow
      POSTGRES_DB: ristek_db
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U valhize -d ristek_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./former-backend
      dockerfile: Dockerfile
    restart: always
    environment:
      DATABASE_URL: postgres://valhize:password_that_is_very_secret_wow@db:5432/ristek_db
      PORT: 3000
      JWT_SECRET: your_jwt_secret
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build:
      context: ./former-frontend
      dockerfile: Dockerfile
    restart: always
    environment:
      PORT: 3000
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend
      - frontend

volumes:
  postgres_data:

```

**nginx.conf**

```nginx
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;

        location ^~ /api/ {
            proxy_pass http://backend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        location / {
            proxy_pass http://frontend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}

```

### Execution Commands

Navigate to the parent directory containing the `docker-compose.yml` file and execute the following commands.

To build the images from source and start the containers in detached mode:

```bash
docker-compose up -d --build

```

To view the real-time logs of all running services:

```bash
docker-compose logs -f

```

To stop and remove the containers:

```bash
docker-compose down

```

### Accessing the Application

Once the deployment commands execute successfully, the Nginx reverse proxy will route incoming traffic on port 80:

* **Frontend Client:** `http://<your-server-ip>/` (localhost if running locally)
* **Backend API:** `http://<your-server-ip>/api/` (localhost if running locally)
