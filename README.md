# Vommy Chat - Real-time Chat with Referral System

A modern real-time chat application with an integrated referral and reward system built using Node.js, Express, MySQL, and Redis.

## 🌟 Features

- 🔐 User Authentication & Authorization
- 💬 Real-time Chat Functionality
- 🔗 Referral System with Tracking
- 💰 Reward Management
- 📊 Performance Monitoring
- 🛡️ Advanced Security Features

## 🚀 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MySQL 8.0
- **Caching:** Redis
- **Authentication:** JWT
- **Testing:** Jest
- **Documentation:** Swagger

## 📋 Prerequisites

- Node.js >= 14
- MySQL >= 8.0
- Redis Server
- Windows 10/11

## ⚡ Quick Start

### 1. Clone & Setup
```bash
# Clone repository
git clone https://github.com/yourusername/vommy-chat.git
cd vommy-chat

# Install dependencies
npm install
```

### 2. Database Configuration
```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE vommy_chat_db;
EXIT;
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env
```

Update `.env` with your credentials:
```env
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=vommy_chat_db

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your_secret_key
JWT_EXPIRE=24h
```

### 4. Start Services

```powershell
# Start MySQL (Windows)
net start MySQL80

# Start Redis (WSL)
wsl sudo service redis-server start

# Verify Redis
wsl redis-cli ping
```

### 5. Initialize Application

```bash
# Verify database setup
npm run verify-db

# Seed test data
npm run seed

# Start development server
npm run dev
```

## 🔍 API Documentation

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
POST /api/auth/logout
```

### Referrals
```http
GET /api/referrals
POST /api/referrals/verify
GET /api/referrals/stats
```

### Rewards
```http
GET /api/rewards
POST /api/rewards/claim
GET /api/rewards/history
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific tests
npm test tests/referral.test.js
```

## 📁 Project Structure

```plaintext
vommy-chat/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── tests/         # Test files
├── utils/         # Utility functions
└── server.js      # Entry point
```

## 🔒 Security Features

- ✅ XSS Protection
- ✅ Rate Limiting
- ✅ CSRF Protection
- ✅ SQL Injection Prevention
- ✅ Input Validation
- ✅ JWT Authentication

## 🔧 Troubleshooting

### Database Issues
```powershell
# Reset database
mysql -u root -p -e "DROP DATABASE vommy_chat_db; CREATE DATABASE vommy_chat_db;"
npm run verify-db
```

### Redis Issues
```powershell
# Restart Redis
wsl sudo service redis-server restart

# Clear Redis cache
wsl redis-cli flushall
```

### Common Errors

1. **Port 5000 in use**
```bash
# Change port in .env or kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

2. **Redis Connection Failed**
```bash
# Check Redis status
wsl sudo service redis-server status
```

3. **Database Connection Failed**
- Verify credentials in .env
- Check MySQL service status
- Ensure database exists

## 📈 Performance Features

- Redis Caching
- Connection Pooling
- Query Optimization
- Rate Limiting
- Load Testing Ready

## 🤝 Contributing

1. Fork repository
2. Create feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open Pull Request

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

## 📮 Support

- Documentation: `/docs`
- Issues: GitHub Issues
- Email: support@vommy.com

## 🔖 Version

1.0.0
