# Spec: Self-hosted VPS Deployment Migration

**Date:** 2026-09-19
**Status:** Ready

---

## Problem Statement
The project currently relies on PaaS platforms which abstract away infrastructure but increase long-term costs and vendor lock-in. We need to build a self-hosted staging/production environment on a Virtual Private Server (VPS) using standard DevOps practices (Docker, Nginx, VPN) to reduce costs, increase control, and serve as a hands-on learning environment for the development team.

---

## User Stories

- **[P1]** As a DevOps engineer, I want to provision a Free Tier VPS (Oracle or AWS) so that I can host the application without incurring immediate monthly costs.
  Accepted when: A VPS instance is accessible via SSH.
- **[P1]** As a DevOps engineer, I want to secure the VPS using Netbird (VPN) and a Firewall (UFW) so that SSH access is hidden from the public internet.
  Accepted when: The server drops external SSH attempts but allows connections via the Netbird interface.
- **[P1]** As a DevOps engineer, I want to deploy the application stack (React/Vite frontend, Backend, PostgreSQL) using Docker Compose so that the environment is reproducible and isolated.
  Accepted when: Running `docker compose up -d` successfully spins up all services, with PostgreSQL data persisted to a named volume.
- **[P1]** As a User, I want to access the web application securely via HTTPS so that my data is protected in transit.
  Accepted when: Nginx successfully routes external HTTPS traffic to the React frontend or Backend API, secured by a Let's Encrypt SSL certificate.
- **[P2]** As a developer, I want to implement automated CI/CD (e.g., GitHub Actions) so that pushing code automatically updates the VPS without manual SSH intervention.
  Accepted when: Merging to main automatically triggers a build and container restart on the VPS.

---

## Functional Requirements

1. FR-01: The system must run entirely within Docker containers, orchestrated by a single `docker-compose.yml` file.
2. FR-02: The PostgreSQL database must use a persistent Docker volume to ensure data survives container restarts or rebuilds.
3. FR-03: The React/Vite frontend must be compiled to static assets (`dist`) and served by an Nginx container.
4. FR-04: Nginx must act as a reverse proxy, routing `/api/*` traffic to the backend container and all other traffic to the static frontend assets.

---

## Non-Functional Requirements

- Security: SSH port (22) must only be accessible via the Netbird overlay network interface.
- Security: All public HTTP traffic (port 80) must be automatically redirected to HTTPS (port 443).
- Availability: Application services (Backend, Frontend) must be configured with Docker restart policies (`restart: always` or `unless-stopped`) to recover from crashes.

---

## Success Criteria

- [ ] Security metric: 0 open ports exposed to the public internet other than 80 and 443.
- [ ] Deployment metric: The entire stack can be torn down and brought back up using standard docker compose commands without data loss in the DB.
- [ ] Access metric: Application is fully accessible and functional via the public domain with a valid SSL certificate.

---

## Out of Scope

- Setting up an external managed database (e.g., Supabase, RDS) — keeping it internal for cost savings.
- Immediate CI/CD automation — will be handled manually first for educational purposes.

---

## Assumptions

- The user has a valid domain name to point to the new VPS IP for Nginx/Certbot configuration.
- The React/Vite frontend can be built successfully into static assets without relying on server-side runtime environments like Next.js.
