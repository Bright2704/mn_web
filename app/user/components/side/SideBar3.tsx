import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SideBarItem {
    title: string;
    icon: string;
    link: string;
    subItems?: SideBarItem[];
}

const SideBar3 = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const menuItems: SideBarItem[] = [
        {
            title: 'สินค้าไม่มีจำหน่าย',
            icon: '/images/icon3.png',  // Ensure path is correct and starts from the public directory
            link: '#',
            subItems: [
                { title: 'Sub Item 1', icon: '/images/icon1.png', link: '#' },
                { title: 'Sub Item 2', icon: '/images/icon2.png', link: '#' }
            ]
        },
        // More items...
    ];

    const toggleSubMenu = (index: number) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    return (
        <div className="sidebar">
            <ul>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <Link href={item.link}>
                            <a onClick={(e) => {
                                e.preventDefault();
                                toggleSubMenu(index);
                            }}>
                                <Image src={item.icon} alt={item.title} width={50} height={50} />
                                {item.title}
                            </a>
                        </Link>
                        {item.subItems && activeIndex === index && (
                            <ul className="submenu">
                                {item.subItems.map((subItem, subIndex) => (
                                    <li key={subIndex}>
                                        <Link href={subItem.link}>
                                            <a>
                                                <Image src={subItem.icon} alt={subItem.title} width={50} height={50} />
                                                {subItem.title}
                                            </a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideBar3;
