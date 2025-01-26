import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

function RequireUser() {
  const [cookies] = useCookies();

  return cookies.accessToken ? <Outlet /> : <Navigate to="/login" />;
}

export default RequireUser;
