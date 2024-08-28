import React from 'react';
import { Card, Col, Row, Checkbox, Button, Typography, Descriptions, Input } from 'antd';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const TermsAndPayment: React.FC = () => {
  return (
    <Row gutter={[8, 8]}>
      {/* Terms and Conditions Section */}
      <Col lg={11} xl={9} style={{ paddingLeft: 8, paddingRight: 8 }}>
        <Card bordered>
          <div style={{ fontSize: 21, fontWeight: 500, marginBottom: 18 }}>เงื่อนไขและข้อตกลง</div>
          <Paragraph style={{ marginBottom: 18 }}>
            เมื่อได้รับสินค้าแล้ว รบกวนลูกค้า <br /><br />
            1. ถ่ายวิดิโอตอนแกะห่อสินค้า <br />
            2. ถ่ายรูปเลขแทร็คกิ้งจีน <br />
            3. ถ่ายรูปหน้าห่อหรือกล่องสินค้า <br />
            4. ถ่ายรูปห่อหรือกล่องสินค้าที่ได้รับรับไปทั้งหมด <br />
            ทั้งตอนที่ยังไม่ได้แกะสินค้าออกจากห่อและตอนที่แกะสินค้าออกจากห่อแล้ว หากลูกค้าไม่มีหลักฐานข้อใดข้อหนึ่งเพื่อมายืนยันกับทาง PLM CARGO ทางเราของสงวนสิทธิ์ไม่รับผิดชอบในกรณีที่ได้รับสินค้าผิด , ได้รับสินค้าไม่ครบ , ได้รับสินค้าไม่ตรงกับที่สั่ง ฯลฯ <br />
            5. PLM CARGO ขอสงวนสิทธิ์ไม่รับผิดชอบให้หากสินค้าเสียหายจากการขนส่งทุกกรณี เช่น บุบ , แตก , หัก , ขาด , บิ่น , ยับ , งอ , เสียรูปทรง รวมทั้งการเสียหายจากการขนส่ง ในรูปแบบอื่นๆ
          </Paragraph>
          <Checkbox>
            <div style={{ fontWeight: 600, fontSize: 16 }}>MN1688 เข้าใจและยอมรับเงื่อนไขแล้ว</div>
          </Checkbox>
        </Card>

        {/* Payment Summary Section */}
        <Card bordered style={{ marginTop: 18 }}>
          <Descriptions title="ยอดที่ต้องชำระ" size="small" column={1} layout="vertical">
            <Descriptions.Item label="ยอดเงินในระบบลูกค้า">189.71 ฿</Descriptions.Item>
            <Descriptions.Item label="ค่านำเข้า">95.52 ฿</Descriptions.Item>
            <Descriptions.Item label="จัดส่งโดย"><div style={{ fontWeight: 600, fontSize: 14 }}>-</div></Descriptions.Item>
            <Descriptions.Item label="ค่าบริการ">0.00 ฿</Descriptions.Item>
            <Descriptions.Item label="ค่าขนส่ง">0.00 ฿</Descriptions.Item>
            <Descriptions.Item label="ประเภทการชำระ">ตัดเงินในระบบ</Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontSize: 20 }}>ยอดรวม</span>}>
              <span style={{ fontSize: 20 }}>95.52 ฿</span>
            </Descriptions.Item>
          </Descriptions>
          <Title level={5} style={{ fontWeight: 500, fontSize: 15, marginTop: 5 }}>หมายเหตุ</Title>
          <TextArea rows={3} id="remark" style={{ marginTop: 5 }} />
          <Button type="primary" block style={{ height: 40, marginTop: 10 }}>
            <span role="img" aria-label="save" className="anticon anticon-save">
              <svg viewBox="64 64 896 896" focusable="false" data-icon="save" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                <path d="M893.3 293.3L730.7 130.7c-7.5-7.5-16.7-13-26.7-16V112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V338.5c0-17-6.7-33.2-18.7-45.2zM384 184h256v104H384V184zm456 656H184V184h136v136c0 17.7 14.3 32 32 32h320c17.7 0 32-14.3 32-32V205.8l136 136V840zM512 442c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 224c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z"></path>
              </svg>
            </span>
            บันทึกรายการ
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

export default TermsAndPayment;
