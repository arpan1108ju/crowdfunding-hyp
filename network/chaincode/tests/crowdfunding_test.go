package test

import (
	"crypto/x509"
	"encoding/json"
	"fmt"
	"testing"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-chaincode-go/shimtest"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/stretchr/testify/require"

	"crowdfunding-go-copy"
)

// MockTransactionContext implements contractapi.TransactionContextInterface
type MockTransactionContext struct {
	contractapi.TransactionContext
	stub *shimtest.MockStub
}

func (m *MockTransactionContext) GetStub() shim.ChaincodeStubInterface {
	return m.stub
}

// MockClientIdentity implements contractapi.ClientIdentityInterface
type MockClientIdentity struct {
	ID string
}

func (m *MockClientIdentity) GetID() (string, error) {
	return m.ID, nil
}

func (m *MockClientIdentity) GetMSPID() (string, error) {
	return "Org1MSP", nil
}

func (m *MockClientIdentity) GetAttributeValue(attrName string) (string, bool, error) {
	if attrName == "hf.Registrar.Roles" {
		return "admin", true, nil
	}
	return "", false, nil
}

func (m *MockClientIdentity) AssertAttributeValue(attrName, attrValue string) error {
	return nil
}

func (m *MockClientIdentity) GetX509Certificate() (*x509.Certificate, error) {
	return nil, nil
}

// setupTest creates a new contract instance and initializes the ledger
func setupTest(t *testing.T) (*crowdfunding.SmartContract, *MockTransactionContext) {
	// Create a new instance of the SmartContract
	contract := new(crowdfunding.SmartContract)

	// Create the chaincode instance properly (handle error)
	cc, err := contractapi.NewChaincode(contract)
	require.NoError(t, err)

	// Create a new mock stub with the initialized chaincode
	mockStub := shimtest.NewMockStub("crowdfunding", cc)

	// Create mock client identity
	mockClientIdentity := &MockClientIdentity{
		ID: "admin",
	}

	// Use a mock context with the stub and client identity
	ctx := &MockTransactionContext{
		stub: mockStub,
	}
	ctx.SetClientIdentity(mockClientIdentity)

	// Initialize the ledger
	err = contract.InitLedger(ctx)
	require.NoError(t, err, "InitLedger should not return error")

	// Verify the state was set correctly
	metadataBytes, err := mockStub.GetState("token_metadata")
	require.NoError(t, err, "Failed to get token metadata from state")
	require.NotNil(t, metadataBytes, "Token metadata should be in state")

	// rateKey, err := mockStub.CreateCompositeKey("rate_", []string{"USD"})
	// require.NoError(t, err, "Failed to create rate key")
	// rateBytes, err := mockStub.GetState(rateKey)
	// require.NoError(t, err, "Failed to get exchange rate from state")
	// require.NotNil(t, rateBytes, "Exchange rate should be in state")

	return contract, ctx
}

func TestInitLedger(t *testing.T) {
	// Create a new instance of the SmartContract
	contract := new(crowdfunding.SmartContract)

	// Create the chaincode instance properly (handle error)
	cc, err := contractapi.NewChaincode(contract)
	require.NoError(t, err)

	// Create a new mock stub with the initialized chaincode
	mockStub := shimtest.NewMockStub("crowdfunding", cc)

	// Create mock client identity
	mockClientIdentity := &MockClientIdentity{
		ID: "admin",
	}

	// Use a mock context with the stub and client identity
	ctx := &MockTransactionContext{
		stub: mockStub,
	}
	ctx.SetClientIdentity(mockClientIdentity)

	// Log state before initialization
	fmt.Println("\n=== State Before InitLedger ===")
	state := mockStub.State
	for key, value := range state {
		fmt.Printf("Key: %s, Value: %s\n", key, string(value))
	}

	// Initialize the ledger
	fmt.Println("\n=== Calling InitLedger ===")
	err = contract.InitLedger(ctx)
	require.NoError(t, err, "InitLedger should not return error")

	// Log state after initialization
	fmt.Println("\n=== State After InitLedger ===")
	state = mockStub.State
	for key, value := range state {
		fmt.Printf("Key: %s, Value: %s\n", key, string(value))
	}

	// Try to get token metadata directly from state
	fmt.Println("\n=== Checking Token Metadata in State ===")
	metadataBytes, err := mockStub.GetState("token_metadata")
	if err != nil {
		fmt.Printf("Error getting token metadata: %v\n", err)
	} else if metadataBytes == nil {
		fmt.Println("Token metadata is nil")
	} else {
		fmt.Printf("Token metadata found: %s\n", string(metadataBytes))
		var metadata crowdfunding.TokenMetadata
		if err := json.Unmarshal(metadataBytes, &metadata); err != nil {
			fmt.Printf("Error unmarshaling metadata: %v\n", err)
		} else {
			fmt.Printf("Unmarshaled metadata: %+v\n", metadata)
		}
	}

	// Verify token metadata was set correctly
	metadata, err := contract.GetTokenMetadata(ctx)
	require.NoError(t, err, "GetTokenMetadata should not return error")
	require.NotNil(t, metadata, "Metadata should not be nil")
	require.Equal(t, "CrowdfundingToken", metadata.Name, "Token name should be CrowdfundingToken")
	require.Equal(t, "CFT", metadata.Symbol, "Token symbol should be CFT")
	require.Equal(t, uint64(0), metadata.TotalSupply, "Total supply should be 0")

	// // Verify default exchange rate for USD was set
	// rate, err := contract.GetExchangeRate(ctx, "USD")
	// require.NoError(t, err, "GetExchangeRate should not return error")
	// require.NotNil(t, rate, "Exchange rate should not be nil")
	// require.Equal(t, "USD", rate.Currency, "Currency should be USD")
	// require.Equal(t, 100.0, rate.RateToToken, "Rate should be 100.0 (1 USD = 100 CFT)")
}
