# BiteSpeed Backend Task: Identity Reconciliation

This repository contains the solution for the BiteSpeed Backend Developer assignment. It's a NestJS web service designed to handle identity reconciliation for contacts.

## Live Endpoint

The `/identify` endpoint is hosted on Render and is available at:

**`https://bitespeed-task-lqtl.onrender.com`**

### Example Usage (`curl`)

```bash
curl -X POST https://bitespeed-task-lqtl.onrender.com/identify \
-H "Content-Type: application/json" \
-d '{
  "email": "mcfly@bitespeed.com",
  "phoneNumber": "1234567890"
}'
```

## Tech Stack

- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Deployment:** Render

## Project Structure

- `src/contact`: Contains the core logic for the `/identify` endpoint.
  - `contact.controller.ts`: Handles the incoming HTTP request.
  - `contact.service.ts`: Implements the main identity reconciliation logic.
  - `dto/identify-contact.dto.ts`: Defines the request body shape and validation rules.
- `src/prisma`: Contains the Prisma schema and service for database interaction.
- `prisma/migrations`: Contains the auto-generated SQL migration files.

## Running Locally

### Prerequisites

- Node.js (v16+)
- npm
- A running PostgreSQL instance

### Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/chiillbro/bitespeed-task.git
    cd bitespeed-task
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your PostgreSQL connection string:

    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    ```

4.  **Run database migrations:**
    This will create the `Contact` table in your database.

    ```bash
    npx prisma migrate dev
    ```

5.  **Start the server:**
    ```bash
    npm run start:dev
    ```
    The application will be running on `http://localhost:3000`.
