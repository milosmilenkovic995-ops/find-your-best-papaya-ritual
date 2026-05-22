# Supabase setup — 5 minutes

Follow these steps once. After this, the survey will save every submission to
your database, and you'll have a Supabase dashboard to browse the data.

---

## 1. Create a Supabase account & project

1. Go to **https://supabase.com** and click **Start your project**.
2. Sign in with GitHub (easiest — uses your existing GitHub account).
3. Click **New project**.
4. Fill in:
   - **Name:** `znaturalfoods-survey` (or whatever you want)
   - **Database Password:** click the generate button — Supabase makes a strong one. **Copy it and save it somewhere safe.** You won't need it for normal use, only if you ever connect via a SQL tool.
   - **Region:** pick the one closest to your customers (e.g. East US for North America).
   - **Plan:** Free.
5. Click **Create new project**. Wait ~1 minute for it to spin up.

---

## 2. Apply the schema (creates the tables)

1. In your new Supabase project, click **SQL Editor** in the left sidebar.
2. Click **+ New query**.
3. Open `db/schema.sql` from this project folder, copy ALL of the contents.
4. Paste into the SQL Editor.
5. Click **Run** (bottom right). You should see "Success. No rows returned."

You can verify by clicking **Table Editor** in the left sidebar — you should
now see two tables: `submissions` and `events`.

---

## 3. Get your API keys

1. In Supabase, click **Project Settings** (gear icon, bottom-left) → **API**.
2. You'll see a section called **Project URL** and another called **Project API keys**.
3. Copy these three values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" — click the eye icon to reveal it). **This is a secret — keep it private.**

---

## 4. Paste keys into `.env.local`

1. In the project folder (`find-your-best-papaya-ritual`), make a copy of
   `.env.local.example` and rename the copy to `.env.local`.
2. Open `.env.local` in a text editor.
3. Replace each placeholder with the real value:
   - `SUPABASE_URL=` → your Project URL
   - `SUPABASE_ANON_KEY=` → the anon public key
   - `SUPABASE_SERVICE_ROLE_KEY=` → the service_role key
   - `ADMIN_PASSWORD=` → a password you'll remember (used to view the `/admin` dashboard later)
4. (Optional) Fill in `KLAVIYO_PRIVATE_API_KEY` and `KLAVIYO_LIST_ID` if you want
   submissions to automatically subscribe customers to a Klaviyo list.
5. Save the file.

---

## 5. Tell Claude "Supabase is ready"

That's it — Claude takes over from here, wires up the API to write to your
database, builds the admin dashboard, and deploys everything to Vercel.

---

## Where to look at your data later

- **Supabase dashboard (easiest)** — Table Editor → `submissions`. Browse rows
  like a spreadsheet, filter, export to CSV.
- **Your deployed site's `/admin` page** — pretty charts, percentages, recent
  submissions list. Protected by your `ADMIN_PASSWORD`.
