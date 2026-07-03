# 🚀 ServDeal Production Deployment Guide

## Prerequisites

- [ ] MongoDB Atlas cluster set up and running
- [ ] Razorpay merchant account configured
- [ ] MSG91 or Twilio SMS provider account
- [ ] Cloudinary account for image storage
- [ ] Email service (SMTP or Resend) configured
- [ ] Domain names for both backend and frontend
- [ ] SSL certificates (auto-provisioned by most platforms)
- [ ] GitHub repository with code pushed

---

## Deployment Options

### Option 1: Render.com (Recommended - FREE TIER AVAILABLE)

#### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Connect your GitHub repository

#### Step 2: Deploy Backend Service
1. Click "New +" → "Web Service"
2. Connect to `servdeal` repository
3. Configure:
   - **Name**: `servdeal-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
4. Add Environment Variables (from `.env.production.example`)
5. Select Plan: "Free" or "Starter"
6. Click "Create Web Service"

#### Step 3: Deploy Frontend Service
1. Click "New +" → "Web Service"
2. Connect to `servdeal` repository
3. Configure:
   - **Name**: `servdeal-frontend`
   - **Root Directory**: `frontend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx next start -p $PORT`
4. Add Environment Variables (ensure `NEXT_PUBLIC_API_URL` points to backend service)
5. Click "Create Web Service"

#### Step 4: Set Custom Domains
1. Go to each service's settings
2. Add custom domain under "Custom Domains"
3. Follow DNS setup instructions from Render

**Estimated Cost**: $0 - $12/month on free/starter tier

---

### Option 2: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select `frontend` directory as root
4. Configure build settings automatically detected
5. Add environment variables from `.env.production.example`
6. Deploy

#### Backend on Railway/Render
1. Deploy backend separately to Railway or Render (see Option 1)
2. Update `NEXT_PUBLIC_API_URL` in Vercel with backend URL

**Estimated Cost**: $0 - $20/month

---

### Option 3: Docker + Self-Hosted Server

#### Prerequisites
- Docker and Docker Compose installed
- Ubuntu/Linux server with:
  - 2+ CPU cores
  - 4GB+ RAM
  - 20GB+ SSD storage

#### Step 1: Create Dockerfile for Backend
Already included in project (if available)

#### Step 2: Create Dockerfile for Frontend
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/ ./
RUN npm ci
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npx", "next start"]
```

#### Step 3: Docker Compose Setup
```bash
docker compose up -d
```

#### Step 4: SSL with Let's Encrypt
```bash
certbot certonly --standalone -d your-domain.com
```

#### Step 5: Nginx Reverse Proxy
Configure nginx to proxy requests to Docker containers

---

## Environment Variables Setup

### 1. Backend `.env` (Production)
```bash
# Copy template and fill in real values
cp backend/.env.production.example backend/.env.production

# Edit with your values
vim backend/.env.production
```

### 2. Frontend `.env.local` (Production)
```bash
cp frontend/.env.production.example frontend/.env.local

# Edit with your values
vim frontend/.env.local
```

### 3. GitHub Secrets (for CI/CD)
Add these to your GitHub repository settings:
- `RENDER_PROD_DEPLOY_HOOK` - Webhook URL from Render
- `STAGING_API_URL` - Staging backend URL (if applicable)

---

## Database Seeding

After deploying for the first time:

```bash
# SSH into backend service or run locally with production DB
cd backend
node src/seed/seed.js
```

This initializes:
- Admin user account
- Service categories
- Cities and locations
- Default settings

---

## Post-Deployment Checklist

- [ ] Backend service is running and healthy
- [ ] Frontend service is running and accessible
- [ ] Database connection verified
- [ ] Email service working (test OTP sending)
- [ ] Payment gateway tested (Razorpay test mode)
- [ ] SMS provider working (MSG91/Twilio)
- [ ] Image uploads working (Cloudinary)
- [ ] SSL certificates active
- [ ] CORS configured correctly
- [ ] API rate limiting enabled
- [ ] Security headers set (Helmet)
- [ ] Logging configured
- [ ] Backup strategy in place

---

## Monitoring & Maintenance

### Health Checks
```bash
# Backend health
curl https://your-backend-domain.com/api/v1/health

# Frontend health
curl https://your-frontend-domain.com/api/health
```

### Logs
- **Render**: View in Render dashboard
- **Vercel**: View in Vercel dashboard
- **Self-hosted**: Check Docker logs
  ```bash
  docker compose logs -f
  ```

### Database Backups
- **MongoDB Atlas**: Automatic daily backups (free tier 7-day retention)
- **Manual backup**:
  ```bash
  mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/servdeal"
  ```

---

## Troubleshooting

### Service won't start
- Check environment variables are set correctly
- Verify database connection string
- Check logs for specific errors
- Ensure all secrets are properly configured

### Build failures
- Run `npm install` locally and check for errors
- Verify all dependencies are in package.json
- Check Node version matches (v20 required)

### Database connection issues
- Verify MongoDB Atlas connection string
- Check IP whitelist includes your deployment platform
- Ensure MONGO_URI is set in environment variables

### API not responding
- Check CORS configuration in backend
- Verify backend service is running
- Check network connectivity between services
- Review rate limiting settings

---

## Scaling Considerations

### For 1K+ Daily Users
- Enable Redis caching
- Implement database query optimization
- Use CDN for static assets
- Load balance multiple backend instances

### For 10K+ Daily Users
- Use MongoDB sharding
- Implement microservices architecture
- Set up dedicated worker instances for background jobs
- Use message queues (Redis/RabbitMQ)

---

## Security Best Practices

✅ **Enable**:
- HTTPS/SSL for all traffic
- Rate limiting and DDoS protection
- API authentication (JWT)
- CORS restrictions
- HELMET security headers
- Regular security audits
- Environment variable encryption
- IP whitelisting for database access
- Web Application Firewall (WAF)

❌ **Avoid**:
- Exposing credentials in code
- Using default passwords
- Disabling security headers
- Logging sensitive data
- Skipping authentication checks

---

## Emergency Procedures

### Database Backup Recovery
```bash
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/servdeal" dump/
```

### Rollback Deployment
1. **Render**: Go to "Deployments" tab, select previous version, click "Redeploy"
2. **Vercel**: Go to "Deployments" tab, select previous version, click "Promote to Production"
3. **Docker**: Roll back to previous image tag

### Service Emergency Stop
```bash
# Docker
docker compose down

# Or stop specific service
docker compose stop servdeal-backend
```

---

## Performance Optimization

### Frontend
- Enable Next.js Image Optimization
- Implement automatic code splitting
- Use dynamic imports for large components
- Enable Gzip compression
- Cache static assets

### Backend
- Implement database indexing
- Cache API responses (Redis)
- Use pagination for large datasets
- Optimize database queries
- Enable compression middleware

### Database
- Create indexes on frequently queried fields
- Archive old records to separate storage
- Monitor query performance
- Regular maintenance and optimization

---

## Cost Optimization

### Render.com
- Free tier: $0/month (basic usage)
- Starter: $7/month per service
- Pro: $12+/month per service

### Vercel
- Free tier: $0/month (frontend only)
- Pro: $20/month

### MongoDB Atlas
- Free tier: 512MB shared cluster
- Paid: $57+/month for dedicated cluster

**Total Estimated Monthly Cost**: $0-50 depending on usage tier

---

## Support & Resources

- **Documentation**: `/DEPLOYMENT.md`
- **Docker Compose**: `/README_COMPOSE.md`
- **GitHub Issues**: For bug reports
- **Environment Variables**: See `.env.example` files
- **API Documentation**: `/backend/README.md`
- **Frontend Guide**: `/frontend/README.md`

---

**Last Updated**: 2026-07-02  
**Status**: ✅ Production Ready
