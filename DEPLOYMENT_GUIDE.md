# School ERP Deployment Guide

This guide covers how to deploy your School ERP system to production with multi-tenant support (subdomains for each school).

---

## 🚀 Recommended Platform: **Vercel** (Easiest)

Vercel is the best option for Next.js apps with subdomain support.

### Why Vercel?
- ✅ Native Next.js support (they created Next.js!)
- ✅ Automatic SSL certificates
- ✅ Wildcard subdomain support
- ✅ Free tier available
- ✅ Easy CI/CD from GitHub
- ✅ Edge functions for middleware
- ✅ Analytics included

---

## 📋 Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/school-erp.git
   git push -u origin main
   ```

2. **Create `.env.example`** (for reference)
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # App
   NEXT_PUBLIC_MAIN_DOMAIN=yourapp.com
   NEXT_PUBLIC_APP_URL=https://yourapp.com

   # Optional
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-email
   SMTP_PASS=your-password
   ```

---

### Step 2: Set Up Supabase Database

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name and region (Asia Southeast for Pakistan)
   - Wait for project to initialize

2. **Run Database Migrations**
   - Go to SQL Editor in Supabase Dashboard
   - Copy contents of `supabase/migrations/001_multi_tenant_schema.sql`
   - Run the SQL

3. **Get API Keys**
   - Go to Settings → API
   - Copy:
     - `Project URL` → NEXT_PUBLIC_SUPABASE_URL
     - `anon public` key → NEXT_PUBLIC_SUPABASE_ANON_KEY
     - `service_role` key → SUPABASE_SERVICE_ROLE_KEY

---

### Step 3: Deploy to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   Add these in Vercel Dashboard → Settings → Environment Variables:
   
   | Variable | Value |
   |----------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your service role key |
   | `NEXT_PUBLIC_MAIN_DOMAIN` | yourapp.com |

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

---

### Step 4: Configure Custom Domain

1. **Buy a Domain**
   - Namecheap: [namecheap.com](https://namecheap.com)
   - GoDaddy: [godaddy.com](https://godaddy.com)
   - Cloudflare: [cloudflare.com](https://cloudflare.com) (recommended)

2. **Add Domain in Vercel**
   - Go to your project → Settings → Domains
   - Add your domain: `yourapp.com`
   - Add wildcard: `*.yourapp.com`

3. **Configure DNS Records**
   In your domain provider's DNS settings:
   
   ```
   Type    Name    Value
   ─────────────────────────────────
   A       @       76.76.21.21 (Vercel IP)
   CNAME   www     cname.vercel-dns.com
   CNAME   *       cname.vercel-dns.com
   ```

4. **Verify Domain**
   - Vercel will automatically issue SSL certificates
   - Wait 5-10 minutes for DNS propagation

---

### Step 5: Test Subdomains

After deployment, test these URLs:

- `https://yourapp.com` → Super Admin Dashboard
- `https://citygrammar.yourapp.com` → City Grammar School
- `https://beacon.yourapp.com` → Beacon Academy
- `https://any-school.yourapp.com` → That school's portal

---

## 🔄 Alternative Platforms

### Option 2: Railway.app

Good alternative with database included.

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway init
railway up
```

### Option 3: DigitalOcean App Platform

```bash
# Create app from GitHub
# Configure environment variables
# Add custom domain with wildcard
```

### Option 4: Self-Hosted (VPS)

For full control, use a VPS with Docker:

```bash
# Install on Ubuntu VPS
curl -fsSL https://get.docker.com | sh

# Clone your repo
git clone https://github.com/YOUR_USERNAME/school-erp.git
cd school-erp

# Create docker-compose.yml
# Build and run
docker-compose up -d
```

**Nginx Configuration for Wildcard:**
```nginx
server {
    listen 80;
    server_name *.yourapp.com yourapp.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans | Wildcard Domains |
|----------|-----------|------------|------------------|
| **Vercel** | 100GB bandwidth | From $20/mo | ✅ Yes |
| **Railway** | $5 credits/mo | From $5/mo | ✅ Yes |
| **DigitalOcean** | None | From $5/mo | ✅ Yes |
| **Self-Hosted** | - | VPS from $5/mo | ✅ Yes |

---

## 📱 Mobile Apps (Future)

For mobile apps, you can:
1. **React Native** - Share code with web
2. **Capacitor** - Wrap web app as native
3. **Flutter** - Separate app with same API

---

## 🔒 Security Checklist

Before going live:

- [ ] Enable RLS in Supabase
- [ ] Set strong passwords for admin accounts
- [ ] Configure CORS properly
- [ ] Enable 2FA for super admin
- [ ] Set up backup schedule
- [ ] Configure rate limiting
- [ ] Set up monitoring (Vercel Analytics)

---

## 📈 Scaling Tips

1. **Database**: Upgrade Supabase plan as needed
2. **Edge Functions**: Use for heavy computations
3. **CDN**: Vercel includes CDN automatically
4. **Caching**: Implement Redis for sessions
5. **File Storage**: Use Supabase Storage or S3

---

## 🆘 Troubleshooting

### Subdomain not working?
- Check DNS propagation: [whatsmydns.net](https://whatsmydns.net)
- Verify wildcard certificate in Vercel
- Clear browser cache

### Database connection issues?
- Check Supabase is not paused
- Verify environment variables
- Check IP allowlist in Supabase

### Build failures?
- Run `npm run build` locally first
- Check for TypeScript errors
- Review Vercel build logs

---

## 📞 Support

For issues:
1. Check Vercel/Supabase status pages
2. Review documentation
3. Community forums

---

## Quick Deploy Button

Add this to your README for one-click deploy:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/school-erp)
```

---

**Your School ERP is ready for production! 🎉**
