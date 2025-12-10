import { useState } from "react";
import api from "../api";

export default function AvgRatingProducts() {
  const [season, setSeason] = useState("Summer");
  const [minRating, setMinRating] = useState(4);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const fetchAvg = async () => {
    setError("");
    try {
      const res = await api.get("/api/products/avg-rating", {
        params: { season, minRating },
      });
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h2>Average Rating Filter (2.6)</h2>

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
          max="5"
          step="0.1"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          placeholder="Min Rating"
        />

        <button onClick={fetchAvg}>Search</button>
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
                <th>Avg Rating</th>
                <th>Units</th>
                <th>Returns</th>
                <th>Revenue</th>
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
                  <td>{Number(p.customerRatingAvg).toFixed(2)}</td>
                  <td>{p.unitsSold}</td>
                  <td>{p.returns}</td>
                  <td>{p.revenue}</td>
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
