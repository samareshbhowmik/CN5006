import { useState } from "react";
import api from "../api";

const initialState = {
  productCategory: "",
  productName: "",
  unitsSold: "",
  returns: "",
  revenue: "",
  customerRating: "",
  stockLevel: "",
  season: "Spring",
  trendScore: "",
};

export default function AddProduct() {
  const [form, setForm] = useState(initialState);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setMsg("");
    setError("");
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const payload = {
        ...form,
        unitsSold: Number(form.unitsSold),
        returns: Number(form.returns),
        revenue: Number(form.revenue),
        customerRating: Number(form.customerRating),
        stockLevel: Number(form.stockLevel),
        trendScore: Number(form.trendScore),
      };

      const res = await api.post("/api/products/add", payload);
      setMsg(res.data.message || "Product added");
      setForm(initialState);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h2>Add Product (2.1)</h2>

      <form onSubmit={handleSubmit} className="box">
        <input
          name="productCategory"
          placeholder="Product Category"
          value={form.productCategory}
          onChange={handleChange}
        />

        <input
          name="productName"
          placeholder="Product Name"
          value={form.productName}
          onChange={handleChange}
        />

        <input
          name="unitsSold"
          type="number"
          min="0"
          placeholder="Units Sold"
          value={form.unitsSold}
          onChange={handleChange}
        />

        <input
          name="returns"
          type="number"
          min="0"
          placeholder="Returns"
          value={form.returns}
          onChange={handleChange}
        />

        <input
          name="revenue"
          type="number"
          min="0"
          placeholder="Revenue"
          value={form.revenue}
          onChange={handleChange}
        />

        <input
          name="customerRating"
          type="number"
          min="0"
          max="5"
          step="0.1"
          placeholder="Customer Rating (0-5)"
          value={form.customerRating}
          onChange={handleChange}
        />

        <input
          name="stockLevel"
          type="number"
          min="0"
          placeholder="Stock Level"
          value={form.stockLevel}
          onChange={handleChange}
        />

        <select name="season" value={form.season} onChange={handleChange}>
          <option>Spring</option>
          <option>Summer</option>
          <option>Autumn</option>
          <option>Winter</option>
        </select>

        <input
          name="trendScore"
          type="number"
          min="0"
          max="100"
          placeholder="Trend Score (0-100)"
          value={form.trendScore}
          onChange={handleChange}
        />

        <button type="submit">Add</button>
      </form>

      {msg && <p className="ok">{msg}</p>}
      {error && <p className="err">{error}</p>}
    </div>
  );
}
