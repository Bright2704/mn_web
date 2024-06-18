import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-gray-800 text-white w-64 p-4`}>
      <button onClick={toggleSidebar} className="mb-4 text-right w-full">
        {isOpen ? 'Hide' : 'Show'}
      </button>
      <ul>
        {Array.from({ length: 10 }, (_, i) => (
          <li key={i} className="py-2 px-4 hover:bg-gray-700 rounded">
            Menu Item {i + 1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
