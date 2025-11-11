import { jwtVerify } from "jose";

// Minimal verifier for admin-protected routes. Returns true when the
// request contains a valid admin secret header or a verifiable JWT.
export async function verifyAdminRequest(req: Request): Promise<boolean> {
  try {
    const providedSecret = req.headers.get("x-admin-secret") || "";
    if (process.env.ADMIN_SECRET && providedSecret && providedSecret === process.env.ADMIN_SECRET) {
      return true;
    }

    const auth = req.headers.get("authorization") || "";
    if (!auth.toLowerCase().startsWith("bearer ")) return false;
    const token = auth.slice(7).trim();

    const secret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
    if (!secret) return false;

    const encoder = new TextEncoder();
    await jwtVerify(token, encoder.encode(secret));
    return true;
  } catch (e) {
    return false;
  }
}
