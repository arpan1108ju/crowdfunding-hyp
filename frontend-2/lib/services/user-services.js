const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user`;

export async function reEnrollUser() {

  const response = await fetch(`${API_URL}/re-enroll`, {
    method: 'POST',
    credentials : 'include',
  });
  return response.json();
}

export async function getUserSelf() {

  const response = await fetch(`${API_URL}/`, {
    method: 'GET',
    credentials : 'include',
  });
  return response.json();
}