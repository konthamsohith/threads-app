# Deployment Guide for Threads Posting App

To make the app "Universal for Anyone", you need to host it on the public internet.

## 1. Push to GitHub
1.  Create a new repository on GitHub (e.g., `threads-app`).
2.  Run these commands in your terminal (at `f:\Threads`):
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/threads-app.git
    git push -u origin main
    ```

## 2. Deploy Backend (Render.com)
**Note: The Backend MUST be deployed on Render because it is an Express server.**
1.  Sign up/Login to [Render](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repo.
4.  **Root Directory**: `server`
5.  **Build Command**: `npm install`
6.  **Start Command**: `node index.js`
7.  **Environment Variables**:
    - `APP_ID`: (Your Threads App ID)
    - `APP_SECRET`: (Your Secret)
    - `THREADS_APP_ID`: (Your Threads ID)
    - `THREADS_APP_SECRET`: (Your Secret)
    - `FRONTEND_URL`: `https://YOUR-NETLIFY-APP.netlify.app` (You will get this in Step 3)
    - `REDIRECT_URI`: `https://YOUR-RENDER-APP.onrender.com/auth/threads/callback`

## 3. Deploy Frontend (Netlify)
1.  Sign up/Login to [Netlify](https://netlify.com).
2.  Click **Add new site** -> **Import an existing project**.
3.  Connect Git Provider -> GitHub -> Select `threads-app`.
4.  **Build Settings**:
    - **Base directory**: `client`
    - **Build command**: `npm run build`
    - **Publish directory**: `dist`
5.  **Environment Variables**:
    - `VITE_API_URL`: `https://YOUR-RENDER-APP.onrender.com` (Copy from Render dashboard)
6.  Click **Deploy**.

## 4. Final Configuration (Meta Dashboard)
Update your Meta App Settings one last time:
1.  **Site URL**: `https://YOUR-NETLIFY-APP.netlify.app`
2.  **Redirect Callback URLs**: `https://YOUR-RENDER-APP.onrender.com/auth/threads/callback`
3.  **App Review**: To let *anyone* login, go to **App Review** -> **Permissions** and request access for `threads_content_publish`.
