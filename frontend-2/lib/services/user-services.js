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

export async function payment({amountPaid,currency}) {

  console.log(JSON.stringify({ 
    amountPaid, 
    currency 
  }))

  const response = await fetch(`${API_URL}/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ 
      amountPaid, 
      currency 
    }),
  });

  return response.json();

}