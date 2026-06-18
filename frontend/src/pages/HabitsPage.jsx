import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getHabits, createHabit, updateHabit, deleteHabit } from "../api/habits";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";

const FREQUENCY_OPTIONS = ["daily", "weekdays", "weekly"];

function HabitForm({ initial = { name: "", frequency: "daily" }, onSave, onCancel, saving }) {
    const [name, setName] = useState(initial.name);
    const [frequency, setFrequency] = useState(initial.frequency || "daily");

    async function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim()) return;
        await onSave({ name: name.trim(), frequency });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl">
            <Input
                autoFocus
                type="text"
                placeholder="Habit name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1 text-sm px-3 py-2"
            />
            <select
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
                className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
                {FREQUENCY_OPTIONS.map(f => (
                    <option key={f} value={f}>{f}</option>
                ))}
            </select>
            <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save"}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        </form>
    );
}

export default function HabitsPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                setHabits(await getHabits());
            } catch {
                setError("Failed to load habits.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function handleCreate(data) {
        setSaving(true);
        setFormError(null);
        try {
            const habit = await createHabit(data);
            setHabits(prev => [...prev, habit]);
            setShowNewForm(false);
        } catch {
            setFormError("Failed to create habit.");
        } finally {
            setSaving(false);
        }
    }

    async function handleUpdate(habit_id, data) {
        setSaving(true);
        setFormError(null);
        try {
            const updated = await updateHabit(habit_id, data);
            setHabits(prev => prev.map(h => h.id === habit_id ? updated : h));
            setEditingId(null);
        } catch {
            setFormError("Failed to update habit.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(habit_id) {
        setFormError(null);
        try {
            await deleteHabit(habit_id);
            setHabits(prev => prev.filter(h => h.id !== habit_id));
        } catch {
            setFormError("Failed to delete habit.");
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
                <Navbar title="My Habits">
                    {!showNewForm && (
                        <Button onClick={() => { setShowNewForm(true); setEditingId(null); setFormError(null); }}>
                            + New Habit
                        </Button>
                    )}
                    <Button variant="ghost" onClick={() => navigate("/dashboard")}>Dashboard</Button>
                    <Button variant="ghost" onClick={handleLogout}>Logout</Button>
                </Navbar>

                {formError && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{formError}</p>}

                {showNewForm && (
                    <div className="mb-3">
                        <HabitForm
                            onSave={handleCreate}
                            onCancel={() => { setShowNewForm(false); setFormError(null); }}
                            saving={saving}
                        />
                    </div>
                )}

                {habits.length === 0 && !showNewForm && (
                    <p className="text-gray-400 dark:text-gray-500 text-center mt-16">No habits yet — add your first one.</p>
                )}

                <ul className="flex flex-col gap-3">
                    {habits.map(habit => (
                        <li key={habit.id}>
                            {editingId === habit.id ? (
                                <HabitForm
                                    initial={{ name: habit.name, frequency: habit.frequency }}
                                    onSave={data => handleUpdate(habit.id, data)}
                                    onCancel={() => { setEditingId(null); setFormError(null); }}
                                    saving={saving}
                                />
                            ) : (
                                <Card className="flex items-center gap-4 p-4">
                                    <div className="flex-1">
                                        <p className="font-medium">{habit.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize">{habit.frequency}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => { setEditingId(habit.id); setShowNewForm(false); setFormError(null); }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(habit.id)}
                                    >
                                        Delete
                                    </Button>
                                </Card>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
