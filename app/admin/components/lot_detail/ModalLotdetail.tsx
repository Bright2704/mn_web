import React from 'react';

interface ModalLotdetailProps {
  show: boolean;
  onClose: () => void;
}

const ModalLotdetail: React.FC<ModalLotdetailProps> = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-xl font-medium">รายละเอียดการเติมเงิน</h5>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
            style={{ background: 'none', border: 'none' }}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
        <div className="p-4">
          {/* You can add any content here in the future */}
          <p>This is an empty modal popup.</p>
        </div>
        <div className="p-4 flex justify-center border-t">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalLotdetail;



// test