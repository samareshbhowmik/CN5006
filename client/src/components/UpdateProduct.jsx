import { useState } from "react";
import api from "../api";

export default function UpdateProduct() {
  const [productName, setProductName] = useState("");
  const [updates, setUpdates] = useState({
    productCategory: "",
    unitsSold: "",
    returns: "",
    revenue: "",
    customerRating: "",
    stockLevel: "",
    season: "",
    trendScore: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setMsg("");
    setError("");
    const { name, value } = e.target;
    setUpdates((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const payload = { productName };

      Object.entries(updates).forEach(([k, v]) => {
        if (v !== "" && v != null) {
          payload[k] = ["productCategory", "season"].includes(k) ? v : Number(v);
        }
      });

      const res = await api.post("/api/products/update", payload);
      setMsg(res.data.message || "Product updated");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h2>Update Product (2.2)</h2>

      <form onSubmit={handleSubmit} className="box">
        <input
          placeholder="Product Name (required)"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />

        <input
          name="productCategory"
          placeholder="New Category (optional)"
          value={updates.productCategory}
          onChange={handleChange}
        />

        <input
          name="unitsSold"
          type="number"
          min="0"
          placeholder="New Units Sold"
          value={updates.unitsSold}
          onChange={handleChange}
        />

        <input
          name="returns"
          type="number"
          min="0"
          placeholder="New Returns"
          value={updates.returns}
          onChange={handleChange}
        />

        <input
          name="revenue"
          type="number"
          min="0"
          placeholder="New Revenue"
          value={updates.revenue}
          onChange={handleChange}
        />

        <input
          name="customerRating"
          type="number"
          min="0"
          max="5"
          step="0.1"
          placeholder="New Rating"
          value={updates.customerRating}
          onChange={handleChange}
        />

        <input
          name="stockLevel"
          type="number"
          min="0"
          placeholder="New Stock"
          value={updates.stockLevel}
          onChange={handleChange}
        />

        <input
          name="season"
          placeholder="New Season (Spring/Summer/Autumn/Winter)"
          value={updates.season}
          onChange={handleChange}
        />

        <input
          name="trendScore"
          type="number"
          min="0"
          max="100"
          placeholder="New Trend Score"
          value={updates.trendScore}
          onChange={handleChange}
        />

        <button type="submit">Update</button>
      </form>

      {msg && <p className="ok">{msg}</p>}
      {error && <p className="err">{error}</p>}
    </div>
  );
}
