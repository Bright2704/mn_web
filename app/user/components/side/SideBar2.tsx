// app/components/SideBar2.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FormEvent } from 'react';
// import Styles from '../../globals.css';
// import styles from './SideBar.module.css'; // Ensure this path is correct based on your CSS file location

const SideBar2 = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const [isSubmenuOpen2, setIsSubmenuOpen2] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(prev => !prev); // Toggle sidebar collapse
      };

    const toggleSubmenu = (e:FormEvent) => {
        e.preventDefault();
        setIsSubmenuOpen(prev => !prev);
    };

    const toggleSubmenu2 = (e:FormEvent) => {
        e.preventDefault();
        setIsSubmenuOpen2(prev => !prev);
    };

    return (
        <div className="sidebar">
            {/* <h1 className="text-2xl font-bold">Menu</h1> */}
            <ul>
                <li className="menu-item">
                    <Link href="/user/dashboard">
                        <Image className='h-full mr-2 hover-icon' src="/dashboard-monitor.png" alt='dashboard image' width={14} height={10}/> 
                        แดชบอร์ด
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/user/announcement">
                        <Image className='h-full mr-2 hover-icon' src="/bell-notification-social-media.png" alt='dashboard image' width={14} height={10}/>
                        ประกาศ
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/user/buylist">
                        <Image className='h-full mr-2 hover-icon' src="/shopping-cart.png" alt='dashboard image' width={14} height={10}/>
                        รายการสั่งซื้อ
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/user/status">
                        <Image className='h-full mr-2 hover-icon' src="/file-export.png" alt='dashboard image' width={14} height={10}/>
                        เช็คสถานะสินค้าและแจ้งนำออก
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/user/export">
                        <Image className='h-full mr-2 hover-icon' src="/rectangle-list.png" alt='dashboard image' width={14} height={10}/>
                        รายการนำสินค้าออก
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/user/tracking">
                        <Image className='h-full mr-2 hover-icon' src="/password-alt.png" alt='dashboard image' width={14} height={10}/>
                        รหัสพัสดุ
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/user/service">
                        <Image className='h-full mr-2 hover-icon' src="/truck-side.png" alt='dashboard image' width={14} height={10}/>
                        บริการขนส่งไปจีน
                    </Link>
                </li>
                <li className="menu-item submenu-item"> {/* submenu-item */}
                    <a href="#" onClick={toggleSubmenu} className='justify-between'>
                        <div className='flex items-center'>
                            <Image
                            className="h-full mr-2"
                            src="/wallet.png"
                            alt="dashboard image"
                            width={14}
                            height={10}
                            />
                            กระเป๋าเงิน 
                        </div>
                        
                        <span className="ml-auto transform transition-transform duration-300" style={{ transform: isSubmenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                    </a>
                    <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: isSubmenuOpen ? '200px' : '0' }}>
                        <ul className="submenu">
                        <li className="menu-item">
                            <Link href="/user/wallet/deposit">• เติมเงินเข้าระบบ</Link>
                        </li>
                        <li className="menu-item">
                            <Link href="/user/wallet/balance">• สมุดบัญชี</Link>
                        </li>
                        </ul>
                    </div>
                </li>
                <li className="menu-item">
                    <Link href="/user/points">
                        <Image className='h-full mr-2 hover-icon' src="/token.png" alt='dashboard image' width={14} height={10}/>
                        สะสมแต้ม
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="listnoowner">
                    <Image className='h-full mr-2 hover-icon' src="/person-circle-xmark.png" alt='dashboard image' width={14} height={10}/>
                        รายการสินค้าไม่มีเจ้าของ
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/user/profile">
                    <Image className='h-full mr-2 hover-icon' src="/admin-alt.png" alt='dashboard image' width={14} height={10}/>
                        ตั้งค่าบัญชีผู้ใช้งาน
                    </Link>
                </li>
                <li className="menu-item submenu-item"> {/* submenu-item */}
                    <a href="#" onClick={toggleSubmenu2} className='justify-between'>
                        <div className='flex items-center'>  
                            <Image className='h-full mr-2' src="/guide-alt.png" alt='dashboard image' width={14} height={10}/>
                            คู่มือการใช้งาน 
                        </div>
                        <span className="ml-auto transform transition-transform duration-300" style={{ transform: isSubmenuOpen2 ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                    </a>
                    <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: isSubmenuOpen2 ? '200px' : '0' }}>
                    <ul className="submenu">
                        <li className="menu-item">
                            <Link href="/user/private">
                            • วิธีแก้ไขข้อมูลส่วนตัว
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link href="/user/private">
                            • วิธีการสั่งซื้อและชำระเงิน
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link href="/user/private">
                            • วิธีเติมเงิน/ถอนเงินในระบบ
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link href="/user/private">
                            • วิธีแสดงความเป็นเจ้าของฯ
                            </Link>
                        </li>
                    </ul>
                    </div>
                </li>
                <li className="menu-item">
                    <Link href="/user/LineNotification">
                    <Image className='h-full mr-2 hover-icon' src="/line.png" alt='dashboard image' width={14} height={10}/>
                        เชื่อมต่อ LINE NOTIFY
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default SideBar2;
