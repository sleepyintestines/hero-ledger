import { useState, useEffect } from "react";

export default function EditTaskModal({ isOpen, onClose, onUpdate, task }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [dueDate, setDueDate] = useState("");

    useEffect(() => {
        if (task) {
            setTitle(task.title || "");
            setDescription(task.description || "");
            setDifficulty(task.difficulty || "easy");
            setDueDate(task.due_date || "");
        }
    }, [task]);

    const handleSubmit = () => {
        if (!title.trim()) return;

        const apReward = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;

        const updatedData = {
            title,
            description: description || null,
            difficulty,
            ap_reward: apReward,
            due_date: task.task_type === "normal" ? (dueDate || null) : null,
        };

        onUpdate(task.id, updatedData);
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen || !task) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "30px",
                width: "90%",
                maxWidth: "500px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
            }}>
                <h2 style={{ marginTop: 0, marginBottom: "20px", color: "#333" }}>Edit Task</h2>
                
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#555" }}>
                        Task Type
                    </label>
                    <input
                        type="text"
                        value={task.task_type === "recurring" ? "Daily Task" : "Normal Task"}
                        disabled
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "14px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            backgroundColor: "#f5f5f5",
                            color: "#666"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#555" }}>
                        Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title..."
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "14px",
                            border: "1px solid #ddd",
                            borderRadius: "4px"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#555" }}>
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description..."
                        rows={3}
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "14px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            resize: "vertical",
                            fontFamily: "inherit"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#555" }}>
                        Difficulty
                    </label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "14px",
                            border: "1px solid #ddd",
                            borderRadius: "4px"
                        }}
                    >
                        <option value="easy">Easy (1 AP)</option>
                        <option value="medium">Medium (2 AP)</option>
                        <option value="hard">Hard (3 AP)</option>
                    </select>
                </div>

                {task.task_type === "normal" && (
                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#555" }}>
                            Due Date
                        </label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                fontSize: "14px",
                                border: "1px solid #ddd",
                                borderRadius: "4px"
                            }}
                        />
                    </div>
                )}

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "25px" }}>
                    <button
                        onClick={handleClose}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
