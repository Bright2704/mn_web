// /components/createpayment/PaymentSummary.tsx

import React from 'react';
import { Button, Card, Checkbox,Form,Row,Col } from 'antd';

interface PaymentSummaryProps {
    totalAmount: number;
    handleSavePayments: () => void;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ totalAmount, handleSavePayments }) => {
    const importFee = 95.52; // Example of import fee
    const transportCost = 0.00; // Adjust based on transport

    return (
        <>
            <Card title="เงื่อนไขและข้อตกลง" bordered>
                <div
                    style={{ marginBottom: '18px' }}
                    dangerouslySetInnerHTML={{
                        __html: `
                            เมื่อได้รับสินค้าแล้ว รบกวนลูกค้า <br><br>
                            1. ถ่ายวิดิโอตอนแกะห่อสินค้า <br>
                            2. ถ่ายรูปเลขแทร็คกิ้งจีน <br>
                            3. ถ่ายรูปหน้าห่อหรือกล่องสินค้า <br>
                            4. ถ่ายรูปห่อหรือกล่องสินค้าที่ได้รับรับไปทั้งหมด ทั้งตอนที่ยังไม่ได้แกะสินค้าออกจากห่อและตอนที่แกะสินค้าออกจากห่อแล้ว หากลูกค้าไม่มีหลักฐานข้อใดข้อหนึ่งเพื่อมายืนยันกับทาง 
                            MN1688 EXPRESS ทางเราของสงวนสิทธิ์ไม่รับผิดชอบในกรณีที่ได้รับสินค้าผิด , ได้รับสินค้าไม่ครบ , ได้รับสินค้าไม่ตรงกับที่สั่ง ฯลฯ <br>
                            5. MN1688 EXPRESS ขอสงวนสิทธิ์ไม่รับผิดชอบให้หากสินค้าเสียหายจากการขนส่งทุกกรณี เช่น บุบ , แตก , หัก , ขาด , บิ่น , ยับ , งอ , เสียรูปทรง รวมทั้งการเสียหายจากการขนส่ง ในรูปแบบอื่นๆ
                        `,
                    }}
                />
                <Checkbox> user_id เข้าใจและยอมรับเงื่อนไขแล้ว</Checkbox>
            </Card>


            <Card title="ยอดที่ต้องชำระ" bordered style={{ marginTop: '16px' }}>
            <Form layout="vertical">

                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={10} style={{ textAlign: 'right', paddingTop: '6px' }}>
                        <span style={{ fontWeight: '600' }}>ยอดเงินในระบบลูกค้า </span>&nbsp; &nbsp;
                    </Col>
                    <Col span={4} style={{ textAlign: 'left', paddingTop: '6px' }}> {/* Adjusted span to ensure proper spacing */}
                        <span>name</span> {/* Display the name on the same line */}
                    </Col>
                </Row>

                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={10} style={{ textAlign: 'right', paddingTop: '6px' }}>
                        <span style={{ fontWeight: '600' }}>ค่านำเข้า </span>&nbsp; &nbsp;
                    </Col>
                    <Col span={4} style={{ textAlign: 'left', paddingTop: '6px' }}> {/* Adjusted span to ensure proper spacing */}
                        <span>name</span> {/* Display the name on the same line */}
                    </Col>
                </Row>
'               
                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={10} style={{ textAlign: 'right', paddingTop: '6px' }}>
                        <span style={{ fontWeight: '600' }}>จัดส่งโดย </span>&nbsp; &nbsp;
                    </Col>
                    <Col span={4} style={{ textAlign: 'left', paddingTop: '6px' }}> {/* Adjusted span to ensure proper spacing */}
                        <span>name</span> {/* Display the name on the same line */}
                    </Col>
                </Row>

                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={10} style={{ textAlign: 'right', paddingTop: '6px' }}>
                        <span style={{ fontWeight: '600' }}>ค่าบริการ </span>&nbsp; &nbsp;
                    </Col>
                    <Col span={4} style={{ textAlign: 'left', paddingTop: '6px' }}> {/* Adjusted span to ensure proper spacing */}
                        <span>name</span> {/* Display the name on the same line */}
                    </Col>
                </Row>

                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={10} style={{ textAlign: 'right', paddingTop: '6px' }}>
                        <span style={{ fontWeight: '600' }}>ค่าขนส่ง </span>&nbsp; &nbsp;
                    </Col>
                    <Col span={4} style={{ textAlign: 'left', paddingTop: '6px' }}> {/* Adjusted span to ensure proper spacing */}
                        <span>name</span> {/* Display the name on the same line */}
                    </Col>
                </Row>

                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={10} style={{ textAlign: 'right', paddingTop: '6px' }}>
                        <span style={{ fontWeight: '600' }}>ประเภทการชำระ </span>&nbsp; &nbsp;
                    </Col>
                    <Col span={4} style={{ textAlign: 'left', paddingTop: '6px' }}> {/* Adjusted span to ensure proper spacing */}
                        <span>name</span> {/* Display the name on the same line */}
                    </Col>
                </Row>

                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={10} style={{ textAlign: 'right', paddingTop: '6px' }}>
                        <span style={{ fontWeight: '600' }}>ยอดรวม </span>&nbsp; &nbsp;
                    </Col>
                    <Col span={4} style={{ textAlign: 'left', paddingTop: '6px' }}> {/* Adjusted span to ensure proper spacing */}
                        <span>name</span> {/* Display the name on the same line */}
                    </Col>
                </Row>
                
                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                    <Col span={20}> {/* Adjust span to occupy enough space */}
                        {/* Label */}
                        <div style={{ textAlign: 'left', paddingBottom: '8px' }}>
                            <span style={{ fontWeight: '600' }}>หมายเหตุ</span>
                        </div>

                        {/* Textarea directly below the label */}
                        <textarea
                            rows={3}
                            className="ant-input ant-input-lg"
                            placeholder="บ้านเลขที่ ถนน ซอย"
                            style={{
                                width: '100%',
                                height: '100px',
                                resize: 'none',
                                border: '1px solid #d9d9d9',
                                padding: '10px',
                                borderRadius: '4px',
                            }}
                        />
                    </Col>
                </Row>




                    <Button type="primary" block style={{ height: '40px' }} onClick={handleSavePayments}>
                        บันทึกรายการ
                    </Button>
'
            </Form>

            </Card>
        </>
    );
};

export default PaymentSummary;
