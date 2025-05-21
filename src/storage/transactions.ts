import { useState, useEffect } from "react";

export interface Transaction {
  id: string;
  accountId: string;
  type: "deposit" | "withdraw" | "transfer";
  amount: number;
  description: string;
  date: string;
}

const LOCAL_KEY = "mc-bank-transactions";

function loadTransactions(): Transaction[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveTransactions(txs: Transaction[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(txs));
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions());

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  function addTransaction(tx: Omit<Transaction, "id">) {
    setTransactions(txs => [
      ...txs,
      {
        ...tx,
        id: Math.random().toString(36).slice(2, 10)
      }
    ]);
  }

  function deleteTransaction(id: string) {
    setTransactions(txs => txs.filter(t => t.id !== id));
  }

  function deleteTransactionsByAccount(accountId: string) {
    setTransactions(txs => txs.filter(t => t.accountId !== accountId));
  }

  function getTransactionsByAccount(accountId: string) {
    return transactions.filter(t => t.accountId === accountId);
  }

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    deleteTransactionsByAccount,
    getTransactionsByAccount
  };
}