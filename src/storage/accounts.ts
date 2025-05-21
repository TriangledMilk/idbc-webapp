import { useState, useEffect } from "react";

export interface Account {
  id: string;
  name: string;
  balance: number;
}

const LOCAL_KEY = "mc-bank-accounts";

function loadAccounts(): Account[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveAccounts(accounts: Account[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(accounts));
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>(loadAccounts());

  useEffect(() => {
    saveAccounts(accounts);
  }, [accounts]);

  function addAccount(account: Omit<Account, "id">) {
    setAccounts(accs => [
      ...accs,
      {
        ...account,
        id: Math.random().toString(36).slice(2, 10)
      }
    ]);
  }

  function updateAccount(account: Account) {
    setAccounts(accs => accs.map(a => a.id === account.id ? account : a));
  }

  function deleteAccount(id: string) {
    setAccounts(accs => accs.filter(a => a.id !== id));
  }

  return { accounts, addAccount, updateAccount, deleteAccount };
}