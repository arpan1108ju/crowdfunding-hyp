package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


const name = "CrowdfundingToken"
const symbol = "CFT"
const totalInitialSupply = 0

const TOKEN_METADATA = "token_metadata"
const ADMIN = "admin"
const BalancePrefix = "balance_"
const RatePrefix = "rate_"



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



// Campaign defines a crowdfunding campaign
type Campaign struct {
	ID              string   `json:"id"`
	Owner           string   `json:"owner"`
	Title           string   `json:"title"`
	Description     string   `json:"description"`
	CampaignType    string   `json:"campaignType"`
	Target          uint64    `json:"target"`
	Deadline        uint64    `json:"deadline"`
	AmountCollected uint64    `json:"amountCollected"`
	Image           string   `json:"image"`
	Donators        []string `json:"donators"`
	Donations       []uint64  `json:"donations"`
	Withdrawn       bool     `json:"withdrawn"`
	Canceled        bool     `json:"canceled"`
}

// PaymentDetail records a payment-related event
type PaymentDetail struct {
	CampaignID  string `json:"campaignId"`
	Amount      uint64  `json:"amount"`
	Timestamp   uint64  `json:"timestamp"`
	PaymentType string `json:"paymentType"`
}


type ResponseMessage struct {
	Message  string `json:"message"`
}




// Init initializes the chaincode
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {

	metadata := TokenMetadata{
		Name:        name,
		Symbol:      symbol,
		TotalSupply: totalInitialSupply,
	}
	metadataBytes, _ := json.Marshal(metadata)
	ctx.GetStub().PutState(TOKEN_METADATA, metadataBytes)

	log.Printf("Successfully called InitLedger")
	return nil
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
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return false, err
	}
	adminID, err := ctx.GetStub().GetState(ADMIN)
	if err != nil || adminID == nil {
		return false, nil
	}
	return string(adminID) == clientID, nil
}

func (s *SmartContract) SetAdmin(ctx contractapi.TransactionContextInterface) error {
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(ADMIN, []byte(clientID))
}


func (s *SmartContract) SetExchangeRate(ctx contractapi.TransactionContextInterface, currency string, rate float64) error {
	isAdmin, err := s.isAdmin(ctx)
	if err != nil || !isAdmin {
		return fmt.Errorf("unauthorized: only admin can set exchange rate")
	}
	rateObj := ExchangeRate{
		Currency:   currency,
		RateToToken: rate,
	}
	rateBytes, _ := json.Marshal(rateObj)

	rateKey, err := ctx.GetStub().CreateCompositeKey(RatePrefix, []string{currency})
	if err != nil {
		return  fmt.Errorf("failed to create composite key for %s: %v", rateKey, err)
	}

	return ctx.GetStub().PutState(rateKey, rateBytes)
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




func (s *SmartContract) MintToken(ctx contractapi.TransactionContextInterface, currency string, amountPaid float64) error {
	// Fetch exchange rate

	rateKey, err := ctx.GetStub().CreateCompositeKey(RatePrefix, []string{currency})
	if err != nil {
		return  fmt.Errorf("failed to create composite key for %s: %v", rateKey, err)
	}

	rateBytes, err := ctx.GetStub().GetState(rateKey)
	if err != nil || rateBytes == nil {
		return fmt.Errorf("no exchange rate for currency %s", currency)
	}

	userID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return fmt.Errorf("failed to get client identity: %v", err)
	}


	var rate ExchangeRate
	json.Unmarshal(rateBytes, &rate)

	tokensToMint := uint64(amountPaid * rate.RateToToken)

	balanceKey, err := ctx.GetStub().CreateCompositeKey(BalancePrefix, []string{userID})
	if err != nil {
		return  fmt.Errorf("failed to create composite key for %s: %v", balanceKey, err)
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

	return nil
}

func (s *SmartContract) GetBalance(ctx contractapi.TransactionContextInterface) (uint64, error) {
	
	userID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return 0,fmt.Errorf("failed to get client identity: %v", err)
	}

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

	// Get the current token balance
	currentBalance, err := s.GetTokenBalance(ctx, userID)
	if err != nil {
		return fmt.Errorf("failed to get token balance: %v", err)
	}

	// Update the balance
	newBalance := currentBalance + amount

	// Store the new balance
	tokenBalanceJSON, err := json.Marshal(newBalance)
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
func (s *SmartContract) CreateCampaign(ctx contractapi.TransactionContextInterface,id, title, description, campaignType string, target, deadline uint64, image string, timestamp uint64) (*ResponseMessage, error) {
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

	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil, fmt.Errorf("failed to get client identity: %v", err)
	}

	campaign := Campaign{
		ID:              id,
		Owner:           clientID,
		Title:           title,
		Description:     description,
		CampaignType:    campaignType,
		Target:          target,
		Deadline:        deadline,
		AmountCollected: 0,
		Image:           image,
		Withdrawn:       false,
		Canceled:        false,
		Donators:        []string{},
		Donations:       []uint64{},
	}

	campaignJSON, err := json.Marshal(campaign)
	if err != nil {
		return nil, err
	}

	err = ctx.GetStub().PutState(id, campaignJSON)
	if err != nil {
		return nil, err
	}

	log.Printf("Successfully created campaign: %s", id)


	// ✅ Return a custom success message
	return &ResponseMessage{Message: "campaign created successfully"}, nil
}

// UpdateCampaign allows campaign owner to update editable fields before deadline and before donations
func (s *SmartContract) UpdateCampaign(ctx contractapi.TransactionContextInterface,id, title, description, campaignType string, target ,deadline uint64, image string, timestamp uint64) (*ResponseMessage, error) {
	campaign, err := s.ReadCampaign(ctx, id)
	if err != nil {
		return nil , err
	}

	if campaign.Canceled {
		return nil , fmt.Errorf("cannot update a canceled campaign")
	}
	if campaign.Withdrawn {
		return nil , fmt.Errorf("cannot update a withdrawn campaign")
	}
	if campaign.Deadline <= timestamp {
		return nil , fmt.Errorf("cannot update a campaign after deadline")
	}

	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil , fmt.Errorf("failed to get client identity: %v", err)
	}
	if campaign.Owner != clientID {
		return nil , fmt.Errorf("only campaign owner can update the campaign")
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

	err = ctx.GetStub().PutState(id, campaignJSON)
	if err != nil {
		return nil,err
	}

	log.Printf("Successfully updated campaign: %s", id)
	return &ResponseMessage{Message: "campaign updated successfully"}, nil
}

// DonateToCampaign allows a user to donate to a campaign
func (s *SmartContract) DonateToCampaign(ctx contractapi.TransactionContextInterface,id string, amount uint64, timestamp uint64) (*ResponseMessage, error) {
	campaign, err := s.ReadCampaign(ctx, id)
	if err != nil {
		return nil,err
	}
	if campaign.Canceled {
		return nil,fmt.Errorf("cannot donate to a canceled campaign")
	}
	if campaign.AmountCollected+amount > campaign.Target {
		return nil,fmt.Errorf("donation exceeds campaign target")
	}

	donorID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil,err
	}


	// Fetch the donor's token balance
	donorBalance, err := s.GetTokenBalance(ctx, donorID)
	if err != nil {
		return nil, err
	}

	if donorBalance < amount {
		return nil, fmt.Errorf("insufficient tokens")
	}

	// Deduct the tokens from the donor's balance
	err = s.UpdateTokenBalance(ctx, donorID, -amount)
	if err != nil {
		return nil, err
	}

	campaign.AmountCollected += amount
	campaign.Donators = append(campaign.Donators, donorID)
	campaign.Donations = append(campaign.Donations, amount)

	campaignJSON, err := json.Marshal(campaign)
	if err != nil {
		return nil,err
	}

	err = ctx.GetStub().PutState(id, campaignJSON)
	if err != nil {
		return nil,err
	}

	payment := PaymentDetail{
		CampaignID:  id,
		Amount:      amount,
		Timestamp:   timestamp,
		PaymentType: "donation",
	}

	log.Printf("Successfully donated to campaign: %s", id)

	err = s.appendPayment(ctx, donorID, payment)
	if err != nil {
		return nil, err
	}

	return &ResponseMessage{Message: "donation successful"}, nil
}

// Withdraw allows the campaign owner to withdraw funds after deadline
func (s *SmartContract) Withdraw(ctx contractapi.TransactionContextInterface, id string, timestamp uint64) (*ResponseMessage, error) {
	campaign, err := s.ReadCampaign(ctx, id)
	if err != nil {
		return nil,err
	}

	if campaign.Withdrawn {
		return nil,fmt.Errorf("funds already withdrawn")
	}
	if campaign.AmountCollected <= 0 {
		return nil,fmt.Errorf("no funds to withdraw")
	}
	if campaign.Deadline > timestamp {
		return nil,fmt.Errorf("cannot withdraw before deadline")
	}

	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil,err
	}
	if campaign.Owner != clientID {
		return nil,fmt.Errorf("only campaign owner can withdraw")
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

	err = ctx.GetStub().PutState(id, campaignJSON)
	if err != nil {
		return nil,err
	}

	payment := PaymentDetail{
		CampaignID:  id,
		Amount:      campaign.AmountCollected,
		Timestamp:   timestamp,
		PaymentType: "withdrawal",
	}

	log.Printf("Successfully withdrawn campaign: %s", id)
	err = s.appendPayment(ctx, clientID, payment)
	if err != nil {
		return nil, err
	}

	return &ResponseMessage{Message: "funds withdrawn successfully"}, nil
}

// CancelCampaign cancels the campaign and refunds donors
func (s *SmartContract) CancelCampaign(ctx contractapi.TransactionContextInterface,id string, timestamp uint64) (*ResponseMessage,error) {
	campaign, err := s.ReadCampaign(ctx, id)
	if err != nil {
		return nil,err
	}
	if campaign.Canceled {
		return nil,fmt.Errorf("campaign is already canceled")
	}
	if campaign.Deadline <= timestamp {
		return nil,fmt.Errorf("cannot cancel after deadline")
	}

	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil,err
	}
	if campaign.Owner != clientID {
		return nil,fmt.Errorf("only campaign owner can cancel")
	}

	for i, donor := range campaign.Donators {
		amount := campaign.Donations[i]

		// Add tokens back to the donor's balance
		err := s.UpdateTokenBalance(ctx, donor, amount)
		if err != nil {
			return nil, fmt.Errorf("failed to refund donor %s: %v", donor, err)
		}

		refund := PaymentDetail{
			CampaignID:  id,
			Amount:      amount,
			Timestamp:   timestamp,
			PaymentType: "refund",
		}
		err = s.appendPayment(ctx, donor, refund)

		if err != nil {
			return nil,fmt.Errorf("failed to log refund: %v", err)
		}
	}

	campaign.Canceled = true
	campaignJSON, err := json.Marshal(campaign)
	if err != nil {
		return nil,err
	}

	log.Printf("Successfully cenceled campaign: %s", id)

	err = ctx.GetStub().PutState(id, campaignJSON)
	if err != nil {
		return nil, err
	}

	return &ResponseMessage{Message: "campaign canceled and refunds processed"}, nil

}

// DeleteCampaign deletes a campaign if it exists, is not withdrawn, and belongs to the caller
func (s *SmartContract) DeleteCampaign(ctx contractapi.TransactionContextInterface, 
	id string) (*ResponseMessage,error) {
	campaign, err := s.ReadCampaign(ctx, id)
	if err != nil {
		return nil,err
	}

	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil,fmt.Errorf("failed to get client identity: %v", err)
	}

	if campaign.Owner != clientID {
		return nil,fmt.Errorf("only the campaign owner can delete the campaign")
	}

	if campaign.Withdrawn {
		return nil,fmt.Errorf("cannot delete a campaign that has already been withdrawn")
	}

	if campaign.Canceled {
		return nil,fmt.Errorf("campaign is already canceled; deletion not allowed")
	}

	err = ctx.GetStub().DelState(id)
	if err != nil {
		return nil,fmt.Errorf("failed to delete campaign: %v", err)
	}

	log.Printf("Successfully deleted campaign: %s", id)
	return &ResponseMessage{Message: "campaign deleted successfully"}, nil
}

// ReadCampaign returns the campaign stored in the ledger with given ID
func (s *SmartContract) ReadCampaign(ctx contractapi.TransactionContextInterface, id string) (*Campaign, error) {
	campaignJSON, err := ctx.GetStub().GetState(id)
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
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
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

	log.Printf("Got all campaign : ")
	return campaigns, nil

}

// GetUserPayments retrieves all payment records for the calling user
func (s *SmartContract) GetUserPayments(ctx contractapi.TransactionContextInterface) ([]*PaymentDetail, error) {
	userID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil, fmt.Errorf("failed to get client identity: %v", err)
	}

	iterator, err := ctx.GetStub().GetStateByPartialCompositeKey("payment", []string{userID})
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
	paymentKey, err := ctx.GetStub().CreateCompositeKey("payment", []string{user, fmt.Sprint(payment.Timestamp)})
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
	campaignJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, err
	}
	return campaignJSON != nil, nil
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
