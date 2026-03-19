/**
 * Application Configuration
 *
 * Centralise shared constants here so that changing the backend URL
 * only requires editing a single file.
 *
 * To override for production, set the VITE_API_BASE_URL environment variable
 * in a .env file at the client root:
 *   VITE_API_BASE_URL=https://your-api.example.com/api
 */

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
