import React from 'react';
import { Tag, Space } from 'antd';

// Define a type for the color legend items
type LegendItem = {
    label: string;
    color: string;
};

const StatusStyle: React.FC = () => {
    // Array of items for the color legend
    const legendItems: LegendItem[] = [
        { label: 'เช็คสินค้า / ตีลังไม้', color: 'rgb(249, 255, 165)' },
        { label: 'เช็คสินค้า', color: 'rgb(165, 255, 197)' },
        { label: 'ตีลัง', color: 'rgb(255, 223, 165)' },
    ];

    return (
        <div className="text-center" style={{ marginTop: '12px' }}>
            <div style={{ marginBottom: '8px' }}>สัญลักษณ์ของแถบสีคือ</div>
            <Space className="ant-space-horizontal ant-space-align-center" style={{ gap: '4px' }}>
                {legendItems.map(item => (
                    <div className="ant-space-item" key={item.label}>
                        <span style={{backgroundColor : item.color}} className="px-2 mx-2 rounded-xl ant-tag ant-tag-has-color text-black md:text-center">
                            {item.label}
                        </span>
                    </div>
                ))}
            </Space>
        </div>
    );
};

export default StatusStyle;