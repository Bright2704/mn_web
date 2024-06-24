"use client"
import React, { useState } from 'react';

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
            icon: '/path-to-icon1.png',
            link: '#',
            subItems: [
                { title: 'Sub Item 1', icon: '../../images/icon1.png', link: '#' },
                { title: 'Sub Item 2', icon: '../../images/icon2.png', link: '#' }
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
                        <a href={item.link} onClick={(e) => {
                            e.preventDefault();
                            toggleSubMenu(index);
                        }}>
                            <img src={item.icon} alt={item.title} />
                            {item.title}
                        </a>
                        {item.subItems && activeIndex === index && (
                            <ul className="submenu">
                                {item.subItems.map((subItem, subIndex) => (
                                    <li key={subIndex}>
                                        <a href={subItem.link}>
                                            <img src={subItem.icon} alt={subItem.title} />
                                            {subItem.title}
                                        </a>
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
