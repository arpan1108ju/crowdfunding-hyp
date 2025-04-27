const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/token`;

export async function getBalance() {
  const response = await fetch(`${API_URL}/balance`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

export async function getPayments() {
  const response = await fetch(`${API_URL}/payments`, {
    method: 'GET',
    credentials: 'include',
  });
  return await response.json();
}

export async function getExchangeRate(currency = 'USD') {
  const response = await fetch(`${API_URL}/exchange-rate?currency=${currency}`, {
    method: 'GET',
    credentials: 'include',
  });
  return await response.json();
}

export async function getAllExchangeRates() {
  const response = await fetch(`${API_URL}/exchange-rates`, {
    method: 'GET',
    credentials: 'include',
  });
  return await response.json();
}

export async function setExchangeRate(currency, rate) {
  const response = await fetch(`${API_URL}/exchange-rate`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currency, rate }),
  });
  return await response.json();
}

export async function getClientIdFromX509(x509Identity) {
  const response = await fetch(`${API_URL}/client-id`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(x509Identity),
  });
  return await response.json();
}

export async function getTokenMetadata() {
  const response = await fetch(`${API_URL}/metadata`, {
    method: 'GET',
    credentials: 'include',
  });
  return await response.json();
}

export async function setTokenMetadata(name, symbol) {
  const response = await fetch(`${API_URL}/metadata`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, symbol }),
  });
  return response.json();
}

export async function mintToken(currency, amountPaid,paymentId) {
  const response = await fetch(`${API_URL}/mint`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currency, amountPaid,paymentId }),
  });
  return response.json();
}
