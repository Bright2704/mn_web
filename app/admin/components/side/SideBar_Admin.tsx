"use client"; // Add this line

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FormEvent } from 'react';

const SideBar2 = () => {

  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

    const toggleSubmenu = (e:FormEvent) => {
        e.preventDefault();
        setIsSubmenuOpen(!isSubmenuOpen);
    };

  return (
    <div className="sidebar">
      <ul>
        <li className="menu-item">
          <Link href="/admin/dashboard">
            <Image className='h-full mr-2 hover-icon' src="/dashboard-monitor.png" alt='dashboard image' width={14} height={10}/> 
            แดชบอร์ด
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/settings">
            <Image className='h-full mr-2 hover-icon' src="/settings.png" alt='dashboard image' width={14} height={10}/>
            ตั้งค่าระบบ
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/announcement">
            <Image className='h-full mr-2 hover-icon' src="/bell-notification-social-media.png" alt='dashboard image' width={14} height={10}/> 
            ประกาศ
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/chat">
          <Image className='h-full mr-2 hover-icon' src="/messages.png" alt='dashboard image' width={14} height={10}/> 
          แชท
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/buylist">
            <Image className='h-full mr-2 hover-icon' src="/shopping-cart.png" alt='dashboard image' width={14} height={10}/>
            รายการสั่งซื้อ
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/status">
            <Image className='h-full mr-2 hover-icon' src="/file-export.png" alt='dashboard image' width={14} height={10}/>
            เช็คสถานะสินค้า
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/export">
            <Image className='h-full mr-2 hover-icon' src="/rectangle-list.png" alt='dashboard image' width={14} height={10}/>
            รายการนำสินค้าออก
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/tracking">
            <Image className='h-full mr-2 hover-icon' src="/password-alt.png" alt='dashboard image' width={14} height={10}/>
            รหัสพัสดุ
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/lot">
            <Image className='h-full mr-2 hover-icon' src="/boxes.png" alt='dashboard image' width={14} height={10}/>
            ล็อตสินค้า
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/transport">
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
                <Link href="/admin/wallet/deposit">• เติมเงินเข้าระบบ</Link>
              </li>
              <li className="menu-item">
                <Link href="/admin/wallet/withdraw">• ถอนเงินจากระบบ</Link>
              </li>
              <li className="menu-item">
                <Link href="/admin/wallet/transfer">• โอนเงินไปจีน</Link>
              </li>
              <li className="menu-item">
                <Link href="/admin/wallet/alipay">• เติมเงินอลีเพย์</Link>
              </li>
              <li className="menu-item">
                <Link href="/admin/wallet/taobao">• ฝากจ่ายเถาเปา</Link>
              </li>
            </ul>
          </div>
        </li>
        <li className="menu-item">
          <Link href="/admin/points">
            <Image className='h-full mr-2 hover-icon' src="/token.png" alt='dashboard image' width={14} height={10}/>
            แต้ม
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/points_redeem">
            <Image className='h-full mr-2 hover-icon' src="/token.png" alt='dashboard image' width={14} height={10}/>
            แลกแต้ม
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/unowned-items">
            <Image className='h-full mr-2 hover-icon' src="/person-circle-xmark.png" alt='dashboard image' width={14} height={10}/>
            รายการสินค้าไม่มีเจ้าของ
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/admin/settings_account">
            <Image className='h-full mr-2 hover-icon' src="/admin-alt.png" alt='dashboard image' width={14} height={10}/>
            ตั้งค่าบัญชีผู้ใช้งาน
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar2;
