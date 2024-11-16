import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import AddAddressModal from './AddAddressModal';
import EditAddressModal from './EditAddressModal';


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
}

const AddressBookModal: React.FC<AddressBookModalProps> = ({ show, onClose, onSelectAddress }) => {
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [showEditAddressModal, setShowEditAddressModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession();
            if (session?.user) {
                const userId = (session.user as { user_id?: string }).user_id;
                if (userId) {
                    setUserId(userId);
                    fetchAddresses(userId);
                }
            }
        };
        fetchSession();
    }, []);

    const fetchAddresses = async (userId: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/book_address/user/${userId}`);
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleDelete = async (addressId: string) => {
        try {
            await axios.delete(`http://localhost:5000/book_address/${addressId}`);
            if (userId) fetchAddresses(userId);
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
                        if (userId) fetchAddresses(userId);
                    }}
                />
                {selectedAddress && (
                    <EditAddressModal
                        show={showEditAddressModal}
                        onClose={() => setShowEditAddressModal(false)}
                        address={selectedAddress}
                        onSave={() => fetchAddresses(userId!)}
                    />
                )}
            </div>
        </div>
    );
};

export default AddressBookModal;