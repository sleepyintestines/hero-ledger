import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/provider";

export default function Tasks() {
    const { user } = useAuth();
    
    // Daily tasks (reset daily, no deadlines)
    const [dailyTasks, setDailyTasks] = useState([]);
    const [newDailyTask, setNewDailyTask] = useState("");
    const [newDailyTaskDesc, setNewDailyTaskDesc] = useState("");

    // Normal tasks (with deadlines)
    const [normalTasks, setNormalTasks] = useState([]);
    const [newNormalTask, setNewNormalTask] = useState("");
    const [newNormalTaskDesc, setNewNormalTaskDesc] = useState("");
    const [newNormalTaskDeadline, setNewNormalTaskDeadline] = useState("");

    const [loading, setLoading] = useState(true);

    // Fetch tasks from database
    useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [user]);

    const fetchTasks = async () => {
        try {
            console.log('Fetching tasks for user:', user.id);
            
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            console.log('Fetch result:', { data, error });
            
            if (error) throw error;

            // Split tasks by type
            const daily = data.filter(task => task.task_type === 'recurring');
            const normal = data.filter(task => task.task_type === 'normal');

            setDailyTasks(daily);
            setNormalTasks(normal);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    // Add daily task
    const addDailyTask = async () => {
        if (!newDailyTask.trim()) return;
        
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{
                    user_id: user.id,
                    title: newDailyTask,
                    description: newDailyTaskDesc || null,
                    task_type: 'recurring',
                    difficulty: 'easy',
                    ap_reward: 10,
                    is_complete: false
                }])
                .select()
                .single();

            if (error) throw error;

            setDailyTasks([data, ...dailyTasks]);
            setNewDailyTask("");
            setNewDailyTaskDesc("");
        } catch (error) {
            console.error('Error adding daily task:', error);
        }
    };

    // Add normal task
    const addNormalTask = async () => {
        if (!newNormalTask.trim()) return;
        
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{
                    user_id: user.id,
                    title: newNormalTask,
                    description: newNormalTaskDesc || null,
                    task_type: 'normal',
                    difficulty: 'medium',
                    ap_reward: 20,
                    due_date: newNormalTaskDeadline || null,
                    is_complete: false
                }])
                .select()
                .single();

            if (error) throw error;

            setNormalTasks([data, ...normalTasks]);
            setNewNormalTask("");
            setNewNormalTaskDesc("");
            setNewNormalTaskDeadline("");
        } catch (error) {
            console.error('Error adding normal task:', error);
        }
    };

    // Toggle task completion
    const toggleDailyTask = async (id) => {
        const task = dailyTasks.find(t => t.id === id);
        
        try {
            const { error } = await supabase
                .from('tasks')
                .update({ is_complete: !task.is_complete })
                .eq('id', id);

            if (error) throw error;

            setDailyTasks(dailyTasks.map(task =>
                task.id === id ? { ...task, is_complete: !task.is_complete } : task
            ));
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    const toggleNormalTask = async (id) => {
        const task = normalTasks.find(t => t.id === id);
        
        try {
            const { error } = await supabase
                .from('tasks')
                .update({ is_complete: !task.is_complete })
                .eq('id', id);

            if (error) throw error;

            setNormalTasks(normalTasks.map(task =>
                task.id === id ? { ...task, is_complete: !task.is_complete } : task
            ));
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    // Delete tasks
    const deleteDailyTask = async (id) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setDailyTasks(dailyTasks.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const deleteNormalTask = async (id) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setNormalTasks(normalTasks.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    if (loading) {
        return <div style={{ padding: "20px" }}>Loading tasks...</div>;
    }

    return (
        <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>
            {/* Daily Tasks Section */}
            <div style={{ flex: 1 }}>
                <h2>Daily Tasks</h2>
                <div style={{ marginBottom: "20px" }}>
                    <input
                        type="text"
                        value={newDailyTask}
                        onChange={(e) => setNewDailyTask(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addDailyTask()}
                        placeholder="Add daily task..."
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "10px",
                            fontSize: "14px"
                        }}
                    />
                    <input
                        type="text"
                        value={newDailyTaskDesc}
                        onChange={(e) => setNewDailyTaskDesc(e.target.value)}
                        placeholder="Description (optional)..."
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "10px",
                            fontSize: "14px"
                        }}
                    />
                    <button
                        onClick={addDailyTask}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Add Task
                    </button>
                </div>

                <div>
                    {dailyTasks.length === 0 ? (
                        <p style={{ color: "#666", fontStyle: "italic" }}>No daily tasks yet</p>
                    ) : (
                        dailyTasks.map(task => (
                            <div
                                key={task.id}
                                style={{
                                    padding: "12px",
                                    marginBottom: "10px",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px"
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={task.is_complete}
                                    onChange={() => toggleDailyTask(task.id)}
                                    style={{ cursor: "pointer" }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        textDecoration: task.is_complete ? "line-through" : "none",
                                        color: task.is_complete ? "#999" : "#333"
                                    }}>
                                        {task.title}
                                    </div>
                                    {task.description && (
                                        <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                                            {task.description}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => deleteDailyTask(task.id)}
                                    style={{
                                        padding: "4px 8px",
                                        backgroundColor: "#dc3545",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "3px",
                                        cursor: "pointer",
                                        fontSize: "12px"
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Normal Tasks Section */}
            <div style={{ flex: 1 }}>
                <h2>Tasks</h2>
                <div style={{ marginBottom: "20px" }}>
                    <input
                        type="text"
                        value={newNormalTask}
                        onChange={(e) => setNewNormalTask(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addNormalTask()}
                        placeholder="Add task..."
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "10px",
                            fontSize: "14px"
                        }}
                    />
                    <input
                        type="text"
                        value={newNormalTaskDesc}
                        onChange={(e) => setNewNormalTaskDesc(e.target.value)}
                        placeholder="Description (optional)..."
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "10px",
                            fontSize: "14px"
                        }}
                    />
                    <input
                        type="date"
                        value={newNormalTaskDeadline}
                        onChange={(e) => setNewNormalTaskDeadline(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "10px",
                            fontSize: "14px"
                        }}
                    />
                    <button
                        onClick={addNormalTask}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Add Task
                    </button>
                </div>

                <div>
                    {normalTasks.length === 0 ? (
                        <p style={{ color: "#666", fontStyle: "italic" }}>No tasks yet</p>
                    ) : (
                        normalTasks.map(task => (
                            <div
                                key={task.id}
                                style={{
                                    padding: "12px",
                                    marginBottom: "10px",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px"
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={task.is_complete}
                                    onChange={() => toggleNormalTask(task.id)}
                                    style={{ cursor: "pointer" }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        textDecoration: task.is_complete ? "line-through" : "none",
                                        color: task.is_complete ? "#999" : "#333"
                                    }}>
                                        {task.title}
                                    </div>
                                    {task.description && (
                                        <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                                            {task.description}
                                        </div>
                                    )}
                                    {task.due_date && (
                                        <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                                            Due: {new Date(task.due_date).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => deleteNormalTask(task.id)}
                                    style={{
                                        padding: "4px 8px",
                                        backgroundColor: "#dc3545",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "3px",
                                        cursor: "pointer",
                                        fontSize: "12px"
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
