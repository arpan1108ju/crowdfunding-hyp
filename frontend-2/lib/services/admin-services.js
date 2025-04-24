const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin`;

export async function fetchAllUsers(token) {
  const response = await fetch(`${API_URL}/users?verified=false`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function fetchUserById(token, userId) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function enrollUser(token, userId) {
  const response = await fetch(`${API_URL}/users/${userId}/enroll`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function revokeUser(token, userId) {
  const response = await fetch(`${API_URL}/users/${userId}/revoke`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}
