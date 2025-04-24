export const ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
  SUPERADMIN: "SUPERADMIN",
};

/**
 * Check if a given role is valid
 * @param {string} role - The role to validate
 * @returns {boolean} - True if role is valid
 */
export function isValidRole(role) {
  return Object.values(ROLE).includes(role);
}

/**
 * Get all available user roles
 * @returns {string[]} - Array of valid roles
 */
export function getAllRoles() {
  return Object.values(ROLE);
}
