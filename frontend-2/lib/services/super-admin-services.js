const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/superadmin`;

export async function enrollSuperadmin() {
  const response = await fetch(`${API_URL}/enroll`, {
    method: 'POST',
    credentials: 'include',
  });
  return await response.json();
}

export async function changeUserRole(userId, role) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role }),
  });
  return await response.json();
}

export async function enrollAdmin(adminId) {
  const response = await fetch(`${API_URL}/admins/${adminId}/enroll`, {
    method: 'POST',
    credentials: 'include',
  });
  return await response.json();
}

export async function revokeAdmin(adminId) {
  const response = await fetch(`${API_URL}/admins/${adminId}/revoke`, {
    method: 'POST',
    credentials: 'include',
  });
  return await response.json();
}
