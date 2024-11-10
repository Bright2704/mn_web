import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import AddBankAccountModal from './AddBankAccountModal';
import EditBankAccountModal from './EditBankAccountModal';

interface BankAccount {
    _id: string;
    bank: string;
    account_name: string;
    account_number: string;
    branch: string;
  }
  
  interface BankBookModalProps {
    show: boolean;
    onClose: () => void;
    onSelectBank: (bankAccount: BankAccount) => void;
  }

  const BankBookModal: React.FC<BankBookModalProps> = ({ show, onClose, onSelectBank }) => {
    const [showAddBankModal, setShowAddBankModal] = useState(false);
    const [showEditBankModal, setShowEditBankModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  
    useEffect(() => {
      const fetchSession = async () => {
        const session = await getSession();
        if (session?.user) {
          const userId = (session.user as { user_id?: string }).user_id;
          if (userId) {
            setUserId(userId);
            fetchBankAccounts(userId);
          } else {
            console.error('User ID not found in session');
          }
        }
      };
  
      fetchSession();
    }, []);

    const fetchBankAccounts = async (userId: string) => {
        try {
          const response = await axios.get(`http://localhost:5000/book_bank/user/${userId}`);
          setBankAccounts(response.data);
        } catch (error) {
          console.error('Error fetching bank accounts:', error);
        }
      };
    
      const handleDelete = async (accountId: string) => {
        try {
          await axios.delete(`http://localhost:5000/book_bank/${accountId}`);
          if (userId) fetchBankAccounts(userId);
        } catch (error) {
          console.error('Error deleting bank account:', error);
        }
      };

      const handleConfirm = () => {
        if (selectedAccount) {
          onSelectBank(selectedAccount);
          onClose();
        }
      };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-xl font-medium">เลือกบัญชีธนาคาร</h5>
          <button
            className="btn btn-success px-4 mr-2"
            onClick={() => setShowAddBankModal(true)}
          >
            เพิ่มบัญชีธนาคาร
          </button>
        </div>

        <div className="p-4">
          <table className="table table-bordered w-full text-center">
            <thead>
              <tr>
                <th></th>
                <th>ชื่อธนาคาร</th>
                <th>ชื่อบัญชี</th>
                <th>เลขที่บัญชี</th>
                <th>สาขา</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {bankAccounts.map((account) => (
                <tr key={account._id}>
                  <td>
                    <input
                      type="radio"
                      name="bankSelection"
                      checked={selectedAccount?._id === account._id}
                      onChange={() => setSelectedAccount(account)}
                    />
                  </td>
                  <td>{account.bank}</td>
                  <td>{account.account_name}</td>
                  <td>{account.account_number}</td>
                  <td>{account.branch}</td>
                  <td>
                    <button
                      type="button"
                      className="text-blue-600"
                      onClick={() => {
                        setSelectedAccount(account);
                        setShowEditBankModal(true);
                      }}
                    >
                      แก้ไข
                    </button>
                    <button
                      type="button"
                      className="text-red-600 ml-2"
                      onClick={() => handleDelete(account._id)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
              {bankAccounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center">No bank accounts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end p-4 border-t">
          <button type="button" className="btn btn-secondary mr-2" onClick={onClose}>
            ยกเลิก
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleConfirm}
            disabled={!selectedAccount}
          >
            ตกลง
          </button>
        </div>

        {/* Add and Edit Modals */}
        <AddBankAccountModal
          show={showAddBankModal}
          onClose={() => {
            setShowAddBankModal(false);
            if (userId) fetchBankAccounts(userId);
          }}
        />
        {selectedAccount && (
          <EditBankAccountModal
            show={showEditBankModal}
            onClose={() => setShowEditBankModal(false)}
            account={selectedAccount}
            onSave={() => fetchBankAccounts(userId!)}
          />
        )}
      </div>
    </div>
  );
};

export default BankBookModal;
