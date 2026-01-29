import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { Target, Link, BarChart3, PlusCircle, BrainCircuit } from 'lucide-react';
import AddCompetitorModal from '../components/AddCompetitorModal';
import ContentGapModal from '../components/ContentGapModal';
import api from '../api/axios';
import toast from 'react-hot-toast';
import CompetitorsSkeleton from '../components/CompetitorsSkeleton';
import Footer from '../components/Footer';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const Competitors = () => {
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);
  const [gapAnalysisResults, setGapAnalysisResults] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [loadingGaps, setLoadingGaps] = useState(false);

  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/competitors');
        setCompetitors(res.data.data || []);
      } catch (err) {
        setError(err?.response?.data?.error || err.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchCompetitors();
  }, []);

  const handleAddCompetitor = async (competitorData) => {
    const promise = api.post('/api/competitors', competitorData);
    
    toast.promise(promise, {
      loading: 'Analyzing and adding competitor...',
      success: (res) => {
        setCompetitors(prev => [res.data.data, ...prev]);
        return 'Competitor added successfully!';
      },
      error: (err) => err.normalizedMessage || 'Failed to add competitor.',
    });
    
    // This allows the modal to catch the error for its own state
    await promise;
  };

  const handleAnalyzeGaps = async (competitor) => {
    setSelectedCompetitor(competitor);
    setIsGapModalOpen(true);
    setLoadingGaps(true);
    try {
      const res = await api.get(`/api/competitors/${competitor._id}/analyze-gaps`);
      setGapAnalysisResults(res.data.data);
    } catch (err) {
      setGapAnalysisResults([err.normalizedMessage || 'Could not perform analysis.']);
    } finally {
      setLoadingGaps(false);
    }
  };

  const getCompetitorLinkAndHandle = (c) => {
    switch (c.platform) {
      case 'YouTube':
        const channelId = c.youtubeChannelId || c.handle;
        return { href: `https://www.youtube.com/channel/${channelId}`, text: 'View Channel' };
      case 'Twitter':
        return { href: `https://twitter.com/${c.twitterHandle}`, text: `@${c.twitterHandle}` };
      case 'Blog':
        const blogUrl = new URL(c.blogRssUrl);
        return { href: blogUrl.origin, text: 'Visit Blog' };
      default:
        return { href: '#', text: 'Unknown' };
    }
  };

  const buildComparisonData = (numWeeks = 6) => {
    const now = new Date();
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const labels = [];
    for (let i = numWeeks - 1; i >= 0; i--) {
      const start = new Date(now.getTime() - i * msPerWeek);
      labels.push(start.toLocaleDateString());
    }
    const datasets = (competitors || []).slice(0, 4).map((c, idx) => {
      const counts = new Array(numWeeks).fill(0);
      (c.recentPosts || []).forEach((p) => {
        const published = p.publishedAt ? new Date(p.publishedAt) : null;
        if (!published) return;
        const diff = now.getTime() - published.getTime();
        const weekIndex = Math.floor(diff / msPerWeek);
        if (weekIndex >= 0 && weekIndex < numWeeks) {
          const arrIndex = numWeeks - 1 - weekIndex;
          counts[arrIndex] += 1;
        }
      });
      const palette = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
      return {
        label: c.name,
        data: counts,
        borderColor: palette[idx % palette.length],
        backgroundColor: palette[idx % palette.length] + '33',
        tension: 0.4,
      };
    });
    return { labels, datasets };
  };
  const comparisonData = buildComparisonData(6);
  if (loading) {
    return <CompetitorsSkeleton />;
  }

  return (
    <>
      <AddCompetitorModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddCompetitor} />
      <ContentGapModal 
        isOpen={isGapModalOpen} 
        onClose={() => setIsGapModalOpen(false)} 
        gaps={gapAnalysisResults}
        competitorName={selectedCompetitor?.name}
        loading={loadingGaps}
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0B0F1A] text-[#E5E7EB] p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Competitor Benchmarking</h1>
              <p className="text-[#9CA3AF] mt-2">Analyze content from industry leaders & find opportunities</p>
            </div>
            <button onClick={() => setIsAddModalOpen(true)} className="flex items-center px-6 py-3 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-lg text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow">
              <PlusCircle className="w-5 h-5 mr-2" /> Add Competitor
            </button>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          >
            {loading && <div className="col-span-full text-center text-[#9CA3AF]">Loading competitors...</div>}
            {error && <div className="col-span-full text-center text-red-300 bg-red-500/20 border border-red-500/30 p-4 rounded-lg">Error: {error}</div>}
            {!loading && !error && competitors.length === 0 && <div className="col-span-full text-center text-[#9CA3AF] bg-[#111827] border border-purple-500/20 p-8 rounded-lg">No competitors found. Add one to get started!</div>}
            {!loading && !error && competitors.map((competitor) => {
              const initials = (competitor.name || '').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
              const linkInfo = getCompetitorLinkAndHandle(competitor);
              return (
                <motion.div key={competitor._id} whileHover={{ scale: 1.05, y: -6 }} className="bg-[#111827] rounded-2xl p-6 shadow-xl border border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/10 flex flex-col transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white mr-3 flex-shrink-0 shadow-lg">
                      {initials || 'C'}
                    </div>
                    <div className="truncate">
                      <h3 className="font-bold text-sm truncate text-[#E5E7EB]">{competitor.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30">{competitor.platform}</span>
                    </div>
                  </div>
                  <div className="space-y-3 flex-grow">
                     {competitor.recentPosts && competitor.recentPosts[0] ? (
                      <div className="text-sm text-[#E5E7EB] truncate">Latest: <a href={competitor.recentPosts[0].link} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 hover:underline">{competitor.recentPosts[0].title}</a></div>
                    ) : <div className="text-sm text-[#9CA3AF] italic">No recent posts found.</div>}
                    <div className="flex justify-between items-center">
                      <span className="text-[#9CA3AF] text-xs flex items-center"><Target className="w-3 h-3 mr-1" />Recent Posts</span>
                      <span className="text-[#E5E7EB] font-semibold text-sm">{competitor.recentPosts?.length || 0}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-purple-500/20 space-y-2">
                    <a className="text-purple-400 hover:text-purple-300 text-sm hover:underline flex items-center justify-center font-semibold transition-colors" href={linkInfo.href} target="_blank" rel="noreferrer">
                      <Link className="w-4 h-4 mr-2" /> {linkInfo.text}
                    </a>
                    <button 
                      onClick={() => handleAnalyzeGaps(competitor)}
                      disabled={!competitor.topicAnalysis?.themes?.length}
                      className="w-full text-purple-400 hover:text-purple-300 text-sm hover:underline flex items-center justify-center font-semibold disabled:text-[#9CA3AF] disabled:cursor-not-allowed disabled:no-underline transition-colors"
                    >
                      <BrainCircuit className="w-4 h-4 mr-2" /> Analyze Gaps
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-[#111827] rounded-2xl p-6 shadow-xl border border-purple-500/20"
          >
            <div className="flex items-center mb-6">
              <BarChart3 className="w-6 h-6 text-purple-400 mr-3" />
              <h2 className="text-xl font-bold text-[#E5E7EB]">Posting Frequency Comparison</h2>
            </div>
            <div className="h-80">
              <Line data={comparisonData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#9ca3af' } } }, scales: { x: { grid: { color: '#1F2937' }, ticks: { color: '#9ca3af' } }, y: { grid: { color: '#1F2937' }, ticks: { color: '#9ca3af' } } } }} />
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      <Footer />
    </>
  );
};


export default Competitors;