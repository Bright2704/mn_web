import React, { useState, useRef } from 'react';
import { Table, Modal, Typography, Card, Tag, Space, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface TrackingData {
    tracking_id: string;
    mnemonics: string;
    weight: number;
    wide: number;
    high: number;
    long: number;
    number: number;
    lot_id: string;
    lot_order: string;
    in_cn: string;
    out_cn: string;
    in_th: string;
    user_id: string;
    type_item: string;
    check_product_price: number;
    transport: number;
    price_crate: number;
    new_wrap: number;
    other: number;
    image_item_paths: string[];
    lot_type: string;
    cal_price: number;
    type_cal: "weightPrice" | "volumePrice";
    user_rate: string
}

interface TrackingTableProps {
    trackingData: TrackingData[];
    calculateSum: (key: keyof TrackingData) => number;
    transportFee: number;
    serviceFee: number;
}

const TrackingTable: React.FC<TrackingTableProps> = ({ 
    trackingData, 
    calculateSum,
    transportFee,
    serviceFee 
}) => {
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [previewIndex, setPreviewIndex] = useState<number>(0);
    const [modalOpen, setModalOpen] = useState(false);
    const swiperRef = useRef<any>(null);

    const calculateVolume = (wide: number, long: number, high: number) =>
        (wide * long * high) / 1000000;

    // Open image preview modal
    const openImagePreview = (images: string[], index: number) => {
        setPreviewImages(images);
        setPreviewIndex(index);
        setModalOpen(true);

        setTimeout(() => {
            if (swiperRef.current && swiperRef.current.swiper) {
                swiperRef.current.swiper.slideTo(index);
            }
        }, 0);
    };

    const handlePreviewClose = () => {
        setModalOpen(false);
    };

    const getRowClassName = (record: TrackingData) => {
        const hasCheckProduct = record.check_product_price > 0;
        const hasCrate = record.price_crate > 0;

        if (hasCheckProduct && hasCrate) {
            return 'bg-[rgb(249,255,165)]'; // Yellow for both check and crate
        } else if (hasCheckProduct) {
            return 'bg-[rgb(165,255,197)]'; // Green for check only
        } else if (hasCrate) {
            return 'bg-[rgb(255,223,165)]'; // Orange for crate only
        }
        return '';
    };

    // Define columns with explicit type ColumnsType
    const columns: ColumnsType<TrackingData> = [
        { title: 'ล็อต/ลำดับ', render: (record: TrackingData) => `${record.lot_type} ${record.lot_id}${record.lot_order}`, className: 'header-center' },
        { title: 'รหัสพัสดุ', dataIndex: 'tracking_id', key: 'tracking_id', className: 'header-center' },
        {
            title: 'รูปภาพ',
            render: (record: TrackingData) => (
                <div style={{ display: 'flex', gap: '5px' }}>
                    {record.image_item_paths.length > 0 ? (
                        record.image_item_paths.map((image, i) => (
                            <div
                                key={i}
                                onClick={() => openImagePreview(record.image_item_paths, i)}
                                style={{ 
                                    width: '50px', 
                                    height: '50px', 
                                    cursor: 'pointer',
                                    position: 'relative' 
                                }}
                            >
                                <Image
                                    src={image}
                                    alt={`Image ${i + 1}`}
                                    layout="responsive"
                                    width={100}
                                    height={100}
                                    objectFit="cover"
                                />
                            </div>
                        ))
                    ) : (
                        <span>No images</span>
                    )}
                </div>
            ),
            className: 'header-center'
        },
        { title: 'รายการสั่งซื้อ', dataIndex: 'mnemonics', key: 'mnemonics', className: 'header-center' },
        { title: 'จำนวน', dataIndex: 'number', key: 'number', align: 'right', className: 'header-center' },
        { title: 'น้ำหนัก', dataIndex: 'weight', key: 'weight', align: 'right', className: 'header-center' },
        { title: 'กว้าง', dataIndex: 'wide', key: 'wide', align: 'right', className: 'header-center' },
        { title: 'สูง', dataIndex: 'high', key: 'high', align: 'right', className: 'header-center' },
        { title: 'ยาว', dataIndex: 'long', key: 'long', align: 'right', className: 'header-center' },
        {
            title: 'คิว.',
            render: (record: TrackingData) => calculateVolume(record.wide, record.long, record.high).toFixed(4),
            align: 'right',
            className: 'header-center'
        },
        { title: 'ประเภท', dataIndex: 'user_rate', key: 'user_rate', className: 'header-center' },
        {
            title: 'ค่าบริการ',
            render: (record: TrackingData) => (
                <Tooltip title={
                    <div>
                        <p>ค่าเช็คสินค้า: {record.check_product_price?.toFixed(2)}</p>
                        <p>ค่าห่อใหม่: {record.new_wrap?.toFixed(2)}</p>
                        <p>ค่าขนส่งจีน: {record.transport?.toFixed(2)}</p>
                        <p>ค่าตีลัง: {record.price_crate?.toFixed(2)}</p>
                        <p>ค่าอื่นๆ: {record.other?.toFixed(2)}</p>
                    </div>
                }>
                    {(
                        record.check_product_price +
                        record.new_wrap +
                        record.transport +
                        record.price_crate +
                        record.other
                    ).toFixed(2)}
                </Tooltip>
            ),
            align: 'right',
            className: 'header-center'
        },
        {
            title: 'ราคากิโล',
            render: (record: TrackingData) => 
                (record.type_cal === "weightPrice" ? record.cal_price * record.number : 0).toFixed(2),
            align: 'right',
            className: 'header-center',
            // onCell: () => ({ style: { backgroundColor: "rgb(255, 167, 163)" } })
        },
        {
            title: 'ราคาคิว',
            render: (record: TrackingData) => 
                (record.type_cal === "volumePrice" ? record.cal_price * record.number : 0).toFixed(2),
            align: 'right',
            className: 'header-center',
            // onCell: () => ({ style: { backgroundColor: "rgb(255, 167, 163)" } })
        }
    ];

    const totalSum = trackingData.reduce((sum, row) => sum + calculateVolume(row.wide, row.long, row.high) * row.number, 0);
    const warehouseServiceFee = 0.00; // Example value, replace with actual calculation if needed
    const thaiShippingFee = 0.00; // Example value, replace with actual calculation if needed
    const grandTotal = totalSum + warehouseServiceFee + thaiShippingFee;
    const calculateSelectedTotals = () => {
        return trackingData.reduce((acc, row) => {
            const weightPrice = row.type_cal === "weightPrice" ? row.cal_price * row.number : 0;
            const volumePrice = row.type_cal === "volumePrice" ? row.cal_price * row.number : 0;
            const serviceFee = row.check_product_price + row.new_wrap + row.transport + row.price_crate + row.other;

            return {
                serviceFee: acc.serviceFee + serviceFee,
                weightPrice: acc.weightPrice + weightPrice,
                volumePrice: acc.volumePrice + volumePrice
            };
        }, { serviceFee: 0, weightPrice: 0, volumePrice: 0 });
    };

    return (
        <>
            <Card title="รายการรหัสพัสดุ" bordered style={{ marginTop: '16px' }}>
                <Table
                    dataSource={trackingData}
                    columns={columns}
                    rowKey="tracking_id"
                    pagination={false}
                    bordered
                    size="small"
                    rowClassName={getRowClassName}
                    summary={() => {
                    const totals = calculateSelectedTotals();
                    const total = totals.serviceFee + totals.weightPrice + totals.volumePrice;
                    const grandTotal = total + transportFee + serviceFee;
                    
                    return (
                        <>
                        <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={11} className="text-right p-1">
                                    รวม
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1} colSpan={3} className="text-right p-1">
                                <Text strong>{total.toFixed(2)}</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={11} className="text-right p-1">
                                คูปองส่วนลด
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1} colSpan={3} className="text-right p-1">
                                <Text strong>0.00</Text>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={11} className="text-right p-1">
                                    ค่าบริการโกดังไทย
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1} colSpan={3} className="text-right p-1">
                                    <Text strong>{serviceFee.toFixed(2)}</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={11} className="text-right p-1">
                                    <Text type="danger">
                                        (ราคาข้างต้นเป็นเพียงราคาประมาณการ ค่าใช้จ่ายจริงจะคิดตามบิลขนส่งตัวจริงและหักลบคืนเป็นยอดเงินในระบบ)
                                    </Text>
                                    &nbsp;ค่าจัดส่งในไทย
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1} colSpan={3} className="text-right p-1">
                                    <Text strong>{transportFee.toFixed(2)}</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={11} className="text-right p-1">
                                สุทธิ
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1} colSpan={3} className="text-right p-1">
                                <Text strong style={{ fontSize: '20px' }}>{grandTotal.toFixed(2)}</Text>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                        </>
                    );
                }}
            />           
        </Card>
        <Modal
                open={modalOpen}
                footer={null}
                onCancel={handlePreviewClose}
                centered
            >
                <Swiper
                    ref={swiperRef}
                    initialSlide={previewIndex}
                    onSlideChange={(swiper) => setPreviewIndex(swiper.activeIndex)}
                    navigation={false}
                    modules={[Navigation]}
                >
                    {previewImages.map((image, index) => (
                        <SwiperSlide key={index}>
                            <Image
                                src={image}
                                alt={`Preview ${index + 1}`}
                                layout="responsive"
                                width={100}
                                height={80}
                                objectFit="contain"
                                style={{ maxHeight: '80vh' }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Left Arrow */}
                <button
                    className="swiper-button-prev"
                    style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: '#fff',
                        borderRadius: '50%',
                        padding: '10px',
                        cursor: 'pointer',
                    }}
                    onClick={() => swiperRef.current?.swiper?.slidePrev()}
                >
                    <LeftOutlined />
                </button>

                {/* Right Arrow */}
                <button
                    className="swiper-button-next"
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: '#fff',
                        borderRadius: '50%',
                        padding: '10px',
                        cursor: 'pointer',
                    }}
                    onClick={() => swiperRef.current?.swiper?.slideNext()}
                >
                    <RightOutlined />
                </button>
            </Modal>
        </>
        
    );
};

export default TrackingTable;
