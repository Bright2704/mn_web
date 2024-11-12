"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "../../../../styles/globals.css";

type Balance = {
  user_id: string;
  balance_id: string;
  balance_date: string;
  balance_type: string;
  balance_descri: string;
  balance_amount: number;
  balance_total: number;
};

const balance_type = [
  { label: "สถานะทั้งหมด", value: "all" },
  { label: "เติมเงิน", value: "deposit" },
  { label: "ถอนเงิน", value: "withdraw" },
  { label: "ชำระค่านำเข้า", value: "export_price" },
  { label: "ค่าสินค้า", value: "product_price" },
  { label: "ส่วนต่างค่าขนส่งในไทย", value: "thaitrans_price" },
  { label: "ค่าสินค้าใน MALL", value: "mall_price" },
];

const BalancePage: React.FC = () => {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0); // State for total amount
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    // Fetch balances from the API
    axios
      .get("http://localhost:5000/balances")
      .then((response) => {
        const fetchedBalances: Balance[] = response.data;
        setBalances(fetchedBalances);
        // Calculate totalAmount as the latest balance_total
        if (fetchedBalances.length > 0) {
          const latestBalanceTotal =
            fetchedBalances[fetchedBalances.length - 1].balance_total;
          setTotalAmount(latestBalanceTotal);
        }
      })
      .catch((error) => {
        console.error("Error fetching balances:", error);
      });
  }, []);

  const handleManageClick = (balanceId: string) => {
    // Placeholder for managing a balance
    console.log("Manage balance ID:", balanceId);
  };

  return (
    <div className="card">
      <div className="d-lg-flex justify-between items-center px-2 py-2 mt-2 mb-2">
        <h3 className="font-weight-bolder text-lg font-semibold">สมุดบัญชี</h3>
        <div className="d-flex align-items-center" style={{ gap: "24px" }}>
          {/* Total Amount Information */}
          <div>
            {/* Action Buttons */}
            <div className="d-flex align-items-center" style={{ gap: "20px" }}>
              <p
                className="mb-1"
                style={{ color: "#198754", fontSize: "24px" }}
              >
                ยอดเงินในระบบ{" "}
              </p>
              <div className="bg-light p-2 rounded">
                <h5
                  className="mb-0"
                  style={{ color: "#198754", fontSize: "30px" }}
                >
                  {totalAmount.toLocaleString()} ฿
                </h5>
              </div>
              <a href="/user/wallet/deposit">
                <button type="button" className="btn btn-primary">
                  <span>เติมเงิน</span>
                </button>
              </a>
              <a href="/user/wallet/withdraw">
                <button type="button" className="btn btn-secondary">
                  <span>ถอนเงิน</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="nav-panel">
        <div className="anan-tabs__nav">
          <div
            className="anan-tabs__nav-warp px-2 table-container"
            style={{ marginTop: "5px" }}
          >
            <div className="anan-tabs__nav-tabs">
              {balance_type.map((type) => (
                <div
                  key={type.value}
                  className={`anan-tabs__nav-tab ${
                    selectedType === type.value ? "active" : ""
                  }`}
                  onClick={() => setSelectedType(type.value)}
                >
                  <span>{type.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 table-container">
        <table className="table table-width-1">
          <thead>
            <tr className="text-center">
              <th>หมายเลข</th>
              <th>วันที่ทำรายการ</th>
              <th>ประเภท</th>
              <th>รายละเอียด</th>
              <th>จำนวน</th>
              <th>คงเหลือ</th>
            </tr>
          </thead>
          <tbody>
            {balances.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-3">
                  No balances found.
                </td>
              </tr>
            ) : (
              balances
                .filter(
                  (balance) =>
                    selectedType === "all" ||
                    balance.balance_type === selectedType
                )
                .map((balance) => (
                  <tr key={balance.balance_id}>
                    <td>{balance.balance_id}</td>
                    <td>{balance.balance_date}</td>

                    <td>
                      {(() => {
                        const types = balance_type.find(
                          (s) => s.value === balance.balance_type
                        );
                        return types ? types.label : balance.balance_type;
                      })()}
                    </td>
                    <td>{balance.balance_descri}</td>
                    <td>{balance.balance_amount.toLocaleString()}</td>
                    <td>{balance.balance_total.toLocaleString()}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
        <div className="demo-spacing-0 d-flex justify-content-end">
          <ul className="pagination mb-0">
            {/* Add pagination controls here */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BalancePage;
