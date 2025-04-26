const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin`;

export async function fetchAllUsers(verified) {

  let url = `${API_URL}/users`;
  if(verified === true || verified === false){
    url = `${API_URL}/users?verified=${verified}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    credentials : 'include',
  });
  return response.json();
}

export async function fetchUserById(userId) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'GET',
    credentials : 'include',
  });
  return response.json();
}

export async function enrollUser(userId) {
  const response = await fetch(`${API_URL}/users/${userId}/enroll`, {
    method: 'POST',
    credentials : 'include',
  });
  return response.json();
}

export async function revokeUser(userId) {
  const response = await fetch(`${API_URL}/users/${userId}/revoke`, {
    method: 'POST',
    credentials : 'include',
  });
  return response.json();
}
