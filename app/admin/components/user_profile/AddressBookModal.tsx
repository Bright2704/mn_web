import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import AddAddressModal from './AddAddressModal';
import EditAddressModal from './EditAddressModal';


interface User {
    user_id: string;
    name: string;
    phone?: string;
  }
  
  interface Address {
    _id: string;
    name: string;
    address: string;
    province: string;
    districts: string;
    subdistricts: string;
    postalCode: string;
    phone: string;
  }

  interface AddressBookModalProps {
    show: boolean;
    onClose: () => void;
    onSelectAddress: (address: Address) => void;
    selectedUser: User | null;
  }

  const AddressBookModal: React.FC<AddressBookModalProps> = ({
    show, onClose, onSelectAddress, selectedUser
  }) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [showEditAddressModal, setShowEditAddressModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
    useEffect(() => {
      if (selectedUser?.user_id) {
        fetchAddresses();
      }
    }, [selectedUser]);

    

    const fetchAddresses = async () => {
        try {
          if (selectedUser?.user_id) {
            const response = await axios.get(`http://localhost:5000/book_address/user/${selectedUser.user_id}`);
            setAddresses(response.data);
          }
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
      };
    
      const handleDelete = async (addressId: string) => {
        try {
          await axios.delete(`http://localhost:5000/book_address/${addressId}`);
          fetchAddresses();
        } catch (error) {
          console.error('Error deleting address:', error);
        }
      };

    const handleConfirm = () => {
        if (selectedAddress) {
            onSelectAddress(selectedAddress);
            onClose();
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h5 className="text-xl font-medium">เลือกที่อยู่ผู้รับ</h5>
                    <button
                        className="btn btn-success px-4 mr-2"
                        onClick={() => setShowAddAddressModal(true)}
                    >
                        เพิ่มที่อยู่
                    </button>
                </div>

                <div className="p-4">
                    <table className="table table-bordered w-full text-center">
                        <thead>
                            <tr>
                                <th></th>
                                <th>ชื่อ - สกุล</th>
                                <th>ที่อยู่</th>
                                <th>จังหวัด</th>
                                <th>อำเภอ</th>
                                <th>ตำบล</th>
                                <th>รหัสไปรษณีย์</th>
                                <th>เบอร์โทรศัพท์</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {addresses.map((address) => (
                                <tr key={address._id}>
                                    <td>
                                        <input
                                            type="radio"
                                            name="addressSelection"
                                            checked={selectedAddress?._id === address._id}
                                            onChange={() => setSelectedAddress(address)}
                                        />
                                    </td>
                                    <td>{address.name}</td>
                                    <td>{address.address}</td>
                                    <td>{address.province}</td>
                                    <td>{address.districts}</td>
                                    <td>{address.subdistricts}</td>
                                    <td>{address.postalCode}</td>
                                    <td>{address.phone}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="text-blue-600"
                                            onClick={() => {
                                                setSelectedAddress(address);
                                                setShowEditAddressModal(true);
                                            }}
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            type="button"
                                            className="text-red-600 ml-2"
                                            onClick={() => handleDelete(address._id)}
                                        >
                                            ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {addresses.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="text-center">No addresses found.</td>
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
                        disabled={!selectedAddress}
                    >
                        ตกลง
                    </button>
                </div>
                {/* Add modals at the bottom of your JSX */}
                <AddAddressModal
        show={showAddAddressModal}
        onClose={() => {
          setShowAddAddressModal(false);
          fetchAddresses();
        }}
        selectedUserId={selectedUser?.user_id || null}
      />
      {selectedAddress && (
        <EditAddressModal
          show={showEditAddressModal}
          onClose={() => setShowEditAddressModal(false)}
          address={selectedAddress}
          onSave={fetchAddresses}
          selectedUserId={selectedUser?.user_id || null}
        />
      )}
            </div>
        </div>
    );
};

export default AddressBookModal;