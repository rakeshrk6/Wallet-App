import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import { axiosClient } from "../utils/axiosClient";

export default function TransactionTable({ transactions }) {
  const [emails, setEmails] = useState({});

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchEmails = async () => {
      const emailMap = {};
      for (const transaction of transactions) {
        if (transaction.sender && !emailMap[transaction.sender]) {
          emailMap[transaction.sender] = await getUserMail(transaction.sender);
        }
        if (transaction.receiver && !emailMap[transaction.receiver]) {
          emailMap[transaction.receiver] = await getUserMail(
            transaction.receiver
          );
        }
      }
      setEmails(emailMap);
    };

    fetchEmails();
  }, [transactions]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontSize: 18,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  async function getUserMail(userId) {
    const res = await axiosClient.post("/wallet/userMail", {
      userId,
    });
    return res.data.mail;
  }

  if (isMobile) {
    // Mobile View Table
    return (
      <div className="flex flex-col gap-4 w-full">
        {transactions.map((row) => {
          const date = new Date(row.createdAt).toLocaleString();
          const updatedTimestamp = date.substring(0, date.lastIndexOf(":"));

          const mail =
            row.type === "debit"
              ? emails[row.receiver] || "NA"
              : emails[row.sender] || "NA";
          return (
            <div
              key={row._id}
              className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-md"
            >
              <div className="flex justify-between">
                <span className="font-bold text-gray-500">Date:</span>
                <span>{updatedTimestamp}</span>
              </div>
              <div className="flex justify-between">
                <span
                  className={`font-bold ${
                    row.type === "debit" ? "text-red-500" : "text-green-500"
                  }`}
                >
                  Amount:
                </span>
                <span>
                  {row.type === "debit" ? "-" : "+"} ₹{row.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-500">Type:</span>
                <span>{row.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-500">
                  {row.type === "debit" ? "Receiver" : "Sender"}:
                </span>
                <span>{mail}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop View Table
  return (
    <TableContainer className="text-xl" component={Paper}>
      <Table sx={{ overflow: "auto" }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell
              align="center"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              Date
            </StyledTableCell>
            <StyledTableCell
              align="center"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              Amount (₹)
            </StyledTableCell>
            <StyledTableCell
              align="center"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              Type
            </StyledTableCell>
            <StyledTableCell
              align="center"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              Sender/Receiver
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((row) => {
            const date = new Date(row.createdAt).toLocaleString();
            const updatedTimestamp = date.substring(0, date.lastIndexOf(":"));

            const mail =
              row.type === "debit"
                ? emails[row.receiver] || "NA"
                : emails[row.sender] || "NA";
            return (
              <StyledTableRow key={row._id}>
                <StyledTableCell align="center" component="th" scope="row">
                  {updatedTimestamp}
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    color:
                      row.type === "debit"
                        ? "red"
                        : row.type === "credit"
                        ? "green"
                        : "inherit",
                  }}
                  align="center"
                >
                  {row.type === "debit" ? "-" : "+"} ₹{row.amount}
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    color:
                      row.type === "debit"
                        ? "red"
                        : row.type === "credit"
                        ? "green"
                        : "inherit",
                  }}
                  align="center"
                >
                  {row.type}
                </StyledTableCell>
                <StyledTableCell align="center">{mail}</StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
