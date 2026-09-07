import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement, Filler } from 'chart.js';
import { TrendingUp, Users, MessageCircle, Target, BarChart3 } from 'lucide-react';
import UserInputPanel from '../components/UserInputPanel';
import DashboardSkeleton from '../components/DashboardSkeleton';
import Footer from '../components/Footer';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement, Filler);

const Dashboard = ({ onStrategyGenerated }) => {
  const [competitors, setCompetitors] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const api = (await import('../api/axios')).default;
        // Fetching a smaller, more relevant set of data for the dashboard
        const [compResult, trendsResult] = await Promise.allSettled([
          api.get('/api/competitors'),
          api.get('/api/trends', { params: { topic: 'AI' } }), // Example topic
        ]);
        if (compResult.status === 'fulfilled') {
          setCompetitors(compResult.value.data.data || []);
        } else {
          setError(compResult.reason?.normalizedMessage || 'Failed to load competitor data');
        }
        if (trendsResult.status === 'fulfilled') {
          setTrends(trendsResult.value.data.data || []);
        } else {
          setError(previousError => previousError || trendsResult.reason?.normalizedMessage || 'Failed to load trend data');
        }
      } catch (err) {
        console.error('Dashboard fetch error', err);
        setError(err?.normalizedMessage || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- NEW: Render skeleton on loading state ---
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Derived KPIs
  const totalCompetitors = competitors.length;
  const totalPosts = competitors.reduce((sum, c) => sum + (c.recentPosts?.length || 0), 0);
  const positiveTrendPercent = trends.length > 0 ? Math.round((trends.filter(t => t.sentiment === 'Positive').length / trends.length) * 100) : 0;
  
  const kpiCards = [
    { title: 'Competitors Tracked', value: `${totalCompetitors}`, icon: Users, color: 'from-blue-500 to-blue-600' },
    { title: 'Positive Trend Share', value: `${positiveTrendPercent}%`, icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { title: 'Total Recent Posts', value: `${totalPosts}`, icon: MessageCircle, color: 'from-purple-500 to-purple-600' },
    { title: 'Avg Posts / Competitor', value: totalCompetitors > 0 ? `${Math.round(totalPosts / totalCompetitors)}` : '0', icon: Target, color: 'from-orange-500 to-orange-600' },
  ];

  const now = new Date();
  const weekMilliseconds = 7 * 24 * 60 * 60 * 1000;
  const weeklyPostCounts = [0, 0, 0, 0];
  competitors.forEach(competitor => {
    (competitor.recentPosts || []).forEach(post => {
      const publishedAt = new Date(post.publishedAt);
      const weeksAgo = Math.floor((now - publishedAt) / weekMilliseconds);
      if (weeksAgo >= 0 && weeksAgo < weeklyPostCounts.length) {
        weeklyPostCounts[weeklyPostCounts.length - 1 - weeksAgo] += 1;
      }
    });
  });
  const performanceData = {
    labels: weeklyPostCounts.map((_, index) => `Week ${index + 1}`),
    datasets: [{ label: 'Posts from tracked competitors', data: weeklyPostCounts, borderColor: '#3b82f6', tension: 0.4 }]
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0B0F1A] text-[#E5E7EB] p-6">
      <div className="max-w-7xl mx-auto">
        {error && <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-4">Error: {error}</div>}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI Content Dashboard</h1>
          <p className="text-[#9CA3AF] mt-2">Real-time insights and AI-powered recommendations</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <UserInputPanel onGenerate={onStrategyGenerated} />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((card, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05, y: -6 }} className="bg-[#111827] rounded-2xl p-6 shadow-xl border border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/10 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg`}><card.icon className="w-6 h-6 text-white" /></div>
              </div>
              <h3 className="text-[#9CA3AF] text-sm mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-[#E5E7EB]">{card.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#111827] rounded-2xl p-6 shadow-xl border border-purple-500/20 mb-8">
          <div className="flex items-center mb-6"><BarChart3 className="w-6 h-6 text-purple-400 mr-3" /><h2 className="text-xl font-bold text-[#E5E7EB]">Performance Trends</h2></div>
          <div className="h-80"><Line data={performanceData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#9ca3af' } } }, scales: { x: { grid: { color: '#1F2937' }, ticks: { color: '#9ca3af' } }, y: { grid: { color: '#1F2937' }, ticks: { color: '#9ca3af' } } } }} /></div>
        </motion.div>

      </div>
      
      <Footer />
    </motion.div>
  );
};

export default Dashboard;