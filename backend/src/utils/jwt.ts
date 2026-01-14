/**
 * JWT (JSON Web Token) UTILITIES
 * 
 * JWT is a way to securely transmit information between parties as a JSON object.
 * It's commonly used for authentication - when a user logs in, we give them a token
 * that proves their identity without storing their credentials on the server.
 * 
 * How JWT Authentication Works:
 * 1. User logs in with email/password
 * 2. Server verifies credentials and creates a JWT token containing user info
 * 3. Server sends token to client
 * 4. Client stores token (usually in localStorage or cookies)
 * 5. Client sends token with every request (in Authorization header)
 * 6. Server verifies token and extracts user information
 * 
 * Token Structure: header.payload.signature
 * - Header: Type of token (JWT) and signing algorithm
 * - Payload: User data (id, email, role) - this is what we encode
 * - Signature: Ensures token hasn't been tampered with
 */

import jwt from "jsonwebtoken";

/**
 * JWT Configuration
 * 
 * JWT_SECRET: A secret key used to sign tokens. Must be kept secret!
 * - In production, store this in .env file (never commit to git)
 * - Anyone with this secret can create valid tokens (security risk!)
 * 
 * JWT_EXPIRES_IN: How long tokens remain valid
 * - "7d" = 7 days
 * - Other options: "1h" (1 hour), "30m" (30 minutes), "24h" (24 hours)
 * - After expiration, user must log in again
 */
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * JWTPayload Interface - Data stored inside the JWT token
 * 
 * This defines what information we encode in the token.
 * The payload is visible to anyone (it's base64 encoded, not encrypted),
 * so don't put sensitive data like passwords here.
 * 
 * What we store:
 * - id: Admin's database ID (used to fetch full admin details)
 * - email: Admin's email (used for identification)
 * - role: Admin's role (used for authorization checks)
 */
export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * generateToken - Creates a new JWT token
 * 
 * This function takes user information and creates a signed JWT token.
 * The token can be sent to the client and used for authentication.
 * 
 * @param payload - The data to encode in the token (id, email, role)
 * @returns A signed JWT token string
 * 
 * Example:
 * const token = generateToken({
 *   id: "507f1f77bcf86cd799439011",
 *   email: "admin@example.com",
 *   role: "Admin"
 * });
 * // Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
export const generateToken = (payload: JWTPayload): string => {
  // jwt.sign() creates and signs the token
  // - First param: Data to encode (payload)
  // - Second param: Secret key for signing
  // - Third param: Options (like expiration time)
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN, // Token expires after this time
  } as jwt.SignOptions);
};

/**
 * verifyToken - Verifies and decodes a JWT token
 * 
 * This function checks if a token is valid and extracts the payload.
 * It throws an error if the token is invalid, expired, or tampered with.
 * 
 * @param token - The JWT token string to verify
 * @returns The decoded payload (user information)
 * @throws Error if token is invalid or expired
 * 
 * Example:
 * try {
 *   const payload = verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
 *   console.log(payload.id);    // "507f1f77bcf86cd799439011"
 *   console.log(payload.email); // "admin@example.com"
 * } catch (error) {
 *   // Token is invalid or expired
 * }
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    // jwt.verify() checks the signature and expiration
    // If valid, returns the decoded payload
    // If invalid, throws an error
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    // Token could be:
    // - Expired (past the expiresIn time)
    // - Invalid signature (tampered with or wrong secret)
    // - Malformed (not a valid JWT format)
    throw new Error("Invalid or expired token");
  }
};

/**
 * extractTokenFromHeader - Extracts JWT token from HTTP Authorization header
 * 
 * When clients send requests, they include the token in the Authorization header
 * like this: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * 
 * This function extracts just the token part (everything after "Bearer ").
 * 
 * @param authHeader - The Authorization header value (e.g., "Bearer token123")
 * @returns The token string, or null if not found/invalid format
 * 
 * Example:
 * extractTokenFromHeader("Bearer abc123")  // Returns: "abc123"
 * extractTokenFromHeader("Bearer")         // Returns: null (invalid format)
 * extractTokenFromHeader(undefined)        // Returns: null (no header)
 */
export const extractTokenFromHeader = (
  authHeader?: string
): string | null => {
  // If no header provided, return null
  if (!authHeader) {
    return null;
  }

  // Split header by space: ["Bearer", "token123"]
  const parts = authHeader.split(" ");

  // Check if format is correct: "Bearer <token>"
  if (parts.length === 2 && parts[0] === "Bearer") {
    // Return the token part (everything after "Bearer ")
    return parts[1];
  }

  // Invalid format, return null
  return null;
};
