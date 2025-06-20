# Architecture and Technology Choices

## Monorepo Structure
- All code (backend, frontend, shared types) in a single repository for easier management and coordination.

## Backend
- **Framework:** NestJS (TypeScript)
- **API Style:** RESTful, versioned (e.g., /api/v1/)
- **Authentication:** JWT (JSON Web Tokens), with Passport.js as an option
- **Database:** MongoDB (using Mongoose or TypeORM for ODM)
- **Environment Management:** dotenv for environment variables, separate configs for dev and production
- **Testing:** Jest (unit and integration tests)
- **API Documentation:** Swagger (auto-generated docs)
- **CORS:** Configured to allow requests from frontend

## Frontend
- **Framework:** React (TypeScript)
- **UI:** Responsive, mobile-friendly
- **Testing:** React Testing Library

## Monorepo Tooling
- **Package Manager:** npm (with workspaces)
- **Shared Folder:** (TBD) for shared types/interfaces between backend and frontend

## Deployment
- **Decision deferred until MVP is ready** (options include Vercel, Netlify, Render, Heroku, AWS, etc.)

## Other Considerations
- **Rate Limiting & Security:** To be determined
- **Documentation:** Keep endpoint and model references in the repo

---

This file summarizes the key architectural and technology choices for the project as of MVP planning.
