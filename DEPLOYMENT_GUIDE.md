# Complete Deployment Guide (with Data) 🚀

Follow these steps to put your Library System online while keeping all your users and activity.

## Phase 1: Create a Cloud Database (Persistent)
1.  Go to [Supabase.com](https://supabase.com) or [Neon.tech](https://neon.tech).
2.  Create a new Project.
3.  Go to **Database Settings** and find your **Connection String** (URI).
    *   It should look like: `postgresql://postgres:password@db.host.supabase.co:5432/postgres`

## Phase 2: Migrate your Data
Run this on your computer before deploying:
1.  Open your terminal in the `backend` folder.
2.  Set your environment variable (Command Prompt):
    ```cmd
    set DATABASE_URL=your_postgres_connection_string
    ```
3.  Run the migration script:
    ```bash
    python migrate_to_cloud.py
    ```
4.  Check your Supabase/Neon dashboard. You should see all your books, users, and ratings!

## Phase 3: Deploy Backend (Render.com)
1.  Create a new **Web Service** on Render.
2.  Connect your GitHub repository.
3.  **Environment**: Python
4.  **Build Command**: `pip install -r requirements.txt`
5.  **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6.  **Environment Variables**:
    *   `DATABASE_URL`: Your postgres connection string.
    *   `GEMINI_API_KEY`: Your Google Gemini key.

## Phase 4: Deploy Frontend (Vercel)
1.  Go to [Vercel.com](https://vercel.com).
2.  Import your repository.
3.  **Environment Variables**:
    *   `VITE_API_URL`: The URL Render gave you (e.g., `https://library-backend.onrender.com`).
4.  Deploy!

---

### Important Notes:
*   **Gemini vs Ollama**: On Render, the website will automatically use **Gemini** (Cloud) because Render cannot run Ollama. 
*   **Persistence**: Once you are connected to Supabase, any new users or ratings created on the website will be saved forever in the cloud!
