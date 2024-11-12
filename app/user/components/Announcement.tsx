import React from 'react';

const Announcement = () => {
  return (
    <div>
      <div className="announcement-bar green-bar">
        <span>
          หมายเหตุสินค้าที่เข้าโกดังไทยคืนนี้: วันที่ 28 มิ.ย. 67 ตู้รถล็อต 1954,1955,1956,1959,1960
          <br />
          คลังห้องเย็น 12/06/2024 (ตู้เรือล็อต 1735,1736) ติดตรวจ ยังอยู่ในขั้นตอนแยกพัสดุ รอแจ้งเตือนอีกครั้ง
        </span>
      </div>
      <div className="announcement-bar red-bar">
        <span>
          วันอาทิตย์ ลูกค้าสามารถเข้ารับสินค้าได้เช่นกัน ตั้งแต่เวลา 08.30-21.00 น.
          <br />
          รายชื่อขนส่งที่จัดส่งได้ในวันอาทิตย์ Flash Express, Kerry Express, Best Express, J&T
          <br />
          ไทเกอร์รูปและไปรษณีย์ไทย (นอกเหนือจากนี้จัดส่งได้ในวันทำการเท่านั้น)
          <br />
          สวัสดีครับ และยินดีอย่างยิ่ง
        </span>
      </div>
    </div>
  );
};

export default Announcement;
