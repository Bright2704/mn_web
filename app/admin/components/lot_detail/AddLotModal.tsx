import React from 'react';

interface AddLotModalProps {
  show: boolean;
  onClose: () => void;
}

const AddLotModal: React.FC<AddLotModalProps> = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2">
        <div className="modal-content">
          <header className="modal-header">
            <h5 className="modal-title">เพิ่มล็อตสินค้า</h5>
            <button type="button" aria-label="Close" className="close" onClick={onClose}>
              ×
            </button>
          </header>
          <div className="modal-body">
            <label htmlFor="Type">ประเภทขนส่ง <span className="text-danger">*</span></label>
            <div className="demo-inline-spacing mt-n1">
              <div className="custom-control custom-radio">
                <input type="radio" name="transportType" className="custom-control-input" value="1" id="car" />
                <label className="custom-control-label" htmlFor="car"> รถ </label>
              </div>
              <div className="custom-control custom-radio">
                <input type="radio" name="transportType" className="custom-control-input" value="2" id="boat" />
                <label className="custom-control-label" htmlFor="boat"> เรือ </label>
              </div>
            </div>
          </div>
          <footer className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>ยกเลิก</button>
            <button type="button" className="btn btn-primary">บันทึก</button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AddLotModal;
