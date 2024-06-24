import Link from "next/link";
import Image from "next/image";
import Container from "../container";
import logo from "../../images/logo_MN1688_rmb.png"; // Correct path to the image

const NavBar = () => {
  return (
    <div
      className="
        sticky
        top-0
        w-full
        bg-custom-faf2f2 
        z-30
        shadow-sm
      "
    >
      <div className="py-1 border-b-[1px]">
        <Container>
          <div className="flex justify-between items-center">
            <Link href="/" passHref>
              <div style={{ position: 'relative', height: '100px', width: '150px' }}>
                <Image 
                  src={logo} 
                  alt="MN-Shop Logo" 
                  layout="fill" 
                  objectFit="contain" 
                />
              </div>
            </Link>
            <div
              className="
                flex
                items-center
                justify-end
                gap-10
                mr-10
              "
            >
              <div>การแจ้งเตือน</div>
              <div>ภาษา</div>
              <div>ผู้ใช้งาน</div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default NavBar;
