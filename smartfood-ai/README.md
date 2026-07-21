# SmartFood AI - Intelligent Food Redistribution & Hunger Prediction Platform

A next-generation AI-powered platform designed to reduce food wastage and combat hunger through intelligent logistics, real-time coordination, and predictive analytics.

## 🎯 Vision

SmartFood AI creates a sustainable digital ecosystem that:
- Minimizes food wastage
- Predicts hunger-prone regions using AI
- Automates food donation workflows
- Enables fast NGO coordination
- Tracks volunteers in real-time
- Generates impact analytics for governments and organizations
- Supports smart city and social welfare initiatives

## 🏗️ Project Structure

```
smartfood-ai/
├── backend/                 # Spring Boot REST API
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                # React Web Application
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docs/                    # Documentation
├── docker-compose.yml       # Microservices orchestration
├── .github/                 # GitHub templates & workflows
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Docker & Docker Compose (optional)

### Option 1: Using Docker Compose

```bash
docker-compose up --build
```

This will start:
- Backend API: http://localhost:8080
- Frontend: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Option 2: Local Development

#### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📋 Features

### For Restaurants & Hotels
- Upload food availability
- Mention quantity and expiry
- Schedule pickups
- Track donation history
- Receive impact reports

### For NGOs & Shelter Homes
- Request food donations
- Accept nearby donations
- View delivery status
- Track received meals
- Manage beneficiaries

### For Volunteers / Delivery Partners
- Accept delivery tasks
- Navigate using real-time maps
- Upload proof of delivery
- Earn reward points
- Track delivery routes

### For Admin
- Monitor all operations
- Manage users and organizations
- AI analytics dashboard
- Heatmap monitoring
- Fraud detection
- Food safety monitoring

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **API**: REST + WebSocket (Real-time)
- **Database**: PostgreSQL 13+
- **Cache**: Redis 6+
- **Authentication**: JWT + Spring Security
- **Testing**: JUnit 5, Mockito
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Maps**: OpenStreetMap / Leaflet
- **Real-time**: Socket.io
- **Testing**: Jest, React Testing Library

### DevOps
- Docker & Docker Compose
- PostgreSQL
- Redis
- GitHub Actions (CI/CD)

## 📊 Database Schema

Key entities:
- **Users**: Restaurants, NGOs, Volunteers, Admins
- **Organizations**: Donor and receiving entities
- **Food Donations**: Available food items
- **Delivery Orders**: Assignment and tracking
- **Transactions**: History and analytics
- **Analytics**: Predictive models and heatmaps

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Encrypted sensitive data
- SQL injection prevention
- CORS protection
- Rate limiting

## 🤖 AI & ML Features

- Hunger hotspot prediction
- Optimal food-to-NGO matching
- Delivery route optimization
- Demand forecasting
- Anomaly detection
- User behavior analytics

## 📈 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Donations
- `GET /api/donations` - List all donations
- `POST /api/donations` - Create donation
- `PUT /api/donations/{id}` - Update donation
- `GET /api/donations/{id}/status` - Track donation

### Deliveries
- `GET /api/deliveries` - List deliveries
- `POST /api/deliveries` - Create delivery assignment
- `PUT /api/deliveries/{id}/status` - Update delivery status
- `GET /api/deliveries/{id}/tracking` - Real-time tracking

### Analytics
- `GET /api/analytics/heatmap` - Hunger prediction heatmap
- `GET /api/analytics/impact` - Impact metrics
- `GET /api/analytics/trends` - Trend analysis

## 🚦 Getting Started

1. Clone the repository
2. Set up environment variables (see `.env.example`)
3. Create PostgreSQL database
4. Run database migrations
5. Start backend: `mvn spring-boot:run`
6. Start frontend: `npm start`
7. Access at http://localhost:3000

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_URL=jdbc:postgresql://localhost:5432/smartfood_db
DB_USERNAME=smartfood
DB_PASSWORD=your_password

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000

# Application
APP_NAME=SmartFood AI
APP_ENV=development
APP_PORT=8080

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Mail Service
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📚 Documentation

- [Backend API Documentation](docs/BACKEND_API.md)
- [Frontend Setup Guide](docs/FRONTEND_SETUP.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Support

For questions or issues, please open a GitHub issue or contact the team.

---

## Known limitations

- unable to login from sign in page for donors

- and cant add there donating food or money to the Smart Food Management System

---

**Made with ❤️ for a hunger-free world**
