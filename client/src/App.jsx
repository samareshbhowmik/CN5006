import { NavLink, Routes, Route } from "react-router-dom";

import AddProduct from "./components/AddProduct";
import UpdateProduct from "./components/UpdateProduct";
import DeleteProduct from "./components/DeleteProduct";
import SeasonTotals from "./components/SeasonTotals";
import Top10Products from "./components/Top10Products";
import AvgRatingProducts from "./components/AvgRatingProducts";

export default function App() {
  return (
    <div className="container">
      <h1>Fashion Shop Dashboard</h1>
      <p className="subtitle">
        React UI connected to Express + MongoDB REST API
      </p>

      <nav className="nav">
        <NavLink to="/" end>Add</NavLink>
        <NavLink to="/update">Update</NavLink>
        <NavLink to="/delete">Delete</NavLink>
        <NavLink to="/totals">Season Totals</NavLink>
        <NavLink to="/top10">Top 10</NavLink>
        <NavLink to="/avg-rating">Avg Rating</NavLink>
      </nav>

      <div className="page">
        <Routes>
          <Route path="/" element={<AddProduct />} />
          <Route path="/update" element={<UpdateProduct />} />
          <Route path="/delete" element={<DeleteProduct />} />
          <Route path="/totals" element={<SeasonTotals />} />
          <Route path="/top10" element={<Top10Products />} />
          <Route path="/avg-rating" element={<AvgRatingProducts />} />
        </Routes>
      </div>
    </div>
  );
}
