import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGODB_USER = process.env.MONGODB_USER;
export const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
export const MONGODB_APP_NAME = process.env.MONGODB_APP_NAME;
export const AUTH_PIN = process.env.AUTH_PIN;