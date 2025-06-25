import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';

const TaskList = () => {
  const { loading, error, request } = useApi();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await request('get', '/tasks');
        setTasks(data);
      } catch (err) {}
    };
    fetchTasks();
  }, [request]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-6">
        {tasks.map(task => (
          <div key={task._id} className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold text-orange-500">{task.title}</h3>
            <p className="text-white">{task.description || 'No description'}</p>
            <div className="flex gap-4 mt-2">
              <span className={`px-2 py-1 rounded text-blue-600 ${task.status === 'todo' ? 'bg-red-100' : task.status === 'in-progress' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                {task.status}
              </span>
              {task.dueDate && (
                <span className="text-blue-600">{new Date(task.dueDate).toLocaleDateString()}</span>
              )}
            </div>
            <Link to={`/tasks/${task._id}`} className="text-blue-500 mt-2 inline-block">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;