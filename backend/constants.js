const CHANNEL_NAME = "mychannel";
const CONTRACT_NAME = "crowdfundingGO";

const CAMPAIGN_ID = "camp123";
const CAMPAIGN_TITLE = "Save the Planet";
const CAMPAIGN_DESC = "Campaign to plant trees";
const CAMPAIGN_CATEGORY = "Environment";
const CAMPAIGN_GOAL = "10000";
const CAMPAIGN_IMAGE = "https://image.url";

const CAMPAIGN_CREATED_AT = "1000000000";
const CAMPAIGN_DEADLINE = "2000000000";

const DONATION_AMOUNT = "500";
const DONATION_TIMESTAMP = "1000000010";

const WITHDRAW_TIMESTAMP = "2000100000";
const CANCEL_TIMESTAMP = "1000100000";

/*******************function name****************** */

const CREATE_CAMPAIGN = "CreateCampaign";
const DONATE_TO_CAMPAIGN = "DonateToCampaign";
const WITHDRAW_CAMPAIGN = "Withdraw";
const CANCEL_CAMPAIGN = "CancelCampaign";
const GET_ALL_CAMPAIGNS = "GetAllCampaigns";
const GET_CAMPAIGN = "ReadCampaign";
const GET_USER_PAYMENTS = "GetUserPayments";
const DELETE_CAMPAIGN = "DeleteCampaign";
const UPDATE_CAMPAIGN = "UpdateCampaign";

const GET_BALANCE = "GetBalance";
const MINT_TOKEN = "MintToken";
const GET_TOKEN_METADATA = "GetTokenMetadata";
const SET_TOKEN_METADATA = "SetTokenMetadata";
const GET_EXCHANGE_RATE = "GetExchangeRate";
const SET_EXCHANGE_RATE = "SetExchangeRate";

const GET_CLIENT_ID_FROM_X509 ="GetClientIDFromX509";
const GET_ALL_EXCHANGE_RATE="GetAllExchangeRates";
const GET_USER_CAMPAIGNS="GetUserCampaigns";

const REGISTER_USER = "RegisterUser";
const UNREGISTER_USER = "UnregisterUser";

// /utils/constants.js or /constants/roles.js

const FabricRoles = Object.freeze({
  CLIENT: 'client',
  ADMIN: 'admin',
  PEER: 'peer',
  ORDERER: 'orderer',
});



const APP_ADMIN = "admin";
const APP_USER = "appUser";

const SUPERADMIN = 'admin';
const SUPERADMIN_PASSWORD = 'adminpw';

const AUTH_TOKEN_NAME = 'auth-token';

export {

  REGISTER_USER,
  UNREGISTER_USER,

  AUTH_TOKEN_NAME,
  GET_CLIENT_ID_FROM_X509,
  GET_USER_CAMPAIGNS,
  GET_ALL_EXCHANGE_RATE,

  SUPERADMIN,
  SUPERADMIN_PASSWORD,

  FabricRoles,

  GET_BALANCE,
  GET_EXCHANGE_RATE,
  GET_TOKEN_METADATA,
  SET_EXCHANGE_RATE,
  SET_TOKEN_METADATA,
  MINT_TOKEN,
  APP_ADMIN,
  APP_USER,
  CAMPAIGN_ID,
  CAMPAIGN_TITLE,
  CAMPAIGN_DESC,
  CAMPAIGN_CATEGORY,
  CAMPAIGN_GOAL,
  CAMPAIGN_IMAGE,
  CAMPAIGN_CREATED_AT,
  CAMPAIGN_DEADLINE,
  DONATION_AMOUNT,
  DONATION_TIMESTAMP,
  WITHDRAW_TIMESTAMP,
  CANCEL_TIMESTAMP,
  CREATE_CAMPAIGN,
  DONATE_TO_CAMPAIGN,
  CANCEL_CAMPAIGN,
  WITHDRAW_CAMPAIGN,
  GET_ALL_CAMPAIGNS,
  GET_CAMPAIGN,
  CHANNEL_NAME,
  CONTRACT_NAME,
  GET_USER_PAYMENTS,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN,
};
