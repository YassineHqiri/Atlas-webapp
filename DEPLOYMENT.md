# AWS Deployment Guide (Option A: Build on AWS)

This project is set up for AWS deployment with Docker. AWS builds the images from your GitHub repo—no local Docker required.

## Architecture

- **Backend** (Laravel): `atlastech-backend/Dockerfile`
- **Frontend** (React): `atlastech-frontend/Dockerfile`
- **Database**: Use Amazon RDS (MySQL) for the backend

## Prerequisites

1. **Amazon RDS (MySQL)** – Create a MySQL database and note:
   - Endpoint (host)
   - Port (usually 3306)
   - Database name
   - Username & password

2. **GitHub repo** – Code pushed to https://github.com/YassineHqiri/Atlas-webapp

## Deploy with AWS App Runner

### Step 1: Deploy the Backend

1. In AWS Console, go to **App Runner** → **Create service**
2. **Source**: Connect to GitHub → select `YassineHqiri/Atlas-webapp`
3. **Branch**: `main`
4. **Deployment settings**:
   - **Source directory**: `atlastech-backend` (App Runner supports monorepos)
   - **Dockerfile**: `Dockerfile` (relative to source directory)

5. **Environment variables** (add these):
   ```
   APP_NAME=AtlasTech
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=base64:YOUR_32_CHAR_KEY  (generate with: php artisan key:generate --show)
   APP_URL=https://your-backend-url.awsapprunner.com
   FRONTEND_URL=https://your-frontend-url.awsapprunner.com

   DB_CONNECTION=mysql
   DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
   DB_PORT=3306
   DB_DATABASE=atlastech
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_db_password

   CORS_ALLOWED_ORIGINS=https://your-frontend-url.awsapprunner.com
   SANCTUM_STATEFUL_DOMAINS=your-frontend-url.awsapprunner.com

   MAIL_MAILER=log
   SESSION_DRIVER=database
   CACHE_DRIVER=file
   QUEUE_CONNECTION=sync
   ```

6. Create the service and note the **backend URL** (e.g. `https://xxxxx.awsapprunner.com`)

### Step 2: Deploy the Frontend

1. Create another App Runner service
2. **Source**: Same GitHub repo, branch `main`
3. **Source directory**: `atlastech-frontend`
4. **Dockerfile**: `Dockerfile`
5. **Build environment variables** (important for API URL):
   ```
   VITE_API_URL=https://your-backend-url.awsapprunner.com/api
   ```
   (Use the backend URL from Step 1 + `/api`)

6. Create the service and note the **frontend URL**

### Step 3: Update CORS

After both are deployed, update the backend environment variable:
```
CORS_ALLOWED_ORIGINS=https://your-actual-frontend-url.awsapprunner.com
```
Redeploy the backend if needed.

## Alternative: Amazon ECS with GitHub Actions

If App Runner has limitations with monorepos:

1. Use **Amazon ECR** to store Docker images
2. Use **GitHub Actions** to build and push on each push to `main`
3. Use **ECS Fargate** to run the containers
4. Use **Application Load Balancer** to route traffic

## Environment Variables Summary

| Variable | Backend | Frontend (build) |
|----------|---------|------------------|
| APP_KEY | ✓ | - |
| DB_* | ✓ | - |
| CORS_ALLOWED_ORIGINS | ✓ | - |
| FRONTEND_URL | ✓ | - |
| VITE_API_URL | - | ✓ (backend URL + /api) |

## Troubleshooting

- **502 Bad Gateway**: Check backend logs; often DB connection or missing APP_KEY
- **CORS errors**: Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL
- **API 404**: Ensure `VITE_API_URL` points to backend URL + `/api`
