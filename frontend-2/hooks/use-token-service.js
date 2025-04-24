'use client';

import { useAuth } from '@/hooks/use-auth';
import * as tokenService from '@/lib/services/token-services';

export const useTokenService = () => {
  const { token } = useAuth();

  return {
    getBalance: () => tokenService.getBalance(token),
    getPayments: () => tokenService.getPayments(token),
    getExchangeRate: (currency) => tokenService.getExchangeRate(token, currency),
    getAllExchangeRates: () => tokenService.getAllExchangeRates(token),
    setExchangeRate: (currency, rate) => tokenService.setExchangeRate(token, currency, rate),
    getClientIdFromX509: (x509Identity) => tokenService.getClientIdFromX509(token, x509Identity),
    getMetadata: () => tokenService.getMetadata(token),
    setMetadata: (name, symbol) => tokenService.setMetadata(token, name, symbol),
    mintToken: (currency, amountPaid) => tokenService.mintToken(token, currency, amountPaid),
  };
};
