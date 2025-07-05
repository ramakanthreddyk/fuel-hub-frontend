import * as dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

console.log('Environment:', env);
console.log('DB_USER:', process.env.DB_USER);
