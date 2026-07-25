import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import api from '../services/api';

const KeyModal = ({ isOpen, onClose, currentKey, onSave }) => {
  const [formData, setFormData] = useState({
    serviceName: '',
    apiKey: '',
    category: 'Development',
    environment: 'Development',
    description: '',
    favorite: false,
  });

  const categories = ['Development', 'Payment', 'Cloud', 'Database', 'Social', 'Analytics', 'Hosting'];
  const environments = ['Development', 'Staging', 'Production', 'Testing', 'Other'];

  useEffect(() => {
    if (currentKey) {
      setFormData({
        serviceName: currentKey.serviceName || '',
        apiKey: currentKey.apiKey || '',
        category: currentKey.category || 'Development',
        environment: currentKey.environment || 'Development',
        description: currentKey.description || '',
        favorite: currentKey.favorite || false,
      });
    } else {
      setFormData({
        serviceName: '',
        apiKey: '',
        category: 'Development',
        environment: 'Development',
        description: '',
        favorite: false,
      });
    }
  }, [currentKey, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentKey) {
        await api.put(`/keys/${currentKey._id || currentKey.id}`, formData);
      } else {
        await api.post('/keys', formData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving key');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-dark-card w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-dark-border overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-dark-border">
            <h2 className="text-xl font-bold">{currentKey ? 'Edit API Key' : 'Add New API Key'}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 p-2 rounded-full">
              <FiX />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Service Name *</label>
              <input 
                type="text" 
                name="serviceName"
                required
                value={formData.serviceName}
                onChange={handleChange}
                placeholder="e.g. Stripe, AWS, OpenAI"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">API Key *</label>
              <input 
                type="password" 
                name="apiKey"
                required={!currentKey} // Required only for new keys
                value={formData.apiKey}
                onChange={handleChange}
                placeholder="Paste your API key here"
                className="input-field font-mono"
              />
              {currentKey && <p className="text-xs text-slate-500 mt-1">Leave blank to keep existing key unchanged.</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Environment</label>
                <select 
                  name="environment"
                  value={formData.environment}
                  onChange={handleChange}
                  className="input-field"
                >
                  {environments.map(env => (
                    <option key={env} value={env}>{env}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (Optional)</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What is this key used for?"
                className="input-field min-h-[80px] resize-none"
              ></textarea>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="favorite" 
                name="favorite"
                checked={formData.favorite}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="favorite" className="text-sm font-medium">Mark as Favorite</label>
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-dark-border">
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">
                {currentKey ? 'Save Changes' : 'Add API Key'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default KeyModal;
