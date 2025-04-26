package main

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"crypto/x509"
	"encoding/pem"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


const NAME = "CrowdfundingToken"
const SYMBOL = "CFT"
const TOTAL_INITIAL_SUPPLY = 0

const TOKEN_METADATA = "token_metadata"
const ADMIN = "admin"
const ERROR_BALANCE = 0

const BalancePrefix = "balance_"
const RatePrefix = "rate_"
const CampaignPrefix = "campaign_"
const PaymentPrefix = "payment_"
const UserMappingPrefix = "user_mapping_"

type SmartContract struct {
	contractapi.Contract
}

// Token metadata
type TokenMetadata struct {
	Name        string `json:"name"`
	Symbol      string `json:"symbol"`
	TotalSupply uint64 `json:"totalSupply"`
}

// User balance mapping
type Balance struct {
	Owner   string `json:"owner"`
	Balance uint64 `json:"balance"`
}

// Admin exchange rate mapping (fiat to token)
type ExchangeRate struct {
	Currency   string  `json:"currency"`
	RateToToken float64 `json:"rateToToken"` // e.g., 1 USD = 10 tokens => rate = 10.0
}

// User mapping
type UserMapping struct {
	DBUserID    string `json:"dbUserId"`
	ClientID    string `json:"clientId"`
	Timestamp   uint64 `json:"timestamp"`
}

// Donor represents a donation made by a user
type Donor struct {
	DonorDBID      string `json:"donorDbId"`
	DonationAmount uint64 `json:"donationAmount"`
	Timestamp      uint64 `json:"timestamp"`
}

// Campaign defines a crowdfunding campaign
type Campaign struct {
	ID              string   `json:"id"`
	OwnerDBID       string   `json:"ownerDbId"`
	Title           string   `json:"title"`
	Description     string   `json:"description"`
	CampaignType    string   `json:"campaignType"`
	Target          uint64    `json:"target"`
	Deadline        uint64    `json:"deadline"`
	AmountCollected uint64    `json:"amountCollected"`
	Image           string   `json:"image"`
	Donors          []Donor   `json:"donors"`
	Withdrawn       bool      `json:"withdrawn"`
	Canceled        bool      `json:"canceled"`
}


type PaymentType string

const (
	DONATION   PaymentType = "DONATION"
	REFUND     PaymentType = "REFUND"
	WITHDRAWAL PaymentType = "WITHDRAWAL"
	CANCEL     PaymentType = "CANCEL"
)

// PaymentDetail records a payment-related event
type PaymentDetail struct {
	CampaignID  string `json:"campaignId"`
	Amount      uint64  `json:"amount"`
	Timestamp   uint64  `json:"timestamp"`
	PaymentType PaymentType `json:"paymentType"`
}


type ResponseMessage struct {
	Message  string `json:"message"`
}


type FabricIdentity struct {
	Type        string                 `json:"type"`
	MspID       string                 `json:"mspId"`
	Credentials map[string]interface{} 	`json:"credentials"`
}

// GetClientIDFromX509 takes a Fabric identity structure and returns the standard client ID
func (s *SmartContract) GetClientIDFromX509(ctx contractapi.TransactionContextInterface,identity FabricIdentity) (string, error) {
	// 1. Verify we have an X.509 identity
	if identity.Type != "X.509" {
		return "", fmt.Errorf("identity type must be X.509")
	}

	// 2. Extract certificate from credentials
	certPEM, ok := identity.Credentials["certificate"].(string)
	if !ok {
		return "", fmt.Errorf("certificate not found in credentials")
	}

	// 3. Parse the certificate
	block, _ := pem.Decode([]byte(certPEM))
	if block == nil {
		return "", fmt.Errorf("failed to decode PEM block containing certificate")
	}

	cert, err := x509.ParseCertificate(block.Bytes)
	if err != nil {
		return "", fmt.Errorf("failed to parse certificate: %v", err)
	}

	// 4. Format in standard Fabric way
	subject := cert.Subject.String()
	issuer := cert.Issuer.String()
	clientID := fmt.Sprintf("x509::%s::%s", subject, issuer)

	return clientID, nil
}


// Init initializes the chaincode
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {

	metadata := TokenMetadata{
		Name:        NAME,
		Symbol:      SYMBOL,
		TotalSupply: TOTAL_INITIAL_SUPPLY,
	}
	metadataBytes, _ := json.Marshal(metadata)
	ctx.GetStub().PutState(TOKEN_METADATA, metadataBytes)

	// Set default exchange rate for USD
	defaultRate := ExchangeRate{
		Currency:   "USD",
		RateToToken: 100.0, // 1 USD = 100 CFT
	}
	rateBytes, _ := json.Marshal(defaultRate)
	rateKey, _ := ctx.GetStub().CreateCompositeKey(RatePrefix, []string{"USD"})
	ctx.GetStub().PutState(rateKey, rateBytes)

	log.Printf("Successfully called InitLedger")
	return nil
}

func (s *SmartContract) SetTokenMetadata(ctx contractapi.TransactionContextInterface,name string,symbol string) (*TokenMetadata, error) {
	
	isAdmin, err := s.isAdmin(ctx)
	if err != nil || !isAdmin {
		return nil,fmt.Errorf("unauthorized: only admin can set exchange rate")
	}
	
	metadata := TokenMetadata{
		Name:        name,
		Symbol:      symbol,
		TotalSupply: TOTAL_INITIAL_SUPPLY,
	}
	metadataBytes, _ := json.Marshal(metadata)
	ctx.GetStub().PutState(TOKEN_METADATA, metadataBytes)

	return &metadata, nil
}


func (s *SmartContract) GetTokenMetadata(ctx contractapi.TransactionContextInterface) (*TokenMetadata, error) {
	metaBytes, err := ctx.GetStub().GetState(TOKEN_METADATA)
	if err != nil || metaBytes == nil {
		return nil, fmt.Errorf("token metadata not found")
	}
	var metadata TokenMetadata
	json.Unmarshal(metaBytes, &metadata)
	return &metadata, nil
}





func (s *SmartContract) isAdmin(ctx contractapi.TransactionContextInterface) (bool, error) {
	// Get the value of the 'hf.Registrar.Roles' attribute
	role, found, err := ctx.GetClientIdentity().GetAttributeValue("hf.Registrar.Roles")
	if err != nil {
		return false, fmt.Errorf("failed to get hf.Registrar.Roles attribute: %v", err)
	}
	if !found {
		return false, nil // Attribute not present
	}

	// Check if "admin" is included in the attribute value
	if role == "admin" || strings.Contains(role, "admin") {
		return true, nil
	}

	return false, nil
}


func (s *SmartContract) SetExchangeRate(ctx contractapi.TransactionContextInterface, currency string, rate float64) (*ResponseMessage,error) {
	isAdmin, err := s.isAdmin(ctx)
	if err != nil || !isAdmin {
		return nil,fmt.Errorf("unauthorized: only admin can set exchange rate")
	}
	rateObj := ExchangeRate{
		Currency:   currency,
		RateToToken: rate,
	}
	rateBytes, _ := json.Marshal(rateObj)

	rateKey, err := ctx.GetStub().CreateCompositeKey(RatePrefix, []string{currency})
	if err != nil {
		return  nil,fmt.Errorf("failed to create composite key for %s: %v", rateKey, err)
	}



	err = ctx.GetStub().PutState(rateKey, rateBytes)
	if err != nil {
		return nil, err
	}

	return &ResponseMessage{Message: "exchange rate set successfully"}, nil
}

// GetExchangeRate fetches the exchange rate for a given currency
func (s *SmartContract) GetExchangeRate(ctx contractapi.TransactionContextInterface, currency string) (*ExchangeRate, error) {
	// Fetch the exchange rate using the composite key 'exchangeRate' and currency as part of the key
	exchangeRateKey, err := ctx.GetStub().CreateCompositeKey(RatePrefix, []string{currency})
	if err != nil {
		return nil, fmt.Errorf("failed to create composite key: %v", err)
	}

	exchangeRateJSON, err := ctx.GetStub().GetState(exchangeRateKey)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch exchange rate: %v", err)
	}
	if exchangeRateJSON == nil {
		return nil, fmt.Errorf("exchange rate for currency %s does not exist", currency)
	}

	var exchangeRate ExchangeRate
	err = json.Unmarshal(exchangeRateJSON, &exchangeRate)
	if err != nil {
		return nil, err
	}

	return &exchangeRate, nil
}

// GetAllExchangeRates returns all exchange rates from world state
func (s *SmartContract) GetAllExchangeRates(ctx contractapi.TransactionContextInterface) ([]*ExchangeRate, error) {
    // 1. Get iterator for all exchange rates using the rate prefix
    resultsIterator, err := ctx.GetStub().GetStateByPartialCompositeKey(RatePrefix, []string{})
    if err != nil {
        return nil, fmt.Errorf("failed to get exchange rate iterator: %v", err)
    }
    defer resultsIterator.Close()

    var exchangeRates []*ExchangeRate
    
    // 2. Iterate through all exchange rates
    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return nil, fmt.Errorf("failed to get next exchange rate: %v", err)
        }

        var rate ExchangeRate
        err = json.Unmarshal(queryResponse.Value, &rate)
        if err != nil {
            // Log but continue to next rate instead of failing
            log.Printf("Failed to unmarshal exchange rate %s: %v", queryResponse.Key, err)
            continue
        }

        exchangeRates = append(exchangeRates, &rate)
    }

    // 3. Return empty slice instead of nil if no rates found
    if exchangeRates == nil {
        exchangeRates = make([]*ExchangeRate, 0)
    }

    log.Printf("Found %d exchange rates", len(exchangeRates))
    return exchangeRates, nil
}



func (s *SmartContract) MintToken(ctx contractapi.TransactionContextInterface, currency string, amountPaid float64) (*ResponseMessage,error) {
	// Fetch exchange rate

	rateKey, err := ctx.GetStub().CreateCompositeKey(RatePrefix, []string{currency})
	if err != nil {
		return  nil,fmt.Errorf("failed to create composite key for %s: %v", rateKey, err)
	}

	rateBytes, err := ctx.GetStub().GetState(rateKey)
	if err != nil || rateBytes == nil {
		return nil,fmt.Errorf("no exchange rate for currency %s", currency)
	}

	userID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil,fmt.Errorf("failed to get client identity: %v", err)
	}


	var rate ExchangeRate
	json.Unmarshal(rateBytes, &rate)

	tokensToMint := uint64(amountPaid * rate.RateToToken)

	balanceKey, err := ctx.GetStub().CreateCompositeKey(BalancePrefix, []string{userID})
	if err != nil {
		return  nil,fmt.Errorf("failed to create composite key for %s: %v", balanceKey, err)
	}

	balanceBytes, _ := ctx.GetStub().GetState(balanceKey)
	var balance Balance
	if balanceBytes != nil {
		json.Unmarshal(balanceBytes, &balance)
	} else {
		balance = Balance{Owner: userID, Balance: 0}
	}
	balance.Balance += tokensToMint
	newBalanceBytes, _ := json.Marshal(balance)
	ctx.GetStub().PutState(balanceKey, newBalanceBytes)

	// Update total supply
	metaBytes, _ := ctx.GetStub().GetState(TOKEN_METADATA)
	var metadata TokenMetadata
	json.Unmarshal(metaBytes, &metadata)
	metadata.TotalSupply += tokensToMint
	updatedMetaBytes, _ := json.Marshal(metadata)
	ctx.GetStub().PutState(TOKEN_METADATA, updatedMetaBytes)

	return &ResponseMessage{Message: "token minted successfully"}, nil
}

func (s *SmartContract) GetBalance(ctx contractapi.TransactionContextInterface) (uint64, error) {
	
	userID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return ERROR_BALANCE,fmt.Errorf("failed to get client identity: %v", err)
	}

	balanceKey, err := ctx.GetStub().CreateCompositeKey(BalancePrefix, []string{userID})
	if err != nil {
		return  ERROR_BALANCE,fmt.Errorf("failed to create composite key for %s: %v", balanceKey, err)
	}
	
	balanceBytes, err := ctx.GetStub().GetState(balanceKey)
	if err != nil || balanceBytes == nil {
		return ERROR_BALANCE, nil
	}
	var balance Balance
	json.Unmarshal(balanceBytes, &balance)
	return balance.Balance, nil
}

func (s *SmartContract) GetTokenBalance(ctx contractapi.TransactionContextInterface,userID string) (uint64, error) {
	
	balanceKey, err := ctx.GetStub().CreateCompositeKey(BalancePrefix, []string{userID})
	if err != nil {
		return  0,fmt.Errorf("failed to create composite key for %s: %v", balanceKey, err)
	}
	
	balanceBytes, err := ctx.GetStub().GetState(balanceKey)
	if err != nil || balanceBytes == nil {
		return 0, nil
	}
	var balance Balance
	json.Unmarshal(balanceBytes, &balance)
	return balance.Balance, nil
}

// UpdateTokenBalance updates the token balance for a user
func (s *SmartContract) UpdateTokenBalance(ctx contractapi.TransactionContextInterface, userID string, amount uint64) error {
	tokenBalanceKey, err := ctx.GetStub().CreateCompositeKey(BalancePrefix, []string{userID})
	if err != nil {
		return fmt.Errorf("failed to create composite key: %v", err)
	}

	balanceBytes, err := ctx.GetStub().GetState(tokenBalanceKey)
	if err != nil || balanceBytes == nil {
		return fmt.Errorf("failed to extract balance : %v", err)
	}

	var balance Balance
	json.Unmarshal(balanceBytes, &balance)

	// Update the balance
	balance.Balance += amount

	// Store the new balance
	tokenBalanceJSON, err := json.Marshal(balance)
	if err != nil {
		return fmt.Errorf("failed to marshal new token balance: %v", err)
	}

	err = ctx.GetStub().PutState(tokenBalanceKey, tokenBalanceJSON)
	if err != nil {
		return fmt.Errorf("failed to update token balance: %v", err)
	}

	return nil
}



// CreateCampaign adds a new campaign to the ledger
func (s *SmartContract) CreateCampaign(ctx contractapi.TransactionContextInterface, id, title, description, campaignType string, target, deadline uint64, image string, timestamp uint64) (*ResponseMessage, error) {
	// Admin check
	isAdmin, err := s.isAdmin(ctx)
	if err != nil || !isAdmin {
		return nil, fmt.Errorf("unauthorized: only admin can create campaign")
	}

	// Check if campaign exists
	exists, err := s.CampaignExists(ctx, id)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, fmt.Errorf("campaign %s already exists", id)
	}

	if deadline <= timestamp {
		return nil, fmt.Errorf("deadline must be in the future")
	}

	// Get the client ID
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil, fmt.Errorf("failed to get client identity: %v", err)
	}

	// Get the database user ID for this client
	dbUserID, err := s.GetDBUserIDFromClientID(ctx, clientID)
	if err != nil {
		return nil, fmt.Errorf("user not registered: %v", err)
	}

	campaign := Campaign{
		ID:              id,
		OwnerDBID:       dbUserID,  // Store database user ID instead of client ID
		Title:           title,
		Description:     description,
		CampaignType:    campaignType,
		Target:          target,
		Deadline:        deadline,
		AmountCollected: 0,
		Image:           image,
		Withdrawn:       false,
		Canceled:        false,
		Donors:          []Donor{},
	}

	campaignJSON, err := json.Marshal(campaign)
	if err != nil {
		return nil, err
	}

	campaignKey, err := ctx.GetStub().CreateCompositeKey(CampaignPrefix, []string{id})
	if err != nil {
		return nil, fmt.Errorf("failed to create composite key for %s: %v", campaignKey, err)
	}

	err = ctx.GetStub().PutState(campaignKey, campaignJSON)
	if err != nil {
		return nil, err
	}

	log.Printf("Successfully created campaign: %s", id)

	return &ResponseMessage{Message: "campaign created successfully"}, nil
}


// UpdateCampaign allows campaign owner to update editable fields before deadline and before donations
func (s *SmartContract) UpdateCampaign(ctx contractapi.TransactionContextInterface, id, title, description, campaignType string, target, deadline uint64, image string, timestamp uint64) (*ResponseMessage, error) {
	isAdmin, err := s.isAdmin(ctx)
	if err != nil || !isAdmin {
		return nil, fmt.Errorf("unauthorized: only admin can update campaign")
	}

	campaign, err := s.ReadCampaign(ctx, id)
	if err != nil {
		return nil, err
	}

	if campaign.Canceled {
		return nil, fmt.Errorf("cannot update a canceled campaign")
	}
	if campaign.Withdrawn {
		return nil, fmt.Errorf("cannot update a withdrawn campaign")
	}
	if campaign.Deadline <= timestamp {
		return nil, fmt.Errorf("cannot update a campaign after deadline")
	}

	// Get the client ID
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil, fmt.Errorf("failed to get client identity: %v", err)
	}

	// Get the database user ID for this client
	dbUserID, err := s.GetDBUserIDFromClientID(ctx, clientID)
	if err != nil {
		return nil, fmt.Errorf("user not registered: %v", err)
	}

	// Compare database user IDs instead of client IDs
	if campaign.OwnerDBID != dbUserID {
		return nil, fmt.Errorf("only campaign owner can update the campaign")
	}

	if campaign.AmountCollected > 0 {
		// If funds already collected, restrict update to only title, description and image
		campaign.Title = title
		campaign.Description = description
		campaign.Image = image
	} else {
		// Full editable if no donations
		if deadline <= timestamp {
			return nil,fmt.Errorf("new deadline must be in the future")
		}
		campaign.Title = title
		campaign.Description = description
		campaign.CampaignType = campaignType
		campaign.Target = target
		campaign.Deadline = deadline
		campaign.Image = image
	}

	campaignJSON, err := json.Marshal(campaign)
	if err != nil {
		return nil,err
	}

	campaignKey, err := ctx.GetStub().CreateCompositeKey(CampaignPrefix, []string{id})
	if err != nil {
		return  nil,fmt.Errorf("failed to create composite key for %s: %v", campaignKey, err)
	}

	err = ctx.GetStub().PutState(campaignKey, campaignJSON)
	if err != nil {
		return nil, err
	}

	log.Printf("Successfully updated campaign: %s", id)
	return &ResponseMessage{Message: "campaign updated successfully"}, nil
}

// DonateToCampaign allows a user to donate to a campaign
func (s *SmartContract) DonateToCampaign(ctx contractapi.TransactionContextInterface, id string, amount uint64, timestamp uint64) (*ResponseMessage, error) {
	campaign, err := s.ReadCampaign(ctx, id)
	if err != nil {
		return nil,err
	}

	if campaign.Deadline <= timestamp {
		return nil,fmt.Errorf("cannot donate after deadline")
	}

	if campaign.Withdrawn {
		return nil,fmt.Errorf("cannot donate to a withdrawn campaign")
	}

	if campaign.Canceled {
		return nil,fmt.Errorf("cannot donate to a canceled campaign")
	}
	if campaign.AmountCollected + amount > campaign.Target {
		return nil,fmt.Errorf("donation exceeds campaign target")
	}

	// Get the client ID
	donorClientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil, err
	}

	// Get the database user ID for this donor
	donorDBID, err := s.GetDBUserIDFromClientID(ctx, donorClientID)
	if err != nil {
		return nil, fmt.Errorf("donor not registered: %v", err)
	}

	// Fetch the donor's token balance
	donorBalance, err := s.GetTokenBalance(ctx, donorClientID)
	if err != nil {
		return nil, err
	}

	if donorBalance < amount {
		return nil, fmt.Errorf("insufficient tokens")
	}

	// Deduct the tokens from the donor's balance
	err = s.UpdateTokenBalance(ctx, donorClientID, -amount)
	if err != nil {
		return nil, err
	}

	// Create new donor record
	newDonor := Donor{
		DonorDBID:      donorDBID,
		DonationAmount: amount,
		Timestamp:      timestamp,
	}

	campaign.AmountCollected += amount
	campaign.Donors = append(campaign.Donors, newDonor)

	campaignJSON, err := json.Marshal(campaign)
	if err != nil {
		return nil,err
	}

	campaignKey, err := ctx.GetStub().CreateCompositeKey(CampaignPrefix, []string{id})
	if err != nil {
		return  nil,fmt.Errorf("failed to create composite key for %s: %v", campaignKey, err)
	}

	err = ctx.GetStub().PutState(campaignKey, campaignJSON)
	if err != nil {
		return nil, err
	}

	payment := PaymentDetail{
		CampaignID:  id,
		Amount:      amount,
		Timestamp:   timestamp,
		PaymentType: DONATION,
	}

	log.Printf("Successfully donated to campaign: %s", id)

	err = s.appendPayment(ctx, donorClientID, payment)
	if err != nil {
		return nil, err
	}

	return &ResponseMessage{Message: "donation successful"}, nil
}

// Withdraw allows the campaign owner to withdraw funds after deadline
func (s *SmartContract) Withdraw(ctx contractapi.TransactionContextInterface, id string, timestamp uint64) (*ResponseMessage, error) {
    isAdmin, err := s.isAdmin(ctx)
    if err != nil || !isAdmin {
        return nil, fmt.Errorf("unauthorized: only admin can withdraw campaign")
    }

    campaign, err := s.ReadCampaign(ctx, id)
    if err != nil {
        return nil, err
    }

    if campaign.Withdrawn {
        return nil, fmt.Errorf("funds already withdrawn")
    }
    if campaign.AmountCollected <= 0 {
        return nil, fmt.Errorf("no funds to withdraw")
    }
    if campaign.Deadline > timestamp {
        return nil, fmt.Errorf("cannot withdraw before deadline")
    }

    // Get the client ID
    clientID, err := ctx.GetClientIdentity().GetID()
    if err != nil {
        return nil, err
    }

    // Get the database user ID for this client
    dbUserID, err := s.GetDBUserIDFromClientID(ctx, clientID)
    if err != nil {
        return nil, fmt.Errorf("user not registered: %v", err)
    }

    // Compare database user IDs instead of client IDs
    if campaign.OwnerDBID != dbUserID {
        return nil, fmt.Errorf("only campaign owner can withdraw")
    }

    // Update token balance for the owner
    err = s.UpdateTokenBalance(ctx, clientID, campaign.AmountCollected)
    if err != nil {
        return nil, err
    }

    campaign.Withdrawn = true

    campaignJSON, err := json.Marshal(campaign)
    if err != nil {
        return nil,err
    }

    campaignKey, err := ctx.GetStub().CreateCompositeKey(CampaignPrefix, []string{id})
    if err != nil {
        return  nil,fmt.Errorf("failed to create composite key for %s: %v", campaignKey, err)
    }

    err = ctx.GetStub().PutState(campaignKey, campaignJSON)
    if err != nil {
        return nil, err
    }

    payment := PaymentDetail{
        CampaignID:  id,
        Amount:      campaign.AmountCollected,
        Timestamp:   timestamp,
        PaymentType: WITHDRAWAL,
    }

    log.Printf("Successfully withdrawn campaign: %s", id)
    err = s.appendPayment(ctx, clientID, payment)
    if err != nil {
        return nil, err
    }

    return &ResponseMessage{Message: "funds withdrawn successfully"}, nil
}

// CancelCampaign cancels the campaign and refunds donors
func (s *SmartContract) CancelCampaign(ctx contractapi.TransactionContextInterface, id string, timestamp uint64) (*ResponseMessage, error) {
    isAdmin, err := s.isAdmin(ctx)
    if err != nil || !isAdmin {
        return nil, fmt.Errorf("unauthorized: only admin can cancel campaign")
    }

    campaign, err := s.ReadCampaign(ctx, id)
    if err != nil {
        return nil, err
    }
    if campaign.Canceled {
        return nil, fmt.Errorf("campaign is already canceled")
    }
    if campaign.Deadline <= timestamp {
        return nil, fmt.Errorf("cannot cancel after deadline")
    }

    // Get the client ID
    clientID, err := ctx.GetClientIdentity().GetID()
    if err != nil {
        return nil, err
    }

    // Get the database user ID for this client
    dbUserID, err := s.GetDBUserIDFromClientID(ctx, clientID)
    if err != nil {
        return nil, fmt.Errorf("user not registered: %v", err)
    }

    // Compare database user IDs instead of client IDs
    if campaign.OwnerDBID != dbUserID {
        return nil, fmt.Errorf("only campaign owner can cancel")
    }

    for _, donor := range campaign.Donors {
        // Get the client ID for this donator
        donatorClientID, err := s.GetClientIDFromDBUserID(ctx, donor.DonorDBID)
        if err != nil {
            return nil, fmt.Errorf("failed to get client ID for donator %s: %v", donor.DonorDBID, err)
        }

        // Add tokens back to the donor's balance
        err = s.UpdateTokenBalance(ctx, donatorClientID, donor.DonationAmount)
        if err != nil {
            return nil, fmt.Errorf("failed to refund donor %s: %v", donor.DonorDBID, err)
        }

        refund := PaymentDetail{
            CampaignID:  id,
            Amount:      donor.DonationAmount,
            Timestamp:   timestamp,
            PaymentType: REFUND,
        }
        err = s.appendPayment(ctx, donatorClientID, refund)

        if err != nil {
            return nil, fmt.Errorf("failed to log refund: %v", err)
        }
    }

    campaign.Canceled = true
    campaignJSON, err := json.Marshal(campaign)
    if err != nil {
        return nil,err
    }

    log.Printf("Successfully cenceled campaign: %s", id)

    campaignKey, err := ctx.GetStub().CreateCompositeKey(CampaignPrefix, []string{id})
    if err != nil {
        return  nil,fmt.Errorf("failed to create composite key for %s: %v", campaignKey, err)
    }

    err = ctx.GetStub().PutState(campaignKey, campaignJSON)
    if err != nil {
        return nil, err
    }

    return &ResponseMessage{Message: "campaign canceled and refunds processed"}, nil
}

// DeleteCampaign deletes a campaign if it exists and is either withdrawn or canceled
func (s *SmartContract) DeleteCampaign(ctx contractapi.TransactionContextInterface, id string) (*ResponseMessage, error) {
    // 1. Admin check
    isAdmin, err := s.isAdmin(ctx)
    if err != nil || !isAdmin {
        return nil, fmt.Errorf("unauthorized: only admin can delete campaign")
    }

    // 2. Get campaign
    campaign, err := s.ReadCampaign(ctx, id)
    if err != nil {
        return nil, err
    }

    // 3. Verify campaign state
    if !campaign.Withdrawn && !campaign.Canceled {
        return nil, fmt.Errorf("only withdrawn or canceled campaigns can be deleted")
    }

    // 4. Delete campaign
    campaignKey, err := ctx.GetStub().CreateCompositeKey(CampaignPrefix, []string{id})
    if err != nil {
        return nil, fmt.Errorf("failed to create composite key for %s: %v", campaignKey, err)
    }

    err = ctx.GetStub().DelState(campaignKey)
    if err != nil {
        return nil, fmt.Errorf("failed to delete campaign: %v", err)
    }

    log.Printf("Successfully deleted campaign: %s", id)
    return &ResponseMessage{Message: "campaign deleted successfully"}, nil
}

// ReadCampaign returns the campaign stored in the ledger with given ID
func (s *SmartContract) ReadCampaign(ctx contractapi.TransactionContextInterface, id string) (*Campaign, error) {
	
	campaignKey, err := ctx.GetStub().CreateCompositeKey(CampaignPrefix, []string{id})
	if err != nil {
		return  nil,fmt.Errorf("failed to create composite key for %s: %v", campaignKey, err)
	}
	
	campaignJSON, err := ctx.GetStub().GetState(campaignKey)
	if err != nil {
		return nil, err
	}
	if campaignJSON == nil {
		return nil, fmt.Errorf("campaign %s does not exist", id)
	}

	var campaign Campaign
	err = json.Unmarshal(campaignJSON, &campaign)
	if err != nil {
		return nil, err
	}

	log.Printf("Successfully read campaign: %s", id)
	return &campaign, nil
}

// GetAllCampaigns returns all campaigns from world state
func (s *SmartContract) GetAllCampaigns(ctx contractapi.TransactionContextInterface) ([]*Campaign, error) {
	resultsIterator, err := ctx.GetStub().GetStateByPartialCompositeKey(CampaignPrefix, []string{})
	
	
	
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var campaigns []*Campaign
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var campaign Campaign
		err = json.Unmarshal(queryResponse.Value, &campaign)
		if err != nil {
			continue
		}

		campaigns = append(campaigns, &campaign)
	}

	if campaigns == nil {
		campaigns = []*Campaign{}
	}

	log.Printf("Got all campaign : %d",len(campaigns))
	return campaigns, nil

}

// GetUserCampaigns returns all campaigns owned by the calling user
func (s *SmartContract) GetUserCampaigns(ctx contractapi.TransactionContextInterface) ([]*Campaign, error) {
    // 1. Get client identity first (before any other operations)
    clientID, err := ctx.GetClientIdentity().GetID()
    if err != nil {
        return nil, fmt.Errorf("failed to get client identity: %v", err)
    }

    // Get the database user ID for this client
    dbUserID, err := s.GetDBUserIDFromClientID(ctx, clientID)
    if err != nil {
        return nil, fmt.Errorf("user not registered: %v", err)
    }

    // 2. Get iterator for all campaigns
    resultsIterator, err := ctx.GetStub().GetStateByPartialCompositeKey(CampaignPrefix, []string{})
    if err != nil {
        return nil, fmt.Errorf("failed to get campaign iterator: %v", err)
    }
    defer resultsIterator.Close()

    var userCampaigns []*Campaign
    
    // 3. Iterate through all campaigns
    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return nil, fmt.Errorf("failed to get next campaign: %v", err)
        }

        var campaign Campaign
        err = json.Unmarshal(queryResponse.Value, &campaign)
        if err != nil {
            // Log but continue to next campaign instead of failing
            log.Printf("Failed to unmarshal campaign %s: %v", queryResponse.Key, err)
            continue
        }

        // 4. Only include campaigns owned by the caller
        if campaign.OwnerDBID == dbUserID {  // Compare with database user ID instead of client ID
            userCampaigns = append(userCampaigns, &campaign)
        }
    }

    // 5. Return empty slice instead of nil if no campaigns found
    if userCampaigns == nil {
        userCampaigns = make([]*Campaign, 0)
    }

    log.Printf("Found %d campaigns for user %s", len(userCampaigns), dbUserID)
    return userCampaigns, nil
}


// GetUserPayments retrieves all payment records for the calling user
func (s *SmartContract) GetUserPayments(ctx contractapi.TransactionContextInterface) ([]*PaymentDetail, error) {
	userID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil, fmt.Errorf("failed to get client identity: %v", err)
	}

	iterator, err := ctx.GetStub().GetStateByPartialCompositeKey(PaymentPrefix, []string{userID})
	if err != nil {
		return nil, fmt.Errorf("failed to get payment history for user %s: %v", userID, err)
	}
	defer iterator.Close()

	var payments []*PaymentDetail

	for iterator.HasNext() {
		response, err := iterator.Next()
		if err != nil {
			return nil, err
		}

		var payment PaymentDetail
		err = json.Unmarshal(response.Value, &payment)
		if err != nil {
			continue // skip any corrupted record
		}

		payments = append(payments, &payment)
	}

	if payments == nil {
		payments = []*PaymentDetail{}
	}

	log.Printf("Retrieved %d payments for user: %s", len(payments), userID)
	return payments, nil
}

// appendPayment appends a payment detail to a composite key list
func (s *SmartContract) appendPayment(ctx contractapi.TransactionContextInterface, user string, payment PaymentDetail) error {
	paymentKey, err := ctx.GetStub().CreateCompositeKey(PaymentPrefix, []string{user, fmt.Sprint(payment.Timestamp)})
	if err != nil {
		return err
	}
	paymentJSON, err := json.Marshal(payment)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(paymentKey, paymentJSON)
}

// CampaignExists returns true if campaign with given ID exists
func (s *SmartContract) CampaignExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	
	campaignKey, err := ctx.GetStub().CreateCompositeKey(CampaignPrefix, []string{id})
	if err != nil {
		return  false,fmt.Errorf("failed to create composite key for %s: %v", campaignKey, err)
	}
	
	campaignJSON, err := ctx.GetStub().GetState(campaignKey)
	if err != nil {
		return false, err
	}
	return campaignJSON != nil, nil
}

// RegisterUser creates a mapping between database user ID and Fabric client ID
func (s *SmartContract) RegisterUser(ctx contractapi.TransactionContextInterface, dbUserID string, timestamp uint64) (*ResponseMessage, error) {
	// Get the client ID from the transaction context
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil, fmt.Errorf("failed to get client identity: %v", err)
	}

	// Create the mapping
	mapping := UserMapping{
		DBUserID:  dbUserID,
		ClientID:  clientID,
		Timestamp: timestamp,
	}

	// Store the mapping
	mappingKey, err := ctx.GetStub().CreateCompositeKey(UserMappingPrefix, []string{dbUserID})
	if err != nil {
		return nil, fmt.Errorf("failed to create composite key: %v", err)
	}

	mappingJSON, err := json.Marshal(mapping)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal mapping: %v", err)
	}

	err = ctx.GetStub().PutState(mappingKey, mappingJSON)
	if err != nil {
		return nil, fmt.Errorf("failed to store mapping: %v", err)
	}

	return &ResponseMessage{Message: "user registered successfully"}, nil
}

// GetClientIDFromDBUserID retrieves the Fabric client ID for a given database user ID
func (s *SmartContract) GetClientIDFromDBUserID(ctx contractapi.TransactionContextInterface, dbUserID string) (string, error) {
	mappingKey, err := ctx.GetStub().CreateCompositeKey(UserMappingPrefix, []string{dbUserID})
	if err != nil {
		return "", fmt.Errorf("failed to create composite key: %v", err)
	}

	mappingJSON, err := ctx.GetStub().GetState(mappingKey)
	if err != nil {
		return "", fmt.Errorf("failed to get mapping: %v", err)
	}
	if mappingJSON == nil {
		return "", fmt.Errorf("no mapping found for user %s", dbUserID)
	}

	var mapping UserMapping
	err = json.Unmarshal(mappingJSON, &mapping)
	if err != nil {
		return "", fmt.Errorf("failed to unmarshal mapping: %v", err)
	}

	return mapping.ClientID, nil
}

// GetDBUserIDFromClientID retrieves the database user ID for a given Fabric client ID
func (s *SmartContract) GetDBUserIDFromClientID(ctx contractapi.TransactionContextInterface, clientID string) (string, error) {
    // Get iterator for all user mappings
    resultsIterator, err := ctx.GetStub().GetStateByPartialCompositeKey(UserMappingPrefix, []string{})
    if err != nil {
        return "", fmt.Errorf("failed to get user mapping iterator: %v", err)
    }
    defer resultsIterator.Close()

    // Iterate through all mappings to find the one with matching client ID
    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return "", fmt.Errorf("failed to get next mapping: %v", err)
        }

        var mapping UserMapping
        err = json.Unmarshal(queryResponse.Value, &mapping)
        if err != nil {
            // Log but continue to next mapping instead of failing
            log.Printf("Failed to unmarshal mapping %s: %v", queryResponse.Key, err)
            continue
        }

        // If we find a mapping with matching client ID, return the database user ID
        if mapping.ClientID == clientID {
            return mapping.DBUserID, nil
        }
    }

    return "", fmt.Errorf("no mapping found for client ID %s", clientID)
}

// UnregisterUser removes the mapping between database user ID and Fabric client ID
func (s *SmartContract) UnregisterUser(ctx contractapi.TransactionContextInterface, dbUserID string) (*ResponseMessage, error) {
    // Get the client ID from the transaction context
    clientID, err := ctx.GetClientIdentity().GetID()
    if err != nil {
        return nil, fmt.Errorf("failed to get client identity: %v", err)
    }

    // Get the existing mapping to verify ownership
    mappingKey, err := ctx.GetStub().CreateCompositeKey(UserMappingPrefix, []string{dbUserID})
    if err != nil {
        return nil, fmt.Errorf("failed to create composite key: %v", err)
    }

    mappingJSON, err := ctx.GetStub().GetState(mappingKey)
    if err != nil {
        return nil, fmt.Errorf("failed to get mapping: %v", err)
    }
    if mappingJSON == nil {
        return nil, fmt.Errorf("no mapping found for user %s", dbUserID)
    }

    var mapping UserMapping
    err = json.Unmarshal(mappingJSON, &mapping)
    if err != nil {
        return nil, fmt.Errorf("failed to unmarshal mapping: %v", err)
    }

    // Verify that the caller is the owner of this mapping
    if mapping.ClientID != clientID {
        return nil, fmt.Errorf("unauthorized: only the owner can unregister this mapping")
    }

    // Delete the mapping
    err = ctx.GetStub().DelState(mappingKey)
    if err != nil {
        return nil, fmt.Errorf("failed to delete mapping: %v", err)
    }

    return &ResponseMessage{Message: "user unregistered successfully"}, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		panic(fmt.Sprintf("Error creating chaincode: %v", err))
	}

	if err := chaincode.Start(); err != nil {
		panic(fmt.Sprintf("Error starting chaincode: %v", err))
	}
}
