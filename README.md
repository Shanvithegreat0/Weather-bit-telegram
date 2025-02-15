# 🌦 Telegram Weather Bot

A **NestJS-based Telegram bot** that provides weather forecasts for a particular state and allows users to subscribe for daily updates. It also includes an admin panel for managing users and commands.

## 🚀 Features
- Get real-time weather forecasts
- Subscribe to daily weather updates
- Admin panel for user management
- Add or remove bot commands dynamically

---
# Here is my bot link : t.me/shanvi_weather_bot

## 🛠 Installation
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add:
```env
BOT_TOKEN=your_telegram_bot_token
OPENWEATHER_API_KEY=your_openweather_api_key
ADMIN_PASSWORD=your_secure_password
PORT=4000
```

---

## ▶ Running Locally

### 1️⃣ Start the Bot & Server
```bash
npm run start
```
The bot should now be running, and the web admin panel should be available at:
```
http://localhost:4000
```

---

## 🌍 Deployment Options

### 🚀 **Deploy on Railway (Easiest & Free)**
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
2. Go to **[Railway.app](https://railway.app/)** → Start a New Project → Connect GitHub repo.
3. Set environment variables (`BOT_TOKEN`, `PORT`, etc.).
4. Click **Deploy** and get a public URL.

### 🚀 **Deploy on Render (Alternative Free Option)**
1. Go to **[Render.com](https://render.com/)** → New Web Service → Connect GitHub repo.
2. Set environment variables (`BOT_TOKEN`, `PORT`, etc.).
3. Deploy & get your bot's **public URL**!


---

## 📌 Usage
### 🔹 Start the Bot
Search for your bot in Telegram and send `/start`.

### 🔹 Get Weather Forecast
```bash
/weather city_name
```

### 🔹 Subscribe to Daily Updates
```bash
/subscribe
```

### 🔹 Unsubscribe
```bash
/unsubscribe
```

### 🔹 Admin Login (Web Panel)
Visit `http://localhost:4000`, enter the **admin password**, and manage users or bot commands.

---

## 📜 License
This project is licensed under the MIT License.

---

## 🚀 Need Help?
Feel free to open an issue or contact me! 😊

