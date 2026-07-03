# ServDeal Security & Deployment Checklist ✅

## 🔐 Security Fixes Applied

### CRITICAL (Fixed)
- ✅ **HttpOnly Cookie** - Changed from `false` to `true` to prevent XSS token theft
- ✅ **Token Verification Error Handling** - Wrapped `verifyToken()` in try-catch to handle malformed tokens
- ✅ **OTP Exposure** - Removed OTP from API responses (production security)
- ✅ **Weak JWT Secrets** - Enforce separate JWT_REFRESH_SECRET instead of fallback
- ✅ **Unprotected Payment Callback** - Added `protect` middleware to `/payu/callback`
- ✅ **ReDoS Vulnerability** - Escaped regex patterns in leaderboard queries
- ✅ **User Enumeration** - Generic error messages for auth endpoints
- ✅ **Weak OTP Generation** - Using `crypto.randomInt()` instead of `Math.random()`

### HIGH (Fixed)
- ✅ **Helmet Security Headers** - Configured CSP, X-Frame-Options, HSTS
- ✅ **CORS Over-permissive** - Restricted from wildcard `.onrender.com` to specific domain
- ✅ **PAYU_KEY Exposure** - Removed API key from `/config` endpoint
- ✅ **Missing Admin Rate Limiting** - Added rate limiter to admin routes

### MEDIUM (Remaining - Implement Before Production)
- ⏳ **Image Optimization** - 15 `<img>` tags should use Next.js `Image` component
- ⏳ **Payment Hash Validation** - Add timestamp validation in PayU response verification
- ⏳ **Booking Authorization** - Add comprehensive provider association validation
- ⏳ **Input Validation** - Add field length/format validation beyond whitelist

---

## 🚀 Deployment Checklist

### 1. Environment Setup
```bash
# Copy and configure .env file
cp backend/.env.example backend/.env
```

**Required variables:**
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/servdeal
JWT_SECRET=<generate-secure-secret>
JWT_REFRESH_SECRET=<generate-separate-secret>
CLIENT_URL=https://yourdomain.com

# Payment Providers
PAYU_MERCHANT_KEY=your_key
PAYU_MERCHANT_SALT=your_salt

# SMS Provider (India)
MSG91_AUTH_KEY=your_key
MSG91_OTP_TEMPLATE_ID=your_template

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email
SMTP_PASS=your_app_password

# Image CDN
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 2. Generate Secure Secrets
```bash
# Generate JWT_SECRET (use this in terminal)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_REFRESH_SECRET (different from above)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Pre-Deployment Build
```bash
npm run build
```
✅ **Status:** All builds pass successfully

### 4. Database Preparation
- [ ] Create MongoDB cluster on MongoDB Atlas
- [ ] Add IP whitelist for your server
- [ ] Run initial seed if needed: `npm run seed` (backend)
- [ ] Backup existing data before migration

### 5. Frontend Configuration
```env
# frontend/.env.production.local
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://yourdomain.com
```

### 6. HTTPS & SSL
- [ ] Generate SSL certificate (Let's Encrypt recommended)
- [ ] Configure reverse proxy (Nginx/Apache)
- [ ] Set `secure: true` in cookie options (already configured)

### 7. CORS Configuration
- [ ] Update `CLIENT_URL` to production domain
- [ ] Set `RENDER_EXTERNAL_URL` if using Render
- [ ] Test CORS from frontend domain

### 8. Security Headers Verification
```bash
# Test security headers
curl -I https://yourdomain.com/api/v1/health

# Expected headers:
# - Strict-Transport-Security
# - X-Frame-Options: DENY
# - X-Content-Type-Options: nosniff
# - Content-Security-Policy
```

### 9. Rate Limiting Verification
```bash
# Test rate limiting (should return 429 after limit)
for i in {1..250}; do curl https://yourdomain.com/api/v1/health; done
```

### 10. Payment Gateway Setup
- [ ] PayU sandbox testing completed
- [ ] Switch to production keys in `.env`
- [ ] Test payment flow end-to-end
- [ ] Webhook URL configured correctly

### 11. Email Configuration
- [ ] SMTP credentials tested
- [ ] Email templates verified
- [ ] Sender email whitelisted with payment gateway

### 12. Monitoring & Logging
- [ ] Enable server logs monitoring
- [ ] Setup error tracking (Sentry recommended)
- [ ] Configure health check endpoint
- [ ] Monitor database connection pool

### 13. Performance Optimization
- [ ] Build size verified: `npm run build` ✅
- [ ] Bundle analysis completed
- [ ] CDN configured for static assets
- [ ] Database indexes optimized

### 14. Backup & Disaster Recovery
- [ ] Database backups automated daily
- [ ] Environment variables backed up securely
- [ ] Rollback plan documented
- [ ] Recovery time objective (RTO) defined

---

## 🧪 Testing Checklist

### Authentication Flow
- [ ] Register new user (SMS OTP)
- [ ] Register new user (Email OTP)
- [ ] Login with email/password
- [ ] Login with OTP
- [ ] Token refresh working
- [ ] Logout clears cookies
- [ ] Invalid token returns 401

### Payment Flow
- [ ] Create booking
- [ ] Initiate payment
- [ ] Complete payment in PayU sandbox
- [ ] Payment status updated
- [ ] Invoice generated

### Authorization
- [ ] Customer can only see own bookings
- [ ] Provider can manage own profile
- [ ] Admin can access dashboard
- [ ] Rate limiting activates correctly

### Error Handling
- [ ] Database connection failures handled
- [ ] Payment gateway timeouts handled
- [ ] Invalid input returns proper errors
- [ ] Stack traces hidden in production

---

## 📋 Production Deployment Commands

### Backend
```bash
cd backend
npm install --production
npm start
```

### Frontend
```bash
cd frontend
npm install --production
npm run build
npm start
```

### With Docker (Optional)
```bash
docker build -t servdeal-backend ./backend
docker build -t servdeal-frontend ./frontend
docker compose up -d
```

### Health Check
```bash
curl https://yourdomain.com/api/v1/health
```

---

## 🔍 Monitoring After Deployment

### Key Metrics to Monitor
1. **Response Times** - API response time < 500ms
2. **Error Rate** - < 0.1% of requests should fail
3. **Database Connections** - Monitor pool usage
4. **Payment Success Rate** - > 99.5%
5. **OTP Delivery Rate** - SMS/Email > 95%

### Log Files to Check
- Application logs: `npm run dev` output
- Error logs: Database connection failures
- Security logs: Failed auth attempts, rate limit triggers

### Alerts to Setup
- [ ] CPU usage > 80%
- [ ] Memory usage > 90%
- [ ] Error rate > 5%
- [ ] Response time > 1000ms
- [ ] Database disconnection

---

## 🚨 Emergency Contacts

Add team contacts for production support:
- Backend Developer: [Add contact]
- DevOps/Infrastructure: [Add contact]
- Database Admin: [Add contact]
- Security Team: [Add contact]

---

## ✅ Pre-Go-Live Sign-Off

- [ ] All security fixes applied and tested
- [ ] Environment variables configured
- [ ] Build passes without errors
- [ ] Tests pass (if applicable)
- [ ] Staging environment verified
- [ ] Production database ready
- [ ] SSL certificate installed
- [ ] Monitoring configured
- [ ] Backups automated
- [ ] Rollback plan ready
- [ ] Team trained on production procedures

**Deployment Date:** ___________  
**Deployed By:** ___________  
**Approved By:** ___________

---

*Last Updated: 2026-07-03*
