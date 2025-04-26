const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/campaigns`;

export async function getAllCampaigns() {
  const response = await fetch(`${API_URL}`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

export async function getUserCampaigns() {
  const response = await fetch(`${API_URL}/admin`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

export async function getCampaignById(campaignId) {
  const response = await fetch(`${API_URL}/${campaignId}`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

export async function createCampaign(campaignData) {
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(campaignData),
  });
  return response.json();
}

export async function donateToCampaign(campaignId, amount) {
  const response = await fetch(`${API_URL}/${campaignId}/donate`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  });
  return response.json();
}

export async function withdrawFromCampaign(campaignId) {
  const response = await fetch(`${API_URL}/${campaignId}/withdraw`, {
    method: 'POST',
    credentials: 'include',
  });
  return response.json();
}

export async function cancelCampaign(campaignId) {
  const response = await fetch(`${API_URL}/${campaignId}/cancel`, {
    method: 'POST',
    credentials: 'include',
  });
  return response.json();
}

export async function updateCampaign(campaignId, updates) {
  const response = await fetch(`${API_URL}/${campaignId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  return response.json();
}

export async function deleteCampaign(campaignId) {
  const response = await fetch(`${API_URL}/${campaignId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return response.json();
}
