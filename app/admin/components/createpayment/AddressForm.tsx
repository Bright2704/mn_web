import React, { useState, useEffect } from "react";
import { Select, Form, Card, Row, Col, Input, Button, Radio } from "antd";
import AddressBookModal from "../user_profile/AddressBookModal";
import addressData from "../../../user/components/AddressData";
import TaxInformationModal from "../tax/TaxInformationModal";
import TransportData from "../../../user/components/TransportData";

const { Option } = Select;

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

interface User {
  user_id: string;
  name: string;
  phone?: string;
}

interface IntrinsicAttributes {
  selectedUser?: User | null;  // Make it optional and allow null
}

interface TaxInfo {
  _id: string;
  name: string;
  address: string;
  phone: string;
  taxId: string;
  customerType: string;
  document: string;
}

interface AddressFormProps {
  selectedUser: User | null;
  address: {
    province: string;
    district: string;
    subdistrict: string;
    postalCode: string;
    transport: string;
  };
  handleAddressChange: (field: string, value: string) => void;
  onTransportChange: (
    value: string,
    carrier?: string,
    shippingPayment?: string
  ) => void;
  onSenderOptionChange: (value: string, senderDetails?: {
    name: string;
    address: string;
    phone: string;
  }) => void;
  onReceiptOptionChange: (isRequired: boolean) => void;
  taxInfo: TaxInfo | null;
  onTaxInfoChange: (taxInfo: TaxInfo | null) => void;
  
}

const AddressForm: React.FC<AddressFormProps> = ({
  selectedUser,
  address,
  handleAddressChange,
  onTransportChange,
  onSenderOptionChange,
  onReceiptOptionChange,
  taxInfo,
  onTaxInfoChange,
}) => {
  const [form] = Form.useForm();
  const [selectedTransport, setSelectedTransport] = useState<string>("");
  const [selectedShippingPayment, setSelectedShippingPayment] = useState<string>("");
  const [selectedCarrier, setSelectedCarrier] = useState<string>("");
  const [senderOption, setSenderOption] = useState<string>("0");
  const [showReceiptOptions, setShowReceiptOptions] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userAddress, setUserAddress] = useState<string>("");
  const [userProvince, setUserProvince] = useState<string>("");
  const [userDistrict, setUserDistrict] = useState<string>("");
  const [userSubdistrict, setUserSubdistrict] = useState<string>("");
  const [userPostalCode, setUserPostalCode] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [showAddressBookModal, setShowAddressBookModal] = useState<boolean>(false);
  const [showTaxInfoModal, setShowTaxInfoModal] = useState<boolean>(false);
  const [selectedTaxInfo, setSelectedTaxInfo] = useState<TaxInfo | null>(null);
  const [showPreviewCard, setShowPreviewCard] = useState<boolean>(false);
  const [senderName, setSenderName] = useState<string>("");
const [senderAddress, setSenderAddress] = useState<string>("");
const [senderPhone, setSenderPhone] = useState<string>("");

  const cashOnDeliveryCarriers = [
    "Kerry Express",
    "Flash Express",
    "J&T Express",
  ];

  useEffect(() => {
    const cleanup = () => {
      setSelectedTransport('');
      setSelectedShippingPayment('');
      setSelectedCarrier('');
      setSenderOption('0');
    };
    cleanup();
    return cleanup;
  }, []);

  const handleTransportChange = (e: any) => {
    const value = e.target.value;
    setSelectedTransport(value);
    setSelectedCarrier('');
    setSelectedShippingPayment('');
    onTransportChange(value);
  };

  const handleCarrierChange = (value: string) => {
    setSelectedCarrier(value);
    onTransportChange(selectedTransport, value, selectedShippingPayment);
  };

  const handleSenderOptionChange = (value: string) => {
    setSenderOption(value);
    
    if (value === "-99") {
        // Pass null initially when switching to custom sender
        onSenderOptionChange(value);
    } else {
        // Reset sender details when switching away from custom sender
        setSenderName('');
        setSenderAddress('');
        setSenderPhone('');
        onSenderOptionChange(value);
    }
};

useEffect(() => {
    if (senderOption === "-99" && (senderName || senderAddress || senderPhone)) {
        onSenderOptionChange(senderOption, {
            name: senderName,
            address: senderAddress,
            phone: senderPhone
        });
    }
}, [senderName, senderAddress, senderPhone, senderOption]);

useEffect(() => {
  if (selectedUser) {
    setUserName(selectedUser.name || '');
    setUserPhone(selectedUser.phone || '');
  }
}, [selectedUser]);

  const handleShippingPaymentChange = (e: any) => {
    const value = e.target.value;
    setSelectedShippingPayment(value);
    onTransportChange(selectedTransport, selectedCarrier, value);
  };

  const handleReceiptRadioChange = (e: any) => {
    const value = e.target.value;
    setShowReceiptOptions(value);
    onReceiptOptionChange(value === "1");
    if (value === "2") {
      setShowPreviewCard(false);
      onTaxInfoChange(null);
    }
  };

  const handleTaxInfoSelect = (taxInfo: TaxInfo | null) => {
    setSelectedTaxInfo(taxInfo);
    onTaxInfoChange(taxInfo);
    setShowTaxInfoModal(false);
  };

  const handleAddressSelect = (selectedAddress: Address) => {
    setUserName(selectedAddress.name);
    setUserAddress(selectedAddress.address);
    setUserProvince(selectedAddress.province);
    setUserDistrict(selectedAddress.districts);
    setUserSubdistrict(selectedAddress.subdistricts);
    setUserPostalCode(selectedAddress.postalCode);
    setUserPhone(selectedAddress.phone);
    setShowAddressBookModal(false);

    // Update parent state
    handleAddressChange("userName", selectedAddress.name);
    handleAddressChange("address", selectedAddress.address);
    handleAddressChange("province", selectedAddress.province);
    handleAddressChange("district", selectedAddress.districts);
    handleAddressChange("subdistrict", selectedAddress.subdistricts);
    handleAddressChange("postalCode", selectedAddress.postalCode);
    handleAddressChange("phone", selectedAddress.phone);
  };

  const handleSubdistrictChange = (value: string) => {
    setUserSubdistrict(value);
    const selectedSubdistrict = addressData.provinces
      .find((p) => p.name === userProvince)
      ?.districts.find((d) => d.name === userDistrict)
      ?.subdistricts.find((s) => s.name === value);

    if (selectedSubdistrict && selectedSubdistrict.postalCodes.length > 0) {
      setUserPostalCode(selectedSubdistrict.postalCodes[0]);
    }
  };

  useEffect(() => {
    // Update parent component whenever address fields change
    handleAddressChange("userName", userName);
    handleAddressChange("address", userAddress);
    handleAddressChange("province", userProvince);
    handleAddressChange("district", userDistrict);
    handleAddressChange("subdistrict", userSubdistrict);
    handleAddressChange("postalCode", userPostalCode);
    handleAddressChange("phone", userPhone);
  }, [
    userName,
    userAddress,
    userProvince,
    userDistrict,
    userSubdistrict,
    userPostalCode,
    userPhone,
  ]);

  return (
    <>
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ marginBottom: 0 }}>ที่อยู่ผู้รับสินค้า</h3>
            <Button
              type="primary"
              style={{ height: "40px" }}
              onClick={() => setShowAddressBookModal(true)}
            >
              เลือกที่อยู่ผู้รับจากสมุดที่อยู่
            </Button>
          </div>
        }
        bordered
        style={{ marginBottom: "16px" }}
      >
        <Form layout="vertical" form={form}>
          {/* Name */}
          <Row
            style={{
              marginBottom: "4px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Col span={4} style={{ textAlign: "right", paddingTop: "6px" }}>
              <span style={{ fontWeight: "600" }}>ชื่อ - สกุล </span>&nbsp; &nbsp;
            </Col>
            <Col span={16} style={{ textAlign: "right" }}>
              <Input
                className="ant-input-lg"
                value={selectedUser?.user_id || ''}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Col>
          </Row>

          {/* Address */}
          <Row
            style={{
              marginBottom: "4px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Col span={4} style={{ textAlign: "right", paddingTop: "6px" }}>
              <span style={{ fontWeight: "600" }}>ที่อยู่ </span>&nbsp; &nbsp;
            </Col>
            <Col span={16} style={{ textAlign: "right" }}>
              <textarea
                rows={3}
                className="ant-input ant-input-lg"
                placeholder="บ้านเลขที่ ถนน ซอย"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                style={{
                  width: "100%",
                  height: "100px",
                  resize: "none",
                  border: "1px solid #d9d9d9",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              />
            </Col>
          </Row>

          {/* Province */}
          <Row
            style={{
              marginBottom: "4px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Col span={4} style={{ textAlign: "right", paddingTop: "6px" }}>
              <span style={{ fontWeight: "600" }}>จังหวัด </span>&nbsp; &nbsp;
            </Col>
            <Col span={16}>
              <Select
                showSearch
                value={userProvince}
                onChange={(value) => setUserProvince(value)}
                placeholder="Select Province"
                style={{ width: "100%" }}
              >
                {addressData.provinces.map((province) => (
                  <Option key={province.name} value={province.name}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>

          {/* District */}
          <Row
            style={{
              marginBottom: "4px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Col span={4} style={{ textAlign: "right", paddingTop: "6px" }}>
              <span style={{ fontWeight: "600" }}>อำเภอ </span>&nbsp; &nbsp;
            </Col>
            <Col span={16}>
              <Select
                showSearch
                value={userDistrict}
                onChange={(value) => setUserDistrict(value)}
                placeholder="Select District"
                disabled={!userProvince}
                style={{ width: "100%" }}
              >
                {addressData.provinces
                  .find((p) => p.name === userProvince)
                  ?.districts.map((district) => (
                    <Option key={district.name} value={district.name}>
                      {district.name}
                    </Option>
                  ))}
              </Select>
            </Col>
          </Row>

          {/* Subdistrict */}
          <Row
            style={{
              marginBottom: "4px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Col span={4} style={{ textAlign: "right", paddingTop: "6px" }}>
              <span style={{ fontWeight: "600" }}>ตำบล </span>&nbsp; &nbsp;
            </Col>
            <Col span={16}>
              <Select
                showSearch
                value={userSubdistrict}
                onChange={handleSubdistrictChange}
                placeholder="Select Subdistrict"
                disabled={!userDistrict}
                style={{ width: "100%" }}
              >
                {addressData.provinces
                  .find((p) => p.name === userProvince)
                  ?.districts.find((d) => d.name === userDistrict)
                  ?.subdistricts.map((subdistrict) => (
                    <Option key={subdistrict.name} value={subdistrict.name}>
                      {subdistrict.name}
                    </Option>
                  ))}
              </Select>
            </Col>
          </Row>

          {/* Postal Code */}
          <Row
            style={{
              marginBottom: "4px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Col span={4} style={{ textAlign: "right", paddingTop: "6px" }}>
              <span style={{ fontWeight: "600" }}>รหัสไปรษณีย์ </span>&nbsp;
              &nbsp;
            </Col>
            <Col span={16}>
              <Input
                value={userPostalCode}
                placeholder="Postal Code"
                onChange={(e) => setUserPostalCode(e.target.value)}
                style={{ width: "100%" }}
              />
            </Col>
          </Row>

          {/* Phone */}
          <Row
            style={{
              marginBottom: "4px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Col span={4} style={{ textAlign: "right", paddingTop: "6px" }}>
              <span style={{ fontWeight: "600" }}>เบอร์โทรศัพท์ </span>&nbsp;
              &nbsp;
            </Col>
            <Col span={16}>
              <Input
                className="ant-input-lg"
                value={userPhone}
                placeholder="Phone Number"
                onChange={(e) => setUserPhone(e.target.value)}
              />
            </Col>
          </Row>

          {/* Transport Type */}
          <Row
            style={{
              marginBottom: "4px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Col span={5} style={{ textAlign: "right" }}>
              <span style={{ fontWeight: 600 }}>ประเภทการจัดส่ง </span>
              &nbsp;&nbsp;
            </Col>
            <Col span={16}>
              <Radio.Group
                onChange={handleTransportChange}
                value={selectedTransport}
              >
                <Radio value="1">
                  รับสินค้าเอง (รับสินค้าเองได้ทุกวัน 09.00-21.00 น.)
                </Radio>
                <Radio value="2" style={{ display: "block", marginTop: "8px" }}>
                  บริษัทจัดส่ง 690 บาท (เฉพาะเขตกรุงเทพ)
                </Radio>
                <Radio
                  value="-99"
                  style={{ display: "block", marginTop: "8px" }}
                >
                  ขนส่งเอกชน (แจ้งก่อน 12.00 น.)
                </Radio>
              </Radio.Group>

              {/* Conditionally render extra options if "ขนส่งเอกชน" is selected */}
              {selectedTransport === "-99" && (
                <div style={{ marginLeft: "16px", marginTop: "16px" }}>
                  <Radio.Group
                    onChange={handleShippingPaymentChange}
                    value={selectedShippingPayment}
                  >
                    <Radio value="0" style={{ marginBottom: "12px" }}>
                      จ่ายค่าขนส่งต้นทาง
                    </Radio>
                    <br />
                    <Radio value="1" style={{ marginBottom: "12px" }}>
                      จ่ายค่าขนส่งปลายทาง
                    </Radio>
                  </Radio.Group>

                  <Select
                    className="ant-input ant-input-lg"
                    value={selectedCarrier}
                    onChange={handleCarrierChange}
                    style={{ width: "100%", marginTop: "12px" }}
                  >
                    {(selectedShippingPayment === "1"
                      ? cashOnDeliveryCarriers
                      : TransportData.companies
                    ).map((company, index) => (
                      <Option key={index} value={company}>
                        {company}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}
            </Col>
          </Row>
          {/* Add gray line */}
          <div
            style={{ borderBottom: "2px solid gray", marginTop: "20px" }}
          ></div>

          {/* Additional section starts here */}
          <Row
            style={{
              marginLeft: "-8px",
              marginRight: "-8px",
              marginTop: "5px",
              rowGap: "16px",
            }}
          >
            <Col
              span={18}
              style={{ paddingLeft: "8px", paddingRight: "8px" }}
            >
              <Row style={{ marginTop: "16px", marginLeft: "20px" }}>
                <Col
                  span={8}
                  style={{ textAlign: "right", paddingTop: "6px" }}
                >
                  <span style={{ fontWeight: "600" }}>ที่อยู่ผู้ส่ง</span>&nbsp;
                  &nbsp;
                </Col>
                <Col span={16}>
                  <Select
                    className="ant-input ant-input-lg"
                    value={senderOption}
                    onChange={handleSenderOptionChange}
                  >
                    <Option value="0">- กรุณาเลือก -</Option>
                    <Option value="MN">MN1688 EXPRESS</Option>
                    <Option value="NO_DISPLAY">ไม่แสดงราคา</Option>
                    <Option value="-99">กรอกใหม่</Option>
                  </Select>
                </Col>
              </Row>

              {/* Conditionally render the hidden section if "กรอกใหม่" is selected */}
              {senderOption === "-99" && (
  <div style={{ marginLeft: "20px" }}>
    <Row style={{ marginBottom: "4px", marginTop: "16px" }}>
      <Col span={8} style={{ textAlign: "right", paddingTop: "6px" }}>
        <span style={{ fontWeight: "600" }}>ชื่อผู้ส่ง</span>
        &nbsp; &nbsp;
      </Col>
      <Col span={16}>
        <div style={{ color: "red" }}>
          การกรอกผู้ส่งเองจะถูกคิดค่าบริการ 10฿
        </div>
        <Input 
          className="ant-input-lg" 
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
        />
      </Col>
    </Row>

    <Row
      style={{
        marginBottom: "4px",
        marginTop: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Col span={8} style={{ textAlign: "right", paddingTop: "6px" }}>
        <span style={{ fontWeight: "600" }}>ที่อยู่ :</span>
        &nbsp; &nbsp;
      </Col>
      <Col span={16} style={{ textAlign: "right" }}>
        <textarea
          rows={3}
          className="ant-input ant-input-lg"
          placeholder="บ้านเลขที่ ถนน ซอย"
          value={senderAddress}
          onChange={(e) => setSenderAddress(e.target.value)}
          style={{
            width: "100%",
            height: "100px",
            resize: "none",
            border: "1px solid #d9d9d9",
            padding: "10px",
            borderRadius: "4px",
          }}
        />
      </Col>
    </Row>

    <Row style={{ marginBottom: "4px" }}>
      <Col span={8} style={{ textAlign: "right", paddingTop: "6px" }}>
        <span style={{ fontWeight: "600" }}>
          เบอร์ติดต่อผู้ส่ง
        </span>
        &nbsp; &nbsp;
      </Col>
      <Col span={16}>
        <Input 
          className="ant-input-lg" 
          value={senderPhone}
          onChange={(e) => setSenderPhone(e.target.value)}
        />
      </Col>
    </Row>
  </div>
)}
            </Col>

            {/* Button Section */}
            <Col
              span={3}
              style={{
                paddingLeft: "8px",
                paddingRight: "8px",
                textAlign: "right",
              }}
            >
              <Button
                type="primary"
                style={{ marginTop: "16px" }}
                icon={
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="eye"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                  </svg>
                }
              >
                ดูตัวอย่าง
              </Button>
            </Col>

            {/* Add gray line */}
            <div
              style={{ borderBottom: "2px solid gray", marginTop: "20px" }}
            ></div>
          </Row>

          {/* Receipt Options */}
          <Row
            style={{
              marginBottom: "4px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Col span={5} style={{ textAlign: "right" }}>
              <span style={{ fontWeight: 600 }}>ต้องการใบเสร็จ?</span>
              &nbsp;&nbsp;
            </Col>
            <Col span={16}>
              <Radio.Group
                onChange={handleReceiptRadioChange}
                value={showReceiptOptions}
              >
                <Radio value="1">ต้องการใบเสร็จ</Radio>
                <Radio value="2">ไม่ต้องการใบเสร็จ</Radio>
              </Radio.Group>

              {showReceiptOptions === "1" && (
                <div style={{ marginLeft: "16px", marginTop: "16px" }}>
                  <Button
                    type="primary"
                    style={{ height: "40px" }}
                    onClick={() => setShowTaxInfoModal(true)}
                  >
                    เลือกข้อมูลผู้เสียภาษี หรือ ใบรับรองบริษัท
                  </Button>
                </div>
              )}
            </Col>
          </Row>

          {/* Preview Card */}
          {showReceiptOptions === "1" && selectedTaxInfo && (
            <Row style={{ marginTop: "16px", marginLeft: "20px" }}>
              <Col span={5} style={{ textAlign: "right" }}>
                <span style={{ fontWeight: 600 }}>ข้อมูลผู้เสียภาษี:</span>
                &nbsp;&nbsp;
              </Col>
              <Col span={16}>
                <div
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                    padding: "16px",
                    background: "#f5f5f5",
                  }}
                >
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <strong>นาม:</strong> {selectedTaxInfo.name}
                    </Col>
                    <Col span={12}>
                      <strong>เบอร์โทรศัพท์:</strong> {selectedTaxInfo.phone}
                    </Col>
                    <Col span={24}>
                      <strong>ที่อยู่:</strong> {selectedTaxInfo.address}
                    </Col>
                    <Col span={12}>
                      <strong>เลขผู้เสียภาษี:</strong> {selectedTaxInfo.taxId}
                    </Col>
                    <Col span={12}>
                      <strong>ประเภทลูกค้า:</strong>{" "}
                      {selectedTaxInfo.customerType}
                    </Col>
                    <Col span={12}>
                      <strong>เอกสาร:</strong>
                      {selectedTaxInfo.document ? (
                        <Button
                          type="link"
                          onClick={() =>
                            window.open(
                              `http://localhost:5001${selectedTaxInfo.document}`,
                              "_blank"
                            )
                          }
                        >
                          ดูเอกสาร
                        </Button>
                      ) : (
                        "-"
                      )}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          )}

          {/* Coupon Section */}
          <Row style={{ marginTop: "16px", marginLeft: "20px" }}>
            <Col span={6} style={{ textAlign: "right", paddingTop: "6px" }}>
              <span style={{ fontWeight: "600" }}>คูปอง</span>&nbsp; &nbsp;
            </Col>
            <Col span={12}>
              <Button
                type="dashed"
                style={{
                  borderColor: "rgb(239, 68, 68)",
                  color: "rgb(239, 68, 68)",
                }}
              >
                เลือกคูปอง
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Render the AddressBookModal */}
      <AddressBookModal
  show={showAddressBookModal}
  onClose={() => setShowAddressBookModal(false)}
  onSelectAddress={handleAddressSelect}
  selectedUser={selectedUser}
/>

      {/* Render the TaxInformationModal */}
      <TaxInformationModal
  show={showTaxInfoModal}
  onClose={() => setShowTaxInfoModal(false)}
  onSelect={handleTaxInfoSelect}
  selectedUser={selectedUser}
/>
    </>
  );
};

export default AddressForm;
