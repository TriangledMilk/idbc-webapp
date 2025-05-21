import React from "react";
import { useAccounts } from "../storage/accounts";
import { useTransactions } from "../storage/transactions";

const Summary: React.FC = () => {
  const { accounts } = useAccounts();
  const { transactions } = useTransactions();

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalDeposits = transactions
    .filter(t => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions
    .filter(t => t.type === "withdraw")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <section>
      <h2>Bank Summary</h2>
      <div style={{
        background: "#f0f3f8",
        borderRadius: 10,
        padding: 24,
        marginBottom: 24,
        display: "flex",
        gap: 40,
        flexWrap: "wrap"
      }}>
        <div>
          <b>Total Bank Balance:</b>
          <div style={{fontSize: 24, color: "#238c2c"}}>{totalBalance.toLocaleString()}</div>
        </div>
        <div>
          <b>Deposits:</b>
          <div>{totalDeposits.toLocaleString()}</div>
        </div>
        <div>
          <b>Withdrawals:</b>
          <div>{totalWithdrawals.toLocaleString()}</div>
        </div>
        <div>
          <b>Accounts:</b>
          <div>{accounts.length}</div>
        </div>
        <div>
          <b>Transactions:</b>
          <div>{transactions.length}</div>
        </div>
      </div>
      <h3>Accounts</h3>
      <table style={{width: "100%", borderCollapse: "collapse"}}>
        <thead>
          <tr style={{background: "#e3eaf5"}}>
            <th>Name</th>
            <th>Balance</th>
            <th>Transactions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length === 0 && (
            <tr>
              <td colSpan={3} style={{textAlign: "center", color: "#aaa"}}>No accounts yet.</td>
            </tr>
          )}
          {accounts.map(acc => (
            <tr key={acc.id} style={{borderTop: "1px solid #ddd"}}>
              <td>{acc.name}</td>
              <td>{acc.balance.toLocaleString()}</td>
              <td>{transactions.filter(t => t.accountId === acc.id).length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Summary;