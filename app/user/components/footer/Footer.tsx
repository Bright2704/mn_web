import Container from "../container";
import FooterList from "./FooterList";
import Link from "next/link";
import Image from "next/image";
import logo from "../../images/logo_New-01.png"; // Correct path to the image

const Footer = () => {
    return (
        <footer className="bg-slate-700 text-slate-200 text-sm ">
            <Container>
                <div className="flex flex-col md:flex-row justify-between pt-2.5 pb-0.5">
                        <div className="flex items-center justify-center">
                            <Link href="/" passHref>
                                    <Image 
                                        src={logo} 
                                        alt="MN-Shop Logo" 
                                        width={150} 
                                        height={100} 
                                    />
                            </Link>
                        </div>
                    <FooterList>
                        <h3 className="text-base font-bold mb-1"> ศูนย์ช่วยเหลือ </h3>
                        <a href="#">Help Center</a>
                        <a href="#">สั่งซื้อสินค้าอย่างไร</a>
                        <a href="#">การคืนเงินและคืนสินค้า</a>
                        <a href="#">การันตีโดย MN 1688 EXPRESS คืออะไร</a>
                        <a href="#">ติดต่อ MN 1688 EXPRESS</a>
                    </FooterList>
                    <FooterList>
                        <h3 className="text-base font-bold mb-1"> ศูนย์ช่วยเหลือ </h3>
                        <a href="#">Help Center</a>
                        <a href="#">สั่งซื้อสินค้าอย่างไร</a>
                        <a href="#">การคืนเงินและคืนสินค้า</a>
                        <a href="#">การันตีโดย MN 1688 EXPRESS คืออะไร</a>
                        <a href="#">ติดต่อ MN 1688 EXPRESS</a>
                    </FooterList>
                    <FooterList>
                        <h3 className="text-base font-bold mb-1"> Payment </h3>
                    </FooterList>
                    <FooterList>
                        <h3 className="text-base font-bold mb-1"> deliverly </h3>
                    </FooterList>
                </div>
            </Container>
            <div className="text-white text-center py-2" style={{ backgroundColor: '#E12E4B' }}>
                test
            </div>
        </footer>
    );
}

export default Footer;
