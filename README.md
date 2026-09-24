# VisualLab - Virtual Physics Laboratory Platform

An interactive virtual physics laboratory platform and integrated Learning Management System (LMS) designed for teaching, experimentation, and assessment aligned with the Vietnam General Education Curriculum (GDPT 2018).

---

## 1. Project Overview

VisualLab is an Educational Technology (EdTech) platform that delivers real-time numerical physics simulations combined with classroom management and automated grading capabilities. The platform enables students to assemble apparatus, investigate physical phenomena, collect empirical measurement datasets, and submit comprehensive lab reports directly within modern web browsers.

---

## 2. System Architecture

The platform adheres to a tiered Client-Server architectural pattern, decoupling user interfaces, simulation physics engines, backend business services, and persistent data storage.

```text
+-----------------------------------------------------------------------+
|                           CLIENT TIER (Frontend)                      |
|  +------------------------+  +-------------------------------------+  |
|  |   UI / LMS Portal      |  |     Physics Simulation Engine       |  |
|  |   (React 19 + Vite)    |  |  - 2D Canvas Solver (Circuit/Motion)|  |
|  |   (Tailwind CSS v4)    |  |  - 3D Three.js WebGL (Wave/Optics)  |  |
|  |   (Zustand State)      |  |  - Web Audio API / Tone.js Synth    |  |
|  +------------------------+  +-------------------------------------+  |
+-----------------------------------^-----------------------------------+
                                    | REST API / JSON / OAuth2
+-----------------------------------v-----------------------------------+
|                           SERVER TIER (Backend)                       |
|  +-----------------------------------------------------------------+  |
|  |   Spring Boot 3.2.x RESTful Services                            |  |
|  |   - Authentication & RBAC (Spring Security, JWT, Google OAuth2) |  |
|  |   - Classroom, Curriculum & Assignment Services                 |  |
|  |   - Automated Math Verification & Grading Engine                |  |
|  |   - Cloudinary Media & Snapshot Management                      |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------^-----------------------------------+
                                    | JPA / SQL / Redis Protocol
+-----------------------------------v-----------------------------------+
|                           DATA TIER (Storage)                         |
|  +---------------------------------+  +----------------------------+  |
|  |      PostgreSQL Database        |  |        Redis Cache         |  |
|  |  (Users, Classes, Assignments,  |  |   (Tokens, Presets, Cache) |  |
|  |   Submissions, Snapshots JSONB) |  |                            |  |
|  +---------------------------------+  +----------------------------+  |
+-----------------------------------------------------------------------+
```

---

## 3. Functional Requirements

### 3.1. Physics Simulation Engine & Interactive Workbench
- **2D Draggable Workbench Canvas:**
  - Drag-and-drop apparatus positioning with coordinate grid snapping.
  - Integrated dynamic DC circuit solver (`CircuitSolver`) supporting Ohm's Law, Kirchhoff's Laws, dynamic power dissipation, and electron flow visualization.
  - Real-time numerical integration for kinematics and dynamic force systems.
- **3D Parameter Concept Studio:**
  - Full $360^\circ$ OrbitControls camera navigation for spatial and wave phenomena.
  - Real-time acoustic synthesis via Web Audio API / Tone.js simulating frequency modulation and sound resonance in air columns.
  - Optical ray tracing and wave optics simulations (Young's double-slit interference, prism refraction).
- **Curriculum-Aligned Lab Catalog (GDPT 2018):**
  - *Kinematics & Dynamics:* Free fall acceleration with digital photogate timers, Hooke's Law spring extension, sliding friction on inclined tracks, momentum conservation in collisions, and simple pendulums.
  - *Electricity & Magnetism:* Direct current (DC) circuits, electromotive force (EMF) and internal resistance measurement, electromagnetic induction.
  - *Thermodynamics:* Boyle-Mariotte isothermal gas law, specific heat capacity, latent heat of fusion.
  - *Optics & Acoustics:* Light refraction, Young's double-slit interference, speed of sound measurement via resonance tube.

### 3.2. Learning Management System (LMS) & Classroom Management
- **Teacher Workspace:**
  - Classroom lifecycle management, enrollment code generation, and student roster administration.
  - Assignment authoring with customizable presets, submission deadlines, and maximum attempt limits.
  - Comprehensive grading portal with access to student measurement tables and visual workbench snapshots.
- **Student Workspace:**
  - Course enrollment via unique class invitation codes.
  - Interactive workbench access linked to active assignments.
  - In-workbench experimental data collection and tabular recording.
  - Workspace state serialization, draft saving, and final lab report submission.

### 3.3. Automated Verification & Grading Engine
- Standardized three-tier assessment formula:
  $$\text{Total Score} = \text{Assembly \& Operation (30\%)} + \text{Measurement Accuracy (40\%)} + \text{Comprehension Quiz (30\%)}$$
- **Assembly & Operation Verification (30%):** Validates circuit topology, component connectivity, and minimum trial thresholds ($N \ge 3$).
- **Measurement Accuracy & Error Analysis (40%):** The `MathVerificationEngine` evaluates empirical measurements against theoretical values:
  $$\text{Relative Error (\%)} = \frac{|X_{\text{student}} - X_{\text{theoretical}}|}{X_{\text{theoretical}}} \times 100\%$$
  - Full score awarded for errors $\le 5\%$, with proportional point deductions up to $20\%$ error.
- **Comprehension Quiz (30%):** Automated post-experiment assessment measuring conceptual understanding.

### 3.4. Authentication & Role-Based Access Control (RBAC)
- Dual authentication pathways: Local credentials (Email/Password) and Single Sign-On (Google OAuth2).
- Stateless JWT architecture utilizing short-lived access tokens paired with revocable database-backed refresh tokens.
- Granular permission boundaries:
  - `ROLE_STUDENT`: Execute experiments, submit reports, and review feedback.
  - `ROLE_TEACHER`: Create classes, dispatch assignments, grade submissions, and view analytics.
  - `ROLE_ADMIN`: User administration, global curriculum catalog management, and audit log inspection.

### 3.5. State Persistence & Cloud Media Storage
- Full workspace state serialization (components, wire connections, physical parameters) into JSONB structures within PostgreSQL.
- Cloudinary integration for rendering and persisting experiment screenshot artifacts for grading verification.

---

## 4. Non-Functional Requirements

### 4.1. Performance & Real-Time Responsiveness
- Physics rendering loops sustain a steady 60 frames per second (FPS) on standard HTML5 2D Canvas and Three.js WebGL contexts.
- Numerical integration algorithms utilize fixed time-step loops ($\Delta t$) to eliminate numerical divergence and frame-rate-dependent physical drift.
- Backend REST API latency remains $\le 200\text{ms}$ for standard transactional endpoints under normal load.
- Redis caching layer optimizes read latency for experiment presets and authentication sessions.

### 4.2. Physics Accuracy & Determinism
- Core simulation engines operate exclusively on SI metric units (meters, kilograms, seconds, amperes, volts, joules).
- Strict separation between the physical domain model (SI calculations) and the presentation view (coordinate transformations to pixels).
- Deterministic execution guarantees identical output states when given identical initial conditions and parameter inputs.

### 4.3. Security & Data Integrity
- Stateless API protection enforced via Spring Security with explicit method-level authorization.
- Password hashing utilizing cryptographic algorithms (BCrypt).
- Protection against Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), and SQL injection via JPA parameterized queries.
- Refresh token rotation preventing replay and token hijacking attacks.

### 4.4. Scalability & Modularity
- Data-driven instrument design: Apparatus attributes are structured via dynamic parameter schemas (`IPhysicsParamDescriptor`), allowing hot-loading via JSON configs without code modification.
- Factory and Interface Segregation patterns (`InstrumentFactory`, `ICircuitInstrument`, `IMechanicalInstrument`, `IOpticalInstrument`) decouple experiment modules.
- Containerized infrastructure (Docker Compose) supporting independent horizontal scaling of backend services.

### 4.5. Usability & Resource Lifecycle Management
- Responsive UI layouts supporting desktop, laptop, and tablet viewports.
- Bilingual terminology (Vietnamese and international scientific nomenclature) across instrument labels and parameter tooltips.
- Deterministic resource teardown on route navigation (`AudioContext.close()`, `WebGLRenderer.dispose()`) to eliminate memory leaks.

---

## 5. Technology Stack

### Frontend
- **Framework & Language:** React 19, TypeScript 5+, Vite 8
- **Styling:** Tailwind CSS v4
- **Graphics & Simulation:** HTML5 Canvas API, Three.js, `@react-three/fiber`, `@react-three/drei`
- **Audio & Gestures:** Tone.js, Web Audio API, `@dnd-kit/core`, `@use-gesture/react`
- **State & Routing:** Zustand, React Router DOM v7
- **Authentication:** `@react-oauth/google`

### Backend
- **Framework & Language:** Java 17, Spring Boot 3.2.4
- **Security:** Spring Security, Nimbus JWT, Google API Client
- **Data Persistence:** Spring Data JPA, Hibernate
- **Databases:** PostgreSQL (Relational & JSONB), Redis (Cache & Session)
- **External Services:** Cloudinary API (Media storage), Groq AI SDK

---

## 6. Directory Structure

```text
visuallab-project/
├── backend/
│   ├── src/main/java/com/edulab/
│   │   ├── config/          # Spring Security, CORS, Cloudinary configurations
│   │   ├── controller/      # REST API Controllers (Auth, Class, Lab, Submission)
│   │   ├── model/           # JPA Entities (User, Classroom, Assignment, Lab)
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   ├── service/         # Business service interfaces
│   │   └── service/impl/    # Service logic, MathVerification, OAuth2
│   ├── pom.xml              # Maven dependencies & build definitions
│   └── mvnw / mvnw.cmd      # Maven Wrapper
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Shared UI components (Navbar, Sidebar, Modals)
│   │   ├── core/            # Core interfaces (ILabInstrument, Factory, Descriptors)
│   │   ├── engine/          # Physics Solvers (CircuitSolver, Numerical Engines)
│   │   ├── pages/
│   │   │   ├── admin/       # Administrator management views
│   │   │   ├── teacher/     # Instructor workspace (Classes, Assignments, Grading)
│   │   │   ├── student/     # Student workspace (Classes, Labs, History)
│   │   │   └── labs/        # Physics experiment simulation modules
│   │   ├── store/           # Zustand global state stores
│   │   └── types/           # TypeScript domain definitions
│   ├── package.json         # NPM dependencies & scripts
│   └── vite.config.ts       # Vite & Tailwind configuration
│
├── docker-compose.yml       # PostgreSQL & Redis container orchestrations
└── README.md                # Project documentation
```

---

## 7. Local Setup & Installation

### 7.1. Prerequisites
- Docker & Docker Compose
- Java Development Kit (JDK) 17+
- Node.js LTS (v18.x or v20.x+) and npm

### 7.2. Step 1: Start Database & Cache Containers
From the repository root directory, run:
```bash
docker-compose up -d
```
This initializes:
- `visuallab-postgres`: Port `5432` (Database: `visuallab_db`, User/Password: `postgres/postgres`)
- `visuallab-redis`: Port `6379`

### 7.3. Step 2: Start Backend Service
Open a terminal, navigate to `backend`, and execute:

Windows (PowerShell/CMD):
```bash
cd backend
.\mvnw spring-boot:run
```

macOS / Linux:
```bash
cd backend
./mvnw spring-boot:run
```
The REST API server will initialize on: `http://localhost:8080`

### 7.4. Step 3: Start Frontend Application
Open a separate terminal, navigate to `frontend`, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
Access the client application at: `http://localhost:5173`

---

## 8. Development & Contribution Workflow

1. Avoid committing directly to the `main` or `master` branches.
2. Branch naming conventions:
   - Feature additions: `feature/feature-name`
   - Bug resolutions: `fix/issue-name`
   - Maintenance & docs: `chore/task-name`
3. Conventional Commits standard:
   - `feat: Description of new feature`
   - `fix: Description of bug fix`
   - `refactor: Code restructuring without functional alterations`
   - `docs: Documentation updates`
4. All pull requests must pass automated build checks and code reviews prior to merging.
