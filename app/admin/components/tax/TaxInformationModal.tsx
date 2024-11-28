import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import AddTaxInformationModal from './AddTaxInformationModal';
import EditTaxInformationModal from './EditTaxInformationModal';

interface TaxInformation {
  _id: string;
  name: string;
  address: string;
  phone: string;
  taxId: string;
  customerType: string;
  document: string;
}

interface User {
  user_id: string;
  name: string;
  phone?: string;
 }
 

interface TaxInformationModalProps {
  show: boolean;
  onClose: () => void;
  onSelect: (selectedTax: TaxInformation) => void;
  selectedUser: User | null;
}

const TaxInformationModal: React.FC<TaxInformationModalProps> = ({
  show, onClose, onSelect, selectedUser
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTaxInfo, setSelectedTaxInfo] = useState<TaxInformation | null>(null);
  const [taxInfoList, setTaxInfoList] = useState<TaxInformation[]>([]);

  useEffect(() => {
    if (show && selectedUser?.user_id) {
      fetchTaxInfo();
    }
  }, [show, selectedUser]);


  const fetchTaxInfo = async () => {
    try {
      if (selectedUser?.user_id) {
        const response = await axios.get(`http://localhost:5000/tax_info/user/${selectedUser.user_id}`);
        setTaxInfoList(response.data);
      }
    } catch (error) {
      console.error('Error fetching tax information:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/tax_info/${id}`);
      fetchTaxInfo();
    } catch (error) {
      console.error('Error deleting tax information:', error);
    }
   };

  const handleConfirm = () => {
    if (selectedTaxInfo) {
      onSelect(selectedTaxInfo);
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-xl font-medium">เลือกข้อมูลผู้เสียภาษี</h5>
          <button
            className="btn btn-success px-4 mr-2"
            onClick={() => setShowAddModal(true)}
          >
            เพิ่มข้อมูลผู้เสียภาษี
          </button>
        </div>

        <div className="p-4">
          <table className="table table-bordered w-full text-center">
            <thead>
              <tr>
                <th></th>
                <th>ชื่อ</th>
                <th>ที่อยู่</th>
                <th>เบอร์โทรศัพท์</th>
                <th>เลขผู้เสียภาษี</th>
                <th>ประเภทลูกค้า</th>
                <th>เอกสาร</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {taxInfoList.map((info) => (
                <tr key={info._id}>
                  <td>
                    <input
                      type="radio"
                      name="taxSelection"
                      checked={selectedTaxInfo?._id === info._id}
                      onChange={() => setSelectedTaxInfo(info)}
                    />
                  </td>
                  <td>{info.name}</td>
                  <td>{info.address}</td>
                  <td>{info.phone}</td>
                  <td>{info.taxId}</td>
                  <td>{info.customerType}</td>
                  <td>
                    {info.document && (
                      <a href={`http://localhost:5000${info.document}`} target="_blank" rel="noopener noreferrer">
                        ดูเอกสาร
                      </a>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="text-blue-600"
                      onClick={() => {
                        setSelectedTaxInfo(info);
                        setShowEditModal(true);
                      }}
                    >
                      แก้ไข
                    </button>
                    <button
                      type="button"
                      className="text-red-600 ml-2"
                      onClick={() => handleDelete(info._id)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
              {taxInfoList.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center">No tax information found.</td>
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
            disabled={!selectedTaxInfo}
          >
            ตกลง
          </button>
        </div>

        <AddTaxInformationModal
        show={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          fetchTaxInfo();
        }}
        selectedUser={selectedUser}
      />
      {selectedTaxInfo && (
        <EditTaxInformationModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          taxInfo={selectedTaxInfo}
          onSave={fetchTaxInfo}
          selectedUser={selectedUser}
        />
        )}
      </div>
    </div>
  );
};

export default TaxInformationModal ;