# ARA Connect

**ARA Connect** is a digital ecosystem designed for member onboarding, professional application management, and secure document vaulting. The platform features an integrated **Opportunity Vault**, enabling users to seamlessly upload and manage CVs, business profiles, and supporting compliance documents with real-time backend synchronization.

**Live Application:** [ara-connect-w45.vercel.app]

---

## 🚀 Key Features

* **Membership Onboarding & Application Portal:** Streamlined digital registration workflow for new applicants and existing members.
* **Document & Opportunity Vault (`/vault`):** Secure cloud storage management for CVs, company profile decks, and verification assets powered by Supabase Storage.
* **Resilient Brand System:** Dynamic asset loading with multi-stage fallback mechanisms (`public` relative assets → CDN → inline SVG) and cache-busting query flags.
* **Reactive UI & Real-Time Sync:** State mutation revalidation ensuring instant UI updates upon successful document uploads.
* **Responsive Architecture:** Mobile-first, fully responsive design powered by Tailwind CSS and modern React components.

---

## 🛠️ Tech Stack

| Tier | Technology | Purpose |
| --- | --- | --- |
| **Frontend Framework** | React + Vite | Fast, component-driven client rendering |
| **Styling & UI** | Tailwind CSS + Lucide Icons | Responsive styling and icon system |
| **Backend / Database** | Supabase | PostgreSQL Database, Authentication, and Cloud Storage Buckets |
| **Hosting & CI/CD** | Vercel | Continuous deployment linked directly to GitHub `main` branch |

---

## 📁 Project Structure

```text
ara-connect/
├── public/
│   ├── logo.png                # Primary brand asset (Root relative /logo.png)
│   └── favicon.ico
├── src/
│   ├── components/             # Reusable UI elements (BrandLogo, Navbar, Footer, etc.)
│   ├── pages/                  # Application views (Index, Vault, Membership, etc.)
│   ├── lib/                    # Supabase client configuration & utilities
│   ├── hooks/                  # Custom React hooks for data fetching & state
│   ├── App.tsx                 # Route mapping & global context providers
│   └── main.tsx                # Client entrypoint
├── supabase/
│   └── migrations/             # Database schemas, policies, and bucket definitions
├── .env.example                # Template for required environment variables
├── package.json
└── vite.config.ts

```

---

## ⚡ Getting Started (Local Development)

### Prerequisites

Ensure you have the following installed on your machine:

* **Node.js:** `v18.x` or higher
* **npm:** `v9.x` or higher
* **Git**

### Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/thabangmotsotsa14/ara-connect-circle.git
cd ara-connect

```


2. **Install Dependencies**
```bash
npm install

```


3. **Configure Environment Variables**
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

```


4. **Start the Local Development Server**
```bash
npm run dev

```


Navigate to `http://localhost:5173` in your browser.

---

## 🗄️ Backend Setup (Supabase Storage Buckets)

To ensure document uploads on the `/vault` and Opportunity Vault pages function properly, initialize the required storage buckets and Row-Level Security (RLS) policies in your **Supabase SQL Editor**:

```sql
-- 1. Create essential storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('vault', 'vault', true),
  ('documents', 'documents', true),
  ('opportunities', 'opportunities', true),
  ('files', 'files', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Clear out legacy storage policies if re-initializing
DROP POLICY IF EXISTS "Allow Public Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Updates" ON storage.objects;

-- 3. Configure storage access rules
CREATE POLICY "Allow Public Uploads" 
ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow Public Downloads" 
ON storage.objects FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow Public Updates" 
ON storage.objects FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- 4. Reload schema proxy
NOTIFY pgrst, 'reload schema';

```

---

## 🌐 Deployment

This application is configured for seamless deployment on **Vercel**.

1. Connect your GitHub repository to **Vercel**.
2. Add your environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in **Project Settings ➔ Environment Variables**.
3. Every commit pushed to the `main` branch will automatically trigger a production build.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
