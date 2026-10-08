# Camp API

Young Leaders Camp Registration API built with NestJS, TypeScript, and Prisma.

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Next-generation ORM
- **MySQL** - Database
- **JWT** - Authentication
- **Class Validator** - Validation

## Prerequisites

- Node.js 18+ 
- MySQL 8+
- npm or yarn

## Installation

```bash
npm install
```

## Database Setup

### For Hostinger MySQL (Production):

1. **Create database in Hostinger hPanel**:
   - Go to **Databases** → **MySQL Databases**
   - Create database and user
   - Configure **Remote MySQL** access (set Access host to `%` for remote connections)

2. **Find your MySQL host**:
   - Check phpMyAdmin URL (e.g., `auth-db1455.hstgr.io`)
   - Or find it in MySQL Databases section in hPanel

3. **Update `.env` file** with your Hostinger MySQL credentials:
   ```env
   DATABASE_URL="mysql://u396247786_4dmi3:YOUR_PASSWORD@auth-db1455.hstgr.io:3306/u396247786_camp"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL="http://localhost:5173"
   ```
   
   **Important**: Use the full username with prefix (e.g., `u396247786_4dmi3`, not just `4dmi3`)

4. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

5. **Push schema to database** (Hostinger shared hosting doesn't support shadow database):
   ```bash
   npx prisma db push
   ```
   
   This will create all necessary tables in your database.

### For Local MySQL Development:

1. **Install and start MySQL** (if not already installed):
   - macOS: `brew install mysql && brew services start mysql`
   - Or download from [MySQL website](https://dev.mysql.com/downloads/mysql/)

2. **Create MySQL database**:
   ```sql
   CREATE DATABASE camp_db;
   ```

3. **Update `.env` file**:
   ```env
   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/camp_db"
   ```

4. **Run migrations**:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

6. **(Optional) Create admin user**:
   ```sql
   INSERT INTO users (id, email, password, role) 
   VALUES (UUID(), 'admin@example.com', '$2b$10$YourHashedPasswordHere', 'admin');
   ```
   
   Or use Prisma Studio to create users:
   ```bash
   npm run prisma:studio
   ```

## Running the app

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`

## API Endpoints

### Auth
- `POST /api/auth/login` - Login (public)

### Registrations
- `POST /api/registrations` - Create registration (public)
- `GET /api/registrations` - List all (admin)
- `GET /api/registrations/:id` - Get one (admin)
- `PATCH /api/registrations/:id/status` - Update status (admin)
- `PATCH /api/registrations/:id/payment` - Update payment (admin)
- `DELETE /api/registrations/:id` - Delete (admin)

### Camps
- `GET /api/camps` - List all (public)
- `GET /api/camps/:id` - Get one (public)
- `POST /api/camps` - Create (admin)
- `PATCH /api/camps/:id` - Update (admin)
- `DELETE /api/camps/:id` - Delete (admin)

### Stats
- `GET /api/stats/registrations` - Get statistics (admin)

## Project Structure

```
src/
├── auth/           # Authentication module
├── camps/          # Camp programs module
├── common/         # Shared utilities
├── prisma/         # Prisma service
├── registrations/  # Registrations module
├── stats/          # Statistics module
├── app.module.ts   # Root module
└── main.ts         # Entry point
```

## Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## License

MIT
# camp-api
