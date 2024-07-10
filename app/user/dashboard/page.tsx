// // app/user/pages/dashboard.tsx

// import React from 'react';
// import Layout from '../layout';  // Update the import path as necessary
// import TrackingWidget from '../components/TrackingWidget';  // Import your widget
// // import Announcement from '@/app/user/components/Annoucement';
// const dashboard = () => {
//     return (
//             <div className="content">
//                     <TrackingWidget />  {/* Use your widget here */}
//                     {/* Add more widgets as needed */}
//             </div>
//     );
// };

// // export default dashboard;
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
        <Image src={menu1} alt="menu1" width={50} height={50} />
        <div className="sub-text">MN1688</div>
      </div>
      <div className="main-item">
        <Image src={menu2} alt="menu2" width={50} height={50} />
        <div className="sub-text">MN1688 (SEA)</div>
      </div>
      <div className="main-item">
        <Image src={menu3} alt="menu3" width={50} height={50} />
        <div className="sub-text-item3">
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
        <Image src={menu4} alt="menu4" width={50} height={50} />
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
      <Link href="/point" legacyBehavior>
        <div className="main-item">
          <Image src={menu5} alt="menu5" width={50} height={50} />
          <div className="sub-text-item5">
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
