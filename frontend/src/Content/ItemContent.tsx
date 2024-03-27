import Card from "./Card/Card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from "axios";

interface Task {
    taskId: number;
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
    // Add other properties if present in your task object
}

interface ItemContentProps {
    title: string;
    counter: number;
    status: string; // Add status prop
}

function ItemContent(props: ItemContentProps) {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get<Task[]>('http://localhost:3000/tasks');
                setTasks(response.data);
            } catch (error) {
                setError('Error fetching tasks: ' + error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [tasks]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Filter tasks based on the status prop
    const filteredTasks = tasks.filter(task => task.status === props.status);

    return (
        <div className='item-content'>
            <div className="content-top">
                <h4>{props.title}</h4>
                <div className="content-top-right">
                    <h4>{props.counter}</h4>
                    <button><span className="material-symbols-outlined">more_vert</span></button>
                </div>
            </div>
            <div className="content-bottom">
                <button onClick={() => navigate('/new-card-edit')}><span className="material-symbols-outlined">add</span>Add New Card</button>
            </div>

            {filteredTasks.map(task => (
                <Card
                    key={task.taskId}
                    title={task.title}
                    description={task.description}
                    date={task.dueDate}
                    priority={task.priority}
                    status={task.status}
                    taskId= {task.taskId}
                />
            ))}
        </div>
    );
}

export default ItemContent;
