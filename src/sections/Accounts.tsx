import React, { useState } from "react";
import { useAccounts, Account } from "../storage/accounts";
import { useTransactions, Transaction } from "../storage/transactions";

const emptyAccount: Omit<Account, "id"> = { name: "", balance: 0 };

const Accounts: React.FC = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();
  const { getTransactionsByAccount, addTransaction, deleteTransactionsByAccount } = useTransactions();

  const [editing, setEditing] = useState<Account | null>(null);
  const [form, setForm] = useState(emptyAccount);

  function resetForm() {
    setEditing(null);
    setForm(emptyAccount);
  }

  function handleEdit(account: Account) {
    setEditing(account);
    setForm({ name: account.name, balance: account.balance });
  }

  function handleDelete(account: Account) {
    if (window.confirm(`Delete account "${account.name}"? This will also delete all its transactions.`)) {
      deleteAccount(account.id);
      deleteTransactionsByAccount(account.id);
      resetForm();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return alert("Account name required");
    if (editing) {
      updateAccount({ ...editing, ...form });
      resetForm();
    } else {
      addAccount(form);
      resetForm();
    }
  }

  function handleQuickTransaction(account: Account, type: "deposit" | "withdraw") {
    const amt = Number(prompt(`Enter amount to ${type}:`));
    if (isNaN(amt) || amt <= 0) return;
    const sign = type === "deposit" ? 1 : -1;
    addTransaction({
      accountId: account.id,
      amount: sign * amt,
      type,
      description: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      date: new Date().toISOString()
    });
  }

  return (
    <section>
      <h2>Accounts</h2>
      <form onSubmit={handleSubmit} style={{marginBottom: 24, background: "#eee", padding: 18, borderRadius: 8}}>
        <h3>{editing ? "Edit Account" : "Add New Account"}</h3>
        <label>
          Name: <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            style={{marginRight: 10}}
          />
        </label>
        <label>
          Balance: <input
            type="number"
            value={form.balance}
            onChange={e => setForm(f => ({ ...f, balance: Number(e.target.value) }))}
            required
            style={{width: 100, marginRight: 10}}
          />
        </label>
        <button type="submit">{editing ? "Update" : "Add"}</button>
        {editing && <button type="button" onClick={resetForm} style={{marginLeft: 10}}>Cancel</button>}
      </form>

      <table style={{width: "100%", borderCollapse: "collapse"}}>
        <thead>
          <tr style={{background: "#f0f3f8"}}>
            <th style={{padding: "8px 4px"}}>Name</th>
            <th>Balance</th>
            <th>Transactions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length === 0 && (
            <tr>
              <td colSpan={4} style={{textAlign: "center", color: "#aaa"}}>No accounts yet.</td>
            </tr>
          )}
          {accounts.map(acc => (
            <tr key={acc.id} style={{borderTop: "1px solid #ddd"}}>
              <td style={{padding: "8px 4px"}}>{acc.name}</td>
              <td>{acc.balance.toLocaleString()}</td>
              <td>
                <button onClick={() => handleQuickTransaction(acc, "deposit")}>+ Deposit</button>
                <button onClick={() => handleQuickTransaction(acc, "withdraw")} style={{marginLeft: 5}}>- Withdraw</button>
                <div style={{fontSize: 12, color: "#666", marginTop: 4}}>
                  {getTransactionsByAccount(acc.id).length} transactions
                </div>
              </td>
              <td>
                <button onClick={() => handleEdit(acc)}>Edit</button>
                <button onClick={() => handleDelete(acc)} style={{marginLeft: 5, color: "#d00"}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TransactionsList />
    </section>
  );
};

function TransactionsList() {
  const { accounts } = useAccounts();
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const [selected, setSelected] = useState<string | null>(null);

  if (accounts.length === 0) return null;

  return (
    <div style={{marginTop: 36}}>
      <h3>Transactions</h3>
      <label>
        Account:{" "}
        <select value={selected ?? ""} onChange={e => setSelected(e.target.value)}>
          <option value="">-- select --</option>
          {accounts.map(acc =>
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          )}
        </select>
      </label>
      {selected && (
        <TransactionsForAccount
          accountId={selected}
          addTransaction={addTransaction}
          deleteTransaction={deleteTransaction}
        />
      )}
    </div>
  );
}

function TransactionsForAccount({
  accountId,
  addTransaction,
  deleteTransaction
}: {
  accountId: string;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
}) {
  const { getTransactionsByAccount } = useTransactions();
  const txs = getTransactionsByAccount(accountId);

  const [form, setForm] = useState<Omit<Transaction, "id" | "accountId">>({
    type: "deposit",
    amount: 0,
    description: "",
    date: new Date().toISOString()
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount)) return;
    addTransaction({
      ...form,
      accountId
    });
    setForm(f => ({ ...f, amount: 0, description: "" }));
  }

  return (
    <div style={{marginTop: 20, background: "#f7f7f7", padding: 14, borderRadius: 6}}>
      <h4>Transactions</h4>
      <form onSubmit={submit} style={{marginBottom: 16}}>
        <select value={form.type}
          onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}
          style={{marginRight: 8}}
        >
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
          <option value="transfer">Transfer</option>
        </select>
        <input
          type="number"
          value={form.amount}
          onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
          placeholder="Amount"
          required
          style={{width: 80, marginRight: 8}}
        />
        <input
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Description (optional)"
          style={{width: 180, marginRight: 8}}
        />
        <button type="submit">Add</button>
      </form>
      <table style={{width: "100%", fontSize: 14}}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {txs.length === 0 && (
            <tr>
              <td colSpan={5} style={{textAlign: "center", color: "#bbb"}}>No transactions</td>
            </tr>
          )}
          {txs.map(tx => (
            <tr key={tx.id}>
              <td>{new Date(tx.date).toLocaleString()}</td>
              <td>{tx.type}</td>
              <td>{tx.amount}</td>
              <td>{tx.description}</td>
              <td>
                <button onClick={() => deleteTransaction(tx.id)} style={{color: "#a00"}}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Accounts;