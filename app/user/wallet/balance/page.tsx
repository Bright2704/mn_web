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
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const itemsPerPageOptions = [5, 10, 15, 25, 50, 100];

  useEffect(() => {
    axios
      .get("http://localhost:5001/balances")
      .then((response) => {
        const fetchedBalances: Balance[] = response.data;
        setBalances(fetchedBalances);
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

  // Pagination logic
  const filteredBalances = balances.filter(
    (balance) => selectedType === "all" || balance.balance_type === selectedType
  );
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBalances.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBalances.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center px-2 py-2 mt-2 mb-2">
        <h3 className="font-weight-bolder text-lg font-semibold">สมุดบัญชี</h3>
        <div className="d-flex align-items-center" style={{ gap: "24px" }}>
          <div>
            <div 
              className="d-flex align-items-center px-5 py-3 rounded-2xl" 
              style={{
                gap: "20px",
                backgroundColor: "#f8d7da",
                boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)"
              }}
            >
              <p
                className="mb-1"
                style={{ color: "#721c24", fontSize: "24px" }}
              >
                ยอดเงินในระบบ{" "}
              </p>
              <div className="bg-light p-2 rounded">
                <h5
                  className="mb-0"
                  style={{ color: "#721c24", fontSize: "30px" }}
                >
                  {totalAmount.toLocaleString()} ฿
                </h5>
              </div>
              <div 
                className="flex flex-row ml-2" 
                style={{ boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)" }}
              >
                <a href="/user/wallet/deposit">
                  <button
                    type="button"
                    className="transition-all duration-200 text-white bg-blue-600 px-3 py-2 hover:bg-blue-800"
                    style={{ borderRadius: "10px 0 0 10px" }}
                  >
                    <span>+ เติมเงินเข้าระบบ</span>
                  </button>
                </a>
                <a href="/user/wallet/withdraw">
                  <button
                    type="button"
                    className="transition-all duration-200 text-white bg-red-600 px-3 py-2 hover:bg-red-800"
                    style={{ borderRadius: "0 10px 10px 0" }}
                  >
                    <span>- ถอนเงินออกจากระบบ</span>
                  </button>
                </a>
              </div>
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <span className="mr-2">แสดง</span>
            <select
              className="form-select mx-2"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              style={{ 
                width: "80px",
                padding: "0.375rem 1.75rem 0.375rem 0.75rem",
                border: "1px solid #dee2e6",
                borderRadius: "0.25rem"
              }}
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <span>รายการ</span>
          </div>
        </div>

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
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-3">
                  ไม่พบข้อมูล
                </td>
              </tr>
            ) : (
              currentItems.map((balance) => (
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

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted">
            แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, filteredBalances.length)} จาก {filteredBalances.length} รายการ
          </div>
          <ul className="pagination mb-0" role="menubar" aria-label="Pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                role="menuitem"
                aria-label="Go to previous page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            </li>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
              ) {
                return (
                  <li
                    key={pageNumber}
                    className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                    role="presentation"
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNumber)}
                      role="menuitemradio"
                      aria-label={`Go to page ${pageNumber}`}
                      aria-checked={currentPage === pageNumber}
                      aria-posinset={pageNumber}
                      aria-setsize={totalPages}
                    >
                      {pageNumber}
                    </button>
                  </li>
                );
              } else if (
                pageNumber === currentPage - 3 ||
                pageNumber === currentPage + 3
              ) {
                return (
                  <li key={pageNumber} className="page-item disabled" role="separator">
                    <span className="page-link">...</span>
                  </li>
                );
              }
              return null;
            })}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                role="menuitem"
                aria-label="Go to next page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .page-link {
          cursor: pointer;
          padding: 0.5rem 0.75rem;
          margin: 0 2px;
          border: 1px solid #dee2e6;
          background-color: #fff;
          color: #007bff;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 38px;
        }

        .page-item.active .page-link {
          background-color: #007bff;
          border-color: #007bff;
          color: white;
        }

        .page-item.disabled .page-link {
          cursor: not-allowed;
          opacity: 0.6;
          background-color: #e9ecef;
          border-color: #dee2e6;
          color: #6c757d;
        }

        .page-item:first-child .page-link,
        .page-item:last-child .page-link {
          min-width: 40px;
        }

        .form-select:focus {
          border-color: #80bdff;
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .pagination {
          display: flex;
          padding-left: 0;
          list-style: none;
          border-radius: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default BalancePage;