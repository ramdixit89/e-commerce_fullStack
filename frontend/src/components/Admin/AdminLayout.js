import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const adminEmail = localStorage.getItem("adminEmail");

    if (!adminEmail) {
      navigate("/admin"); // Redirect to login if no email is found
    }
  }, [navigate]);
  return (
    <div>
      <AdminHeader />
      <div className="row">
        <div className="col-md-3 col-12 bg-light ">
          <Sidebar />
        </div>
        <div className="col-md-9 col-12">{children}</div>
      </div>
    </div>
  );
};
export default AdminLayout;
