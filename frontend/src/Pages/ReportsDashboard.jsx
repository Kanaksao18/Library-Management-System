import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const API_BASE = "/api/reports";

export default function ReportsDashboard() {
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [summaryRes, monthlyRes, popularRes] = await Promise.all([
          axios.get(`${API_BASE}/summary`),
          axios.get(`${API_BASE}/monthly-activity`),
          axios.get(`${API_BASE}/popular-books`),
        ]);
        setSummary(summaryRes.data);
        setMonthly(Array.isArray(monthlyRes.data) ? monthlyRes.data : []);
        setPopular(Array.isArray(popularRes.data) ? popularRes.data : []);
      } catch (err) {
        console.error("Failed to fetch report data", err);
        setSummary(null);
        setMonthly([]);
        setPopular([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const exportReport = () => {
    // You can implement PDF/CSV export here
    window.print();
  };

  if (loading) return (
    <div style={{ 
      background: "#fdf6e3", 
      minHeight: "100vh", 
      padding: "24px 32px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{ fontSize: 18, color: "#666" }}>Loading reports...</div>
    </div>
  );

  return (
    <div style={{ background: "#fdf6e3", minHeight: "100vh", padding: "24px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontWeight: 700, fontSize: 36, color: "#1a223f", margin: 0 }}>Reports & Analytics</h1>
        <button
          onClick={exportReport}
          style={{
            background: "#0a2540",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>⬇️</span> Export Report
        </button>
      </div>

      {/* Summary Cards */}
      {summary ? (
        <div style={{ display: "flex", gap: "24px", margin: "32px 0 40px 0" }}>
          <SummaryCard
            title="Books Issued This Month"
            value={summary.booksIssuedThisMonth || 0}
            change={summary.booksIssuedChange || 0}
            icon="📖"
            color="#059669"
          />
          <SummaryCard
            title="New Members"
            value={summary.newMembers || 0}
            change={summary.newMembersChange || 0}
            icon="🧑‍🤝‍🧑"
            color="#16a34a"
          />
          <SummaryCard
            title="Return Rate"
            value={`${Math.round((summary.returnRate || 0) * 100)}%`}
            change={summary.returnRateChange || 0}
            icon="📊"
            color="#a21caf"
          />
          <SummaryCard
            title="Avg. Days Borrowed"
            value={summary.avgDaysBorrowed || 0}
            change={summary.avgDaysBorrowedChange || 0}
            icon="🗓️"
            color="#ea580c"
          />
        </div>
      ) : (
        <div style={{ 
          background: "#fff", 
          borderRadius: 16, 
          padding: "40px", 
          textAlign: "center",
          margin: "32px 0 40px 0",
          boxShadow: "0 2px 8px #0001"
        }}>
          <div style={{ fontSize: 18, color: "#666", marginBottom: 8 }}>
            Unable to load summary data
          </div>
          <div style={{ fontSize: 14, color: "#888" }}>
            Please try refreshing the page
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "24px" }}>
        {/* Monthly Activity */}
        <div style={{ flex: 2, background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 8px #0001" }}>
          <h2 style={{ fontWeight: 600, fontSize: 22, color: "#1a223f", margin: "0 0 8px 0" }}>Monthly Activity</h2>
          <p style={{ color: "#666", marginBottom: 16 }}>Books issued and returned over the past 6 months</p>
          <ResponsiveContainer width="100%" height={260}>
            {Array.isArray(monthly) && monthly.length > 0 ? (
              <BarChart data={monthly}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="issued" fill="#059669" name="Issued" />
                <Bar dataKey="returned" fill="#16a34a" name="Returned" />
              </BarChart>
            ) : (
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "100%",
                color: "#666",
                fontSize: 16
              }}>
                No monthly activity data available
              </div>
            )}
          </ResponsiveContainer>
        </div>

        {/* Most Popular Books */}
        <div style={{ flex: 1, background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 8px #0001" }}>
          <h2 style={{ fontWeight: 600, fontSize: 22, color: "#1a223f", margin: "0 0 8px 0" }}>Most Popular Books</h2>
          <p style={{ color: "#666", marginBottom: 16 }}>Books with highest borrowing frequency</p>
          <ol style={{ paddingLeft: 20 }}>
            {Array.isArray(popular) && popular.length > 0 ? popular.map((book, idx) => (
              <li key={book.rank} style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <span style={{
                    fontWeight: 700,
                    fontSize: 18,
                    marginRight: 8,
                    color: "#a21caf"
                  }}>{book.rank}</span>
                  <span style={{ fontWeight: 600 }}>{book.title}</span>
                  <span style={{ color: "#888", marginLeft: 8 }}>{book.category}</span>
                </div>
                <span style={{ color: "#059669", fontWeight: 600 }}>{book.timesBorrowed} times</span>
              </li>
            )) : (
              <div style={{ 
                color: "#666", 
                fontSize: 16, 
                textAlign: "center",
                padding: "20px 0"
              }}>
                No popular books data available
              </div>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, change, icon, color }) {
  const isPositive = change > 0;
  const isPercent = typeof change === "number" && Math.abs(change) < 1;
  return (
    <div style={{
      flex: 1,
      background: "#fff",
      borderRadius: 16,
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      boxShadow: "0 2px 8px #0001",
      minWidth: 220,
    }}>
      <div style={{ fontSize: 32, color, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 32, color: "#222" }}>{value}</div>
      <div style={{ color: isPositive ? "#16a34a" : "#dc2626", fontWeight: 500, fontSize: 15, marginTop: 4 }}>
        {isPositive ? "↗" : "↘"} {isPercent ? `${Math.abs(change * 100).toFixed(0)}%` : Math.abs(change)} from last month
      </div>
      <div style={{ color: "#888", fontSize: 15, marginTop: 8 }}>{title}</div>
    </div>
  );
}
