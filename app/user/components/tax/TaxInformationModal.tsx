// TaxInformationModal.tsx
import React, { useState } from 'react';
import { Modal, Button, Table } from 'antd';

interface TaxInformation {
    key: string;
    name: string;
    address: string;
    phone: string;
    taxId: string;
    customerType: string;
    document: string;
    action: string;
}

interface TaxInformationModalProps {
    visible: boolean;
    onClose: () => void;
    onAddNewEntry: () => void;
    onSelect: (selectedTaxInfo: TaxInformation | null) => void; // To handle selected row data
}

const TaxInformationModal: React.FC<TaxInformationModalProps> = ({ visible, onClose, onAddNewEntry, onSelect }) => {
    const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
    const [selectedTaxInfo, setSelectedTaxInfo] = useState<TaxInformation | null>(null);

    const columns = [
        { title: 'นาม', dataIndex: 'name', key: 'name', align: 'center' as const },
        { title: 'ที่อยู่', dataIndex: 'address', key: 'address', align: 'center' as const },
        { title: 'เบอร์โทรศัพท์', dataIndex: 'phone', key: 'phone', align: 'center' as const },
        { title: 'เลขผู้เสียภาษี', dataIndex: 'taxId', key: 'taxId', align: 'center' as const },
        { title: 'ประเภทลูกค้า', dataIndex: 'customerType', key: 'customerType', align: 'center' as const },
        { title: 'เอกสาร', dataIndex: 'document', key: 'document', align: 'center' as const },
        { title: 'จัดการ', dataIndex: 'action', key: 'action', align: 'center' as const },
    ];

    // Sample data (use actual data source if available)
    const data: TaxInformation[] = [
        {
            key: '1',
            name: 'บริษัท เอ็กแซมเพิล',
            address: '123/45 ถนนตัวอย่าง, กรุงเทพฯ',
            phone: '0812345678',
            taxId: '1234567890123',
            customerType: 'บริษัท',
            document: 'ใบรับรอง',
            action: 'จัดการ',
        },
    ];

    // Row selection configuration
    const rowSelection = {
        selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
        hideSelectAll: true, // Hide the select-all checkbox in the header
        onSelect: (record: TaxInformation, selected: boolean) => {
            if (selected) {
                setSelectedRowKey(record.key);
                setSelectedTaxInfo(record);
            } else {
                setSelectedRowKey(null);
                setSelectedTaxInfo(null);
            }
        },
    };

    const handleConfirm = () => {
        onSelect(selectedTaxInfo); // Pass selected data to parent component
        onClose(); // Close the modal
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>เลือกข้อมูลผู้เสียภาษี หรือ ใบรับรองบริษัท</span>
                    <Button type="primary" onClick={onAddNewEntry}>เพิ่มข้อมูล</Button>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleConfirm}>
                    OK
                </Button>,
            ]}
            width={800}
            closable={false} // Hides the close button
        >
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
                size="small"
                bordered
                rowClassName={(record) => (record.key === selectedRowKey ? 'selected-row' : '')}
                locale={{ emptyText: 'No Data' }}
            />
        </Modal>
    );
};

export default TaxInformationModal;
