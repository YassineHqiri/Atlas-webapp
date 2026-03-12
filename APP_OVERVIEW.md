# AtlasTech — Complete App Overview (A to Z)

A full-stack web application for **AtlasTech**, a digital agency offering website and web development services. The app lets customers browse service packs, place orders, and contact the company, while admins manage orders, service packs, leads, and CRM.

---

## A — Architecture

- **Backend**: Laravel (PHP) — REST API, authentication, database
- **Frontend**: React + Vite — SPA with Tailwind CSS
- **Database**: MySQL (via Laravel migrations on Amazon RDS)
- **Auth**: Laravel Sanctum (API tokens) + secure password reset tokens
- **Deployment**: AWS ECS (Fargate) for containerized Backend + Frontend, AWS ALB for Load Balancing, AWS Secrets Manager for config, and Amazon RDS (MySQL)

---

## B — Backend (Laravel)

Located in `atlastech-backend/`:

- **API routes** (`routes/api.php`): Auth, customer, public, chatbot, admin
- **Controllers**: `PublicController`, `AuthController`, `ChatbotController`, `Admin/*`
- **Models**: `User`, `Order`, `ServicePack`, `ContactMessage`, `CrmLead`, `CrmNote`, `Faq`, `ChatLog`
- **Migrations**: Users, orders, service packs, contact messages, CRM leads/notes, FAQs, chat logs

---

## C — Chatbot

- **Widget**: Floating chat button on all public pages (hidden on admin login)
- **Endpoint**: `POST /api/chatbot/reply` — sends user message, returns FAQ-based answer
- **Data**: FAQs stored in DB (`faqs` table has `language` column); search via question/answer; logs in `chat_logs`
- **Features**: Multi-language support (French and English via language selectors), custom stopword filtering, and an improved matching algorithm (`Levenshtein` distance).
- **Security**: Rate limit (10 req/min), input validation, CSRF protection

---

## D — Dashboard (Admin)

- **URL**: `/admin/dashboard`
- **Content**: Stats (orders, leads, revenue), recent activity
- **Access**: Admin users only (super_admin, admin roles)

---

## E — Environment

- **Backend**: `.env` — `APP_KEY`, `DB_*`, `CORS_ALLOWED_ORIGINS`, `FRONTEND_URL`, etc.
- **Frontend**: `VITE_API_URL` — backend API base URL (e.g. `https://xxx.awsapprunner.com/api`)

---

## F — FAQ & Contact

- **FAQ page**: `/faq` — public FAQ list
- **Contact form**: `/contact` — sends message to backend, creates `ContactMessage` and CRM lead
- **Chatbot FAQs**: Stored in `faqs` table, used for chatbot replies

---

## G — Guide & Pages

- **Guide**: `/guide` — how-to or usage guide
- **Public pages**: Home, Categories, Product Detail, About, Contact, Order, Account, Privacy, Terms, FAQ
- **Developer Documentation**: The repository contains extensive markdown documentation on recent feature implementations (e.g., `RECAPTCHA_IMPLEMENTATION.md`, `SECURITY_SUMMARY.md`, `SESSION_3_SUMMARY.md`, etc.)

---

## H — Home Page

- **URL**: `/`
- **Content**: Hero, service packs from API, stats, testimonials, CTA
- **Data**: Service packs from `GET /api/public/service-packs`

---

## I — Identity & Auth

- **Customer auth**: Register, login, forgot/reset password — `role: customer`
- **Admin auth**: Login at `/admin/login` — `role: super_admin` or `admin`
- **Security**: Login and Registration endpoints are protected by Google reCAPTCHA v2 to prevent brute-force and spam
- **Seeded admins**: `admin@atlastech.com`, `manager@atlastech.com` (password from `ADMIN_SEED_PASSWORD` or random)

---

## J — JSON API

All API responses are JSON. Examples:

- `GET /api/public/service-packs` → list of service packs
- `POST /api/public/orders` → create order
- `POST /api/public/contact` → send contact message
- `POST /api/chatbot/reply` → chatbot reply

---

## K — Keys & Config

- **APP_KEY**: Laravel encryption key (required)
- **Sanctum**: Token-based auth for API
- **CORS**: `CORS_ALLOWED_ORIGINS` must include frontend URL

---

## L — Leads (CRM)

- **Leads**: Created from contact form and orders
- **Admin**: `/admin/crm/leads`, `/admin/crm/leads/:id`, `/admin/crm/pipeline`
- **Fields**: name, email, phone, status, source, notes
- **Sources**: `contact_form`, `manual`, order placement

---

## M — Models & Migrations

- **Users**: id, name, email, password, role (super_admin, admin, customer)
- **PasswordResetTokens**: Secure hashed tokens for password resets (`user_id`, `token`, `expires_at`, `used`)
- **Orders**: customer_name, email, phone, service_pack_id, user_id, crm_lead_id, status
- **ServicePacks**: name, description, price, features (JSON), is_active
- **ContactMessages**: name, email, message
- **CrmLeads**: name, email, phone, status, source, contact_message_id
- **CrmNotes**: lead_id, content
- **Faqs**: question, answer, is_active, language (ENUM: fr, en)
- **ChatLogs**: user_message, bot_response, ip_address

---

## N — Navigation

- **Public**: Header/footer with links to Home, Categories, About, Contact, Order, Login, Register
- **Admin**: Sidebar with Dashboard, Orders, Service Packs, CRM (Leads, Pipeline)

---

## O — Orders

- **Place order**: `/order` or `/order/:packId` — form with name, email, phone, pack selection
- **Logged-in customers**: Order linked to user; can view at `/account/orders`
- **Admin**: `/admin/orders` — list, view, update status, delete
- **Flow**: Order → CRM lead created/linked → confirmation email sent

---

## P — Products / Service Packs

- **Packs**: Basic (499 DH), Professional (999 DH), Enterprise (2499 DH)
- **Public**: Shown on Home, Categories, Product Detail (`/product/:slug`)
- **Admin**: CRUD at `/admin/service-packs`

---

## Q — Queries & Search

- **Chatbot**: Searches FAQs by question/answer (LIKE)
- **Admin**: Filtering and listing for orders, leads, service packs

---

## R — Routes Summary

**Public**: `/`, `/categories`, `/product/:slug`, `/about`, `/contact`, `/order`, `/account`, `/login`, `/register`, `/faq`, `/privacy`, `/terms`, `/guide`, `/forgot-password`, `/reset-password`

**Admin**: `/admin/login`, `/admin/dashboard`, `/admin/orders`, `/admin/service-packs`, `/admin/crm/leads`, `/admin/crm/leads/:id`, `/admin/crm/pipeline`

---

## S — Security (and Service Packs)

- **App Protection**: Extensive frontend and backend security measures have been implemented (CSRF, XSS, strict CORS)
- **reCAPTCHA v2**: Integrated into public forms (`useRecaptcha` hook) for authentication and action protection, complete with robust logging and token verification
- **Token Security**: Strict localStorage and sessionStorage token management policies
- **Service Packs**: Basic (499 DH), Professional (999 DH), Enterprise (2499 DH) — For more details, refer to **P — Products / Service Packs** above.

---

## T — Tech Stack

- **Backend**: PHP 8.x, Laravel, MySQL
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Framer Motion, React Hot Toast
- **Deploy**: Docker, AWS ECS (Fargate), AWS ALB (Application Load Balancer), Amazon RDS, AWS Secrets Manager, CloudWatch

---

## U — Users & Roles

- **super_admin**: Full admin (e.g. admin@atlastech.com)
- **admin**: Admin (e.g. manager@atlastech.com)
- **customer**: Registered customer (can place orders, view account)

---

## V — Vite & Frontend Build

- **Frontend**: `atlastech-frontend/` — Vite + React
- **Build**: `VITE_API_URL` baked in at build time
- **Dev**: `npm run dev` — typically `http://localhost:5173`

---

## W — Widget (Chatbot)

- **Component**: `ChatbotWidget.jsx`
- **Position**: Bottom-right on public pages
- **Quick actions**: Services, Prices, Contact
- **Styling**: CSS variables for colors and position

---

## X — eXternal Integrations

- **Email**: Laravel Mail (e.g. order confirmation)
- **AWS**: App Runner, RDS
- **GitHub**: Source for deployment

---

## Y — Your Account (Customer)

- **URL**: `/account`
- **Tabs**: Profile, Orders, Password
- **Auth**: Requires customer login

---

## Z — Zero to Deploy

1. Setup parameters securely on **AWS Secrets Manager**: DB password, App key, reCAPTCHA keys, Mail password.
2. Initialize **AWS RDS MySQL** database.
3. Build and push Docker images to **AWS ECR** (backend/frontend).
4. Create an **AWS ECS Task Definition** integrating Secrets.
5. Deploy **ECS Fargate Service** and set up **ALB (Application Load Balancer)** for HTTPS redirection.
6. Run migrations automatically via Docker entrypoint.
7. Seed admin users and FAQs (including EN/FR languages).
8. See `AWS_DEPLOYMENT_GUIDE.md` for full detailed instructions.

---

## Quick Reference

| What            | Where                          |
|----------------|--------------------------------|
| Public site    | `/` (Home) and public routes   |
| Admin panel    | `/admin/login` → `/admin/dashboard` |
| API base       | `{BACKEND_URL}/api`            |
| Chatbot API    | `POST /api/chatbot/reply`      |
| Order API      | `POST /api/public/orders`      |
| Contact API    | `POST /api/public/contact`     |
