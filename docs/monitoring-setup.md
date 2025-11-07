# Monitoring and Observability Setup

Post-deployment monitoring instructions to track health and performance.

## Vercel Analytics
- Enable Vercel Web Analytics under Project → Analytics
- Add `@vercel/analytics` (already included) and initialize in layout if needed

## Vercel Logs and Metrics
- Project → Deployments → View Build and Runtime Logs
- Set alerts (optional) using Vercel integrations or external services

## Supabase Monitoring
- Dashboard → Logs to monitor database queries and errors
- Policies and RLS: verify with SQL editor
- Storage usage: track buckets (receipts, images)

## Health Endpoints
- `/api/health/db` or `/api/health/supabase` for connectivity checks
- Integrate with uptime monitors (e.g., UptimeRobot) to ping health endpoints

## Performance
- Use Next.js Profiler locally; monitor bundle sizes
- Real-time subscriptions performance: watch channel traffic and client memory

## Alerts (Optional)
- Configure Slack/Webhook alerts via Vercel or Supabase
- Set threshold-based alarms for error rates and status codes

