   # Deploy Atlas-webapp to AWS (Step-by-Step)

   Your repo: **https://github.com/YassineHqiri/Atlas-webapp**

   ---

   ## Part 1: Create the Database (RDS)

   1. Go to **AWS Console** → **RDS** → **Create database**
   2. Choose **MySQL 8.0**
   3. **Templates**: Free tier (or Standard)
   4. **DB instance identifier**: `atlastech-db`
   5. **Master username**: `admin` (or your choice)
   6. **Master password**: Set a strong password (save it)
   7. **Public access**: Yes (so App Runner can reach it)
   8. **VPC**: Default is fine
   9. Create database
   10. Wait for it to be available, then copy the **Endpoint** (e.g. `atlastech-db.xxxxx.us-east-1.rds.amazonaws.com`)

   ---

   ## Part 2: Generate APP_KEY

   Run locally (in `atlastech-backend` folder):

   ```powershell
   cd c:\Users\admin\Desktop\mainapp\atlastech-backend
   php artisan key:generate --show
   ```

   Copy the output (e.g. `base64:xxxxxxxxxxxxx`). You'll need it for the backend.

   ---

   ## Part 3: Deploy Backend (App Runner)

   1. Go to **AWS Console** → **App Runner** → **Create service**
   2. **Source and deployment**:
      - **Repository type**: Source code repository
      - **Connect to GitHub** (authorize if first time)
      - **Repository**: `YassineHqiri/Atlas-webapp`
      - **Branch**: `main`
      - **Deployment trigger**: Automatic
      - **Source directory**: `atlastech-backend`
      - **Dockerfile**: `Dockerfile`
   3. **Configure service**:
      - **Service name**: `atlastech-backend`
      - **Port**: `80`
   4. **Environment variables** → Add these (replace placeholders):

      | Name | Value |
      |-----|-------|
      | APP_NAME | AtlasTech |
      | APP_ENV | production |
      | APP_DEBUG | false |
      | APP_KEY | *(paste from Part 2)* |
      | APP_URL | *(leave empty for now, update after deploy)* |
      | FRONTEND_URL | *(leave empty for now, update after frontend deploy)* |
      | DB_CONNECTION | mysql |
      | DB_HOST | *(RDS endpoint from Part 1)* |
      | DB_PORT | 3306 |
      | DB_DATABASE | *(your DB name, e.g. atlastech)* |
      | DB_USERNAME | *(RDS username)* |
      | DB_PASSWORD | *(RDS password)* |
      | CORS_ALLOWED_ORIGINS | *(leave empty for now)* |
      | SANCTUM_STATEFUL_DOMAINS | *(leave empty for now)* |
      | MAIL_MAILER | log |
      | SESSION_DRIVER | database |
      | CACHE_DRIVER | file |
      | QUEUE_CONNECTION | sync |

   5. **Create & deploy**
   6. Wait for deployment, then copy the **Service URL** (e.g. `https://xxxxx.us-east-1.awsapprunner.com`)

   ---

   ## Part 4: Deploy Frontend (App Runner)

   1. **App Runner** → **Create service**
   2. **Source**:
      - **Repository**: `YassineHqiri/Atlas-webapp`
      - **Branch**: `main`
      - **Source directory**: `atlastech-frontend`
      - **Dockerfile**: `Dockerfile`
   3. **Configure service**:
      - **Service name**: `atlastech-frontend`
      - **Port**: `80`
   4. **Environment variables** (Build) → Add:

      | Name | Value |
      |-----|-------|
      | VITE_API_URL | *(Backend URL from Part 3)*/api |

      Example: `https://xxxxx.us-east-1.awsapprunner.com/api`

   5. **Create & deploy**
   6. Copy the **Frontend URL**

   ---

   ## Part 5: Update Backend (CORS & URLs)

   1. Go to your **backend** App Runner service → **Configuration** → **Edit**
   2. Update environment variables:
      - **APP_URL**: Backend URL
      - **FRONTEND_URL**: Frontend URL
      - **CORS_ALLOWED_ORIGINS**: Frontend URL
      - **SANCTUM_STATEFUL_DOMAINS**: Frontend URL (without https://)
   3. **Save changes** (triggers redeploy)

   ---

   ## Part 6: Create the Database (if needed)

   RDS gives you an instance, but you may need to create the database:

   1. Go to **RDS** → your database → **Connect**
   2. Use **Query editor** (or MySQL Workbench) and run:
      ```sql
      CREATE DATABASE IF NOT EXISTS atlastech;
      ```

   **Migrations run automatically** when the backend container starts (see `docker/entrypoint.sh`). No extra step needed.

   ---

   ## Done

   - **Frontend**: Your frontend URL  
   - **Backend API**: Your backend URL + `/api`  
   - **Admin**: Frontend URL + `/admin/login`
