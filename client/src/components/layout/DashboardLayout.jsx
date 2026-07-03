import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-cosmos-950">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <MobileNav />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`transition-all duration-300 ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-60'}`}
      >
        <Navbar />
        <div className="px-4 sm:px-6 lg:px-8 pb-12 pt-4">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
