import React from 'react';
import { Table } from 'antd';

interface TrackingData {
    tracking_id: string;
    weight: number;
    wide: number;
    high: number;
    long: number;
    number: number;
    lot_id: string;
    user_id: string;
    type_item: string;
    image_item_paths: string[];
}

interface TrackingTableProps {
    trackingData: TrackingData[];
    calculateVolume: (wide: number, long: number, high: number) => number;
}

const TrackingTable: React.FC<TrackingTableProps> = ({ trackingData, calculateVolume }) => {
    const columns = [
        {
            title: 'Tracking ID',
            dataIndex: 'tracking_id',
            key: 'tracking_id',
        },
        {
            title: 'Volume',
            render: (record: TrackingData) =>
                calculateVolume(record.wide, record.long, record.high).toFixed(2) + ' m³',
        },
        {
            title: 'Item Type',
            dataIndex: 'type_item',
            key: 'type_item',
        },
        {
            title: 'Price',
            render: (record: TrackingData) =>
                (calculateVolume(record.wide, record.long, record.high) * record.number).toFixed(2) + ' ฿',
        },
    ];

    return (
        <Table
            dataSource={trackingData}
            columns={columns}
            rowKey="tracking_id"
            pagination={false}
            summary={() => (
                <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4}>
                        Total Volume
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                        {trackingData
                            .reduce(
                                (sum, record) =>
                                    sum + calculateVolume(record.wide, record.long, record.high) * record.number,
                                0
                            )
                            .toFixed(2)}{' '}
                        ฿
                    </Table.Summary.Cell>
                </Table.Summary.Row>
            )}
        />
    );
};

export default TrackingTable;
