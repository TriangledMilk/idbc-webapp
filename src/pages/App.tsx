import React, { useState } from "react";
import Accounts from "../sections/Accounts";
import Summary from "../sections/Summary";
import Export from "../sections/Export";

const APP_TABS = ["Accounts", "Summary", "Export"];

const App: React.FC = () => {
  const [tab, setTab] = useState(APP_TABS[0]);

  return (
    <div>
      <header style={{
        background: "#181D24",
        color: "#fff",
        padding: "12px 24px",
        marginBottom: 18,
        boxShadow: "0 1px 6px #0002"
      }}>
        <h1 style={{margin: 0}}>Minecraft Server Bank</h1>
        <nav style={{marginTop: 8}}>
          {APP_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                marginRight: 10,
                background: tab === t ? "#2d6cdf" : "#fff",
                color: tab === t ? "#fff" : "#333",
                border: "1px solid #2d6cdf",
                borderRadius: 4,
                padding: "6px 16px",
                cursor: "pointer"
              }}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>
      <main style={{padding: 20, maxWidth: 800, margin: "0 auto"}}>
        {tab === "Accounts" && <Accounts />}
        {tab === "Summary" && <Summary />}
        {tab === "Export" && <Export />}
      </main>
      <footer style={{marginTop: 40, padding: 12, fontSize: 13, color: "#666", textAlign: "center"}}>
        Minecraft Bank Webapp &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;