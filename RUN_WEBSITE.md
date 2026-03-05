# How to View the A One Tarot Website

## Step 1: Start the Backend (Terminal 1)

```powershell
cd "c:\Users\LENOVO\OneDrive\Desktop\Aone Tarot\backend"
npm run dev
```

Wait until you see: **🚀 A One Tarot API running on port 4000**

## Step 2: Start the Frontend (Terminal 2)

```powershell
cd "c:\Users\LENOVO\OneDrive\Desktop\Aone Tarot\frontend"
npm run dev
```

Wait until you see: **✓ Ready** and **Local: http://localhost:3000**

## Step 3: Open in Browser

Open your browser and go to: **http://localhost:3000**

You should see:
- Dark purple background
- Gold "A One Tarot" header
- "Discover Your Path Through the Cards" hero
- Services section
- Testimonials
- Footer with contact info

## If the page is blank:

1. **Hard refresh**: Press `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)
2. **Clear cache**: Open DevTools (F12) → Application → Clear storage
3. **Check console**: F12 → Console tab for any red errors
4. **Restart both servers**: Stop with Ctrl+C, then run the commands again
