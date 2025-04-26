import { z } from "zod";
import { ROLE } from "@/lib/constants";

// Create a Zod enum from the ROLE object values
export const RoleSchema = z.enum([ROLE.ADMIN, ROLE.USER, ROLE.SUPERADMIN]);

// Validation function
export function validateRole(role) {
  const result = RoleSchema.safeParse(role);

  if (!result.success) {
    return {
      success: false,
      error: `Invalid role. Must be one of: ${Object.values(ROLE).join(", ")}`,
    };
  }

  return { success: true };
}
