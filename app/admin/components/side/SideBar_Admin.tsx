"use client"; // Add this line

import Link from 'next/link';

const SideBar2 = () => {
  return (
    <div className="sidebar">
      <ul>
        <li className="menu-item">
          <Link href="/admin/dashboard">แดชบอร์ด</Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/settings">ตั้งค่าระบบ</Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/announcement">ประกาศ</Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/chat">แชท</Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/buylist">รายการสั่งซื้อ</Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/status">เช็คสถานะสินค้า</Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/export">รายการนำสินค้าออก</Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/tracking">รหัสพัสดุ</Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/lot">ล็อตสินค้า</Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/transport">บริการขนส่งไปจีน</Link>
        </li>
        <li className="menu-item submenu-item">
          <a href="#">
            กระเป๋าเงิน <span style={{ float: 'right' }}></span>
          </a>
          <ul className="submenu">
            <li className="menu-item">
              <Link href="/admin/wallet/deposit">เติมเงินเข้าระบบ</Link>
            </li>
            <li className="menu-item">
              <Link href="/admin/wallet/withdraw">ถอนเงินจากระบบ</Link>
            </li>
            <li className="menu-item">
              <Link href="/admin/wallet/transfer">โอนเงินไปจีน</Link>
            </li>
            <li className="menu-item">
              <Link href="/admin/wallet/alipay">เติมเงินอลีเพย์</Link>
            </li>
            <li className="menu-item">
              <Link href="/admin/wallet/taobao">ฝากจ่ายเถาเปา</Link>
            </li>
          </ul>
        </li>
        <li className="menu-item">
          <Link href="/admin/points">แต้ม</Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/points_redeem">แลกแต้ม</Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/unowned-items">รายการสินค้าไม่มีเจ้าของ</Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/settings_account">ตั้งค่าบัญชีผู้ใช้งาน</Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar2;
