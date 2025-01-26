import React, { useEffect, useState } from "react";
import TransactionTable from "./TransactionTable";
import { axiosClient } from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const transactionsRes = await axiosClient.get("/wallet/transactions");

      setTransactions(transactionsRes.data);
    }
    fetchData();
  }, []);

  const handleFilter = (filterType) => {
    setSelectedFilter(filterType);

    let filteredData;
    if (filterType === "date") {
      filteredData = [...transactions].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (filterType === "amount") {
      filteredData = [...transactions].sort((a, b) => b.amount - a.amount);
    } else if (filterType === "type") {
      filteredData = [...transactions].sort((a, b) =>
        a.type.localeCompare(b.type)
      );
    }

    setFilteredTransactions(filteredData);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-8 p-5 md:p-0">
      <div
        onClick={() => navigate("/")}
        className="flex fixed left-4 md:left-15 top-4 md:top-10 gap-3 text-xl cursor-pointer hover:text-blue-500"
      >
        <FaArrowLeftLong className="my-auto" />
        <div>Dashboard</div>
      </div>

      <div className="flex gap-4 mt-10 items-center justify-center">
        <div className="text-center my-auto">Filter By - </div>
        <button
          onClick={() => handleFilter("date")}
          className={`p-2 rounded-md px-4 md:px-7 cursor-pointer ${
            selectedFilter === "date" ? "bg-blue-700" : "bg-blue-500"
          }`}
        >
          Date
        </button>
        <button
          onClick={() => handleFilter("amount")}
          className={`p-2 rounded-md px-4 md:px-7 cursor-pointer ${
            selectedFilter === "amount" ? "bg-blue-700" : "bg-blue-500"
          }`}
        >
          Amount
        </button>
        <button
          onClick={() => handleFilter("type")}
          className={`p-2 rounded-md px-4 md:px-7 cursor-pointer ${
            selectedFilter === "type" ? "bg-blue-700" : "bg-blue-500"
          }`}
        >
          Type
        </button>
      </div>

      <div className="mt-8 w-full sm:w-[80vw] h-auto sm:h-[80vh] overflow-x-auto">
        {filteredTransactions.length > 0 ? (
          <TransactionTable transactions={filteredTransactions} />
        ) : (
          <TransactionTable transactions={transactions} />
        )}
      </div>
    </div>
  );
}

export default Transaction;
