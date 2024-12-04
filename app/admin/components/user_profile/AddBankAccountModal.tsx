import React, { useState, useEffect } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";

interface AddBankAccountModalProps {
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

const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({
  show,
  onClose,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const userId = (session.user as { user_id?: string }).user_id;
        if (userId) {
          setUserId(userId);
        } else {
          console.error("User ID not found in session");
        }
      }
    };

    fetchSession();
  }, []);

  const handleBankSelect = (value: string) => {
    setSelectedBank(value);
    setShowDropdown(false);
  };

  const handleSaveBankAccount = async () => {
    if (!selectedBank || !accountName || !accountNumber) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      const bankAccountData = {
        user_id: userId, // Ensure this is defined
        bank: selectedBank,
        account_name: accountName,
        account_number: accountNumber,
        branch: branch,
      };

      await axios.post("http://localhost:5001/book_bank", bankAccountData);
      setError(null); // Clear any previous errors
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error("Error saving bank account:", error);
      setError("Failed to save bank account. Please try again.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-medium">เพิ่มบัญชีธนาคาร</h5>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
            style={{ background: "none", border: "none" }}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>

        {/* Modal Body */}
        <form>
          <div className="mb-4">
            <label htmlFor="bank_name" className="block font-semibold">
              ธนาคาร
            </label>
            <div className="form-group">
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="custom-dropdown"
              >
                {selectedBank ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={
                        bankOptions.find((bank) => bank.value === selectedBank)
                          ?.image
                      }
                      alt=""
                      style={{
                        width: "50px",
                        height: "50px",
                        marginRight: "10px",
                      }}
                    />
                    <span>
                      {
                        bankOptions.find((bank) => bank.value === selectedBank)
                          ?.label
                      }
                    </span>
                  </div>
                ) : (
                  <span>เลือกธนาคาร</span>
                )}
              </div>
              {showDropdown && (
                <div
                  className="dropdown-options"
                  style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                >
                  {bankOptions.map((bank) => (
                    <div
                      key={bank.value}
                      onClick={() => handleBankSelect(bank.value)}
                      className="dropdown-option"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "5px",
                      }}
                    >
                      <img
                        src={bank.image}
                        alt={bank.label}
                        style={{
                          width: "30px",
                          height: "30px",
                          marginRight: "10px",
                        }}
                      />
                      {bank.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="account_name" className="block font-semibold">
              ชื่อบัญชี
            </label>
            <input
              type="text"
              id="account_name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="กรอกชื่อบัญชี"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="account_number" className="block font-semibold">
              เลขที่บัญชี
            </label>
            <input
              type="text"
              id="account_number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="กรอกเลขที่บัญชี"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="branch" className="block font-semibold">
              สาขา
            </label>
            <input
              type="text"
              id="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="กรอกสาขา"
            />
          </div>
        </form>

        {/* Display error message if any */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Modal Footer */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={onClose}
          >
            ยกเลิก
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveBankAccount}
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBankAccountModal;
