"use client"; // Add this line
// app/components/SideBar2.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FormEvent } from 'react';
// import Styles from '../../globals.css';
// import styles from './SideBar.module.css'; // Ensure this path is correct based on your CSS file location
import { Anuphan } from 'next/font/google';
import { useRouter, usePathname } from 'next/navigation';

const anuphan = Anuphan({
  subsets: ['latin'],
  weight: ['400', '700'], // choose the weights you need
});

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

    const router = useRouter();
    const pathname = usePathname();

    return (
        <>
        <div className='flex'>
            <div className='sidebar relative z-0' style={{
                width: isCollapsed ? '50px' : '250px', // Adjust min-width dynamically
                transition: 'width .2s ease', // Smooth transition
                }}>
                <Link href="/" style={{margin:'0', padding:'0'}}>
                    <Image className='sidebar-logo' src="/logo_MN1688_rmb.png" alt='web logo' width={100} height={100} />
                </Link>
                <ul>
                <li className="menu-item">
                    <Link href="/user/dashboard">
                        <Image className='h-full mr-2 hover-icon' src="/dashboard-monitor.png" alt='dashboard image' width={30} height={30}/> 
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}> แดชบอร์ด </p>
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/user/announcement">
                        <Image className='h-full mr-2 hover-icon' src="/bell-notification-social-media.png" alt='dashboard image' width={30} height={30}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>ประกาศ</p>
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/user/buylist">
                        <Image className='h-full mr-2 hover-icon' src="/shopping-cart.png" alt='dashboard image' width={30} height={30}/> 
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>รายการสั่งซื้อ</p>
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/user/status">
                    <Image className='h-full mr-2 hover-icon' src="/file-export.png" alt='dashboard image' width={30} height={30}/> 
                    <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>เช็คสถานะสินค้าและแจ้งนำออก</p>
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/user/export">
                        <Image className='h-full mr-2 hover-icon' src="/rectangle-list.png" alt='dashboard image' width={30} height={30}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>รายการนำสินค้าออก</p>
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/user/tracking">
                        <Image className='h-full mr-2 hover-icon' src="/password-alt.png" alt='dashboard image' width={30} height={30}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>รหัสพัสดุ</p>
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/user/service">
                        <Image className='h-full mr-2 hover-icon' src="/truck-side.png" alt='dashboard image' width={30} height={30}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>บริการขนส่งไปจีน</p>
                    </Link>
                </li>
                <li className="menu-item submenu-item"> {/* submenu-item */}
                    <a href="#" onClick={toggleSubmenu}>
                        <div className='flex items-center'>
                            <Image
                            className="h-full mr-2 hover-icon"
                            src="/wallet.png"
                            alt="dashboard image"
                            width={30} height={30}
                            />
                            <span className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>กระเป๋าเงิน</span> 
                        </div>
                        
                        <span className="menu-list ml-auto transform transition-transform duration-200" style={{ transform: isSubmenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' , minWidth:"unset",display: isCollapsed ? 'none' : 'block'}}>▼</span>
                    </a>
                </li>
                <div className="overflow-hidden transition-all duration-200 ease-in-out" style={{ maxHeight: isSubmenuOpen && !isCollapsed ? '200px' : '0'}}>
                    <ul className="submenu">
                    <li className="s-menu-item">
                        <Link href="/user/wallet/deposit">• เติมเงินเข้าระบบ</Link>
                    </li>
                    <li className="s-menu-item">
                        <Link href="/user/wallet/balance">• สมุดบัญชี</Link>
                    </li>
                    </ul>
                </div>
                <li className="menu-item">
                    <Link href="/user/points">
                        <Image className='h-full mr-2 hover-icon' src="/token.png" alt='dashboard image' width={30} height={30}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>สะสมแต้ม</p>
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="listnoowner">
                        <Image className='h-full mr-2 hover-icon' src="/person-circle-xmark.png" alt='dashboard image' width={30} height={30}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>รายการสินค้าไม่มีเจ้าของ</p>
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/user/profile">
                        <Image className='h-full mr-2 hover-icon' src="/admin-alt.png" alt='dashboard image' width={30} height={30}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>ตั้งค่าบัญชีผู้ใช้งาน</p>
                    </Link>
                </li>
                <li className="menu-item submenu-item"> {/* submenu-item */}
                    <a href="#" onClick={toggleSubmenu2}>
                        <div className='flex items-center'>
                            <Image
                            className="h-full mr-2 hover-icon"
                            src="/guide-alt.png"
                            alt="manual image"
                            width={30} height={30}
                            />
                            <span className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>คู่มือการใช้งาน</span> 
                        </div>
                        
                        <span className="menu-list ml-auto transform transition-transform duration-200" style={{ transform: isSubmenuOpen2 ? 'rotate(180deg)' : 'rotate(0deg)' , minWidth:"unset",display: isCollapsed ? 'none' : 'block'}}>▼</span>
                    </a>
                </li>
                <div className="overflow-hidden transition-all duration-200 ease-in-out" style={{ maxHeight: isSubmenuOpen2 && !isCollapsed ? '200px' : '0'}}>
                    <ul className="submenu">
                    <li className="s-menu-item">
                        <Link href="/user/private">• วิธีแก้ไขข้อมูลส่วนตัว</Link>
                    </li>
                    <li className="s-menu-item">
                        <Link href="/user/private">• วิธีการสั่งซื้อและชำระเงิน</Link>
                    </li>
                    <li className="s-menu-item">
                        <Link href="/user/private">• วิธีเติมเงิน/ถอนเงินในระบบ</Link>
                    </li>
                    <li className="s-menu-item">
                        <Link href="/user/private">• วิธีแสดงความเป็นเจ้าของฯ</Link>
                    </li>
                    </ul>
                </div>
                <li className="menu-item">
                    <Link href="/user/LineNotification">
                        <Image className='h-full mr-2 hover-icon' src="/line.png" alt='dashboard image' width={30} height={30}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>เชื่อมต่อ LINE NOTIFY</p>
                    </Link>
                </li>
            </ul>
            </div>
            <div>
            <button
                className="sidebar-btn fixed top-0 py-4 px-3 rounded-md"
                onClick={toggleSidebar}
                style={{ zIndex: 99 }}
              >
                <Image src="/angle-circle-left.png" alt='button icon' width={20} height={20} style={{transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition:"transform 0.2s ease-out"}}/>
            </button>
            </div>
        </div>
            
        <div className="sidebar fixed" style={{
            width: isCollapsed ? '50px' : '250px', // Adjust min-width dynamically
            transition: 'width .2s ease', // Smooth transition
            fontFamily: anuphan.style.fontFamily,
            }}>
            <Link href="/" style={{margin:'0', padding:'0'}}>
                <Image className='sidebar-logo' src="/logo_MN1688_rmb.png" alt='web logo' width={100} height={100} />
            </Link>

            <ul>
                <li className="menu-item" style={{background: pathname === '/user/dashboard' ? '#f48ca9':''}}>
                    <Link href="/user/dashboard">
                        <Image className='h-full mr-2 hover-icon' src="/dashboard-monitor.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/user/dashboard' ? 'invert(1)':''}}/> 
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/user/dashboard' ? 'white':''}}> แดชบอร์ด </p>
                    </Link>
                </li>
                <li className="menu-item" style={{background: pathname === '/user/announcement' ? '#f48ca9':''}}>
                    <Link href="/user/announcement">
                        <Image className='h-full mr-2 hover-icon' src="/bell-notification-social-media.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/user/announcement' ? 'invert(1)':''}}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/user/announcement' ? 'white':''}}>ประกาศ</p>
                    </Link>
                </li>
                <li className="menu-item" style={{background: pathname === '/user/buylist' ? '#f48ca9':''}}>
                    <Link href="/user/buylist">
                        <Image className='h-full mr-2 hover-icon' src="/shopping-cart.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/user/buylist' ? 'invert(1)':''}}/> 
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/user/buylist' ? 'white':''}}>รายการสั่งซื้อ</p>
                    </Link>
                </li>
                <li className="menu-item" style={{background: pathname === '/user/status' ? '#f48ca9':''}}>
                    <Link href="/user/status">
                    <Image className='h-full mr-2 hover-icon' src="/file-export.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/user/status' ? 'invert(1)':''}}/> 
                    <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/user/status' ? 'white':''}}>เช็คสถานะสินค้าและแจ้งนำออก</p>
                    </Link>
                </li>
                <li className="menu-item" style={{background: pathname === '/user/export' ? '#f48ca9':''}}>
                    <Link href="/user/export">
                        <Image className='h-full mr-2 hover-icon' src="/rectangle-list.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/user/export' ? 'invert(1)':''}}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/user/export' ? 'white':''}}>รายการนำสินค้าออก</p>
                    </Link>
                </li>
                <li className="menu-item" style={{background: pathname === '/user/tracking' ? '#f48ca9':''}}>
                    <Link href="/user/tracking">
                        <Image className='h-full mr-2 hover-icon' src="/password-alt.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/user/tracking' ? 'invert(1)':''}}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/user/tracking' ? 'white':''}}>รหัสพัสดุ</p>
                    </Link>
                </li>
                <li className="menu-item" style={{background: pathname === '/user/service' ? '#f48ca9':''}}>
                    <Link href="/user/service">
                        <Image className='h-full mr-2 hover-icon' src="/truck-side.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/user/service' ? 'invert(1)':''}}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/user/service' ? 'white':''}}>บริการขนส่งไปจีน</p>
                    </Link>
                </li>
                <li className="menu-item submenu-item"> {/* submenu-item */}
                    <a href="#" onClick={toggleSubmenu}>
                        <div className='flex items-center'>
                            <Image
                            className="h-full mr-2 hover-icon"
                            src="/wallet.png"
                            alt="dashboard image"
                            width={30} height={30}
                            />
                            <span className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>กระเป๋าเงิน</span> 
                        </div>
                        
                        <span className="menu-list ml-auto transform transition-transform duration-200" style={{ transform: isSubmenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' , minWidth:"unset",display: isCollapsed ? 'none' : 'block'}}>▼</span>
                    </a>
                </li>
                <div className="overflow-hidden transition-all duration-200 ease-in-out" style={{ maxHeight: isSubmenuOpen && !isCollapsed ? '200px' : '0'}}>
                    <ul className="submenu">
                    <li className="s-menu-item">
                        <Link href="/user/wallet/deposit" style={{color: pathname === '/user/wallet/deposit' ? '#f04072':''}}>• เติมเงินเข้าระบบ</Link>
                    </li>
                    <li className="s-menu-item">
                        <Link href="/user/wallet/balance" style={{color: pathname === '/user/wallet/balance' ? '#f04072':''}}>• สมุดบัญชี</Link>
                    </li>
                    </ul>
                </div>
                <li className="menu-item" style={{background: pathname === '/user/points' ? '#f48ca9':''}}>
                    <Link href="/user/points">
                        <Image className='h-full mr-2 hover-icon' src="/token.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/user/points' ? 'invert(1)':''}}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/user/points' ? 'white':''}}>สะสมแต้ม</p>
                    </Link>
                </li>
                <li className="menu-item" style={{background: pathname === 'listnoowner' ? '#f48ca9':''}}>
                    <Link href="listnoowner">
                        <Image className='h-full mr-2 hover-icon' src="/person-circle-xmark.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === 'listnoowner' ? 'invert(1)':''}}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === 'listnoowner' ? 'white':''}}>รายการสินค้าไม่มีเจ้าของ</p>
                    </Link>
                </li>
                <li className="menu-item" style={{background: pathname === '/user/profile' ? '#f48ca9':''}}>
                    <Link href="/user/profile">
                        <Image className='h-full mr-2 hover-icon' src="/admin-alt.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/user/profile' ? 'invert(1)':''}}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/user/profile' ? 'white':''}}>ตั้งค่าบัญชีผู้ใช้งาน</p>
                    </Link>
                </li>
                <li className="menu-item submenu-item"> {/* submenu-item */}
                    <a href="#" onClick={toggleSubmenu2}>
                        <div className='flex items-center'>
                            <Image
                            className="h-full mr-2 hover-icon"
                            src="/guide-alt.png"
                            alt="manual image"
                            width={30} height={30}
                            />
                            <span className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>คู่มือการใช้งาน</span> 
                        </div>
                        
                        <span className="menu-list ml-auto transform transition-transform duration-200" style={{ transform: isSubmenuOpen2 ? 'rotate(180deg)' : 'rotate(0deg)' , minWidth:"unset",display: isCollapsed ? 'none' : 'block'}}>▼</span>
                    </a>
                </li>
                <div className="overflow-hidden transition-all duration-200 ease-in-out" style={{ maxHeight: isSubmenuOpen2 && !isCollapsed ? '200px' : '0'}}>
                    <ul className="submenu">
                    <li className="s-menu-item">
                        <Link href="/user/private" style={{color: pathname === '/user/private' ? '#f04072':''}}>• วิธีแก้ไขข้อมูลส่วนตัว</Link>
                    </li>
                    <li className="s-menu-item">
                        <Link href="/user/private" style={{color: pathname === '/user/private' ? '#f04072':''}}>• วิธีการสั่งซื้อและชำระเงิน</Link>
                    </li>
                    <li className="s-menu-item">
                        <Link href="/user/private" style={{color: pathname === '/user/private' ? '#f04072':''}}>• วิธีเติมเงิน/ถอนเงินในระบบ</Link>
                    </li>
                    <li className="s-menu-item">
                        <Link href="/user/private" style={{color: pathname === '/user/private' ? '#f04072':''}}>• วิธีแสดงความเป็นเจ้าของฯ</Link>
                    </li>
                    </ul>
                </div>
                <li className="menu-item" style={{background: pathname === '/user/LineNotification' ? '#f48ca9':''}}>
                    <Link href="/user/LineNotification">
                        <Image className='h-full mr-2 hover-icon' src="/line.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/user/LineNotification' ? 'invert(1)':''}}/>
                        <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/user/LineNotification' ? 'white':''}}>เชื่อมต่อ LINE NOTIFY</p>
                    </Link>
                </li>
            </ul>
        </div>
    </>
    );
};

export default SideBar2;
