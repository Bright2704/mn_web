"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "@/components/container";
import logo from "@/public/logo_MN1688_rmb.png"; // Correct path to the image
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa"; // Import a user icon from react-icons

const NavBar = () => {
  const { data: session } = useSession();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (session?.user) {
        const userId = (session.user as { user_id?: string }).user_id; // Type assertion
        if (userId) {
          setUserId(userId); // Set the user_id from session
        } else {
          console.error("User ID not found in session");
        }
      }
    };

    fetchSession();
  }, [session]);

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
      <div className="border-b-[1px]">
        <Container>
          <div className="flex justify-end items-center">
            <ul
              className="
                flex
                items-center
                justify-end
                gap-10
                mr-10
              "
            >
              <li style={{paddingBlock:'0.75rem'}}><Link href="#">ภาษา</Link></li>
              <li style={{paddingBlock:'0.75rem'}}><Link href="/"> หน้าแรก </Link></li>
              {!session ? (
                <>
                  <li style={{paddingBlock:'0.75rem'}}>
                    <Link href="/login">ลงชื่อเข้าใช้งาน</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="user-dropdown h-full" style={{paddingBlock:'0.75rem'}}>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <FaUser className="text-lg" /> {/* User icon */}
                      {userId && <span>{userId}</span>} {/* Display the user_id */}
                    </Link>
                    <ul className="dropdown-options">
                      <li>
                        {session.user?.role === "admin" ? (
                          <a href="/admin/profile">บัญชีผู้ใช้งาน</a>
                        ) : (
                          <a href="/user/profile">บัญชีผู้ใช้งาน</a>
                        )}
                      </li>
                      <li>
                        <a onClick={() => signOut()}> ออกจากระบบ </a>
                      </li>
                    </ul>
                  </li>
                  {/* <li>
                    <a
                      onClick={() => signOut()}
                      className="bg-red-500 text-white border py-2 px-3 rounded-md text-lg my-2 cursor-pointer"
                    >
                      ออกจากระบบ
                    </a>
                  </li> */}
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
