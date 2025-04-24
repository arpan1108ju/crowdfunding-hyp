const API_URL = `${env.NEXT_PUBLIC_BACKEND_URL}/api/v1/token`;

export async function getBalance(token) {
  const response = await fetch(`${API_URL}/balance`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function getPayments(token) {
  const response = await fetch(`${API_URL}/payments`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

export async function getExchangeRate(token, currency = 'USD') {
  const response = await fetch(`${API_URL}/exchange-rate?currency=${currency}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

export async function getAllExchangeRates(token) {
  const response = await fetch(`${API_URL}/exchange-rates`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

export async function setExchangeRate(token, currency, rate) {
  const response = await fetch(`${API_URL}/exchange-rate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currency, rate }),
  });
  return await response.json();
}

export async function getClientIdFromX509(token, x509Identity) {
  const response = await fetch(`${API_URL}/client-id`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(x509Identity), // assuming x509Identity is already parsed
  });
  return await response.json();
}

export async function getMetadata(token) {
  const response = await fetch(`${API_URL}/metadata`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

export async function setMetadata(token, name, symbol) {
  const response = await fetch(`${API_URL}/metadata`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, symbol }),
  });
  return response.json();
}

export async function mintToken(token, currency, amountPaid) {
  const response = await fetch(`${API_URL}/mint`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currency, amountPaid }),
  });
  return response.json();
}
