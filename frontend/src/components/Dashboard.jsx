// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import { MdOutlineAddCard } from "react-icons/md";
import TransactionTable from "./TransactionTable";
import { axiosClient } from "../utils/axiosClient";
import { PiHandWithdrawDuotone } from "react-icons/pi";
import { BiTransferAlt } from "react-icons/bi";
import { LuHistory } from "react-icons/lu";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import TransferModal from "./TransferModal";
import { IoLogOutOutline } from "react-icons/io5";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);

  const [user, setUser] = useState();
  const [isOpen, setOpen] = useState();
  const [operationType, setOperationType] = useState();
  const [transferIsOpen, setTransferOpen] = useState();
  const [insights, setInsights] = useState();
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["accessToken"]);

  useEffect(() => {
    async function getUser() {
      const res = await axiosClient.get("/wallet/user");
      console.log(res);

      setUser(res.data.user);
    }
    getUser();
  }, []);

  async function fetchData() {
    const balanceRes = await axiosClient.get("/wallet/balance");
    const insightsRes = await axiosClient.get("/wallet/insights");
    setInsights(insightsRes.data);

    setBalance(balanceRes.data.balance);
  }
  useEffect(() => {
    fetchData();
  }, []);

  function handleOpenModal(e) {
    const textValue =
      e.currentTarget.querySelector("div:nth-child(2)").innerText;
    setOperationType(textValue);
    setOpen((prev) => !prev);
  }

  function handleTransferModal() {
    setTransferOpen((prev) => !prev);
  }

  async function handleLogout() {
    try {
      const res = await axiosClient.get("/auth/logout");
      if (res.status == 200) {
        Cookies.remove("accessToken");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-4">
      {/* Logout Button */}
      <div className="text-xl flex justify-end items-center md:mr-12 md:mt-1">
        <div
          onClick={handleLogout}
          className="hover:text-blue-500 flex gap-2 cursor-pointer"
        >
          <IoLogOutOutline className="text-3xl" />
          <div>Logout</div>
        </div>
      </div>

      {/* Balance Section */}
      <div className="text-center mt-5 md:mt-0 ">
        <h1 className="text-4xl font-bold">
          <span className="text-blue-500">{user?.Name + "'s"}</span> Wallet
        </h1>
        <div className="mt-10">
          <h1 className="text-2xl font-bold">Balance</h1>
          <h1 className="text-7xl mt-3 font-bold text-amber-400">
            ₹ {balance}
          </h1>
        </div>
      </div>

      {/* Action Cards */}
      <div className=" md:px-40">
        <div className="grid grid-cols-2 gap-4 md:gap-10 mt-10 md:grid-cols-4">
          <div
            onClick={handleOpenModal}
            className="flex flex-col cursor-pointer justify-center items-center outline outline-gray-600 rounded-md bg-gray-800 py-6"
          >
            <MdOutlineAddCard className="text-5xl" />
            <div className="text-xl mt-5">Top Up</div>
          </div>
          <div
            onClick={handleOpenModal}
            className="flex flex-col cursor-pointer justify-center items-center outline outline-gray-600 rounded-md bg-gray-800 p-4"
          >
            <PiHandWithdrawDuotone className="text-5xl" />
            <div className="text-xl mt-5">Withdraw</div>
          </div>
          <div
            onClick={handleTransferModal}
            className="flex flex-col cursor-pointer justify-center items-center outline outline-gray-600 rounded-md bg-gray-800 p-4"
          >
            <BiTransferAlt className="text-5xl" />
            <div className="text-xl mt-5">Transfer</div>
          </div>
          <div
            onClick={() => navigate("/transaction")}
            className="flex flex-col cursor-pointer justify-center items-center outline outline-gray-600 rounded-md bg-gray-800 p-4"
          >
            <LuHistory className="text-5xl" />
            <div className="text-xl mt-5 text-center">Transaction History</div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-1 gap-4 md:gap-10 mt-8 md:grid-cols-2">
            <div className="flex flex-col w-full max-w-md justify-center items-center outline outline-gray-600 rounded-md bg-gray-800 md:px-22 p-6 px-22 md:py-10">
              <div className="text-xl">Total Spent</div>
              <div className="text-4xl mt-3">{insights?.totalSpent}</div>
            </div>
            <div className="flex flex-col w-full max-w-md justify-center items-center outline outline-gray-600 rounded-md bg-gray-800 md:px-22 p-6 md:py-10">
              <div className="text-xl">Monthly Spent</div>
              <div className="text-4xl mt-3">{insights?.monthlySpent}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlays */}
      {(isOpen || transferIsOpen) && (
        <div className="fixed inset-0 backdrop-blur-sm z-40"></div>
      )}
      {isOpen && (
        <div className="fixed z-50 top-1/6 left-1/2 transform -translate-x-1/2">
          <Modal
            operationType={operationType}
            fetchData={fetchData}
            setOpen={setOpen}
          />
        </div>
      )}
      {transferIsOpen && (
        <div className="fixed z-50 top-1/4 left-1/2 transform -translate-x-1/2">
          <TransferModal setOpen={setTransferOpen} fetchData={fetchData} />
        </div>
      )}
    </div>
  );
}
