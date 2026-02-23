import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { GoTrophy } from "react-icons/go";
import { MdOutlineEmojiEvents, MdCalendarMonth, MdPersonOutline } from 'react-icons/md';

const API_BASE_URL = "http://localhost:5000/api";

const Announcements = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/event-results`);
            setResults(response.data);
        } catch (error) {
            console.error("Fetch results error:", error);
        } finally {
            setLoading(false);
        }
    };

    const groupedResults = results.reduce((acc, item) => {
        if (!acc[item.eventId]) {
            acc[item.eventId] = {
                id: item.eventId,
                eventName: item.eventName,
                announcedAt: item.announcedAt,
                prizes: []
            };
        }
        acc[item.eventId].prizes.push({
            prizeLevel: item.prizeLevel,
            winners: item.winners
        });
        return acc;
    }, {});

    const displayResults = Object.values(groupedResults);

    if (loading) {
        return (
            <div className="flex-1 h-screen bg-[#03050F] flex flex-col items-center justify-center gap-6">
                <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="text-indigo-400 font-black tracking-widest uppercase text-sm animate-pulse">Retrieving Latest Results...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#03050F] p-6 md:p-12 lg:p-20 font-out text-gray-300 mt-20">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-24 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full -z-10"></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-8"
                    >
                        <GoTrophy className="text-amber-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">WINNER</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent mb-6 tracking-tight">
                        Announcements
                    </h1>
                    <p className="text-gray-500 font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Celebrating excellence and showcasing the remarkable achievements of our talented students across all events.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {displayResults.length === 0 ? (
                            <div className="col-span-full py-40 flex flex-col items-center justify-center text-center bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[4rem]">
                                <div className="text-7xl mb-8 grayscale opacity-20">🏆</div>
                                <h3 className="text-2xl font-black text-white mb-3">No Results Announced Yet</h3>
                                <p className="text-gray-500 max-w-sm">Stay tuned! Winners for recent events will be posted here as soon as they are finalized.</p>
                            </div>
                        ) : (
                            displayResults.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-white/[0.02] backdrop-blur-3xl border border-white/5 hover:border-indigo-500/30 rounded-[3rem] p-8 flex flex-col transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5),0_0_50px_rgba(79,70,229,0.1)] relative overflow-hidden"
                                >
                                    {/* Decorative Trophy Icon */}
                                    <div className="absolute -top-6 -right-6 text-9xl text-white/[0.02] group-hover:text-indigo-500/5 transition-colors -rotate-12 group-hover:rotate-0 duration-700">
                                        <GoTrophy />
                                    </div>

                                    <div className="mb-8 relative">
                                        <h2 className="text-3xl font-black text-white leading-[1.1] mb-2 group-hover:text-indigo-200 transition-colors">
                                            {event.eventName}
                                        </h2>
                                    </div>

                                    <div className="space-y-8 flex-1">
                                        {event.prizes.map((prize, idx) => (
                                            <div key={idx} className="flex flex-col gap-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-4 py-1 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-500/20">
                                                        {prize.prizeLevel}
                                                    </span>
                                                    <div className="h-px bg-white/5 flex-1"></div>
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    {prize.winners.map((winner, wIdx) => (
                                                        <div
                                                            key={wIdx}
                                                            className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl group/winner hover:bg-white/[0.05] transition-all"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-white font-black text-lg tracking-tight group-hover/winner:text-indigo-300 transition-colors">{winner.name}</span>
                                                                <span className="text-[10px] font-black text-gray-600 tracking-[0.1em] uppercase">{winner.registerNumber}</span>
                                                            </div>
                                                            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                                                                <MdOutlineEmojiEvents className="text-amber-500 text-lg" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <MdCalendarMonth className="text-lg" />
                                            <span className="text-[11px] font-bold">
                                                {new Date(event.announcedAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;500;700;900&display=swap');
                
                body {
                    background-color: #03050F;
                }

                .font-out {
                    font-family: 'Outfit', sans-serif;
                }
            `}</style>
        </div>
    );
};

export default Announcements;