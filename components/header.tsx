"use client"

import Link from "next/link";
import Image from "next/image";
import Container from "@/components/container";
import logo from "@/public/logo_MN1688_rmb.png"; // Correct path to the image
import {signOut} from 'next-auth/react'
import { useSession } from 'next-auth/react'

const NavBar = () => {

  const { data: session } = useSession();
    console.log(session)

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
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </Link>
            <ul
              className="
                flex
                items-center
                justify-end
                gap-10
                mr-10
              "
            >
              <li> <a href="#" className="cursor-pointer" >ภาษา</a> </li>
                {!session ? (
                  <>
                  <li> <Link href="/login">ลงชื่อเข้าใช้งาน</Link> </li>
                  </>
                ) : (
                  <>
                    <li> <a className="bg-gray-500 text-white border py-2 px-3 rounded-md text-lg my-2 cursor-pointer" href="/profile" > โปรไฟล์ </a> </li>
                    <li> <a onClick={() => signOut()} className="bg-red-500 text-white border py-2 px-3 rounded-md text-lg my-2 cursor-pointer"> ออกจากระบบ </a> </li>
                  </>
                )}
            </ul>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default NavBar;

