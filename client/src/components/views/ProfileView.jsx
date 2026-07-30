import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiCamera } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useRef } from 'react';

const ProfileView = () => {
  const { user, updateProfile, updateProfilePhoto } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Local state for profile fields
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Software Engineer',
    company: user?.company || '',
    location: user?.location || '',
    timezone: user?.timezone || '(GMT-08:00) Pacific Time',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const success = await updateProfilePhoto(file);
      setLoading(false);
      if (success) {
        alert('Profile photo updated successfully!');
      }
    }
  };

  const handleSave = async () => {
    if (isEditing) {
      setLoading(true);
      const success = await updateProfile(profile);
      setLoading(false);
      
      if (success) {
        alert('Profile saved successfully!');
      } else {
        alert('Failed to save profile. Please try again.');
        return; // Don't exit edit mode if failed
      }
    }
    setIsEditing(!isEditing);
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
          <FiUser className="text-primary-500" /> Profile
        </h2>
        <p className="text-slate-500 dark:text-slate-400">View and manage your profile information.</p>
      </motion.div>

      <div className="grid gap-6">
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div 
              className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg cursor-pointer overflow-hidden group"
              onClick={() => fileInputRef.current?.click()}
            >
              {user?.avatar ? (
                <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile.name?.charAt(0).toUpperCase() || 'U'
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FiCamera size={20} />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
              className="hidden" 
              accept="image/*"
            />
            <div>
              <h3 className="text-lg font-semibold">{profile.name || 'User'}</h3>
              <p className="text-slate-500 dark:text-slate-400">{profile.email}</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={loading}
              className={isEditing ? "btn-primary ml-auto flex items-center gap-2" : "btn-secondary ml-auto flex items-center gap-2"}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                isEditing ? 'Save Profile' : 'Edit Profile'
              )}
            </button>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FiUser /> Account Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-500 mb-1">Full Name</label>
                <input name="name" type="text" className="input-field" disabled={!isEditing} value={profile.name} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Email Address</label>
                <input name="email" type="email" className="input-field" disabled={!isEditing} value={profile.email} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Role / Title</label>
                <input name="role" type="text" className="input-field" disabled={!isEditing} value={profile.role} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Company</label>
                <input name="company" type="text" className="input-field" disabled={!isEditing} value={profile.company} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Location</label>
                <input name="location" type="text" className="input-field" disabled={!isEditing} value={profile.location} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Timezone</label>
                <input name="timezone" type="text" className="input-field" disabled={!isEditing} value={profile.timezone} onChange={handleChange} />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm text-slate-500 mb-1">Bio</label>
              <textarea 
                name="bio"
                className="input-field min-h-[100px] resize-none" 
                disabled={!isEditing}
                value={profile.bio}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileView;
