package tests

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockTransactionContext is a mock implementation of the TransactionContextInterface
type MockTransactionContext struct {
	mock.Mock
	*contractapi.TransactionContext
}

// MockStub is a mock implementation of the ChaincodeStubInterface
type MockStub struct {
	mock.Mock
	*shim.MockStub
}

// MockClientIdentity is a mock implementation of the ClientIdentityInterface
type MockClientIdentity struct {
	mock.Mock
}

func (m *MockClientIdentity) GetID() (string, error) {
	args := m.Called()
	return args.String(0), args.Error(1)
}

func (m *MockClientIdentity) GetAttributeValue(attrName string) (string, bool, error) {
	args := m.Called(attrName)
	return args.String(0), args.Bool(1), args.Error(2)
}

// TestInitLedger tests the initialization of the ledger
func TestInitLedger(t *testing.T) {
	ctx := new(MockTransactionContext)
	stub := new(MockStub)
	ctx.TransactionContext = &contractapi.TransactionContext{Stub: stub}

	// Set up expectations
	stub.On("PutState", "token_metadata", mock.Anything).Return(nil)
	stub.On("CreateCompositeKey", "rate_", []string{"USD"}).Return("rate_USD", nil)
	stub.On("PutState", "rate_USD", mock.Anything).Return(nil)

	// Create contract instance
	contract := new(SmartContract)

	// Call InitLedger
	err := contract.InitLedger(ctx)
	assert.NoError(t, err)
}

// TestCreateCampaign tests campaign creation
func TestCreateCampaign(t *testing.T) {
	ctx := new(MockTransactionContext)
	stub := new(MockStub)
	ctx.TransactionContext = &contractapi.TransactionContext{Stub: stub}

	// Mock admin check
	clientIdentity := new(MockClientIdentity)
	ctx.ClientIdentity = clientIdentity
	clientIdentity.On("GetAttributeValue", "hf.Registrar.Roles").Return("admin", true, nil)
	clientIdentity.On("GetID").Return("testClientID", nil)

	// Mock campaign existence check
	stub.On("CreateCompositeKey", "campaign_", []string{"testCampaign"}).Return("campaign_testCampaign", nil)
	stub.On("GetState", "campaign_testCampaign").Return(nil, nil)

	// Mock user mapping
	stub.On("CreateCompositeKey", "user_mapping_", mock.Anything).Return("user_mapping_test", nil)
	stub.On("GetState", "user_mapping_test").Return([]byte(`{"dbUserId":"testUser","clientId":"testClientID"}`), nil)

	// Mock campaign creation
	stub.On("PutState", "campaign_testCampaign", mock.Anything).Return(nil)

	contract := new(SmartContract)
	deadline := uint64(time.Now().Add(24 * time.Hour).Unix())

	response, err := contract.CreateCampaign(ctx, "testCampaign", "Test Campaign", "Test Description", "CHARITY", 1000, deadline, "test.jpg", uint64(time.Now().Unix()))
	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.Equal(t, "campaign created successfully", response.Message)
}

// TestDonateToCampaign tests donation functionality
func TestDonateToCampaign(t *testing.T) {
	ctx := new(MockTransactionContext)
	stub := new(MockStub)
	ctx.TransactionContext = &contractapi.TransactionContext{Stub: stub}

	// Mock client identity
	clientIdentity := new(MockClientIdentity)
	ctx.ClientIdentity = clientIdentity
	clientIdentity.On("GetID").Return("testClientID", nil)

	// Mock campaign retrieval
	campaign := Campaign{
		ID:              "testCampaign",
		OwnerDBID:       "testOwner",
		Title:           "Test Campaign",
		Description:     "Test Description",
		CampaignType:    "CHARITY",
		Target:          1000,
		Deadline:        uint64(time.Now().Add(24 * time.Hour).Unix()),
		AmountCollected: 0,
		Image:           "test.jpg",
		Withdrawn:       false,
		Canceled:        false,
		Donors:          []Donor{},
	}
	campaignJSON, _ := json.Marshal(campaign)
	stub.On("CreateCompositeKey", "campaign_", []string{"testCampaign"}).Return("campaign_testCampaign", nil)
	stub.On("GetState", "campaign_testCampaign").Return(campaignJSON, nil)

	// Mock user mapping
	stub.On("CreateCompositeKey", "user_mapping_", mock.Anything).Return("user_mapping_test", nil)
	stub.On("GetState", "user_mapping_test").Return([]byte(`{"dbUserId":"testUser","clientId":"testClientID"}`), nil)

	// Mock balance check
	stub.On("CreateCompositeKey", "balance_", []string{"testClientID"}).Return("balance_testClientID", nil)
	stub.On("GetState", "balance_testClientID").Return([]byte(`{"owner":"testClientID","balance":1000}`), nil)

	// Mock balance update
	stub.On("PutState", "balance_testClientID", mock.Anything).Return(nil)

	// Mock campaign update
	stub.On("PutState", "campaign_testCampaign", mock.Anything).Return(nil)

	// Mock payment recording
	stub.On("CreateCompositeKey", "payment_", mock.Anything).Return("payment_test", nil)
	stub.On("PutState", "payment_test", mock.Anything).Return(nil)

	contract := new(SmartContract)
	response, err := contract.DonateToCampaign(ctx, "testCampaign", 100, uint64(time.Now().Unix()))
	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.Equal(t, "donation successful", response.Message)
}

// TestWithdraw tests campaign withdrawal
func TestWithdraw(t *testing.T) {
	ctx := new(MockTransactionContext)
	stub := new(MockStub)
	ctx.TransactionContext = &contractapi.TransactionContext{Stub: stub}

	// Mock admin check
	clientIdentity := new(MockClientIdentity)
	ctx.ClientIdentity = clientIdentity
	clientIdentity.On("GetAttributeValue", "hf.Registrar.Roles").Return("admin", true, nil)
	clientIdentity.On("GetID").Return("testClientID", nil)

	// Mock campaign retrieval
	campaign := Campaign{
		ID:              "testCampaign",
		OwnerDBID:       "testOwner",
		Title:           "Test Campaign",
		Description:     "Test Description",
		CampaignType:    "CHARITY",
		Target:          1000,
		Deadline:        uint64(time.Now().Unix() - 3600), // Past deadline
		AmountCollected: 500,
		Image:           "test.jpg",
		Withdrawn:       false,
		Canceled:        false,
		Donors:          []Donor{},
	}
	campaignJSON, _ := json.Marshal(campaign)
	stub.On("CreateCompositeKey", "campaign_", []string{"testCampaign"}).Return("campaign_testCampaign", nil)
	stub.On("GetState", "campaign_testCampaign").Return(campaignJSON, nil)

	// Mock user mapping
	stub.On("CreateCompositeKey", "user_mapping_", mock.Anything).Return("user_mapping_test", nil)
	stub.On("GetState", "user_mapping_test").Return([]byte(`{"dbUserId":"testOwner","clientId":"testClientID"}`), nil)

	// Mock balance update
	stub.On("CreateCompositeKey", "balance_", []string{"testClientID"}).Return("balance_testClientID", nil)
	stub.On("GetState", "balance_testClientID").Return([]byte(`{"owner":"testClientID","balance":0}`), nil)
	stub.On("PutState", "balance_testClientID", mock.Anything).Return(nil)

	// Mock campaign update
	stub.On("PutState", "campaign_testCampaign", mock.Anything).Return(nil)

	// Mock payment recording
	stub.On("CreateCompositeKey", "payment_", mock.Anything).Return("payment_test", nil)
	stub.On("PutState", "payment_test", mock.Anything).Return(nil)

	contract := new(SmartContract)
	response, err := contract.Withdraw(ctx, "testCampaign", uint64(time.Now().Unix()))
	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.Equal(t, "funds withdrawn successfully", response.Message)
}

// TestCancelCampaign tests campaign cancellation
func TestCancelCampaign(t *testing.T) {
	ctx := new(MockTransactionContext)
	stub := new(MockStub)
	ctx.TransactionContext = &contractapi.TransactionContext{Stub: stub}

	// Mock admin check
	clientIdentity := new(MockClientIdentity)
	ctx.ClientIdentity = clientIdentity
	clientIdentity.On("GetAttributeValue", "hf.Registrar.Roles").Return("admin", true, nil)
	clientIdentity.On("GetID").Return("testClientID", nil)

	// Mock campaign retrieval
	campaign := Campaign{
		ID:              "testCampaign",
		OwnerDBID:       "testOwner",
		Title:           "Test Campaign",
		Description:     "Test Description",
		CampaignType:    "CHARITY",
		Target:          1000,
		Deadline:        uint64(time.Now().Add(24 * time.Hour).Unix()),
		AmountCollected: 500,
		Image:           "test.jpg",
		Withdrawn:       false,
		Canceled:        false,
		Donors: []Donor{
			{
				DonorDBID:      "testDonor",
				DonationAmount: 500,
				Timestamp:      uint64(time.Now().Unix()),
			},
		},
	}
	campaignJSON, _ := json.Marshal(campaign)
	stub.On("CreateCompositeKey", "campaign_", []string{"testCampaign"}).Return("campaign_testCampaign", nil)
	stub.On("GetState", "campaign_testCampaign").Return(campaignJSON, nil)

	// Mock user mapping
	stub.On("CreateCompositeKey", "user_mapping_", mock.Anything).Return("user_mapping_test", nil)
	stub.On("GetState", "user_mapping_test").Return([]byte(`{"dbUserId":"testOwner","clientId":"testClientID"}`), nil)

	// Mock donor client ID retrieval
	stub.On("GetState", "user_mapping_testDonor").Return([]byte(`{"dbUserId":"testDonor","clientId":"testDonorClientID"}`), nil)

	// Mock balance updates
	stub.On("CreateCompositeKey", "balance_", []string{"testDonorClientID"}).Return("balance_testDonorClientID", nil)
	stub.On("GetState", "balance_testDonorClientID").Return([]byte(`{"owner":"testDonorClientID","balance":0}`), nil)
	stub.On("PutState", "balance_testDonorClientID", mock.Anything).Return(nil)

	// Mock campaign update
	stub.On("PutState", "campaign_testCampaign", mock.Anything).Return(nil)

	// Mock payment recording
	stub.On("CreateCompositeKey", "payment_", mock.Anything).Return("payment_test", nil)
	stub.On("PutState", "payment_test", mock.Anything).Return(nil)

	contract := new(SmartContract)
	response, err := contract.CancelCampaign(ctx, "testCampaign", uint64(time.Now().Unix()))
	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.Equal(t, "campaign canceled and refunds processed", response.Message)
}

// TestGetAllCampaigns tests retrieving all campaigns
func TestGetAllCampaigns(t *testing.T) {
	ctx := new(MockTransactionContext)
	stub := new(MockStub)
	ctx.TransactionContext = &contractapi.TransactionContext{Stub: stub}

	// Mock campaign iterator
	iterator := new(MockIterator)
	stub.On("GetStateByPartialCompositeKey", "campaign_", []string{}).Return(iterator, nil)

	// Mock campaign data
	campaign1 := Campaign{
		ID:              "campaign1",
		OwnerDBID:       "owner1",
		Title:           "Campaign 1",
		Description:     "Description 1",
		CampaignType:    "CHARITY",
		Target:          1000,
		Deadline:        uint64(time.Now().Add(24 * time.Hour).Unix()),
		AmountCollected: 500,
		Image:           "image1.jpg",
		Withdrawn:       false,
		Canceled:        false,
		Donors:          []Donor{},
	}
	campaign1JSON, _ := json.Marshal(campaign1)

	campaign2 := Campaign{
		ID:              "campaign2",
		OwnerDBID:       "owner2",
		Title:           "Campaign 2",
		Description:     "Description 2",
		CampaignType:    "CHARITY",
		Target:          2000,
		Deadline:        uint64(time.Now().Add(48 * time.Hour).Unix()),
		AmountCollected: 1000,
		Image:           "image2.jpg",
		Withdrawn:       false,
		Canceled:        false,
		Donors:          []Donor{},
	}
	campaign2JSON, _ := json.Marshal(campaign2)

	// Set up iterator behavior
	iterator.On("HasNext").Return(true).Times(2)
	iterator.On("Next").Return(&shim.QueryResult{Value: campaign1JSON}, nil).Once()
	iterator.On("Next").Return(&shim.QueryResult{Value: campaign2JSON}, nil).Once()
	iterator.On("HasNext").Return(false)
	iterator.On("Close").Return(nil)

	contract := new(SmartContract)
	campaigns, err := contract.GetAllCampaigns(ctx)
	assert.NoError(t, err)
	assert.Len(t, campaigns, 2)
	assert.Equal(t, "campaign1", campaigns[0].ID)
	assert.Equal(t, "campaign2", campaigns[1].ID)
}

// MockIterator is a mock implementation of the StateQueryIteratorInterface
type MockIterator struct {
	mock.Mock
}

func (m *MockIterator) HasNext() bool {
	args := m.Called()
	return args.Bool(0)
}

func (m *MockIterator) Next() (*shim.QueryResult, error) {
	args := m.Called()
	return args.Get(0).(*shim.QueryResult), args.Error(1)
}

func (m *MockIterator) Close() error {
	args := m.Called()
	return args.Error(0)
} 