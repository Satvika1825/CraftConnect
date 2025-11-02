# 🧶 CraftConnect — Empowering Indian Artisans Online

**CraftConnect** is a full-stack e-commerce platform that bridges the gap between **artisans** and **customers**, enabling local craft sellers to showcase and sell handmade products.  
The platform integrates **AI chat mentorship**, **image-based description generation**, and **admin verification** for authenticity and quality control.

---

## 🚀 Features

### 🧵 For Artisans
- Register and request account approval.
- Upload handmade products with images and descriptions.
- AI identifies **materials and craft type** from product images.
- Auto-generates **SEO-friendly product descriptions**.
- Receive personalized **AI mentorship** for pricing, materials, and marketing.
- Manage inventory, orders, and product listings.

---

### 🛍️ For Customers
- Browse verified artisan products by category.
- Add products to cart and place secure orders.
- Chat with an **AI Shopping Assistant** for personalized suggestions.
- Manage profile and view past orders.

---

### 🧑‍💼 For Admin
- **Clerk-based authentication** for secure access.
- **View, approve, or reject** artisan accounts.
- **Approve or reject** product listings before public display.
- Monitor total users, sales, and revenue trends.
- **Manage orders** and remove low-quality or fake listings.
- Generate **sales and user growth analytics**.
- Manage **announcements, offers, and discounts** for the platform.

---

## 🧠 AI & ML Integration

### 💬 AI Chat Mentor
- Powered by **Hugging Face Transformers** for natural conversations.
- Guides artisans in pricing, marketing, and material selection.
- Assists customers with product recommendations and craft education.

### 🖼️ AI Image Description Generator
- Identifies the **materials and craft type** from uploaded images.
- Generates **context-aware product descriptions** automatically.

---

## 🧩 Tech Stack

### 💻 Frontend
- React.js (Vite)
- Tailwind CSS  
- Axios for API communication  
- Clerk Authentication  
- Deployed on **Vercel**

### ⚙️ Backend
- Node.js + Express.js  
- MongoDB + Mongoose  
- RESTful APIs  
- JWT-based Role Access  
- Hugging Face API for AI interactions  
- Cloudinary for image storage  
- Deployed on **Render**

### ☁️ Infrastructure
- **Database:** MongoDB Atlas  
- **Storage:** Cloudinary  
- **Frontend Hosting:** Vercel  
- **Backend Hosting:** Render  

---

## 🔐 Roles & Permissions

| Role | Description | Permissions |
|------|--------------|--------------|
| **Admin** | Manages users, products, and analytics | Full access |
| **Artisan** | Uploads and manages crafts | Limited access |
| **Customer** | Views and purchases products | Purchase access |
| **Pending User** | Awaiting admin approval | Restricted access |

---

## ⚡ Setup Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/craftconnect.git
cd craftconnect
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file with:
```bash
MONGO_URL=your_mongodb_connection_string
HUGGING_FACE_API_KEY=your_huggingface_key
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
CLERK_FRONTEND_API=your_clerk_frontend_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4️⃣ Run the Project
```bash
npm run dev
```

---

## 📈 Future Enhancements
- Voice-based AI assistance for artisans.  
- Multilingual support (Hindi, Telugu, Tamil).  
- AI-driven fake product detection.  
- Integration with Indian payment gateways (Razorpay, Paytm).  
- Document-based artisan verification (OCR).  

---

> 🎨 *“CraftConnect — Where Tradition Meets Technology.”*
