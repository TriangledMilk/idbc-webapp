import React from "react";
import { useAccounts } from "../storage/accounts";
import { useTransactions } from "../storage/transactions";

function toCSV(rows: string[][]) {
  return rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\r\n");
}

const Export: React.FC = () => {
  const { accounts } = useAccounts();
  const { transactions } = useTransactions();

  function exportCSV() {
    const rows = [
      ["Account Name", "Balance", "Transaction Count"],
      ...accounts.map(a => [
        a.name,
        a.balance,
        transactions.filter(t => t.accountId === a.id).length
      ])
    ];
    const txRows = [
      [],
      ["Account", "Type", "Amount", "Description", "Date"],
      ...transactions.map(t => {
        const acc = accounts.find(a => a.id === t.accountId);
        return [
          acc?.name ?? "Unknown",
          t.type,
          t.amount,
          t.description,
          t.date
        ];
      })
    ];
    const csv = toCSV(rows) + "\n\n" + toCSV(txRows);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bank-summary.csv";
    link.click();
  }

  return (
    <section>
      <h2>Export Financial Summary</h2>
      <p>
        Click the button below to download a CSV file with your bank's accounts and all transactions.
      </p>
      <button onClick={exportCSV} style={{
        padding: "10px 24px",
        fontSize: 18,
        color: "#fff",
        background: "#2d6cdf",
        border: "none",
        borderRadius: 8,
        cursor: "pointer"
      }}>
        Export as CSV
      </button>
    </section>
  );
};

export default Export;