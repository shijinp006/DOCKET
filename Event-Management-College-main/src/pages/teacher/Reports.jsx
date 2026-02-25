import { FaPlus, FaTrash } from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = " http://localhost:5000/api";

const STORAGE_KEY = "reports_list";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();
  const { user } = useAppContext();

  // Load reports from localStorage
  const loadReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/reports`);
      setReports(res.data);
    } catch (error) {
      console.error("Error loading reports:", error);
      toast.error("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleDeleteReport = async (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await axios.delete(`${API_BASE_URL}/reports/${reportId}`);
        toast.success("Report deleted successfully");
        loadReports();
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete report.");
      }
    }
  };

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03050F] flex items-center justify-center">
        <div className="text-blue-500 font-bold animate-pulse text-xl">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#03050F] p-6 overflow-y-auto font-out">
      <div className="max-w-7xl mx-auto pt-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12 pt-20 md:pt-10">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
              Event Reports
            </h1>
            <p className="text-gray-500 font-medium">
              View comprehensive reports and outcomes from past events
            </p>
          </div>
          {isTeacher && (
            <button
              onClick={() => navigate("/teacher/addreports")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-blue-500/20 flex items-center gap-2 text-sm uppercase tracking-widest"
            >
              <FaPlus /> Add Report
            </button>
          )}
        </div>

        {/* Reports Grid */}
        {reports.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] rounded-[3rem] border border-white/5 border-dashed">
            <div className="max-w-md mx-auto">
              <span className="text-6xl mb-6 block grayscale opacity-30">📊</span>
              <h3 className="text-2xl font-black text-white mb-2">
                No Reports Published
              </h3>
              <p className="text-gray-500 mb-8 font-medium">
                Detailed event reports will appear here once submitted by the faculty.
              </p>
              {isTeacher && (
                <button
                  onClick={() => navigate("/teacher/addreports")}
                  className="px-8 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-xl font-bold transition-all border border-white/10 uppercase text-xs tracking-widest"
                >
                  Create First Report
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => setSelectedReport(report)}
                className="group bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer"
              >
                {/* Image */}
                <div className="h-56 overflow-hidden relative">
                  {report.image ? (
                    <img
                      src={report.image}
                      alt={report.programName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03050F] via-transparent to-transparent opacity-80" />
                </div>

                {/* Content */}
                <div className="p-8 -mt-6 relative">
                  <div className="bg-[#03050F] absolute inset-x-0 top-0 h-6 -z-10 rounded-t-[2.5rem]" />

                  {/* Program Name */}
                  <h3 className="text-xl font-black text-white mb-3 leading-tight group-hover:text-blue-400 transition-colors">
                    {report.programName}
                  </h3>

                  {/* Description */}
                  <div className="mb-6 relative">
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-4 font-medium">
                      {report.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                      {new Date(report.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>

                    {isTeacher && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReport(report.id);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        title="Delete Report"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 cursor-default">
            {/* Background Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-[#0A0C14] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col"
            >
              {/* Top Header/Image Section */}
              <div className="relative w-full h-80 md:h-[400px] bg-black/40 flex-shrink-0">
                {selectedReport.image ? (
                  <img
                    src={selectedReport.image}
                    alt={selectedReport.programName}
                    className="w-full h-full object-contain relative z-10"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 italic">Document visual missing</div>
                )}
                {/* Blurred background for empty spaces */}
                {selectedReport.image && (
                  <img
                    src={selectedReport.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-20 scale-110"
                  />
                )}

                {/* Close Button Overlay */}
                <button
                  onClick={() => setSelectedReport(null)}
                  className="absolute top-6 right-6 z-20 w-12 h-12 rounded-2xl bg-black/50 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/10 active:scale-90"
                >
                  ✕
                </button>

                {/* Event Name Overlay Tag */}
                <div className="absolute bottom-6 left-8 z-20">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="px-5 py-2 bg-blue-600 rounded-xl text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-900/40"
                  >
                    Event Report
                  </motion.span>
                </div>
              </div>

              {/* Scrollable Content Section */}
              <div className="flex-1 overflow-y-auto p-10 md:p-14 custom-scrollbar">
                <div className="max-w-3xl mx-auto">
                  <div className="flex justify-between items-end mb-10 pb-8 border-b border-white/5">
                    <div>
                      <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
                        {selectedReport.programName}
                      </h2>
                      <div className="flex items-center gap-2 text-gray-500 font-bold text-sm tracking-wide">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        {new Date(selectedReport.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <h4 className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] mb-6">Execution Summary & Outcome</h4>
                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-medium whitespace-pre-wrap selection:bg-blue-500/30">
                      {selectedReport.description}
                    </p>
                  </div>

                  <div className="mt-16 pt-10 border-t border-white/5 flex justify-center">
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="px-12 py-5 bg-white/[0.03] hover:bg-white text-white hover:text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all duration-300 border border-white/10 hover:border-white shadow-xl"
                    >
                      Close Report
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reports;