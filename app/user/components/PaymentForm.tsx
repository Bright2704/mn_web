import React , {useState}from 'react';
import { Card, Col, Row, Input, Button, Radio, Checkbox, Select } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const AddressForm: React.FC = () => {
    const [address, setAddress] = useState({
      fullName: "",
      streetAddress: "",
      district: "",
      province: "",
      postalCode: ""
    });

    const handleAddressChange = (value, field) => {
      setAddress(prev => ({ ...prev, [field]: value }));
    };
    return (
      <Row gutter={[8, 8]}>
        <Col lg={13} xl={15} style={{ paddingLeft: 8, paddingRight: 8 }}>
          <Card bordered>
            <div style={{ margin: '-8px', rowGap: 16 }} className="_border_bottom_small_1xea5_201">
              <Col span={24} style={{ paddingLeft: 8, paddingRight: 8 }}>
                <h1 style={{ marginBottom: 15 }}>
                  ที่อยู่ผู้รับสินค้า<span className="text-danger">*</span>
                </h1>
                <Row style={{ marginBottom: 4, marginTop: 10, display: 'flex' }}>
                  <Col span={6} style={{ textAlign: 'right', paddingTop: 6 }}>
                    <span style={{ fontWeight: 600 }}>ชื่อ - สกุล :</span>&nbsp; &nbsp;
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Input size="large" defaultValue="Mn1688" />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 4, marginTop: 10, display: 'flex' }}>
                  <Col span={6} style={{ textAlign: 'right', paddingTop: 6 }}>
                    <span style={{ fontWeight: 600 }}>ที่อยู่ :</span>&nbsp; &nbsp;
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <TextArea rows={3} defaultValue="206/76 ถนนเทศบาล7" />
                  </Col>
                </Row>
  
                {/* Address Fields */}
                <div className="address-payment" style={{ marginTop: 10 }}>
                  <div>
                    {['ตำบล', 'อำเภอ', 'จังหวัด', 'รหัสไปรษณีย์'].map((label, index) => (
                      <div key={index} className="typeahead-address-container">
                        <label className="typeahead-address-label">{label}</label>
                        <div className="typeahead typeahead-input-wrap">
                          <Select defaultValue={label === 'จังหวัด' ? 'นครราชสีมา' : 'บัวใหญ่'} style={{ width: '100%' }}>
                            <Option value="option1">Option 1</Option>
                            <Option value="option2">Option 2</Option>
                            {/* Additional options */}
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
  
                <Row style={{ marginBottom: 4, marginTop: 10, display: 'flex' }}>
                  <Col span={6} style={{ textAlign: 'right', paddingTop: 6 }}>
                    <span style={{ fontWeight: 600 }}>เบอร์โทรศัพท์ :</span>&nbsp; &nbsp;
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Input size="large" defaultValue="0659307185" />
                  </Col>
                </Row>
  
                <Row style={{ marginBottom: 4, marginTop: 10, display: 'flex' }}>
                  <Col span={6} style={{ textAlign: 'right' }} />
                  <Col span={12} style={{ textAlign: 'left' }}>
                    <Button type="primary">เลือกที่อยู่ผู้รับ</Button>
                  </Col>
                </Row>
  
                <Row style={{ marginTop: 16 }}>
                  <Col span={6} style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 600 }}>ประเภทการจัดส่ง</span>&nbsp; &nbsp;
                  </Col>
                  <Col span={16}>
                    <Radio.Group>
                      <Radio value={1}>รับสินค้าเอง (รับสินค้าเองได้ทุกวัน 09.00-21.00 น.)</Radio>
                      <Radio value={2}>บริษัทจัดส่ง 690 บาท (เฉพาะเขตกรุงเทพ) (แจ้งก่อน 10.00 น. รถจะส่งของถึงบ้านภายในวันนั้น)</Radio>
                      <Radio value={-99}>ขนส่งเอกชน (แจ้งก่อน 12.00 น. รถจะไปส่งสินค้าที่ขนส่งภายในวันนั้น)</Radio>
                    </Radio.Group>
                  </Col>
                </Row>
              </Col>
            </div>
          </Card>
  
          {/* More sections like the sender's address and other fields can be added similarly */}
        </Col>
      </Row>
    );
  };
export default AddressForm ;