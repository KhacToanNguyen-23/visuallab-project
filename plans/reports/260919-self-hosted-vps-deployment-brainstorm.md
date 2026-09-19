# Brainstorm: Self-hosted VPS Deployment for VisualLab

**Date:** 2026-09-19

## Ideas Explored
- **Third-party PaaS (Vercel/Heroku):** Dismissed. High cost at scale, less control over infrastructure.
- **VM with Pure Docker vs Direct Install:** Chosen Pure Docker (Docker Compose). Much cleaner, easier to reproduce, isolates dependencies.
- **Database (PostgreSQL) Placement:** Considered external managed DB vs internal Docker container. Chosen internal Docker container for cost efficiency during the learning phase.
- **VPS Provider:** Considered DigitalOcean/Hetzner vs Free Tiers (Oracle, AWS). Chosen Free Tier (try Oracle first, fallback to AWS/Google Cloud 1-year free tier) to minimize costs while learning.
- **Deployment Flow:** Considered immediate CI/CD setup vs manual setup. Chosen manual pull/deploy first for educational value, with automated CI/CD planned for a future phase.

## User's Direction
The user wants to establish a self-hosted environment to learn DevOps while maintaining the current PaaS deployment as a fallback/production environment. The infrastructure will use a Free Tier VPS running a pure Docker environment. The frontend (React/Vite JS) will be served statically via Nginx, which acts as a reverse proxy, alongside a containerized PostgreSQL database and backend. Access will be secured via Netbird (VPN) and SSH. The initial deployment will be manual for educational purposes, setting up for automated CI/CD later.

## Open Questions
None currently blocking the plan. The primary variable is which Cloud provider's Free Tier registration will succeed (Oracle vs AWS), but the Docker architecture remains identical regardless of the host.

## Risks
1. **Free Tier Limits:** AWS/Google Cloud free tiers have strict outbound traffic and compute limits. Unintended spikes could lead to credit card charges.
2. **Oracle Registration Failure:** High likelihood of card rejection for Oracle Cloud Vietnam.
3. **Containerized DB Data Loss:** Storing PostgreSQL in Docker requires strict volume mapping. If the volume is misconfigured or accidentally pruned, all data will be lost.
