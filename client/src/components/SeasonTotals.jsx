import { useState } from "react";
import api from "../api";

export default function SeasonTotals() {
  const [season, setSeason] = useState("Summer");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchTotals = async () => {
    setError("");
    try {
      const res = await api.get("/api/season/totals", { params: { season } });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h2>Season Totals (2.3)</h2>

      <div className="box">
        <select value={season} onChange={(e) => setSeason(e.target.value)}>
          <option>Spring</option>
          <option>Summer</option>
          <option>Autumn</option>
          <option>Winter</option>
        </select>
        <button onClick={fetchTotals}>Show Totals</button>
      </div>

      {error && <p className="err">{error}</p>}

      {data && (
        <div className="result">
          <p><b>Season:</b> {data.season}</p>
          <p><b>Total Units Sold:</b> {data.totalUnitsSold}</p>
          <p><b>Total Returns:</b> {data.totalReturns}</p>
          <p><b>Total Revenue:</b> {data.totalRevenue}</p>
        </div>
      )}
    </div>
  );
}
