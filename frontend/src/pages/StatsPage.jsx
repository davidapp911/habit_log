import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { getStreaks, getSummary } from "../api/stats";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Card from "../components/Card";

const DAY_OPTIONS = [7, 14, 30];

export default function StatsPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isDark] = useTheme();

    const [days, setDays] = useState(7);
    const [summary, setSummary] = useState(null);
    const [streaks, setStreaks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const [summaryData, streaksData] = await Promise.all([
                    getSummary(days),
                    getStreaks(),
                ]);
                setSummary(summaryData);
                setStreaks(streaksData);
            } catch {
                setError("Failed to load stats.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [days]);

    function handleLogout() {
        logout();
        navigate("/login");
    }

    if (loading) return <Spinner />;
    if (error) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center text-red-600 dark:text-red-400">{error}</div>
    );

    const tickColor = isDark ? "#9ca3af" : "#6b7280";
    const tooltipBg = isDark ? "#1f2937" : "#ffffff";
    const tooltipText = isDark ? "#ffffff" : "#111827";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4 sm:p-8">
            <div className="max-w-lg mx-auto">
                <Navbar title="Stats">
                    <Link to="/dashboard" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Dashboard
                    </Link>
                    <Button variant="ghost" onClick={handleLogout}>Logout</Button>
                </Navbar>

                <div className="flex gap-2 mb-6">
                    {DAY_OPTIONS.map(d => (
                        <button
                            key={d}
                            onClick={() => setDays(d)}
                            className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                                days === d
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            {d}d
                        </button>
                    ))}
                </div>

                {summary && (
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
                        {[
                            { label: "Completions",    value: summary.completions },
                            { label: "Missed",         value: summary.missed },
                            { label: "Longest streak", value: summary.longest_streak },
                        ].map(({ label, value }) => (
                            <Card key={label} className="p-3 sm:p-5 flex flex-col gap-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
                                <p className="text-3xl font-semibold">{value}</p>
                            </Card>
                        ))}
                    </div>
                )}

                <h2 className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Current Streaks</h2>

                {streaks.length === 0 ? (
                    <p className="text-gray-400 dark:text-gray-500 text-center mt-8">No habits tracked yet.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={streaks} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <XAxis
                                dataKey="name"
                                tick={{ fill: tickColor, fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fill: tickColor, fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
                                contentStyle={{ backgroundColor: tooltipBg, border: "none", borderRadius: "8px", color: tooltipText }}
                                formatter={val => [val, "streak"]}
                            />
                            <Bar dataKey="streak_length" radius={[4, 4, 0, 0]}>
                                {streaks.map((_, i) => (
                                    <Cell key={i} fill={i % 2 === 0 ? "#3b82f6" : "#6366f1"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
