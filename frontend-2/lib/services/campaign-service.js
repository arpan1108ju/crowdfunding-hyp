
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/campaigns`;

export async function getAllCampaigns(token) {
  const response = await fetch(`${API_URL}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function getUserCampaigns(token) {
  const response = await fetch(`${API_URL}/admin`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function getCampaignById(token, campaignId) {
  const response = await fetch(`${API_URL}/${campaignId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function createCampaign(token, campaignData) {
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(campaignData),
  });
  return response.json();
}

export async function donateToCampaign(token, campaignId, amount) {
  const response = await fetch(`${API_URL}/${campaignId}/donate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  });
  return response.json();
}

export async function withdrawFromCampaign(token, campaignId) {
  const response = await fetch(`${API_URL}/${campaignId}/withdraw`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function cancelCampaign(token, campaignId) {
  const response = await fetch(`${API_URL}/${campaignId}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function updateCampaign(token, campaignId, updates) {
  const response = await fetch(`${API_URL}/${campaignId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  return response.json();
}

export async function deleteCampaign(token, campaignId) {
  const response = await fetch(`${API_URL}/${campaignId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}
