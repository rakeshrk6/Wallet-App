import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { axiosClient } from "../utils/axiosClient";
import toast from "react-hot-toast";

function TransferModal({ setOpen, fetchData }) {
  const [amount, setAmount] = useState("");
  const [recipientEmail, setRecipientMail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit() {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setErrorMessage("Please enter a valid amount greater than 0.");
      return;
    }

    try {
      setErrorMessage("");
      const res = await axiosClient.post("/wallet/transfer", {
        recipientEmail,
        amount: Number(amount),
      });
      setAmount("");
      fetchData();
      setOpen(false);
      toast.success("Money Sent", {
        duration: 3000,
        style: {
          padding: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (e) {
      console.error(e);
      setErrorMessage(e.response.data.message);
    }
  }

  return (
    <div className="relative my-4 flex flex-col gap-6 w-80 h-88 bg-gray-800 py-10 px-8 outline outline-gray-700 rounded-md">
      <RxCross2
        onClick={() => setOpen(false)}
        className="text-white absolute right-3 top-3 text-xl cursor-pointer"
      />

      <div className="text-red-500 text-sm mb-4 text-center">
        {errorMessage}
      </div>

      <input
        type="email"
        className="border border-gray-600 rounded-sm px-5 py-1.5 bg-gray-900 text-white"
        value={recipientEmail}
        onChange={(e) => setRecipientMail(e.target.value)}
        placeholder="Enter recipient's email"
      />

      <div className="flex flex-col items-center justify-center font-bold text-4xl">
        <div className="text-lg font-normal text-white">Enter Amount</div>
        <input
          type=""
          className=" mt-6 border-none focus:outline-none placeholder-gray-600 bg-transparent text-center"
          autoFocus
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        className={`bg-blue-500 text-white p-2 rounded mt-4 ${
          !recipientEmail || !amount || Number(amount) <= 0
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        disabled={!recipientEmail || !amount || Number(amount) <= 0}
      >
        Send Money
      </button>
    </div>
  );
}

export default TransferModal;
