// Custom event for balance updates
export const BALANCE_UPDATED_EVENT = "balance-updated";

// Function to dispatch balance updated event
export const dispatchBalanceUpdated = () => {
  window.dispatchEvent(new Event(BALANCE_UPDATED_EVENT));
};
