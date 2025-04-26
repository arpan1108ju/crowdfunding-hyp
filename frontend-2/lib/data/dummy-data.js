export const initialTokenMetadata = {
  symbol: "CFT",
  name: "CrowdfundingToken",
  totalSupply: 0,
};

export const initialExchangeRates = [
  { currency: "USD", rateToToken: 23.45 },
  { currency: "INR", rateToToken: 20.45 },
  { currency: "EUR", rateToToken: 21.45 },
];

export const initialPaymentHistory = [
  {
    campaignId: "8bb889ff-db50-4d66-b620-a2d142a5f252",
    amount: 134,
    timestamp: 1745571062783,
    paymentType: "DONATION",
  },
  {
    campaignId: "8238eaa0-261a-480a-b9ae-1a0b72461315",
    amount: 134,
    timestamp: 1745571307740,
    paymentType: "CANCEL",
  },
  {
    campaignId: "8238eaa0-261a-480a-b9ae-1a0b72461315",
    amount: 134,
    timestamp: 1745571314067,
    paymentType: "DONATION",
  },
  {
    campaignId: "8238eaa0-261a-480a-b9ae-1a0b72461315",
    amount: 134,
    timestamp: 1745571317420,
    paymentType: "DONATION",
  },
  {
    campaignId: "8238eaa0-261a-480a-b9ae-1a0b72461315",
    amount: 402,
    timestamp: 1745571446439,
    paymentType: "WITHDRAWAL",
  },
  {
    campaignId: "2163757a-62d1-4db6-a342-184ac1d6886b",
    amount: 134,
    timestamp: 1745571538014,
    paymentType: "DONATION",
  },
  {
    campaignId: "2163757a-62d1-4db6-a342-184ac1d6886b",
    amount: 134,
    timestamp: 1745571541285,
    paymentType: "DONATION",
  },
  {
    campaignId: "2163757a-62d1-4db6-a342-184ac1d6886b",
    amount: 134,
    timestamp: 1745571547005,
    paymentType: "REFUND",
  },
];

export const initialCampaigns = [
  {
    id: "8bb889ff-db50-4d66-b620-a2d142a5f252",
    owner:
      "eDUwOTo6Q049dXNlcjJAZ21haWwuY29tLE9VPW9yZzErT1U9YWRtaW4rT1U9ZGVwYXJ0bWVudDE6OkNOPWZhYnJpYy1jYS1zZXJ2ZXIsT1U9RmFicmljLE89SHlwZXJsZWRnZXIsU1Q9Tm9ydGggQ2Fyb2xpbmEsQz1VUw==",
    title: "My Campaign",
    description: "A very exciting project!",
    campaignType: "Technology",
    target: 5000,
    deadline: 1845174645849,
    amountCollected: 0,
    image: "https://picsum.photos/id/237/200/300",
    donators: ["123"],
    donations: [100],
    withdrawn: false,
    canceled: false,
  },
  {
    id: "8c8a327f-5259-429a-b4a2-b3b678c25faf",
    owner:
      "eDUwOTo6Q049dXNlcjJAZ21haWwuY29tLE9VPW9yZzErT1U9YWRtaW4rT1U9ZGVwYXJ0bWVudDE6OkNOPWZhYnJpYy1jYS1zZXJ2ZXIsT1U9RmFicmljLE89SHlwZXJsZWRnZXIsU1Q9Tm9ydGggQ2Fyb2xpbmEsQz1VUw==",
    title: "My Campaign",
    description: "A very exciting project!",
    campaignType: "Technology",
    target: 5000,
    deadline: 1845174645849,
    amountCollected: 0,
    image: "https://picsum.photos/id/236/200/300",
    donators: [],
    donations: [],
    withdrawn: false,
    canceled: false,
  },
];

export const campaignTypes = [
  'Technology',
  'Education',
  'Healthcare',
  'Environment',
  'Art',
  'Sports',
  'Other'
];