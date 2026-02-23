import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { MdSearch, MdAdd, MdDelete, MdCheckCircle } from 'react-icons/md';
import { GoTrophy } from "react-icons/go";
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = "http://localhost:5000/api";

const TeacherAnnouncement = () => {
    const { user } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [students, setStudents] = useState([]);
    const [eventStudents, setEventStudents] = useState([]);

    // Result form state
    const [results, setResults] = useState([
        { id: 1, prizeLevel: '1st Prize', winners: [] },
        { id: 2, prizeLevel: '2nd Prize', winners: [] },
        { id: 3, prizeLevel: '3rd Prize', winners: [] }
    ]);

    useEffect(() => {
        if (user) {
            loadInitialData();
        }
    }, [user]);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [eventsRes, regsRes, attRes, studentsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/events`),
                axios.get(`${API_BASE_URL}/registrations`),
                axios.get(`${API_BASE_URL}/attendance`),
                axios.get(`${API_BASE_URL}/users`)
            ]);

            // Only show events where this teacher is incharge
            const myEvents = eventsRes.data.filter(event =>
                event.incharge && event.incharge.includes(user.name)
            );

            setEvents(myEvents);
            setRegistrations(regsRes.data);
            setAttendance(attRes.data);
            setStudents(studentsRes.data);
        } catch (error) {
            console.error("Load data error:", error);
            toast.error("Failed to load necessary data");
        } finally {
            setLoading(false);
        }
    };

    // Update students list when event is selected
    useEffect(() => {
        if (selectedEvent) {
            const list = getEventStudents(selectedEvent.id);
            setEventStudents(list);
            // Reset winners if we change event
            setResults(prev => prev.map(r => ({ ...r, winners: [] })));
        } else {
            setEventStudents([]);
        }
    }, [selectedEvent]);

    const getEventStudents = (eventId) => {
        const eventRegs = registrations.filter(reg => String(reg.eventId) === String(eventId));
        const eventAtt = attendance.filter(att => Number(att.eventId) === Number(eventId) && att.status === 'approved');

        const uniqueStudents = new Map();

        eventRegs.forEach(reg => {
            if (reg.teamData && reg.teamData.members) {
                reg.teamData.members.forEach(member => {
                    const student = students.find(u => u.registerNumber && u.registerNumber.toUpperCase() === member.regNo.toUpperCase());

                    // Only include if student has approved attendance
                    const isPresent = student && eventAtt.some(att => String(att.userId) === String(student.id));

                    if (isPresent && !uniqueStudents.has(student.registerNumber)) {
                        uniqueStudents.set(student.registerNumber, { ...student, regStatus: reg.status });
                    }
                });
            } else {
                const student = students.find(u => String(u.id) === String(reg.userId));

                // Only include if student has approved attendance
                const isPresent = student && eventAtt.some(att => String(att.userId) === String(student.id));

                if (isPresent && student && !uniqueStudents.has(student.registerNumber)) {
                    uniqueStudents.set(student.registerNumber, { ...student, regStatus: reg.status });
                }
            }
        });
        return Array.from(uniqueStudents.values());
    };

    const addPrizeLevel = () => {
        const nextId = results.length > 0 ? Math.max(...results.map(r => r.id)) + 1 : 1;
        setResults([...results, { id: nextId, prizeLevel: '', winners: [] }]);
    };

    const removePrizeLevel = (id) => {
        setResults(results.filter(r => r.id !== id));
    };

    const handleLevelChange = (id, field, value) => {
        setResults(results.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const toggleWinner = (prizeId, student) => {
        setResults(results.map(r => {
            if (r.id === prizeId) {
                const alreadySelected = r.winners.find(w => w.registerNumber === student.registerNumber);
                if (alreadySelected) {
                    return { ...r, winners: r.winners.filter(w => w.registerNumber !== student.registerNumber) };
                } else {
                    return { ...r, winners: [...r.winners, { name: student.name, registerNumber: student.registerNumber }] };
                }
            }
            return r;
        }));
    };

    const handleSubmit = async () => {
        if (!selectedEvent) {
            toast.error("Please select an event");
            return;
        }

        const validResults = results.filter(r => r.prizeLevel.trim() !== '' && r.winners.length > 0);
        if (validResults.length === 0) {
            toast.error("Please add at least one valid prize level with winners");
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/event-results`, {
                eventId: selectedEvent.id,
                eventName: selectedEvent.eventName,
                results: validResults.map(r => ({
                    prizeLevel: r.prizeLevel,
                    winners: r.winners
                }))
            });
            toast.success("Results announced successfully!");
            // Reset
            setSelectedEvent(null);
            setResults([
                { id: 1, prizeLevel: '1st Prize', winners: [] },
                { id: 2, prizeLevel: '2nd Prize', winners: [] },
                { id: 3, prizeLevel: '3rd Prize', winners: [] }
            ]);
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Failed to announce results");
        }
    };

    if (loading) {
        return (
            <div className="flex-1 h-screen bg-[#03050F] flex items-center justify-center">
                <div className="text-indigo-500 font-bold animate-pulse text-xl">Loading Announcement Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-screen bg-[#03050F] p-4 md:p-10 font-out text-gray-300">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                            <GoTrophy className="text-3xl text-indigo-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                            Announce Winners
                        </h1>
                    </div>
                    <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-2xl">
                        Select an event you are managing and recognize the achievers by announcing their prizes.
                    </p>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    {/* Left Panel: Event Selection */}
                    <div className="xl:col-span-5 space-y-8">
                        <section className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                <GoTrophy className="text-9xl text-white" />
                            </div>

                            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                                Choose Event
                            </h3>

                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {events.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500 border-2 border-dashed border-white/5 rounded-3xl">
                                        No managed events found.
                                    </div>
                                ) : (
                                    events.map((event) => (
                                        <button
                                            key={event.id}
                                            onClick={() => setSelectedEvent(event)}
                                            className={`w-full text-left p-6 rounded-3xl transition-all duration-300 border ${selectedEvent?.id === event.id
                                                ? "bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                                                : "bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/80">
                                                    {event.programName}
                                                </span>
                                                {selectedEvent?.id === event.id && <MdCheckCircle className="text-indigo-400 text-xl" />}
                                            </div>
                                            <h4 className="text-lg font-black text-white group-hover:text-indigo-200 transition-colors">
                                                {event.eventName}
                                            </h4>
                                            <div className="flex items-center gap-4 mt-3 text-xs font-bold text-gray-500">
                                                <span>📅 {event.date}</span>
                                                <span>📍 {event.venue}</span>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Panel: Prize & Student Selection */}
                    <div className="xl:col-span-7 space-y-8">
                        {!selectedEvent ? (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[3rem] p-12 text-center">
                                <GoTrophy className="text-7xl text-gray-700 mb-6 opacity-20" />
                                <h3 className="text-2xl font-black text-white mb-2">Ready to Announce?</h3>
                                <p className="text-gray-500 font-medium">Please select an event from the left panel to begin adding winners and prize levels.</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <section className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                                            <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                                            Prize Distributions
                                        </h3>
                                        <button
                                            onClick={addPrizeLevel}
                                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                                        >
                                            <MdAdd className="text-lg" /> Add Prize
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <AnimatePresence>
                                            {results.map((prize, idx) => (
                                                <motion.div
                                                    key={prize.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 group focus-within:border-indigo-500/30 transition-all"
                                                >
                                                    <div className="flex flex-col md:flex-row gap-6">
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Prize Title</label>
                                                                {results.length > 1 && (
                                                                    <button
                                                                        onClick={() => removePrizeLevel(prize.id)}
                                                                        className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100"
                                                                    >
                                                                        <MdDelete />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. 1st Prize, Runner Up, Special Mention..."
                                                                value={prize.prizeLevel}
                                                                onChange={(e) => handleLevelChange(prize.id, 'prizeLevel', e.target.value)}
                                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                                            />
                                                        </div>

                                                        <div className="flex-[1.5]">
                                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block">Award Winners</label>
                                                            <div className="flex flex-wrap gap-2 min-h-[56px] p-2 bg-white/5 border border-white/10 rounded-2xl">
                                                                {eventStudents.length === 0 ? (
                                                                    <span className="text-xs text-gray-500 p-3 italic">No students registered for this event yet.</span>
                                                                ) : (
                                                                    eventStudents.map(student => (
                                                                        <button
                                                                            key={student.registerNumber}
                                                                            onClick={() => toggleWinner(prize.id, student)}
                                                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${prize.winners.find(w => w.registerNumber === student.registerNumber)
                                                                                ? "bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20"
                                                                                : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-gray-200"
                                                                                }`}
                                                                        >
                                                                            {student.name}
                                                                        </button>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-white/5">
                                        <button
                                            onClick={handleSubmit}
                                            className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-sm shadow-2xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                                        >
                                            <GoTrophy className="text-2xl" /> Launch Announcement
                                        </button>
                                        <p className="text-center text-[10px] text-gray-500 mt-4 uppercase font-bold tracking-widest">
                                            This will notify students and display the results on the public leaderboard.
                                        </p>
                                    </div>
                                </section>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default TeacherAnnouncement;