import React, { useState } from "react";
import { axiosClient } from "../utils/axiosClient";
import { RxCross2 } from "react-icons/rx";
function Modal({ operationType, fetchData, setOpen }) {
  const [amount, setAmount] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    try {
      setErrorMessage("");
      if (operationType === "Top Up") {
        await axiosClient.post("/wallet/add", { amount: Number(amount) });
      } else {
        await axiosClient.post("/wallet/withdraw", { amount: Number(amount) });
      }
      setAmount("");
      fetchData();
      setOpen(false);
    } catch (e) {
      console.log(e);
      setErrorMessage(e.response.data.error);
    }
  };

  return (
    <div className="my-4 flex flex-col gap-15 w-80 h-84 bg-gray-800 p-10 outline outline-gray-700 rounded-md">
      <RxCross2
        onClick={() => setOpen(false)}
        className=" text-white absolute right-3 top-7 text-xl cursor-pointer"
      />
      <div className="text-red-900  text-center">{errorMessage}</div>
      <div className="flex flex-col items-center justify-center font-bold text-4xl">
        <div className=" text-lg font-normal">Enter Amount</div>
        <input
          type=""
          className=" mt-5 border-none focus:outline-none placeholder-gray-600 bg-transparent text-center"
          autoFocus
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded cursor-pointer"
      >
        {operationType}
      </button>
    </div>
  );
}

export default Modal;
