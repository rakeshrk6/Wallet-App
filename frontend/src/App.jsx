import "./App.css";
import Login from "./components/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Transaction from "./components/Transaction";
import { Toaster } from "react-hot-toast";
import RequireUser from "./utils/RequireUser";
import OnlyIfNotLoggedIn from "./utils/OnlyIfNotLoggedIn";

function App() {
  return (
    <div className=" bg-gray-900 text-white min-h-screen">
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route element={<OnlyIfNotLoggedIn />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<RequireUser />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transaction" element={<Transaction />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
