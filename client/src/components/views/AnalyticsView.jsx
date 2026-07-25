import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { FiDatabase, FiStar, FiClock, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AnalyticsView = ({ keys, stats }) => {
  // Compute chart data
  const envDataMap = {};
  const catDataMap = {};

  keys.forEach(key => {
    envDataMap[key.environment] = (envDataMap[key.environment] || 0) + 1;
    catDataMap[key.category] = (catDataMap[key.category] || 0) + 1;
  });

  const envData = Object.keys(envDataMap).map(name => ({ name, value: envDataMap[name] }));
  const catData = Object.keys(catDataMap).map(name => ({ name, count: catDataMap[name] }));

  // Colors for the charts
  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#64748b'];

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
      className="p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <FiActivity className="text-primary-500" /> API Analytics
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Insights and metrics for your secured keys.</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary-500/10 rounded-full blur-xl group-hover:bg-primary-500/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl">
              <FiDatabase size={20} />
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Total Keys</span>
          </div>
          <span className="text-4xl font-bold text-slate-800 dark:text-white">{stats.total}</span>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-xl">
              <FiStar size={20} />
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Favorites</span>
          </div>
          <span className="text-4xl font-bold text-slate-800 dark:text-white">{stats.favorites}</span>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-xl">
              <FiClock size={20} />
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Added (7 days)</span>
          </div>
          <span className="text-4xl font-bold text-slate-800 dark:text-white">{stats.recentlyAdded}</span>
        </div>
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Environment Distribution */}
        <div className="glass-card rounded-2xl p-6 flex flex-col h-[400px]">
          <h3 className="text-lg font-semibold mb-6 text-slate-800 dark:text-white">Keys by Environment</h3>
          {keys.length > 0 ? (
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={envData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {envData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">No data available</div>
          )}
          
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {envData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-slate-600 dark:text-slate-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass-card rounded-2xl p-6 flex flex-col h-[400px]">
          <h3 className="text-lg font-semibold mb-6 text-slate-800 dark:text-white">Keys by Category</h3>
          {keys.length > 0 ? (
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                    {catData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">No data available</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsView;
