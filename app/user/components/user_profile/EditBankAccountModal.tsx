import React, { useState, useEffect } from 'react';
import axios from 'axios';


interface BankAccount {
    _id: string;
    bank: string;
    account_name: string;
    account_number: string;
    branch: string;
  }


interface EditBankAccountModalProps {
  show: boolean;
  onClose: () => void;
  account: BankAccount;
  onSave: () => void; // Callback to refresh data after saving
}

const bankOptions = [
  { value: 'bbl', label: 'ธนาคารกรุงเทพ', image: '/storage/icon/bank/bbl.png' },
  { value: 'ktb', label: 'ธนาคารกรุงไทย', image: '/storage/icon/bank/ktb.jpg' },
  { value: 'scbb', label: 'ธนาคารไทยพาณิชย์', image: '/storage/icon/bank/scbb.jpg' },
  { value: 'gsb', label: 'ธนาคารออมสิน', image: '/storage/icon/bank/gsb.jpg' },
  { value: 'bay', label: 'ธนาคารกรุงศรีอยุธยา', image: '/storage/icon/bank/bay.png' },
  { value: 'kbank', label: 'ธนาคารกสิกรไทย', image: '/storage/icon/bank/kbank.jpg' },
  { value: 'kkp', label: 'ธนาคารเกียรตินาคินภัทร', image: '/storage/icon/bank/kkp.jpg' },
  { value: 'citi', label: 'ซิตี้แบงก์', image: '/storage/icon/bank/citi.jpg' },
  { value: 'ttb', label: 'ทีเอ็มบีธนชาต', image: '/storage/icon/bank/ttb.png' },
  { value: 'uobt', label: 'ธนาคารยูโอบี', image: '/storage/icon/bank/uobt.jpg' },
];

const EditBankAccountModal: React.FC<EditBankAccountModalProps> = ({ show, onClose, account, onSave }) => {
  const [selectedBank, setSelectedBank] = useState<string | null>(account.bank);
  const [accountName, setAccountName] = useState(account.account_name);
  const [accountNumber, setAccountNumber] = useState(account.account_number);
  const [branch, setBranch] = useState(account.branch);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state to initial values of the account when the modal opens
    setSelectedBank(account.bank);
    setAccountName(account.account_name);
    setAccountNumber(account.account_number);
    setBranch(account.branch);
  }, [account]);

  const handleBankSelect = (value: string) => {
    setSelectedBank(value);
    setShowDropdown(false);
  };

  const handleUpdateBankAccount = async () => {
    if (!selectedBank || !accountName || !accountNumber) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      const updatedAccountData = {
        bank: selectedBank,
        account_name: accountName,
        account_number: accountNumber,
        branch,
      };

      await axios.put(`http://localhost:5001/book_bank/${account._id}`, updatedAccountData);
      setError(null); // Clear any previous errors
      onSave(); // Refresh data after updating
      onClose(); // Close modal after successful update
    } catch (error) {
      console.error("Error updating bank account:", error);
      setError("Failed to update bank account. Please try again.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-medium">แก้ไขบัญชีธนาคาร</h5>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
            style={{ background: 'none', border: 'none' }}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>

        {/* Modal Body */}
        <form>
          <div className="mb-4">
            <label htmlFor="bank_name" className="block font-semibold">ธนาคาร</label>
            <div className="form-group">
              <div onClick={() => setShowDropdown(!showDropdown)} className="custom-dropdown">
                {selectedBank ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={bankOptions.find((bank) => bank.value === selectedBank)?.image}
                      alt=""
                      style={{ width: '50px', height: '50px', marginRight: '10px' }}
                    />
                    <span>{bankOptions.find((bank) => bank.value === selectedBank)?.label}</span>
                  </div>
                ) : (
                  <span>เลือกธนาคาร</span>
                )}
              </div>
              {showDropdown && (
                <div className="dropdown-options" style={{ border: '1px solid #ccc', borderRadius: '5px' }}>
                  {bankOptions.map((bank) => (
                    <div 
                      key={bank.value}
                      onClick={() => handleBankSelect(bank.value)}
                      className="dropdown-option"
                      style={{ display: 'flex', alignItems: 'center', padding: '5px' }}
                    >
                      <img
                        src={bank.image}
                        alt={bank.label}
                        style={{ width: '30px', height: '30px', marginRight: '10px' }}
                      />
                      {bank.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="account_name" className="block font-semibold">ชื่อบัญชี</label>
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
            <label htmlFor="account_number" className="block font-semibold">เลขที่บัญชี</label>
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
            <label htmlFor="branch" className="block font-semibold">สาขา</label>
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
            onClick={handleUpdateBankAccount}
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBankAccountModal;
