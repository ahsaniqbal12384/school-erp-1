# Netlify Deployment Guide for School ERP

This guide will walk you through deploying the School ERP application to Netlify for free.

## Prerequisites

- GitHub account with your repository pushed
- Netlify account (free at [netlify.com](https://netlify.com))
- Supabase project set up with database

## Step 1: Prepare Your Repository

### 1.1 Ensure All Files Are Committed

```bash
cd /workspaces/school-erp-1
git add .
git commit -m "Add Netlify configuration for deployment"
git push origin master
```

### 1.2 Verify Environment Variables Are Set Locally

Check `.env.local` has your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_MAIN_DOMAIN=your-domain.com
```

## Step 2: Create Netlify Account & Connect Repository

1. **Go to [Netlify](https://app.netlify.com)**
2. Click **"Sign up"** → Choose **"Sign up with GitHub"**
3. Authorize Netlify to access your GitHub account
4. Click **"New site from Git"**
5. Click **"GitHub"** and select your repository:
   - Owner: `ahsaniqbalmarketfunsoltech-code`
   - Repository: `school-erp-1`

## Step 3: Configure Build Settings

Once you select your repository, Netlify will auto-detect Next.js settings:

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: Should be 18 or higher

Click **"Deploy"** (don't change these unless needed)

## Step 4: Add Environment Variables

After your first deploy attempt, go to your Netlify site dashboard:

1. Click **"Site settings"** → **"Build & deploy"** → **"Environment"**
2. Click **"Edit variables"**
3. Add these environment variables from your `.env.local`:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `NEXT_PUBLIC_MAIN_DOMAIN` | `your-site-name.netlify.app` |

4. Click **"Save"**

## Step 5: Redeploy

1. Go back to your site dashboard
2. Click **"Deploys"**
3. Click the dropdown menu **"Trigger deploy"** → **"Deploy site"**

Wait 2-5 minutes for the build to complete.

## Step 6: Access Your Live Site

Once deployment completes:
- Your site will be live at: `https://your-site-name.netlify.app`
- Check the deployment logs if there are any errors

## Important Notes for School ERP

### Database Migrations
Ensure your Supabase database is fully set up before deploying:
```bash
# From SUPABASE_SETUP.md - run these migrations on your Supabase project
```

### Multi-Tenant Configuration
If using multiple school subdomains, ensure:
- `NEXT_PUBLIC_MAIN_DOMAIN` is set to your Netlify domain
- Supabase table policies allow your domain

### Authentication
The app uses Supabase authentication. Make sure to:
1. Enable Email/Password auth in Supabase
2. Create a super admin user for initial setup
3. Configure any additional auth methods needed

## Custom Domain Setup (After Testing)

Once you're ready to use your own domain:

1. **Go to Site settings** → **"Domain management"**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `schoolerp.yourcompany.com`)
4. Update your domain registrar's DNS records:
   - Change your domain's A record to Netlify's IP
   - Or use CNAME pointing to `your-site-name.netlify.app`
5. Netlify will auto-provision SSL/HTTPS

## Troubleshooting

### Build Fails
1. Check build logs in Netlify dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node version compatibility

### Environment Variables Not Working
1. Make sure variables are set in Netlify (not just locally)
2. Restart the deployment
3. Check that variable names match exactly

### Authentication Errors
1. Verify Supabase credentials are correct
2. Check if Supabase URL is accessible
3. Ensure database migrations are complete

### Performance Issues
1. Netlify caches `.next` folder
2. Use Netlify Analytics to monitor
3. Consider Netlify Functions for serverless features

## Free Tier Benefits

✅ Unlimited sites  
✅ 300 free build minutes/month  
✅ Automatic HTTPS  
✅ CDN on all continents  
✅ Rollbacks available  
✅ Automatic deployments on git push  

## Next Steps

1. **Test thoroughly** on the Netlify domain
2. **Set up custom domain** when ready
3. **Configure DNS records** for production
4. **Monitor analytics** and performance
5. **Plan upgrade** if you exceed 300 build minutes (unlikely)

## Contact & Support

- Netlify Support: https://app.netlify.com/help
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs

---

**Your site will be live and accessible worldwide once deployed!** 🚀
