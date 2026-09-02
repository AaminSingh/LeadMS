# 🚀 LeadMS — Role-Based B2B CRM & Sales Pipeline Management
### *Track B — Full API Integration*

[![Frontend: React + Vite](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%208-blue.svg)](https://react.dev/)
[![Styling: Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8.svg)](https://tailwindcss.com/)
[![Backend: Node + Express](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20v5-green.svg)](https://expressjs.com/)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB%20%7C%20Mongoose-47a248.svg)](https://mongoosejs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-purple.svg)](#)

---

## 📖 Project Overview

**LeadMS** is a multi-tenant B2B SaaS CRM platform architected to streamline wholesale product distribution, sales catalog curation, custom quotation math, and lead pipeline conversion across distinct organizational roles:

- **Traders (Wholesale Suppliers)**: Publish products with base pricing and manage inventory.
- **Vendors (Installers & Distributors)**: Configure custom profit margins, lock supplier products into a private sales catalog, manage client inquiries, and generate instant quotations.
- **Team Members**: Invited sales representatives who manage assigned client opportunities.
- **System Admins**: System-wide governance with real-time pipeline metrics and revenue analytics.

---

## 🛠️ Tech Stack

### **Frontend**
- **Core**: React 19, Vite 8 (JavaScript ES Modules)
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite`
- **State Management**: Zustand with `persist` middleware (`localStorage`)
- **API Client**: Axios instance with automatic Bearer token injection and silent HTTP 401 token refresh interceptors
- **Routing**: React Router DOM 7 (`BrowserRouter`, `ProtectedRoute`, `RoleGuard`, `AppShell`)
- **Form Handling**: React Hook Form 7
- **Feedback & Icons**: `react-hot-toast`, `lucide-react`, Radix UI Dialog primitives

### **Backend**
- **Runtime**: Node.js v22 (native `--env-file`)
- **Framework**: Express.js v5 (ES Modules)
- **Database**: MongoDB Atlas with Mongoose v9 ODM
- **Authentication**: JWT access tokens (15m expiration) + Refresh tokens stored in MongoDB
- **Security**: `bcryptjs` password hashing, single-device session invalidation, role-based authorization middlewares
- **Email Service**: Nodemailer via SMTP for account verification and team member invitations

---

## ✨ Key Features & Architecture

### 1. Multi-Tenant Role-Based Access Control (RBAC)
- Public registration supporting **Trader** and **Vendor** self-signup with email verification.
- Protected routes using `<ProtectedRoute />` and `<RoleGuard allowedRoles={[...]} />`.
- Vendor team invitation system for onboarding field representatives.

### 2. Atomic Product Catalog Locking
- Vendors browse available wholesale products published by Traders.
- One-click **"Lock to My Catalog"** and **"Unlock"** functionality.
- Powered by atomic MongoDB `$addToSet` and `$pull` operations with pure string array filtering to prevent race conditions and type-mismatch collisions.

### 3. Dynamic Quoting Calculation Engine
- Vendors set global pricing profiles (**Margin %**, **Fixed Installation Fee**, and **Misc Charges**).
- Interactive **Quote Builder Modal** allowing multi-product selection with real-time math:
  $$\text{Base Total} = \sum (\text{Base Price} \times \text{Quantity})$$
  $$\text{Margin Amount} = \text{Base Total} \times \frac{\text{Margin \%}}{100}$$
  $$\text{Final Total} = \text{Base Total} + \text{Margin Amount} + \text{Installation} + \text{Misc Charges}$$
- Generates instant proposal records and updates lead status to `quoted`.

### 4. Visual Lead Pipeline
- Track leads across lifecycle stages: `new` (blue), `contacted` (amber), `quoted` (purple), `accepted` (green), and `rejected` (red).
- Quick search, refresh state, and direct quote builder triggers.

### 5. Admin Analytics Dashboard
- Live metric cards: Total System Users by role, Total Pipeline Leads, Quoted Pipeline Value, and Cumulative Expected Margin.
- Visual status breakdown bars and product catalog statistics.

### 6. Public Landing Page & Responsive App Shell
- Conversion-focused marketing root page (`/`) highlighting multi-tenant workflows and feature highlights.
- Mobile drawer sidebar with backdrop blur and responsive hamburger menu.
- Toast notifications (`react-hot-toast`) replacing browser alerts.

---

## ⚙️ Local Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or v22 recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster connection string)
- Git

---

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd LeadMS
```

---

### 2. Backend Setup (`/leadms-backend`)
1. Navigate to the backend folder:
   ```bash
   cd leadms-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `leadms-backend/`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   CLIENT_URL=http://localhost:5173
   SERVER_URL=http://localhost:5000

   # Nodemailer SMTP Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_16_char_app_password
   FROM_EMAIL=your_email@gmail.com
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Backend runs on `http://localhost:5000` with Nodemon reload.*

---

### 3. Frontend Setup (`/LeadMS`)
1. Open a new terminal and navigate to the project root:
   ```bash
   cd LeadMS
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Frontend opens at `http://localhost:5173`.*

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new Vendor or Trader |
| `GET` | `/api/auth/confirm-email?token=` | Confirm user email address |
| `POST` | `/api/auth/login` | Authenticate & receive tokens |
| `POST` | `/api/auth/refresh-token` | Exchange refresh token for new access token |
| `POST` | `/api/auth/logout` | Invalidate active refresh token |
| `POST` | `/api/auth/invite` | Vendor invites a team member |

### Products (`/api/products`)
| Method | Endpoint | Role | Description |
|---|---|---|---|
| `GET` | `/api/products/trader` | Trader | Get products created by logged-in trader |
| `POST` | `/api/products/trader` | Trader | Create wholesale product |
| `PUT` | `/api/products/trader/:id` | Trader | Update product details |
| `DELETE` | `/api/products/trader/:id` | Trader | Remove product |
| `GET` | `/api/products/available` | Vendor | Get active supplier products not yet locked |
| `GET` | `/api/products/locked` | Vendor / Team | Get products locked in vendor's sales catalog |
| `POST` | `/api/products/:id/lock` | Vendor | Lock product to vendor catalog |
| `POST` | `/api/products/:id/unlock` | Vendor | Unlock product from catalog |

### Vendor Profile (`/api/vendor`)
| Method | Endpoint | Role | Description |
|---|---|---|---|
| `GET` | `/api/vendor/profile` | Vendor | Fetch quoting pricing profile |
| `PUT` | `/api/vendor/profile` | Vendor | Update margin %, installation price, misc charges |

### Leads & Quotes (`/api/leads`)
| Method | Endpoint | Role | Description |
|---|---|---|---|
| `GET` | `/api/leads` | Vendor / Team | List client leads |
| `POST` | `/api/leads` | Vendor / Team | Capture new client lead |
| `PUT` | `/api/leads/:id/assign` | Vendor | Assign lead to team member |
| `POST` | `/api/leads/:id/quote` | Vendor / Team | Generate custom quote proposal |

### Admin Analytics (`/api/admin`)
| Method | Endpoint | Role | Description |
|---|---|---|---|
| `GET` | `/api/admin/analytics` | Admin | Aggregate counts, revenues, and margin totals |
| `GET` | `/api/admin/users` | Admin | List all registered accounts |
| `GET` | `/api/admin/leads` | Admin | Complete pipeline audit |

---

## 🌐 Live Deployment

- **Frontend URL**: `https://leadms-frontend.vercel.app` *(Placeholder — replace with your deployed Vercel URL)*
- **Backend URL**: `https://leadms-backend.vercel.app` *(Or your hosted cloud API URL)*

---

## 📄 License
This project is licensed under the **ISC License**.
