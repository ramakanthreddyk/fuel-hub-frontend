---
title: Database Authentication Troubleshooting
lastUpdated: 2025-07-05
category: guides
---

# Database Authentication Troubleshooting

If you're experiencing login issues with the message "Invalid email or password", follow these steps to check and fix the database:

## Check Database Connection

First, verify that the database connection is working:

```bash
npm run check:db-connection
```

This will test the database connection and check if the required schemas and tables exist.

## Check Database Users

Run the following command to check if users exist in the database:

```bash
npm run check:db
```

This will show all admin users and tenant users in the database.

## Restore Users

If no users are found or passwords were changed, run the setup script again:

```bash
npm run setup-db
```

This recreates the admin and demo tenant accounts with default passwords.

## Common Issues

1. **Database Connection**: If the connection check fails, verify your database is running and the .env file has correct credentials.

2. **Missing Users**: If the check shows no users, run the setup script:
   ```bash
   npm run setup-db
   ```

3. **Schema Issues**: If you see errors about missing schemas, run migrations again and re-seed.

5. **Database Not Initialized**: If the database structure doesn't exist, run the setup script:
   ```bash
   npm run setup-db
   ```

   This recreates all tables and demo data.

## Testing Login

After running the seeder, try logging in with the credentials above.
