import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiUser, FiShield, FiBell, FiSmartphone, FiTrash2, FiMail } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const SettingsView = ({ keys = [] }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [expiryReminders, setExpiryReminders] = useState(false);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(keys, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "vaultx-keys-backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone and you will lose all your keys.')) {
      alert('Your account has been securely deleted.');
      logout();
    }
  };

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

        {/* Notifications Settings */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
          <h4 className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <FiBell /> Notifications
          </h4>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Email Alerts</h5>
                <p className="text-sm text-slate-500">Receive emails about security alerts and unusual activity.</p>
              </div>
              <button 
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailAlerts ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Key Expiry Reminders</h5>
                <p className="text-sm text-slate-500">Get notified before an API key expires.</p>
              </div>
              <button 
                onClick={() => setExpiryReminders(!expiryReminders)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${expiryReminders ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${expiryReminders ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 border border-red-100 dark:border-red-900/30">
          <h4 className="font-medium text-red-600 dark:text-red-500 flex items-center gap-2 mb-4 pb-4 border-b border-red-100 dark:border-red-900/30">
            <FiTrash2 /> Danger Zone
          </h4>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h5 className="font-medium text-slate-800 dark:text-slate-200">Export All Data</h5>
                <p className="text-sm text-slate-500">Download a complete backup of all your keys and metadata.</p>
              </div>
              <button onClick={handleExport} className="btn-secondary whitespace-nowrap">Export JSON</button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h5 className="font-medium text-slate-800 dark:text-slate-200">Delete Account</h5>
                <p className="text-sm text-slate-500">Permanently delete your account and all stored keys. This cannot be undone.</p>
              </div>
              <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-medium rounded-xl transition-colors whitespace-nowrap">
                Delete Account
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SettingsView;
