import React, { useState } from 'react';

interface ImportModalProps {
  show: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ show, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('1');

  if (!show) {
    return null;
  }

  const handleImport = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle the import logic here
    console.log('File:', file);
    console.log('Status:', status);
    onClose(); // Close the modal after import
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50  bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-4/5 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-center p-4 border-b">
          <h5 className="text-xl font-medium">จัดการรายการสั่งซื้อ</h5>
          <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose} style={{ background: 'none', border: 'none' }}>
            <span className="text-xl">&times;</span>
          </button>
        </div>
        <div className="p-4 justify-center flex md:flex-row">
          <div className="w-full md:w-1/2 md:pr-4">
            <form method="post" encType="multipart/form-data" onSubmit={handleImport} className="card-body">
              <input type="hidden" name="_token" value="lGT5gLceZdygZhH8Rom1DpJo9FTZMx10xmA2ktwA" />
              <h5 className="mb-4">อัพเดทสถานะสินค้า</h5>
              <div className="form-group">
                <div className="text-red-500 mb-4">
                  *กรุณาตรวจสอบรายละเอียดให้ครบถ้วนก่อนบันทึกรายการ
                </div>
              </div>
              <hr className="my-4" />
              <div className="form-group">
                <label className="font-medium mb-2" htmlFor="status">อัพเดทสถานะสินค้า</label>
                <select className="form-control" name="status" id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">เลือกสถานะ</option>
                <option value="รอตรวจสอบ">รอตรวจสอบ</option>
                <option value="รอชำระเงิน">รอชำระเงิน</option>
                <option value="ยกเลิกการสั่งซื้อ">ยกเลิกการสั่งซื้อ</option>
                </select>
              </div>
            </form>
          </div>
        </div>
        <div className="container-fluid">
          <div className="card bg-blue p-2">
              <div className="row">
                  <div className="col-md-12">
                      <div className="d-lg-flex justify-content-between align-items-center">
                          <h3 className="text-white mb-0">รายการสั่งซื้อ</h3>
                          <div className="d-flex py-1 py-lg-0">
                              <button className="btn btn-warning mb-1 mr-2">
                                  <span className="text-dark"><i className="fal fa-ship"></i> เปลี่ยนเป็นส่งเรือ</span>
                              </button>
                          </div>
                      </div>
                      <div className="card mt-1 p-2">
                          <div className="anan-order">
                              <div className="row">
                                  <div className="col-lg-6">
                                      {/* <!-- Table for order details --> */}
                                      <table className="table">
                                          <tbody>
                                              <tr><td>หมายเลขรายการ:</td><td>ORD-00167</td></tr>
                                              <tr><td>Ref:</td><td>dacha#00167</td></tr>
                                              <tr><td>รหัสลูกค้า:</td><td><a href="/" className="router-link-active">dacha</a></td></tr>
                                              <tr><td>วลีช่วยจำ:</td><td></td></tr>
                                              <tr><td>วลีช่วยจำ (ผู้ดูแล):</td><td><textarea className="form-control"></textarea></td></tr>
                                              <tr><td>ประเภทการจัดส่ง:</td><td>ทางรถ <i className="fas fa-shipping-fast"></i></td></tr>
                                          </tbody>
                                      </table>
                                  </div>
                                  <div className="col-lg-6">
                                      {/* <!-- Table for additional info --> */}
                                      <table className="table">
                                          <tbody>
                                              <tr><td>สถานะ:</td><td><span className="badge badge-light-success">สั่งซื้อสำเร็จ</span></td></tr>
                                              <tr><td>วันที่ทำรายการ:</td><td>2024-08-01 09:45:45</td></tr>
                                              <tr><td>อัตราแลกเปลี่ยน:</td><td>¥1 = 5.19 ฿</td></tr>
                                          </tbody>
                                      </table>
                                  </div>
                                  {/* <!-- Note fields --> */}
                                  <div className="col-md-6 my-2 px-2">
                                      <h5>หมายเหตุรายการสั่งซื้อ (ลูกค้า)</h5>
                                      <textarea disabled className="form-control"></textarea>
                                  </div>
                                  <div className="col-md-6 my-2 px-2">
                                      <h5>หมายเหตุรายการสั่งซื้อ (ผู้ดูแล)</h5>
                                      <textarea className="form-control"></textarea>
                                  </div>
                                  {/* <!-- Footer info --> */}
                                  <div className="col-md-12 text-center">
                                      <p>ผู้ตรวจสอบ: AUNG</p>
                                      <p>ผู้แก้ไขล่าสุด: <a href="/admin/edit-employee/124">AUNG</a></p>
                                      <p>วันที่แก้ไขล่าสุด: 2024-08-02 11:20:12</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
        <div className="col-md-12">
            <div className="card p-2">
                <h3 className="mb-0 font-weight-bolder">รายการสินค้าในใบสั่งซื้อ</h3>
                <div className="mb-2 table-container">
                    <div className="mt-1">
                        <table style={{ width: '1000px' }}>
                            <tbody>
                                <tr className="anan-order-row">
                                    <td style={{ width: '170px' }}>
                                        <p className="txt-odrx mb-0">ชื่อสินค้า / รายละเอียดสินค้า</p>
                                    </td>
                                    <td style={{ width: '400px' }}>
                                        {/* Simplified version for example; you may need a custom component for a dropdown */}
                                        <p className="txt-odrx mb-0 d-flex align-items-center">
                                            <span className="mr-5">ประเภท</span>
                                            {/* Placeholder for actual dropdown component */}
                                            <select className="form-control">
                                                <option>ธรรมดา (A)</option>
                                            </select>
                                        </p>
                                    </td>
                                    {/* More cells */}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* More divs and tables as needed */}
                </div>
            </div>
            <div className="form-group text-center mt-4">
                <button className="btn btn-secondary" type="submit">บันทึก</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
