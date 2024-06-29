// app/components/SideBar2.tsx
import Link from 'next/link';
// import Styles from '../../globals.css';
// import styles from './SideBar.module.css'; // Ensure this path is correct based on your CSS file location

const SideBar2 = () => {
    return (
        <div className="sidebar">
            {/* <h1 className="text-2xl font-bold">Menu</h1> */}
            <ul>
                <li className="menu-item">
                    <Link href="/dashboard">
                        แดชบอร์ด
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="./announcement">
                        ประกาศ
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="./buylist">
                        รายการสั่งซื้อ
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="./Import">
                        เช็คสถานะสินค้าและแจ้งนำออก
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="./Export">
                        รายการนำสินค้าออก
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="./Code">
                        รหัสพัสดุ
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="./Service">
                        บริการขนส่งไปจีน
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="./Money">
                        กระเป๋าเงิน
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="./Point">
                        สะสมแต้ม
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="./ImportExport">
                        เช็คสถานะสินค้าและแจ้งนำออก
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="./ListNoOwner">
                        รายการสินค้าไม่มีเจ้าของ
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="./Setting">
                        ตั้งค่าบัญชีผู้ใช้งาน
                    </Link>
                </li>
                <li className="menu-item submenu-item">
                    <a href="#">
                    คู่มือการใช้งาน
                    </a>
                    <ul className="submenu">
                        <li className="menu-item">
                            <Link href="/user/private">
                                วิธีแก้ไขข้อมูลส่วนตัว
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link href="/user/private">
                                วิธีการสั่งซื้อและชำระเงิน
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link href="/user/private">
                                วิธีเติมเงิน/ถอนเงินในระบบ
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link href="/user/private">
                                วิธีแสดงความเป็นเจ้าของฯ
                            </Link>
                        </li>
                    </ul>
                </li>
                <li className="menu-item">
                    <Link href="/user/LineNotification">
                        เชื่อมต่อ LINE NOTIFY
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default SideBar2;
