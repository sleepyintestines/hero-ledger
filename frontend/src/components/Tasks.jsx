import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/provider";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";
import UserPanel from "./UserPanel";

export default function Tasks() {
    const { user } = useAuth();

    const [dailyTasks, setDailyTasks] = useState([]);
    const [normalTasks, setNormalTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [user]);

    const fetchTasks = async () => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

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

    const handleAddTask = async (taskData) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{
                    user_id: user.id,
                    ...taskData,
                    is_complete: false
                }])
                .select()
                .single();

            if (error) throw error;

            if (taskData.task_type === 'recurring') {
                setDailyTasks([data, ...dailyTasks]);
            } else {
                setNormalTasks([data, ...normalTasks]);
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleUpdateTask = async (id, updatedData) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .update(updatedData)
                .eq('id', id);

            if (error) throw error;

            if (editingTask.task_type === 'recurring') {
                setDailyTasks(dailyTasks.map(task =>
                    task.id === id ? { ...task, ...updatedData } : task
                ));
            } else {
                setNormalTasks(normalTasks.map(task =>
                    task.id === id ? { ...task, ...updatedData } : task
                ));
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const toggleTask = async (task) => {
        const newCompleteStatus = !task.is_complete;
        
        try {
            // Update task completion status
            const { error: taskError } = await supabase
                .from('tasks')
                .update({ is_complete: newCompleteStatus })
                .eq('id', task.id);

            if (taskError) throw taskError;

            // If completing task (not uncompleting), award AP points
            if (newCompleteStatus) {
                // Get current user stats
                const { data: stats, error: statsError } = await supabase
                    .from('user_stats')
                    .select('action_points')
                    .eq('user_id', user.id)
                    .single();

                if (statsError) {
                    console.error('Error fetching user stats:', statsError);
                } else {
                    // Update user's action points
                    const newAP = (stats.action_points || 0) + task.ap_reward;
                    const { error: updateError } = await supabase
                        .from('user_stats')
                        .update({ 
                            action_points: newAP,
                            updated_at: new Date().toISOString()
                        })
                        .eq('user_id', user.id);

                    if (updateError) {
                        console.error('Error updating action points:', updateError);
                    } else {
                        console.log(`Awarded ${task.ap_reward} AP! Total: ${newAP}`);
                    }
                }
            }

            // Update local state
            if (task.task_type === 'recurring') {
                setDailyTasks(dailyTasks.map(t =>
                    t.id === task.id ? { ...t, is_complete: newCompleteStatus } : t
                ));
            } else {
                setNormalTasks(normalTasks.map(t =>
                    t.id === task.id ? { ...t, is_complete: newCompleteStatus } : t
                ));
            }
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    const deleteTask = async (task) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', task.id);

            if (error) throw error;

            if (task.task_type === 'recurring') {
                setDailyTasks(dailyTasks.filter(t => t.id !== task.id));
            } else {
                setNormalTasks(normalTasks.filter(t => t.id !== task.id));
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setIsEditModalOpen(true);
    };

    const renderTask = (task) => {
        const difficultyColor = task.difficulty === 'easy' ? '#28a745' :
            task.difficulty === 'medium' ? '#ffc107' : '#dc3545';

        return (
            <div
                key={task.id}
                onClick={() => handleEditClick(task)}
                style={{
                    padding: "15px",
                    marginBottom: "12px",
                    backgroundColor: "white",
                    borderRadius: "6px",
                    border: "1px solid #e0e0e0",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#007bff";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,123,255,0.15)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#e0e0e0";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                }}
            >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <input
                        type="checkbox"
                        checked={task.is_complete}
                        onClick={(e) => {
                            // prevents opening of edit modal when clicking checkboxs
                            e.stopPropagation();
                        }}
                        onChange={(e) => {
                            e.stopPropagation();
                            toggleTask(task);
                        }}
                        style={{
                            cursor: "pointer",
                            marginTop: "3px",
                            width: "18px",
                            height: "18px"
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontWeight: "500",
                            fontSize: "15px",
                            color: task.is_complete ? "#999" : "#333",
                            textDecoration: task.is_complete ? "line-through" : "none",
                            marginBottom: "6px"
                        }}>
                            {task.title}
                        </div>
                        {task.description && (
                            <div style={{
                                fontSize: "13px",
                                color: "#666",
                                marginBottom: "6px",
                                lineHeight: "1.4"
                            }}>
                                {task.description}
                            </div>
                        )}
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{
                                display: "inline-block",
                                padding: "3px 8px",
                                backgroundColor: difficultyColor,
                                color: "white",
                                borderRadius: "3px",
                                fontSize: "11px",
                                fontWeight: "600"
                            }}>
                                {task.difficulty.toUpperCase()} • {task.ap_reward} AP
                            </span>
                            {task.due_date && (
                                <span style={{
                                    display: "inline-block",
                                    padding: "3px 8px",
                                    backgroundColor: "#f0f0f0",
                                    color: "#555",
                                    borderRadius: "3px",
                                    fontSize: "11px"
                                }}>
                                    Due: {new Date(task.due_date).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task);
                        }}
                        style={{
                            padding: "6px 10px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "500"
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px"
            }}>
                <div style={{ fontSize: "18px", color: "#666" }}>Loading tasks...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
            <UserPanel />

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px"
            }}>
                <h1 style={{ margin: 0, color: "#333" }}>My Tasks</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "#6f42c1",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "600",
                        boxShadow: "0 2px 4px rgba(111, 66, 193, 0.3)"
                    }}
                >
                    Add Task
                </button>
            </div>

            <div style={{ display: "flex", gap: "30px" }}>
                {/* Daily Tasks Column */}
                <div style={{ flex: 1 }}>
                    <div style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        padding: "20px",
                        border: "2px solid #e9ecef",
                        minHeight: "400px"
                    }}>
                        <h2 style={{
                            margin: "0 0 20px 0",
                            color: "#495057",
                            fontSize: "20px",
                            fontWeight: "600"
                        }}>
                            Daily Tasks
                        </h2>
                        {dailyTasks.length === 0 ? (
                            <p style={{
                                color: "#6c757d",
                                fontStyle: "italic",
                                textAlign: "center",
                                marginTop: "40px"
                            }}>
                                No daily tasks yet
                            </p>
                        ) : (
                            dailyTasks.map(task => renderTask(task))
                        )}
                    </div>
                </div>

                {/* Normal Tasks Column */}
                <div style={{ flex: 1 }}>
                    <div style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        padding: "20px",
                        border: "2px solid #e9ecef",
                        minHeight: "400px"
                    }}>
                        <h2 style={{
                            margin: "0 0 20px 0",
                            color: "#495057",
                            fontSize: "20px",
                            fontWeight: "600"
                        }}>
                            Tasks
                        </h2>
                        {normalTasks.length === 0 ? (
                            <p style={{
                                color: "#6c757d",
                                fontStyle: "italic",
                                textAlign: "center",
                                marginTop: "40px"
                            }}>
                                No tasks yet
                            </p>
                        ) : (
                            normalTasks.map(task => renderTask(task))
                        )}
                    </div>
                </div>
            </div>

            <AddTaskModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddTask}
            />

            <EditTaskModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingTask(null);
                }}
                onUpdate={handleUpdateTask}
                task={editingTask}
            />
        </div>
    );
}
