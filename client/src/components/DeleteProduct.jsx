import { useState } from "react";
import api from "../api";

export default function DeleteProduct() {
  const [productName, setProductName] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const res = await api.post("/api/products/delete", { productName });
      setMsg(res.data.message || "Deleted");
      setProductName("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h2>Delete Product (2.4)</h2>

      <form onSubmit={handleDelete} className="box">
        <input
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <button type="submit">Delete</button>
      </form>

      {msg && <p className="ok">{msg}</p>}
      {error && <p className="err">{error}</p>}
    </div>
  );
}
