import React, { useState } from 'react';
import { Modal, Button, Table } from 'antd';

interface Address {
    key: string;
    name: string;
    address: string;
    province: string;
    districts: string;
    subdistricts: string;
    postalCode: string;
    phone: string;
}

interface AddressBookModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (selectedAddress: Address | null) => void; // `null` for deselecting
    onAddNewAddress: () => void;
}

const AddressBookModal: React.FC<AddressBookModalProps> = ({ visible, onClose, onSelect, onAddNewAddress}) => {
    const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    const columns = [
        { title: 'ชื่อ - สกุล', dataIndex: 'name', key: 'name', align: 'center' as const },
        { title: 'ที่อยู่', dataIndex: 'address', key: 'address', align: 'center' as const },
        { title: 'จังหวัด', dataIndex: 'province', key: 'province', align: 'center' as const },
        { title: 'อำเภอ', dataIndex: 'districts', key: 'districts', align: 'center' as const },
        { title: 'ตำบล', dataIndex: 'subdistricts', key: 'subdistricts', align: 'center' as const },
        { title: 'รหัสไปรษณีย์', dataIndex: 'postalCode', key: 'postalCode', align: 'center' as const },
        { title: 'เบอร์โทรศัพท์', dataIndex: 'phone', key: 'phone', align: 'center' as const },
    ];

    const data: Address[] = [
        {
            key: '1',
            name: 'Mn1688',
            address: '206/76 ถนนเทศบาล7',
            province: 'กระบี่',
            districts: 'คลองท่อม',
            subdistricts: 'คลองท่อมเหนือ',
            postalCode: '81120',
            phone: '0659307185',
        },
    ];

    const rowSelection = {
        selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
        hideSelectAll: true, // Hides the select-all checkbox in the header
        onSelect: (record: Address, selected: boolean) => {
            if (selected) {
                setSelectedRowKey(record.key);
                setSelectedAddress(record);
            } else {
                setSelectedRowKey(null);
                setSelectedAddress(null);
            }
        },
    };

    const handleConfirm = () => {
        onSelect(selectedAddress); // Send the selected address data to parent
        onClose(); // Close the modal
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>เลือกที่อยู่ผู้รับ</span>
                    <Button type="primary" onClick={onAddNewAddress}>เพิ่มข้อมูล</Button>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose} style={{ width: '140px' }}>
                    ยกเลิก
                </Button>,
                <Button key="submit" type="primary" onClick={handleConfirm} style={{ width: '140px' }}>
                    ตกลง
                </Button>,
            ]}
            width={950}
            closable={false} // This hides the close button
        >
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
                size="small"
                bordered
                rowClassName={(record) =>
                    record.key === selectedRowKey ? 'selected-row' : ''
                }
            />
        </Modal>

    );
};

export default AddressBookModal;
