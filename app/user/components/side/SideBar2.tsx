// app/components/SideBar2.tsx
"use client"
import Link from 'next/link';
// import Styles from '../../globals.css';
// import styles from './SideBar.module.css'; // Ensure this path is correct based on your CSS file location

const SideBar2 = () => {
    return (
        <div className="sidebar">
            {/* <h1 className="text-2xl font-bold">Menu</h1> */}
            <ul>
                <li>
                    <a href="/dashboard">
                        แดชบอร์ด
                    </a>
                </li>
                <li>
                    <a href="/announcement">
                        ประกาศ
                    </a>
                </li>
                <li>
                    <a href="/BuyList">
                        รายการสั่งซื้อ
                    </a>
                </li>
                <li>
                    <a href="/Import">
                        เช็คสถานะสินค้าและแจ้งนำออก
                    </a>
                </li>
                <li>
                    <a href="/Export">
                        รายการนำสินค้าออก
                    </a>
                </li>
                <li>
                    <a href="/Code">
                        รหัสพัสดุ
                    </a>
                </li>
                <li>
                    <a href="/Service">
                        บริการขนส่งไปจีน
                    </a>
                </li>
                <li>
                    <a href="/Money">
                        กระเป๋าเงิน
                    </a>
                </li>
                <li>
                    <a href="/Point">
                        สะสมแต้ม
                    </a>
                </li>
                <li>
                    <a href="/ImportExport">
                        เช็คสถานะสินค้าและแจ้งนำออก
                    </a>
                </li>
                <li>
                    <a href="/ListNoOwner">
                        รายการสินค้าไม่มีเจ้าของ
                    </a>
                </li>
                <li>
                    <a href="/Setting">
                        ตั้งค่าบัญชีผู้ใช้งาน
                    </a>
                </li>
                <li>
                    <a href="/GuideBook">
                        คู่มือการใช้งาน
                            <div className="submenu">
                                <li>
                                    <a>
                                        วิธีแก้ไขข้อมูลส่วนตัว
                                    </a>
                                    <a>
                                        วิธีการสั่งซื้อและชำระเงิน
                                    </a>
                                    <a>
                                        วิธีเติมเงิน/ถอนเงินในระบบ
                                    </a>
                                    <a>
                                        วิธีแสดงความเป็นเจ้าของฯ
                                    </a>
                                </li>
                            </div>
                    </a>
                </li>
                <li>
                    <a href="/LineNotification">
                        เชื่อมต่อ LINE NOTIFY
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default SideBar2;
