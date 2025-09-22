
import React from 'react';
import { HomeIcon, UsersIcon, BriefcaseIcon, SettingsIcon, LogoIcon, ShoppingCartIcon, ArrowPathIcon, ChartBarIcon, ClockIcon, MailIcon, DocumentTextIcon, CreditCardIcon } from './Icons';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 transform hover:scale-110 ${
      active ? 'bg-accent-cyan text-black shadow-glow-cyan' : 'text-light-gray hover:bg-dark-border hover:text-white'
    }`}
  >
    {icon}
  </button>
);

const navItems = [
  { id: 'home', icon: <HomeIcon />, label: 'Home' },
  { id: 'users', icon: <UsersIcon />, label: 'Users' },
  { id: 'projects', icon: <BriefcaseIcon />, label: 'Projects' },
  { id: 'messenger', icon: <MailIcon />, label: 'Messenger' },
  { id: 'ecommerce', icon: <ShoppingCartIcon />, label: 'E-commerce' },
  { id: 'trading', icon: <ArrowPathIcon />, label: 'P2P Trading' },
  { id: 'finance', icon: <CreditCardIcon />, label: 'Finance' },
  { id: 'stats', icon: <ChartBarIcon />, label: 'Statistics' },
];

interface SidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  
    return (
      <aside className="w-20 bg-dark-card rounded-4xl flex flex-col items-center justify-between py-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-white">
            <LogoIcon className="w-8 h-8"/>
          </div>
          <nav className="flex flex-col items-center space-y-4">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activePage === item.id}
                onClick={() => setActivePage(item.id)}
              />
            ))}
          </nav>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <NavItem 
            icon={<SettingsIcon />} 
            label="Settings" 
            active={activePage === 'settings'}
            onClick={() => setActivePage('settings')} 
          />
        </div>
      </aside>
    );
};
