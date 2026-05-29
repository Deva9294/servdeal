# ServDeal Deployment Guide

## Project Overview
ServDeal is a full-stack service marketplace platform built with:
- **Backend**: Node.js/Express with MongoDB
- **Frontend**: Next.js 15 with React 19
- **Architecture**: Monorepo using npm workspaces

---

## Pre-Deployment Checklist

### ✅ Completed Steps
- [x] Initial project setup committed
- [x] Dependencies installed
- [x] Backend build validation passed
- [x] Frontend production build successful

### 📋 Required Before Deployment
- [ ] Set up production environment variables (.env)
- [ ] Configure MongoDB Atlas cluster
- [ ] Set up Razorpay account and API keys
- [ ] Configure MSG91 or Twilio for SMS
- [ ] Set up Cloudinary for images
- [ ] Configure SMTP email credentials
- [ ] Get SSL certificate (Let's Encrypt)
- [ ] Set up production domain
- [ ] Run database seed script
- [ ] Configure CI/CD pipeline

---

## Key Credentials Needed

### Payment (Razorpay)
- Dashboard: dashboard.razorpay.com
- Required: Key ID, Key Secret, Webhook Secret

### SMS Provider
- **Recommended**: MSG91 (msg91.com) for India
- Alternative: Twilio (twilio.com)

### Image Storage
- Cloudinary (cloudinary.com)
- Required: Cloud Name, API Key, API Secret

### Email
- Gmail/SMTP credentials
- Create app-specific password if using Gmail

### Database
- MongoDB Atlas cluster
- Create production database user

---

## Quick Start Deploy

### 1. Install Dependencies
```bash
npm install --workspaces
```

### 2. Create Production .env
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with production values
```

### 3. Build Project
```bash
npm run build --workspaces
```

### 4. Start Server
```bash
# Terminal 1 - Backend
npm start -w backend

# Terminal 2 - Frontend  
npm start -w frontend
```

---

## Docker Deployment

### Build Images
```bash
docker build -t servdeal-backend backend/
docker build -t servdeal-frontend frontend/
```

### Run Containers
```bash
docker run -p 5000:5000 --env-file backend/.env servdeal-backend
docker run -p 3000:3000 servdeal-frontend
```

---

## Environment Variables Reference

**Backend (.env)**
```
NODE_ENV=production
PORT=5000
CLIENT_URL=https://yourdomain.com

MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/servdeal
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-key

RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx

SMS_PROVIDER=msg91
MSG91_AUTH_KEY=xxxxx
MSG91_SENDER_ID=SRVDEA

CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

PLATFORM_COMMISSION=15
GST_PERCENT=18
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
```

---

## Deployment Platforms

### Backend Options
- **Heroku**: Free tier available, easy deploy
- **Railway**: Pay-as-you-go, good for Node.js
- **AWS (EC2/Lightsail)**: Most flexible, more setup
- **DigitalOcean App Platform**: Docker support
- **Render**: Modern Node.js hosting

### Frontend Options
- **Vercel**: Optimized for Next.js (recommended)
- **Netlify**: Good for static/SSR
- **AWS S3 + CloudFront**: Static hosting
- **Any Node.js platform**: Can run Next.js server

---

## Production Checklist

- [ ] `.env` configured with real credentials
- [ ] MongoDB Atlas cluster created and IP whitelisted
- [ ] Razorpay test keys replaced with live keys
- [ ] SMS provider credentials added
- [ ] Cloudinary account linked
- [ ] SMTP email configured
- [ ] SSL certificate obtained
- [ ] Domain DNS configured
- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Health checks passing
- [ ] Webhook URLs configured
- [ ] Monitoring/logging set up
- [ ] Database backups enabled
- [ ] Rate limiting tested

---

## Known Issues

### Security Vulnerabilities
3 vulnerabilities found (npm audit):
- nodemailer SMTP injection (nodemailer@8.0.9 available)
- postcss XSS issue (update needed)
- next dependency on vulnerable postcss

**Fix**: Run `npm audit fix --force` with caution

### Missing Dependencies
- recharts requires react-is: `npm install react-is`

---

## Support Files

- **Backend Docker**: `backend/Dockerfile`
- **Frontend Docker**: `frontend/Dockerfile`
- **nginx config**: `nginx/nginx.conf`
- **package.json scripts**: See workspaces

---

## Next Steps

1. Fill in `.env` with production credentials
2. Test locally: `npm run dev --workspaces`
3. Build: `npm run build --workspaces`
4. Deploy backend to your hosting platform
5. Deploy frontend to Vercel/your platform
6. Run smoke tests and monitoring
7. Set up automated backups

---

**Generated**: 2026-05-29
**Status**: Ready for Deployment
