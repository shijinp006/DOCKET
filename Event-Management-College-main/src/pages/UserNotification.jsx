import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineBell, HiOutlineCalendar, HiOutlineUser, HiOutlineTag } from "react-icons/hi";

const API_BASE_URL = "http://localhost:5000/api";

const UserNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/notifications`);
            // Filter for 'all' (Programs) or 'everyone' (Universal Broadcasts)
            const allNotifications = response.data.filter(n => n.recipientType === "all" || n.recipientType === "everyone");
            setNotifications(allNotifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="min-h-screen bg-[#03050C] pt-28 pb-12 px-4 md:px-8 font-out">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4">
                            <HiOutlineBell className="text-blue-500" />
                            Notifications
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Stay updated with the latest college events and programs.</p>
                    </div>
                    <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-full hidden md:block">
                        <span className="text-blue-400 font-bold text-sm">{notifications.length} Total</span>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Broadcasts...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-16 text-center"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-700">
                            <HiOutlineBell size={40} />
                        </div>
                        <h3 className="text-white font-bold text-xl mb-2">No notifications yet</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">When programs are launched or updates are sent, they'll appear here.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {notifications.map((notification, index) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative overflow-hidden bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-300"
                                >
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Image Section */}
                                        {notification.image && (
                                            <div className="w-full md:w-48 h-48 md:h-auto rounded-3xl overflow-hidden border border-white/10 flex-shrink-0">
                                                <img
                                                    src={notification.image}
                                                    alt="Program"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        )}

                                        {/* Content Section */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${notification.senderRole === "admin"
                                                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                            }`}>
                                                            {notification.senderRole}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                                            <HiOutlineCalendar />
                                                            {formatDate(notification.timestamp)}
                                                        </div>
                                                    </div>
                                                    <h2 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                                                        {notification.subject}
                                                    </h2>
                                                </div>
                                            </div>

                                            <p className="text-gray-400 leading-relaxed font-medium">
                                                {notification.message}
                                            </p>

                                            <div className="pt-4 flex items-center gap-6 border-t border-white/5">
                                                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                    <HiOutlineUser className="text-blue-500" />
                                                    <span>Sent to All Users</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Decorative element */}
                                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                                            <HiOutlineTag size={120} className="-rotate-12 text-blue-500" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserNotification;