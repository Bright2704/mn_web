import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import menu1 from '../../../public/menu1.svg';
import menu2 from '../../../public/menu2.svg';
import menu3 from '../../../public/menu3.svg';
import menu4 from '../../../public/menu4.svg';
import menu5 from '../../../public/menu5.svg';

const DashboardPage = () => {
  return (
    <div className="grid-container">
      <div className="main-item">
        <Image className="responsive-image" src={menu1} alt="menu1" />
        <div className="image-text">MN1688</div>
      </div>
      <div className="main-item">
        <Image className="responsive-image" src={menu2} alt="menu2"/>
        <div className="image-text">MN1688 (SEA)</div>
      </div>
      <div className="main-item">
        <Image className="responsive-image" src={menu3} alt="menu3"/>
        <div className="image-text">
          <span style={{ fontWeight: 500 }}>189.71 ฿</span>
          <div className="row-btn-item">
            <div>
              <Link href="/balance" legacyBehavior>
                <a className="btn-dashboard" style={{ backgroundColor: 'rgb(247, 162, 11)' }}>สมุดบัญชี</a>
              </Link>
            </div>
            <div>
              <Link href="/withdraw/create" legacyBehavior>
                <a className="btn-dashboard" style={{ backgroundColor: 'rgb(247, 162, 11)' }}>ถอนเงิน</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="main-item">
        <Image className="large-image" src={menu4} alt="menu4"/>
        <div className="sub-text-item4">
          ¥ 0.00
          <div className="row-btn-item">
            <div>
              <Link href="/payfor?type=balance" legacyBehavior>
                <a className="btn-dashboard" style={{ backgroundColor: 'rgb(37, 196, 217)' }}>สมุดบัญชี</a>
              </Link>
            </div>
            <div>
              <Link href="#" legacyBehavior>
                <a className="btn-dashboard" style={{ backgroundColor: 'rgb(37, 196, 217)' }}>แลกเงินหยวน</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Link href="/user/points" legacyBehavior>
        <div className="main-item">
          <Image className="responsive-image" src={menu5} alt="menu5" />
          <div className="image-text">
            138.45 p
            <div className="row-btn-item">
              <div>
                <div className="text-dashboard">
                  ทุกค่าขนส่งจากจีนมาไทย<br />
                  150.00 ฿ ได้แต้ม 1P
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DashboardPage;
