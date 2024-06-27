import React, { useState } from 'react';

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
                            <a onClick={() => toggleSubMenu(index)} style={{ cursor: 'pointer' }}>
                                {item.icon && <img src={item.icon} alt={item.name} style={{ marginRight: '8px' }} />}
                                {item.name}
                            </a>
                        ) : (
                            <a href={item.link}>
                                {item.icon && <img src={item.icon} alt={item.name} style={{ marginRight: '8px' }} />}
                                {item.name}
                            </a>
                        )}
                        {activeSubMenu === index && item.subMenuItems && (
                            <ul>
                                {item.subMenuItems.map((subItem, subIndex) => (
                                    <li key={subIndex}>
                                        <a href={subItem.link}>
                                            {subItem.icon && <img src={subItem.icon} alt={subItem.name} style={{ marginRight: '8px' }} />}
                                            {subItem.name}
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

export default SideBar4;
