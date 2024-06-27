import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define types for menu items
type MenuItem = {
    name: string;
    link: string;
    icon?: string;  // Optional icon property if you use icons
    subMenuItems?: MenuItem[];  // Optional sub-menu items
};

// Define props for the component if necessary
interface SidebarProps {
    menuItems: MenuItem[];
}

const SideBar4: React.FC<SidebarProps> = ({ menuItems }) => {
    const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);

    const toggleSubMenu = (index: number): void => {
        setActiveSubMenu(activeSubMenu === index ? null : index);
    };

    return (
        <div className="sidebar">
            <ul>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        {item.subMenuItems ? (
                            <a onClick={(e) => {
                                e.preventDefault();
                                toggleSubMenu(index);
                            }} style={{ cursor: 'pointer' }}>
                                {item.icon && <Image src={item.icon} alt={item.name} width={20} height={20} />}
                                {item.name}
                            </a>
                        ) : (
                            <Link href={item.link}>
                                <a>
                                    {item.icon && <Image src={item.icon} alt={item.name} width={20} height={20} />}
                                    {item.name}
                                </a>
                            </Link>
                        )}
                        {activeSubMenu === index && item.subMenuItems && (
                            <ul>
                                {item.subMenuItems.map((subItem, subIndex) => (
                                    <Link key={subIndex} href={subItem.link}>
                                        <a>
                                            {subItem.icon && <Image src={subItem.icon} alt={subItem.name} width={20} height={20} />}
                                            {subItem.name}
                                        </a>
                                    </Link>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideBar4;
