import React, { useState } from 'react';
import Image from 'next/image';

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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-4/5 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-xl font-medium">นำเข้าเลขพัสดุ</h5>
          <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose} style={{ background: 'none', border: 'none' }}>
            <span className="text-xl">&times;</span>
          </button>
        </div>
        <div className="p-4 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 md:pr-4">
            <form method="post" encType="multipart/form-data" onSubmit={handleImport} className="card-body">
              <input type="hidden" name="_token" value="lGT5gLceZdygZhH8Rom1DpJo9FTZMx10xmA2ktwA" />
              <h5 className="mb-4">อัพเดทสถานะพัสดุ</h5>
              <div className="form-group">
                <div className="text-muted mb-4">กรุณากรอกข้อมูลให้ตรงตามแบบฟอร์มที่กำหนด</div>
                <div className="text-red-500 mb-4">
                  *กรณีอัพโหลดไฟล์ไม่สำเร็จ อาจเกิดจากข้อมูลไม่ถูกต้อง ให้ทำการตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง
                </div>
                <a className="inline-flex items-center text-blue-500" href="https://member.mn1688express.com/cms/forwarders/items/import/template" target="_blank">
                  <Image className="icon-img mr-2" width={`${40}`} src="https://member.mn1688express.com/assets/icons/020-xls.png" alt="template file" />
                  ดาวน์โหลด Template
                </a>
              </div>
              <hr className="my-4" />
              <div className="form-group">
                <label className="font-medium mb-2" htmlFor="status">สถานะพัสดุ</label>
                <select className="form-control" name="status" id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="1">รอพัสดุเข้าโกดัง</option>
                  <option value="2">รอพัสดุถึงไทย</option>
                </select>
              </div>
              <div className="form-group">
                <label className="font-medium mb-2" htmlFor="file">ไฟล์ Excel หรือ csv เท่านั้น</label>
                <input className="form-control h-auto" type="file" name="file" id="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
              </div>
              <div className="form-group text-right mt-4">
                <button className="btn btn-secondary" type="submit">บันทึก</button>
              </div>
            </form>
          </div>
          <div className="w-full md:w-1/2 md:pl-4 mt-8 md:mt-0">
            <div className="card-body">
              <div className="table-responsive">
                <h5>วิธีการกรอกข้อมูล</h5>
                <p className="text-lg text-red-500">*จำเป็นต้องกรอก</p>
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>หัวตาราง</th>
                      <th>ตัวอย่าง</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">*รหัสผู้ใช้</td>
                      <td className="py-2">MN0001</td>
                    </tr>
                    <tr>
                      <td className="py-2">ล็อตตู้สินค้า</td>
                      <td className="py-2">LC-2000</td>
                    </tr>
                    <tr>
                      <td className="py-2">วันที่เข้าโกดังจีน</td>
                      <td className="py-2">10/08/2024</td>
                    </tr>
                    <tr>
                      <td className="py-2">*เลขพัสดุ</td>
                      <td className="py-2">43156156883321</td>
                    </tr>
                    <tr>
                      <td className="py-2">จำนวนสินค้า</td>
                      <td className="py-2">1</td>
                    </tr>
                    <tr>
                      <td className="py-2">จำนวนกล่อง</td>
                      <td className="py-2">1</td>
                    </tr>
                    <tr>
                      <td className="py-2">กว้าง(cm)</td>
                      <td className="py-2">10.14</td>
                    </tr>
                    <tr>
                      <td className="py-2">ยาว(cm)</td>
                      <td className="py-2">5</td>
                    </tr>
                    <tr>
                      <td className="py-2">สูง(cm)</td>
                      <td className="py-2">15</td>
                    </tr>
                    <tr>
                      <td className="py-2">คิว</td>
                      <td className="py-2">0.0008</td>
                    </tr>
                    <tr>
                      <td className="py-2">น้ำหนัก(kg)</td>
                      <td className="py-2">0.5</td>
                    </tr>
                    <tr>
                      <td className="py-2">ค่าเช็คสินค้า</td>
                      <td className="py-2">10.00</td>
                    </tr>
                    <tr>
                      <td className="py-2">ค่าตีลัง</td>
                      <td className="py-2">300.00</td>
                    </tr>
                    <tr>
                      <td className="py-2">ประเภทสินค้า</td>
                      <td className="py-2">
                        ทั่วไป, อย, มอก, พิเศษ, พิเศษ 1, พิเศษ 2, พิเศษ 3,<br />
                        อิเล็กทรอนิกส์, เครื่องสำอางค์, แบรนด์, ของเล่น/โมเดล
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">ขนส่งโดย</td>
                      <td className="py-2">รถ หรือ เรือ</td>
                    </tr>
                    <tr>
                      <td className="py-2">รายละเอียดสินค้า</td>
                      <td className="py-2">เสื้อผ้า</td>
                    </tr>
                    <tr>
                      <td className="py-2">หมายเหตุ</td>
                      <td className="py-2">หมายเหตุแจ้งลูกค้า</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
