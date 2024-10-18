// /components/createpayment/PaymentSummary.tsx

import React from 'react';
import { Button, Card, Checkbox } from 'antd';

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
                <div className="ant-card-body">
                    <div className="ant-descriptions ant-descriptions-small align-right">
                        <div className="ant-descriptions-header">
                            <div className="ant-descriptions-title">ยอดที่ต้องชำระ</div>
                        </div>
                        <div className="ant-descriptions-view">
                            <table>
                                <tbody>
                                    <tr className="ant-descriptions-row">
                                        <td className="ant-descriptions-item setDes setDesPayCre fontBCS" colSpan={1}>
                                            <div className="ant-descriptions-item-container">
                                                <span className="ant-descriptions-item-label ant-descriptions-item-no-colon">ยอดเงินในระบบลูกค้า</span>
                                                <span className="ant-descriptions-item-content">{totalAmount.toFixed(2)} ฿</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="ant-descriptions-row">
                                        <td className="ant-descriptions-item setDes setDesPayCre" colSpan={1}>
                                            <div className="ant-descriptions-item-container">
                                                <span className="ant-descriptions-item-label ant-descriptions-item-no-colon">ค่านำเข้า</span>
                                                <span className="ant-descriptions-item-content">{importFee.toFixed(2)} ฿</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="ant-descriptions-row">
                                        <td className="ant-descriptions-item setDes setDesPayCre" colSpan={1}>
                                            <div className="ant-descriptions-item-container">
                                                <span className="ant-descriptions-item-label ant-descriptions-item-no-colon">ยอดรวม</span>
                                                <span className="ant-descriptions-item-content">
                                                    {(totalAmount + importFee + transportCost).toFixed(2)} ฿
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Button type="primary" block style={{ height: '40px' }} onClick={handleSavePayments}>
                        บันทึกรายการ
                    </Button>
                </div>
            </Card>
        </>
    );
};

export default PaymentSummary;
