# Complete Deployment Guide for Trisense Emotion Sensing

This guide provides step-by-step instructions on how to push your code to GitHub and deploy the Trisense Emotion Sensing application completely for **free** using Render (for the backend) and Vercel (for the frontend).

---

## Part 1: Pushing Code to GitHub

First, you need to store your local code in a GitHub repository so that Render and Vercel can access it and deploy it.

### Prerequisites:
- You need a [GitHub](https://github.com/) account.
- You need to download and install [Git](https://git-scm.com/downloads) on your computer.

### Step-by-Step GitHub Push:

1. **Create a New Repository on GitHub:**
   - Go to [GitHub.com](https://github.com/) and log in.
   - Click the **"+"** icon in the top right corner and select **"New repository"**.
   - Name the repository (e.g., `trisense-emotion-sensing`).
   - Leave it as "Public" or "Private".
   - **Do not** check "Add a README file" or ".gitignore" (we want an empty repository).
   - Click **Create repository**.
   - Copy the repository URL (it will look like `https://github.com/yourusername/trisense-emotion-sensing.git`).

2. **Initialize Git Locally:**
   Open your terminal (Command Prompt, PowerShell, or Git Bash), navigate to your project folder, and run these commands:
   ```bash
   cd d:\Coding\trisense_emotion_sensing
   
   # Initialize an empty Git repository
   git init
   
   # Create a .gitignore file to avoid pushing unnecessary/large files
   echo "node_modules/" > .gitignore
   echo "__pycache__/" >> .gitignore
   echo ".env" >> .gitignore
   ```

3. **Commit and Push Your Code:**
   In the same terminal, run:
   ```bash
   # Add all files to staging
   git add .
   
   # Commit the files
   git commit -m "Initial commit of Trisense Emotion Sensing"
   
   # Change 'main' branch name if needed (modern Git uses 'main' instead of 'master')
   git branch -M main
   
   # Link your local folder to your GitHub repository (Replace URL with your copied URL)
   git remote add origin https://github.com/yourusername/trisense-emotion-sensing.git
   
   # Push the code to GitHub
   git push -u origin main
   ```
   *Note: You may be prompted to log into GitHub in the terminal.*

---

## Part 2: Deploying the Backend on Render (Free)

We will deploy the Python FastAPI backend first, as we need its live URL to configure the frontend.

1. Go to [Render.com](https://render.com) and sign up using your GitHub account.
2. In the Render Dashboard, click the **"New +"** button at the top and select **"Blueprint"**.
3. Connect your GitHub account (if not already connected) and select your `trisense-emotion-sensing` repository.
4. Render will look at your code and automatically detect the `render.yaml` file we created.
5. Click **Apply**.
6. Render will now build and deploy your backend. It takes about 2-5 minutes.
7. Once finished, click on the **Dashboard**, find `trisense-api` under "Web Services", and click it.
8. Look near the top left for your live URL, it will look something like `https://trisense-api-abcd.onrender.com`.
9. **Copy this URL**.

---

## Part 3: Deploying the Frontend on Vercel (Free)

Now that the backend is live, we will deploy the React frontend and tell it to talk to the Render backend.

### Prepare the Frontend:
Before deploying, we need to update the frontend code to use your new Render URL instead of `localhost`.

1. Open `d:\Coding\trisense_emotion_sensing\frontend\src\components\Dashboard.jsx`.
2. Find line 38:
   ```javascript
   const res = await fetch('http://localhost:8000/analyze', {
   ```
3. Replace `'http://localhost:8000/analyze'` with your copied Render URL + `/analyze`. For example:
   ```javascript
   const res = await fetch('https://trisense-api-abcd.onrender.com/analyze', {
   ```
4. Save the file.
5. In your terminal, commit and push this change to GitHub:
   ```bash
   git add frontend\src\components\Dashboard.jsx
   git commit -m "Update API URL for production"
   git push
   ```

### Deploy to Vercel:
1. Go to [Vercel.com](https://vercel.com) and sign up using your GitHub account.
2. Click **"Add New..."** button and select **"Project"**.
3. You will see a list of your GitHub repositories. Click **"Import"** next to `trisense-emotion-sensing`.
4. In the "Configure Project" screen, you must change one setting:
   - **Root Directory**: Click the "Edit" button and select the `frontend` folder. *(This is critical because Vercel only needs the frontend code, not the backend).*
5. The Framework Preset should automatically switch to `Vite`.
6. Click **Deploy**.
7. Vercel will build your React application (usually takes less than 1 minute).
8. Once finished, Vercel will give you a live URL for your website!

---

## Conclusion
You now have a fully deployed web application! 
- The React Frontend is hosted globally for free on Vercel.
- The FastAPI Backend is running in the cloud for free on Render.
- They communicate seamlessly via the URL you updated.

You can visit the Vercel URL to test uploading videos/audio and see the Multi-Modal Emotion Profile updating in real-time!
