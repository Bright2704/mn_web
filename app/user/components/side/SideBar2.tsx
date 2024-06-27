// app/components/SideBar2.tsx
import Link from 'next/link';
// import Styles from '../../globals.css';
// import styles from './SideBar.module.css'; // Ensure this path is correct based on your CSS file location

const SideBar2 = () => {
    return (
        <div className="sidebar">
            {/* <h1 className="text-2xl font-bold">Menu</h1> */}
            <ul>
                <li>
                    <Link href="/dashboard">
                        แดชบอร์ด
                    </Link>
                </li>
                <li>
                    <Link href="/announcement">
                        ประกาศ
                    </Link>
                </li>
                <li>
                    <Link href="/BuyList">
                        รายการสั่งซื้อ
                    </Link>
                </li>
                <li>
                    <Link href="/Import">
                        เช็คสถานะสินค้าและแจ้งนำออก
                    </Link>
                </li>
                <li>
                    <Link href="/Export">
                        รายการนำสินค้าออก
                    </Link>
                </li>
                <li>
                    <Link href="/Code">
                        รหัสพัสดุ
                    </Link>
                </li>
                <li>
                    <Link href="/Service">
                        บริการขนส่งไปจีน
                    </Link>
                </li>
                <li>
                    <Link href="/Money">
                        กระเป๋าเงิน
                    </Link>
                </li>
                <li>
                    <Link href="/Point">
                        สะสมแต้ม
                    </Link>
                </li>
                <li>
                    <Link href="/ImportExport">
                        เช็คสถานะสินค้าและแจ้งนำออก
                    </Link>
                </li>
                <li>
                    <Link href="/ListNoOwner">
                        รายการสินค้าไม่มีเจ้าของ
                    </Link>
                </li>
                <li>
                    <Link href="/Setting">
                        ตั้งค่าบัญชีผู้ใช้งาน
                    </Link>
                </li>
                <li>
                    <Link href="/GuideBook">
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
                    </Link>
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
