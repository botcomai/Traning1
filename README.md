# ServiceHub — E-Commerce Website for Services

A full-stack e-commerce platform for selling professional services, built with Next.js 14, Supabase, Paystack, and Tailwind CSS.

## Features

- 📄 **Service Listings** — Browse, search, and filter services by category
- 🛒 **Shopping Cart** — Add/remove services with localStorage persistence
- 💳 **Paystack Payments** — Secure checkout with payment verification
- 🔐 **Supabase Auth** — Sign up, login, and password reset
- 📊 **Admin Dashboard** — Manage services (CRUD), view/update orders, revenue analytics
- 📱 **Responsive Design** — Mobile-first UI with Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Payments | Paystack |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/botcomai/Traning1.git
cd Traning1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

### 4. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your **Project URL** and **Anon Key** from **Settings → API**
3. Open the **SQL Editor** in your Supabase dashboard
4. Run the SQL from `supabase/migrations/setup.sql` to create tables, RLS policies, and seed data

### 5. Configure Paystack

1. Sign up / log in at [dashboard.paystack.com](https://dashboard.paystack.com)
2. Go to **Settings → API Keys & Webhooks**
3. Copy your **Public Key** and **Secret Key**
4. Use **test keys** (`pk_test_` / `sk_test_`) for development
5. Set your webhook URL to `https://yourdomain.com/api/webhooks/paystack`

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

To access the admin dashboard (`/admin`), set a user's `role` to `admin` in the `profiles` table:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import the repository at [vercel.com/new](https://vercel.com/new)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## Project Structure

```
app/
├── layout.tsx           # Root layout with Navbar, Footer, CartProvider
├── page.tsx             # Landing page
├── services/            # Service listings + detail pages
├── cart/                # Cart page
├── checkout/            # Checkout with Paystack
├── auth/                # Login, signup, reset password, callback
├── admin/               # Admin dashboard + services management
├── orders/              # Order history
└── api/
    ├── paystack/        # Initialize & verify payment
    └── webhooks/        # Paystack webhook handler
components/              # Navbar, Footer, ServiceCard, Cart components
lib/                     # Supabase client/server, Paystack helpers, utils
context/                 # CartContext (React Context + localStorage)
supabase/migrations/     # SQL setup script
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack public key |
| `PAYSTACK_SECRET_KEY` | Paystack secret key (server-side only) |