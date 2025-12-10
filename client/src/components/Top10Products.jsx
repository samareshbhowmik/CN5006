import { useState } from "react";
import api from "../api";

export default function Top10Products() {
  const [season, setSeason] = useState("Summer");
  const [minUnits, setMinUnits] = useState(50);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const fetchTop10 = async () => {
    setError("");
    try {
      const res = await api.get("/api/products/top10", {
        params: { season, minUnits },
      });
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h2>Top 10 Filter (2.5)</h2>

      <div className="box">
        <select value={season} onChange={(e) => setSeason(e.target.value)}>
          <option>Spring</option>
          <option>Summer</option>
          <option>Autumn</option>
          <option>Winter</option>
        </select>

        <input
          type="number"
          min="0"
          value={minUnits}
          onChange={(e) => setMinUnits(e.target.value)}
          placeholder="Min Units"
        />

        <button onClick={fetchTop10}>Search</button>
      </div>

      {error && <p className="err">{error}</p>}

      {response && (
        <>
          <p><b>Count:</b> {response.count}</p>
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Name</th>
                <th>Units</th>
                <th>Returns</th>
                <th>Revenue</th>
                <th>Rating</th>
                <th>Stock</th>
                <th>Season</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {response.data.map((p) => (
                <tr key={p._id}>
                  <td>{p.productCategory}</td>
                  <td>{p.productName}</td>
                  <td>{p.unitsSold}</td>
                  <td>{p.returns}</td>
                  <td>{p.revenue}</td>
                  <td>{p.customerRating}</td>
                  <td>{p.stockLevel}</td>
                  <td>{p.season}</td>
                  <td>{p.trendScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
