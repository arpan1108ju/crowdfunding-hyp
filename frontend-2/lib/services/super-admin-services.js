const API_URL = 'http://localhost:5000/api/v1/superadmin';

export async function enrollSuperadmin(token) {

  const response = await fetch(`${API_URL}/enroll`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}


export async function changeUserRole(token, userId, role) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role }),
  });
  return await response.json();
}

export async function enrollAdmin(token, adminId) {
  const response = await fetch(`${API_URL}/admins/${adminId}/enroll`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return await response.json();
}

export async function revokeAdmin(token, adminId) {
  const response = await fetch(`${API_URL}/admins/${adminId}/revoke`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return await response.json();
}
