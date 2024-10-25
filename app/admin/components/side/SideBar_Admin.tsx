"use client"; // Add this line

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FormEvent } from 'react';
import { Right } from 'react-bootstrap/lib/Media';
import { Anuphan } from 'next/font/google';

const anuphan = Anuphan({
  subsets: ['latin'],
  weight: ['400', '700'], // choose the weights you need
});

const SideBar2 = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev); // Toggle sidebar collapse
  };

    const toggleSubmenu = (e:FormEvent) => {
        e.preventDefault();
        setIsSubmenuOpen(prev => !prev);
    };

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
          <Link href="/admin/dashboard">
            <Image className='h-full mr-2 hover-icon' src="/dashboard-monitor.png" alt='dashboard image' width={30} height={30}/> 
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}> แดชบอร์ด </p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/settings">
            <Image className='h-full mr-2 hover-icon' src="/settings.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>ตั้งค่าระบบ</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/announcement">
            <Image className='h-full mr-2 hover-icon' src="/bell-notification-social-media.png" alt='dashboard image' width={30} height={30}/> 
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>ประกาศ</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/chat">
          <Image className='h-full mr-2 hover-icon' src="/messages.png" alt='dashboard image' width={30} height={30}/> 
          <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>แชท</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/buylist">
            <Image className='h-full mr-2 hover-icon' src="/shopping-cart.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>รายการสั่งซื้อ</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/status">
            <Image className='h-full mr-2 hover-icon' src="/file-export.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>เช็คสถานะสินค้า</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/export">
            <Image className='h-full mr-2 hover-icon' src="/rectangle-list.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>รายการนำสินค้าออก</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/tracking">
            <Image className='h-full mr-2 hover-icon' src="/password-alt.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>รหัสพัสดุ</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/lot">
            <Image className='h-full mr-2 hover-icon' src="/boxes.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>ล็อตสินค้า</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/transport">
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
                <Link href="/admin/wallet/deposit">• เติมเงินเข้าระบบ</Link>
              </li>
              <li className="s-menu-item">
                <Link href="/admin/wallet/withdraw">• ถอนเงินจากระบบ</Link>
              </li>
              <li className="s-menu-item">
                <Link href="/admin/wallet/transfer">• โอนเงินไปจีน</Link>
              </li>
              <li className="s-menu-item">
                <Link href="/admin/wallet/alipay">• เติมเงินอลีเพย์</Link>
              </li>
              <li className="s-menu-item">
                <Link href="/admin/wallet/taobao">• ฝากจ่ายเถาเปา</Link>
              </li>
            </ul>
          </div>
        <li className="menu-item">
          <Link href="/admin/points">
            <Image className='h-full mr-2 hover-icon' src="/token.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>แต้ม</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/points_redeem">
            <Image className='h-full mr-2 hover-icon' src="/token.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>แลกแต้ม</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/unowned-items">
            <Image className='h-full mr-2 hover-icon' src="/person-circle-xmark.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>รายการสินค้าไม่มีเจ้าของ</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/settings_account">
            <Image className='h-full mr-2 hover-icon' src="/admin-alt.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>ตั้งค่าบัญชีผู้ใช้งาน</p>
          </Link>
        </li>
      </ul>
      </div>
      <div>
      <button
        className="sidebar-btn fixed top-0 py-2 px-3 rounded-md bg-red-500"
        onClick={toggleSidebar}
        style={{ zIndex: 99 }}
      >
        {isCollapsed ? '>' : '<'} {/* Display different text when collapsed */}
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
        <li className="menu-item">
          <Link href="/admin/dashboard">
            <Image className='h-full mr-2 hover-icon' src="/dashboard-monitor.png" alt='dashboard image' width={30} height={30}/> 
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}> แดชบอร์ด </p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/settings">
            <Image className='h-full mr-2 hover-icon' src="/settings.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>ตั้งค่าระบบ</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/announcement">
            <Image className='h-full mr-2 hover-icon' src="/bell-notification-social-media.png" alt='dashboard image' width={30} height={30}/> 
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>ประกาศ</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/chat">
          <Image className='h-full mr-2 hover-icon' src="/messages.png" alt='dashboard image' width={30} height={30}/> 
          <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>แชท</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/buylist">
            <Image className='h-full mr-2 hover-icon' src="/shopping-cart.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>รายการสั่งซื้อ</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/status">
            <Image className='h-full mr-2 hover-icon' src="/file-export.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>เช็คสถานะสินค้า</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/export">
            <Image className='h-full mr-2 hover-icon' src="/rectangle-list.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>รายการนำสินค้าออก</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/tracking">
            <Image className='h-full mr-2 hover-icon' src="/password-alt.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>รหัสพัสดุ</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/lot">
            <Image className='h-full mr-2 hover-icon' src="/boxes.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>ล็อตสินค้า</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/transport">
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
                <Link href="/admin/wallet/deposit">• เติมเงินเข้าระบบ</Link>
              </li>
              <li className="s-menu-item">
                <Link href="/admin/wallet/withdraw">• ถอนเงินจากระบบ</Link>
              </li>
              <li className="s-menu-item">
                <Link href="/admin/wallet/transfer">• โอนเงินไปจีน</Link>
              </li>
              <li className="s-menu-item">
                <Link href="/admin/wallet/alipay">• เติมเงินอลีเพย์</Link>
              </li>
              <li className="s-menu-item">
                <Link href="/admin/wallet/taobao">• ฝากจ่ายเถาเปา</Link>
              </li>
            </ul>
          </div>
        <li className="menu-item">
          <Link href="/admin/points">
            <Image className='h-full mr-2 hover-icon' src="/token.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>แต้ม</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/points_redeem">
            <Image className='h-full mr-2 hover-icon' src="/token.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>แลกแต้ม</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/unowned-items">
            <Image className='h-full mr-2 hover-icon' src="/person-circle-xmark.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>รายการสินค้าไม่มีเจ้าของ</p>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/settings_account">
            <Image className='h-full mr-2 hover-icon' src="/admin-alt.png" alt='dashboard image' width={30} height={30}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' }}>ตั้งค่าบัญชีผู้ใช้งาน</p>
          </Link>
        </li>
      </ul>
    </div>
    </>
  );
};

export default SideBar2;
