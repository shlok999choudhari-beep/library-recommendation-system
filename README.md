# 📚 Smart Library Recommendation System

> **AI-Powered Library Management with Personalized Book Recommendations**

A modern, full-stack library management system that combines traditional library operations with intelligent book recommendations using hybrid filtering algorithms.

## 🚀 Features

### 🔐 **Authentication & User Management**
- Role-based access (User/Admin)
- User profile management

### 📖 **Smart Book Management**
- Browse 1500+ curated books with detailed descriptions
- Advanced search and filtering capabilities
- Real-time book availability tracking

### 🤖 **AI-Powered Recommendations**
- **Hybrid Filtering Engine**: Combines content-based and collaborative filtering
- Personalized recommendations based on reading history
- Genre-based preference matching

### 📊 **Analytics & Insights**
- Reading activity tracking
- User engagement metrics
- Popular books analytics

## 🛠️ Tech Stack

### **Backend**
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **SQLite** - Lightweight database
- **Scikit-learn** - Machine learning for recommendations
- **Pandas & NumPy** - Data processing
- **JWT** - Secure authentication

### **Frontend**
- **React 19** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Router** - Client-side routing

## 🏗️ Project Structure

```
library-recommendation-system/
├── backend/
│   ├── app/
│   │   ├── core/          # Security & dependencies
│   │   ├── routes/        # API endpoints
│   │   ├── recommender/   # ML recommendation engine
│   │   └── utils/         # Utility functions
│   ├── tests/            # Test files
│   ├── scripts/          # Utility scripts
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Main application pages
│   │   └── services/     # API integration
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/shlok999choudhari-beep/library-recommendation-system.git
cd library-recommendation-system/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py
python import_books.py

# Start the server
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Books
- `GET /books/` - List all books
- `GET /books/{book_id}` - Get book details
- `POST /books/add` - Add new book (Admin)

### Recommendations
- `GET /recommend/{user_id}` - Get personalized recommendations
- `POST /activity/update` - Update reading activity

### User Management
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile

## 🧠 Recommendation Algorithm

Our hybrid recommendation system combines:

1. **Content-Based Filtering**: Analyzes book features (genre, author, description)
2. **Collaborative Filtering**: Learns from user behavior patterns
3. **Popularity-Based**: Incorporates trending and highly-rated books

## 🎯 Future Enhancements

- [ ] AI Chatbot integration (Gemini API)
- [ ] Book issue/return system
- [ ] Real-time notifications
- [ ] Book review & rating system
- [ ] Advanced filtering options
- [ ] Weekly analytics dashboard
- [ ] Mobile app development
- [ ] Cloud deployment (Google Cloud)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Development**: FastAPI, ML Algorithms, Database Design
- **Frontend Development**: React, UI/UX, State Management
- **DevOps**: Deployment, CI/CD, Cloud Infrastructure

---

⭐ **Star this repository if you found it helpful!**

📧 **Contact**: shlok999choudhari@gmail.com 
