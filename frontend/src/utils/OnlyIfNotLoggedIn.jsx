import React from "react";
import { useCookies } from "react-cookie";
import { Navigate, Outlet } from "react-router-dom";

function OnlyIfNotLoggedIn() {
  const [cookies] = useCookies(["accessToken"]);
  return cookies.accessToken ? <Navigate to="/" /> : <Outlet />;
}

export default OnlyIfNotLoggedIn;
