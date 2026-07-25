import React from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiUser, FiShield, FiBell, FiSmartphone } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const SettingsView = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="p-6 lg:p-8 max-w-4xl mx-auto w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <FiSettings className="text-primary-500" /> Settings
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your account and preferences.</p>
      </motion.div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user?.name || 'User'}</h3>
              <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
            <button className="btn-secondary ml-auto">Edit Profile</button>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FiUser /> Account Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-500 mb-1">Full Name</label>
                <input type="text" className="input-field" disabled value={user?.name || ''} />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Email Address</label>
                <input type="email" className="input-field" disabled value={user?.email || ''} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
          <h4 className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <FiSmartphone /> Appearance
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium">Dark Mode</h5>
              <p className="text-sm text-slate-500">Toggle dark mode theme across the application.</p>
            </div>
            <button 
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-primary-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
          <h4 className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <FiShield /> Security (Coming Soon)
          </h4>
          <div className="space-y-6 opacity-60 pointer-events-none">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Two-Factor Authentication</h5>
                <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
              </div>
              <button className="btn-secondary">Enable 2FA</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Auto-lock Vault</h5>
                <p className="text-sm text-slate-500">Automatically require re-authentication after inactivity.</p>
              </div>
              <select className="input-field w-32">
                <option>15 mins</option>
                <option>30 mins</option>
                <option>1 hour</option>
                <option>Never</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SettingsView;
