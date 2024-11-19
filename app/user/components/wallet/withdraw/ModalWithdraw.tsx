import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import BankSelectionModal from "../../../components/user_profile/BankBookModal";
import axios from 'axios';

interface BankAccount {
  _id: string;
  bank: string;
  account_name: string;
  account_number: string;
  branch: string;
}

interface WithdrawData {
  user_id: string;
  bank: string;
  account_name: string;
  account_number: string;
  branch: string;
  withdraw_amount: number;
}

interface ModalWithdrawProps {
  show: boolean;
  onClose: () => void;
}

const bankOptions = [
  { value: "bbl", label: "ธนาคารกรุงเทพ", image: "/storage/icon/bank/bbl.png" },
  { value: "ktb", label: "ธนาคารกรุงไทย", image: "/storage/icon/bank/ktb.jpg" },
  {
    value: "scbb",
    label: "ธนาคารไทยพาณิชย์",
    image: "/storage/icon/bank/scbb.jpg",
  },
  { value: "gsb", label: "ธนาคารออมสิน", image: "/storage/icon/bank/gsb.jpg" },
  {
    value: "bay",
    label: "ธนาคารกรุงศรีอยุธยา",
    image: "/storage/icon/bank/bay.png",
  },
  {
    value: "kbank",
    label: "ธนาคารกสิกรไทย",
    image: "/storage/icon/bank/kbank.jpg",
  },
  {
    value: "kkp",
    label: "ธนาคารเกียรตินาคินภัทร",
    image: "/storage/icon/bank/kkp.jpg",
  },
  { value: "citi", label: "ซิตี้แบงก์", image: "/storage/icon/bank/citi.jpg" },
  { value: "ttb", label: "ทีเอ็มบีธนชาต", image: "/storage/icon/bank/ttb.png" },
  {
    value: "uobt",
    label: "ธนาคารยูโอบี",
    image: "/storage/icon/bank/uobt.jpg",
  },
];

const ModalWithdraw: React.FC<ModalWithdrawProps> = ({ show, onClose }) => {
  const [amount, setAmount] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showBankModal, setShowBankModal] = useState<boolean>(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const userId = (session.user as { user_id?: string }).user_id;
        setUserId(userId || null);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get('http://localhost:5000/balances');
        const fetchedBalances = response.data;
        if (fetchedBalances.length > 0) {
          const latestBalanceTotal = fetchedBalances[fetchedBalances.length - 1].balance_total;
          setTotalAmount(latestBalanceTotal);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    if (show) {  // Only fetch when modal is shown
      fetchBalance();
    }
  }, [show]);

  if (!show) {
    return null;
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      if (!userId || !selectedBankAccount || !amount) {
        throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
      }

      const withdrawData: WithdrawData = {
        user_id: userId,
        bank: selectedBankAccount.bank,
        account_name: selectedBankAccount.account_name,
        account_number: selectedBankAccount.account_number,
        branch: selectedBankAccount.branch,
        withdraw_amount: parseFloat(amount)
      };
      
      await axios.post<WithdrawData>('http://localhost:5000/withdraws', withdrawData);
      
      // Clear form
      setAmount("");
      setSelectedBankAccount(null);
      
      // Close modal
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "เกิดข้อผิดพลาดในการทำรายการ");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("เกิดข้อผิดพลาดในการทำรายการ");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBankSelect = (bankAccount: BankAccount) => {
    setSelectedBankAccount(bankAccount);
    setShowBankModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-xl font-medium">ถอนเงินออกจากระบบ</h5>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
            style={{ background: "none", border: "none" }}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>

        <div className="p-4 md:flex-row">
          <div className="w-full">
            <form onSubmit={handleImport}>
              <div className="form-group">
                <label className="_fw-200 _fs-16">ธนาคารที่โอน</label>
                <div className="form-group mt-3">
                  <button
                    className="btn btn-secondary"
                    style={{
                      backgroundColor: "#28a745",
                      borderColor: "#28a745",
                    }}
                    type="button"
                    onClick={() => setShowBankModal(true)}
                  >
                    เลือกธนาคาร
                  </button>
                </div>
                {selectedBankAccount && (
                  <div className="mt-3">
                    <div className="flex flex-col space-y-2">
                      <div className="flex">
                        <div className="w-24 text-gray-600">ธนาคาร:</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const bank = bankOptions.find(
                                (b) => b.value === selectedBankAccount.bank
                              );
                              return bank ? (
                                <>
                                  <img
                                    src={bank.image}
                                    alt={bank.label}
                                    className="img_icon_bank"
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      objectFit: "contain",
                                    }}
                                  />
                                  <span>{bank.label}</span>
                                </>
                              ) : (
                                selectedBankAccount.bank // Fallback in case no match is found
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-24 text-gray-600">ชื่อบัญชี:</div>
                        <div className="flex-1">
                          {selectedBankAccount.account_name}
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-24 text-gray-600">เลขที่บัญชี:</div>
                        <div className="flex-1">
                          {selectedBankAccount.account_number}
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-24 text-gray-600">สาขา:</div>
                        <div className="flex-1">
                          {selectedBankAccount.branch}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="form-group mt-3">
          <label className="_fw-300 _fs-16" htmlFor="amount">
            ยอดเงินในระบบ
          </label>
          <h5 className="text-xl font-medium mt-3" style={{ color: '#198754', fontSize: '30px' }}>
            {totalAmount.toLocaleString()} ฿
          </h5>
        </div>

              <div className="form-group mt-3">
                <label className="_fw-300 _fs-16" htmlFor="amount">
                  จำนวนเงินที่ต้องการถอน
                </label>
                <input
                  className="form-control deposituser-select mt-3"
                  name="amount"
                  step="0.01"
                  id="amount"
                  type="number"
                  required
                  value={amount}
                  onChange={handleAmountChange}
                  style={{ width: "60%" }} // Adjust width as needed
                />
              </div>

              <div
                className="form-group _tal-r-lg _mgt-30"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "30px",
                }}
              >
                <button
                  className="btn btn-secondary"
                  style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
                  type="submit"
                  disabled={loading || !selectedBankAccount}
                >
                  {loading ? "บันทึก..." : "บันทึก"}
                </button>
                <button
                  className="btn btn-secondary ml-3"
                  style={{ backgroundColor: "#dc3545", borderColor: "#dc3545" }}
                  type="button"
                  onClick={onClose}
                >
                  ยกเลิก
                </button>
              </div>

              <div className="text-danger text-center mt-3">
                รายการถอนเงินออกจากระบบสามารถทำรายการได้ 1 ครั้ง/สัปดาห์
                <div>
                  โดยจะใช้ระยะเวลาในการตรวจสอบและอนุมัติยอดภายใน 2-3 วันทำการ
                  หลังจากที่ทำรายการเข้ามาในระบบ
                </div>
              </div>

              {error && <p className="text-danger">{error}</p>}
            </form>
          </div>
          {/* Bank Selection Modal */}
          <BankSelectionModal
            show={showBankModal}
            onClose={() => setShowBankModal(false)}
            onSelectBank={handleBankSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalWithdraw;
