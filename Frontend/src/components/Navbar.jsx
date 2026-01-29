import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles, Menu, X, LogOut } from 'lucide-react'; 

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeMenu();
  };

  const navLinkClasses = ({ isActive }) => 
    isActive 
      ? 'text-white font-semibold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#7C3AED] after:to-[#A855F7]' 
      : 'text-[#9CA3AF] hover:text-white transition-colors';
  
  const toggleMenu = () => setOpen(prev => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <header className="bg-[#0B0F1A]/80 backdrop-blur-xl text-white shadow-lg border-b border-purple-500/10">
      <div className="container mx-auto flex items-center justify-between p-4 px-6 lg:px-12">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            PlanovaAI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          {user && (
            <>
              <NavLink to="/dashboard" className={navLinkClasses}>Dashboard</NavLink>
              <NavLink to="/strategies" className={navLinkClasses}>My Strategies</NavLink>
              <NavLink to="/idea-bank" className={navLinkClasses}>Idea Bank</NavLink>
              <NavLink to="/competitors" className={navLinkClasses}>Competitors</NavLink>
              <NavLink to="/analytics" className={navLinkClasses}>Analytics</NavLink>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout} 
                className="flex items-center gap-2 px-4 py-2 bg-[#111827] border border-purple-500/20 rounded-lg text-[#E5E7EB] hover:border-purple-500/40 hover:text-white transition-colors ml-4"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </>
          )}
          {!user && (
            <>
              <NavLink to="/login" className={navLinkClasses}>Login</NavLink>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="px-6 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-lg font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
              >
                Sign Up
              </motion.button>
            </>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleMenu}
          className="md:hidden p-2 text-[#E5E7EB] hover:text-white"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Mobile Navigation Menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-[#111827]/95 backdrop-blur-xl border-t border-purple-500/10"
        >
          <div className="flex flex-col p-6 space-y-4">
            {user ? (
              <>
                <Link to="/dashboard" onClick={closeMenu} className="py-2 px-3 text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors">Dashboard</Link>
                <Link to="/strategies" onClick={closeMenu} className="py-2 px-3 text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors">My Strategies</Link>
                <Link to="/idea-bank" onClick={closeMenu} className="py-2 px-3 text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors">Idea Bank</Link>
                <Link to="/competitors" onClick={closeMenu} className="py-2 px-3 text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors">Competitors</Link>
                <Link to="/analytics" onClick={closeMenu} className="py-2 px-3 text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors">Analytics</Link>
                
                <button 
                  onClick={handleLogout} 
                  className="py-3 px-3 text-left flex items-center gap-2 border border-purple-500/30 rounded-lg text-[#E5E7EB] hover:border-purple-500/50 hover:bg-[#1F2937] transition-colors mt-4"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="py-2 px-3 text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors">Login</Link>
                <Link to="/signup" onClick={closeMenu} className="py-3 px-3 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-lg font-semibold text-white text-center shadow-lg shadow-purple-500/30">Sign Up</Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;