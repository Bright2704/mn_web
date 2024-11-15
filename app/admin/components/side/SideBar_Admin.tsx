"use client"; // Add this line

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FormEvent } from 'react';
import { Right } from 'react-bootstrap/lib/Media';
import { Anuphan } from 'next/font/google';
import { useRouter, usePathname } from 'next/navigation';

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

    const router = useRouter();
    const pathname = usePathname();

  return (
    <>
    <div className='flex'>
      <div className='sidebar relative z-0' style={{
          width: isCollapsed ? '50px' : '230px', // Adjust min-width dynamically
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
        className="sidebar-btn fixed top-0 py-3 px-3 rounded-md"
        onClick={toggleSidebar}
        style={{ zIndex: 99 }}
      >
        <Image src="/angle-circle-left.png" alt='button icon' width={20} height={20} style={{transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition:"transform 0.2s ease-out"}}/>
      </button>
      </div>
    </div>
    
    <div className="sidebar fixed" style={{
          width: isCollapsed ? '50px' : '230px', // Adjust min-width dynamically
          transition: 'width .2s ease', // Smooth transition
          fontFamily: anuphan.style.fontFamily,
        }}>
          <Link href="/" style={{margin:'0', padding:'0'}}>
          <Image className='sidebar-logo' src="/logo_MN1688_rmb.png" alt='web logo' width={100} height={100} />
          </Link>
        
      <ul>
      <li className={`menu-item`} style={{background: pathname === '/admin/dashboard' ? '#f48ca9':''}}>
          <Link href="/admin/dashboard">
            <Image className='h-full mr-2 hover-icon' src="/dashboard-monitor.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/admin/dashboard' ? 'invert(1)':''}}/> 
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/admin/dashboard' ? 'white':''}}> แดชบอร์ด </p>
          </Link>
        </li>
        <li className="menu-item" style={{background: pathname === '/admin/settings' ? '#f48ca9':''}}>
          <Link href="/admin/settings">
            <Image className='h-full mr-2 hover-icon' src="/settings.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/admin/settings' ? 'invert(1)':''}}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/admin/settings' ? 'white':''}}>ตั้งค่าระบบ</p>
          </Link>
        </li>
        <li className="menu-item" style={{background: pathname === '/admin/announcement' ? '#f48ca9':''}}>
          <Link href="/admin/announcement">
            <Image className='h-full mr-2 hover-icon' src="/bell-notification-social-media.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/admin/announcement' ? 'invert(1)':''}}/> 
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/admin/announcement' ? 'white':''}}>ประกาศ</p>
          </Link>
        </li>
        <li className="menu-item" style={{background: pathname === '/admin/chat' ? '#f48ca9':''}}>
          <Link href="/admin/chat">
          <Image className='h-full mr-2 hover-icon' src="/messages.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/admin/chat' ? 'invert(1)':''}}/> 
          <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/admin/chat' ? 'white':''}}>แชท</p>
          </Link>
        </li>
        <li className="menu-item" style={{background: pathname === '/admin/buylist' ? '#f48ca9':''}}>
          <Link href="/admin/buylist">
            <Image className='h-full mr-2 hover-icon' src="/shopping-cart.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/admin/buylist' ? 'invert(1)':''}}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/admin/buylist' ? 'white':''}}>รายการสั่งซื้อ</p>
          </Link>
        </li>
        <li className="menu-item" style={{background: pathname === '/admin/status' ? '#f48ca9':''}}>
          <Link href="/admin/status">
            <Image className='h-full mr-2 hover-icon' src="/file-export.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/admin/status' ? 'invert(1)':''}}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/admin/status' ? 'white':''}}>เช็คสถานะสินค้า</p>
          </Link>
        </li>
        <li className="menu-item" style={{background: pathname === '/admin/export' ? '#f48ca9':''}}>
          <Link href="/admin/export">
            <Image className='h-full mr-2 hover-icon' src="/rectangle-list.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/admin/export' ? 'invert(1)':''}}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/admin/export' ? 'white':''}}>รายการนำสินค้าออก</p>
          </Link>
        </li>
        <li className="menu-item" style={{background: pathname === '/admin/tracking' ? '#f48ca9':''}}>
          <Link href="/admin/tracking">
            <Image className='h-full mr-2 hover-icon' src="/password-alt.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/admin/tracking' ? 'invert(1)':''}}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/admin/tracking' ? 'white':''}}>รหัสพัสดุ</p>
          </Link>
        </li>
        <li className="menu-item" style={{background: pathname === '/admin/lot' ? '#f48ca9':''}}>
          <Link href="/admin/lot">
            <Image className='h-full mr-2 hover-icon' src="/boxes.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/admin/lot' ? 'invert(1)':''}}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/admin/lot' ? 'white':''}}>ล็อตสินค้า</p>
          </Link>
        </li>
        <li className="menu-item" style={{background: pathname === '/admin/transport' ? '#f48ca9':''}}>
          <Link href="/admin/transport">
            <Image className='h-full mr-2 hover-icon' src="/truck-side.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/admin/transport' ? 'invert(1)':''}}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/admin/transport' ? 'white':''}}>บริการขนส่งไปจีน</p>
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
                  <div className="menu-list " style={{ display: isCollapsed ? 'none' : 'flex' }}>
                    <span>กระเป๋าเงิน</span>
                    <span className="menu-list ml-auto mr-4 transform transition-transform duration-200" style={{ transform: isSubmenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' , minWidth:"unset",display: isCollapsed ? 'none' : 'block'}}>▼</span>
                    </div> 
              </div>
          </a>
          
        </li>
        <div className="overflow-hidden transition-all duration-200 ease-in-out" style={{ maxHeight: isSubmenuOpen && !isCollapsed ? '200px' : '0'}}>
            <ul className="submenu">
              <li className="s-menu-item">
                <Link href="/admin/wallet/deposit" style={{color: pathname === '/admin/wallet/deposit' ? '#f04072':''}}>• เติมเงินเข้าระบบ</Link>
              </li>
              <li className="s-menu-item">
                <Link href="/admin/wallet/withdraw" style={{color: pathname === '/admin/wallet/withdraw' ? '#f04072':''}}>• ถอนเงินจากระบบ</Link>
              </li>
              <li className="s-menu-item">
                <Link href="/admin/wallet/transfer" style={{color: pathname === '/admin/wallet/transfer' ? '#f04072':''}}>• โอนเงินไปจีน</Link>
              </li>
              <li className="s-menu-item">
                <Link href="/admin/wallet/alipay" style={{color: pathname === '/admin/wallet/alipay' ? '#f04072':''}}>• เติมเงินอลีเพย์</Link>
              </li>
              <li className="s-menu-item">
                <Link href="/admin/wallet/taobao" style={{color: pathname === '/admin/wallet/taobao' ? '#f04072':''}}>• ฝากจ่ายเถาเปา</Link>
              </li>
            </ul>
          </div>
        <li className="menu-item" style={{background: pathname === '/admin/points' ? '#f48ca9':''}}>
          <Link href="/admin/points">
            <Image className='h-full mr-2 hover-icon' src="/token.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/admin/points' ? 'invert(1)':''}}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/admin/points' ? 'white':''}}>แต้ม</p>
          </Link>
        </li>
        <li className="menu-item" style={{background: pathname === '/admin/points_redeem' ? '#f48ca9':''}}>
          <Link href="/admin/points_redeem">
            <Image className='h-full mr-2 hover-icon' src="/token.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/admin/points_redeem' ? 'invert(1)':''}}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/admin/points_redeem' ? 'white':''}}>แลกแต้ม</p>
          </Link>
        </li>
        <li className="menu-item" style={{background: pathname === '/admin/unowned-items' ? '#f48ca9':''}}>
          <Link href="/admin/unowned-items">
            <Image className='h-full mr-2 hover-icon' src="/person-circle-xmark.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/admin/unowned-items' ? 'invert(1)':''}}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/admin/unowned-items' ? 'white':''}}>รายการสินค้าไม่มีเจ้าของ</p>
          </Link>
        </li>
        <li className="menu-item" style={{background: pathname === '/admin/settings_account' ? '#f48ca9':''}}>
          <Link href="/admin/settings_account">
            <Image className='h-full mr-2 hover-icon' src="/admin-alt.png" alt='dashboard image' width={30} height={30} style={{filter: pathname === '/admin/settings_account' ? 'invert(1)':''}}/>
            <p className="menu-list" style={{ display: isCollapsed ? 'none' : 'block' , color: pathname === '/admin/settings_account' ? 'white':''}}>ตั้งค่าบัญชีผู้ใช้งาน</p>
          </Link>
        </li>
      </ul>
    </div>
    </>
  );
};

export default SideBar2;
