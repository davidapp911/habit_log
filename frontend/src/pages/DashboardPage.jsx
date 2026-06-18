import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getHabits, getCompletions, addCompletions, deleteCompletions } from "../api/habits";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

export default function DashboardPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [habits, setHabits] = useState([]);
    const [completedToday, setCompletedToday] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toggleError, setToggleError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const habitList = await getHabits();
                setHabits(habitList);

                const today = new Date().toISOString().split("T")[0];
                const allCompletions = await Promise.all(
                    habitList.map(h => getCompletions(h.id))
                );

                const map = {};
                habitList.forEach((habit, i) => {
                    const todayCompletion = allCompletions[i].find(
                        c => c.logged_at === today
                    );
                    if (todayCompletion) {
                        map[habit.id] = todayCompletion.id;
                    }
                });
                setCompletedToday(map);
            } catch {
                setError("Failed to load habits");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function handleToggle(habit_id) {
        setToggleError(null);
        const today = new Date().toISOString().split("T")[0];
        try {
            if (completedToday[habit_id]) {
                await deleteCompletions(habit_id, completedToday[habit_id]);
                setCompletedToday(prev => {
                    const next = { ...prev };
                    delete next[habit_id];
                    return next;
                });
            } else {
                const completion = await addCompletions(habit_id, { logged_at: today });
                setCompletedToday(prev => ({ ...prev, [habit_id]: completion.id }));
            }
        } catch {
            setToggleError("Failed to update habit. Please try again.");
        }
    }

    function handleLogout() {
        logout();
        navigate("/login");
    }

    if (loading) return <Spinner />;
    if (error) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center text-red-600 dark:text-red-400">{error}</div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4 sm:p-8">
            <div className="max-w-lg mx-auto">
                <Navbar title="Today's Habits">
                    <Link to="/habits" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Manage Habits
                    </Link>
                    <Link to="/stats" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Stats
                    </Link>
                    <Button variant="ghost" onClick={handleLogout}>Logout</Button>
                </Navbar>

                {toggleError && (
                    <p className="mb-4 text-sm text-red-600 dark:text-red-400">{toggleError}</p>
                )}
                {habits.length === 0 && (
                    <p className="text-gray-400 dark:text-gray-500">No habits yet.</p>
                )}
                <ul className="flex flex-col gap-3">
                    {habits.map(habit => {
                        const done = !!completedToday[habit.id];
                        return (
                            <li
                                key={habit.id}
                                onClick={() => handleToggle(habit.id)}
                                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
                                    done
                                        ? "bg-blue-600"
                                        : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    done ? "border-white bg-white" : "border-gray-300 dark:border-gray-500"
                                }`}>
                                    {done && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                </div>
                                <span className={done ? "line-through text-blue-100" : ""}>{habit.name}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
