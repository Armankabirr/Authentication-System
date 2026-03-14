# Authentication System

A MERN-style authentication starter project with an Express/MongoDB backend and an empty frontend workspace prepared for a client app.

## Project Status

This repository is currently backend-first and partially implemented.

- Backend server bootstrapping is complete.
- MongoDB connection, common middleware, user model, and registration controller logic exist.
- Route files are not yet wired into the Express app, so no HTTP auth endpoints are exposed right now.
- The client directory is present but currently empty.

## Tech Stack

### Backend

- Node.js
- Express 5 (ESM)
- MongoDB + Mongoose
- bcryptjs
- JSON Web Tokens (jsonwebtoken)
- Nodemailer
- Twilio
- cookie-parser
- CORS
- dotenv

### Frontend

- Reserved `client/` directory (no app scaffolded yet)

## Repository Structure

```text
Authentication-System/
|-- client/
|-- command.txt
|-- server/
|   |-- app.js
|   |-- config.env
|   |-- package.json
|   |-- server.js
|   |-- controllers/
|   |   |-- userController.js
|   |-- database/
|   |   |-- dbConnection.js
|   |-- middlewares/
|   |   |-- catchAsyncError.js
|   |   |-- error.js
|   |-- models/
|   |   |-- userModel.js
|   |-- utils/
|       |-- sendEmail.js
|       |-- sendToken.js
```

## Backend Flow Overview

1. `server/server.js` starts the app and listens on `process.env.PORT`.
2. `server/app.js` configures environment loading, CORS, JSON/form parsers, cookie parser, and DB connection.
3. Database connection is established in `server/database/dbConnection.js` using `MONGO_URI` and database name `auth-system`.
4. The `User` mongoose model in `server/models/userModel.js` includes:
   - Password hashing in a `pre("save")` hook.
   - Password comparison helper.
   - Verification code generator with 10-minute expiry.
5. `register` logic in `server/controllers/userController.js`:
   - Validates required fields.
   - Validates Bangladesh-style phone number format: `+8801XXXXXXXXX` or `01XXXXXXXXX`.
   - Restricts duplicate verified users by email or phone.
   - Limits repeated unverified attempts.
   - Generates and sends verification code by email or phone call (Twilio).
6. Global error handler in `server/middlewares/error.js` normalizes known errors and returns JSON responses.

## Prerequisites

Install the following before running:

- Node.js 18+
- npm 9+
- MongoDB Atlas (or local MongoDB)
- SMTP credentials (for email OTP)
- Twilio account (for phone OTP/call)

## Installation

From repository root:

```bash
cd server
npm install
```

## Environment Setup

Create/update `server/config.env` with your own values.

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<db>?retryWrites=true&w=majority

TWILIO_SID=<your_twilio_sid>
TWILIO_PHONE_NUMBER=<your_twilio_phone_number>
TWILIO_AUTH_TOKEN=<your_twilio_auth_token>

SMTP_HOST=smtp.gmail.com
SMTP_SERVICE=
SMTP_PORT=587
SMTP_MAIL=<your_email_address>
SMTP_PASSWORD=<your_app_password>

JWT_SECRET=<strong_random_secret>
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
```

## Run the Server

### Development

```bash
cd server
npm run dev
```

### Production-style local run

```bash
cd server
npm start
```

If startup is successful, you should see:

- `Database connected successfully`
- `Server is running on port <PORT>`

## Current API Availability

At the moment, no route module is mounted in `server/app.js` (for example `app.use("/api/v1/user", userRouter)`).

That means requests like `POST /register` will return `404` until route files are added and connected.

## Suggested Route Integration (Next Step)

Create a router (for example `server/routes/userRouter.js`) and mount it in `server/app.js`.

Example mapping:

- `POST /api/v1/user/register` -> `register`

## Known Gaps / Notes

- `sendToken.js` expects `user.generateToken()`, but no `generateToken` method currently exists in `userModel.js`.
- `server/config.env` should not be committed with real credentials. Rotate exposed secrets if this file has ever been pushed.
- `client/` has no initialized application yet.

## Security Recommendations

- Move secrets to a local-only `.env` file and add it to `.gitignore`.
- Regenerate any leaked DB, Twilio, or email credentials immediately.
- Add request validation (for example using `zod` or `joi`) before controller logic.
- Add rate-limiting and brute-force protection for auth-related endpoints.

## Useful Commands

From `command.txt`:

```bash
npm init
npm i express cors dotenv nodemon jsonwebtoken mongoose bcryptjs nodemailer cookie-parser
npm i twilio
```

## Roadmap

- Add auth routes and route mounting.
- Implement account verification endpoint.
- Add login/logout endpoints with JWT cookie flow.
- Add forgot-password / reset-password flow.
- Scaffold frontend client and wire auth UI.
- Add tests (unit + integration) for auth flows.

## License

No license is currently
