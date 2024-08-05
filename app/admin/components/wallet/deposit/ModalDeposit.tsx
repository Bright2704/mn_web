import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

type ModalDepositProps = {
  show: boolean;
  onHide: () => void;
  deposit: {
    deposit_id: string;
    date: string;
    user_id: string;
    amount: number | string;
    status: string;
  };
};

const ModalDeposit: React.FC<ModalDepositProps> = ({ show, onHide, deposit }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered dialogClassName="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>รายการเลขที่: {deposit.deposit_id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="card-body">
          <div className="row">
            <div className="col-12 col-xl-6">
              <div className="form-group">
                <div className="_fs-16 _fw-500 _mgbt-4">ธนาคารที่โอน</div>
                <div className="_fs-16 _fw-300">ธนาคาร: กสิกรไทย</div>
                <div className="_fs-16 _fw-300">สาขา: เซ็นทรัลลาดพร้าว</div>
                <div className="_fs-16 _fw-300">เลขบัญชี: 141-3-41660-0</div>
                <div className="_fs-16 _fw-300">ชื่อบัญชี: บริษัท เอ็มเอ็น 1688 คาร์โก้ เอ็กซ์เพรส จำกัด</div>
              </div>
              <div className="form-group">
                <div className="_fs-16 _fw-500 _mgbt-4">ผู้ทำรายการ</div>
                <div className="_fs-16 _fw-300">
                  <a href={`https://member.mn1688express.com/cms/users/${deposit.user_id}`}>
                    {deposit.user_id}
                  </a>
                </div>
                <div className="_fs-16 _fw-300">สุรดา เรือนทองดี</div>
              </div>
            </div>
            <div className="col-12 col-xl-6">
              <div className="form-group">
                <div className="_fs-16 _fw-500 _mgbt-4">วันที่/เวลาที่โอน</div>
                <div className="_fs-16 _fw-300">{deposit.date}</div>
              </div>
              <div className="form-group">
                <div className="_fs-16 _fw-500 _mgbt-4">จำนวนเงิน</div>
                <div className="_fs-16 _fw-300">{deposit.amount} บาท</div>
              </div>
              <div className="form-group">
                <div className="_fs-16 _fw-500 _mgbt-10">หลักฐานการชำระเงิน (pay slip)</div>
                <div>
                  <a href="/storage/slips/test_slip.jpg" target="_blank">
                    <img
                      src="/storage/slips/test_slip.jpg"
                      alt="pay-slip"
                      className="img-fluid"
                    />
                  </a>
                  <div className="_fs-14 _tal-ct-lg text-muted">คลิกที่ภาพเพื่อเปิดรูปใหญ่</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDeposit;
