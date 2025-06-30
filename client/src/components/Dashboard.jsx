import { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useApi from '../hooks/useApi';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { request, loading, error } = useApi();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      const response = await request('get', '/tasks');
      setTasks(response);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  }, [user, request, logout, navigate]);

  const onSubmit = async (data) => {
    try {
      const response = await request('post', '/tasks', data);
      setTasks((prev) => [...prev, response]);
      reset();
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-50 via-white to-maroon-100 px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="bg-gradient-to-r from-maroon-600 to-maroon-700 text-white px-6 py-4 rounded-t-xl shadow">
            <h1 className="text-3xl font-bold">Welcome, {user?.name || 'User'}!</h1>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-gradient-to-r from-maroon-600 to-maroon-700 text-white px-6 py-2 rounded-lg hover:from-maroon-700 hover:to-maroon-800 transition-all focus:outline-none focus:ring-2 focus:ring-maroon-500"
          >
            Logout
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Create Task Form */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-semibold text-maroon-600 mb-6">Create New Task</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Task Title</label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="w-full md:w-[60%] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-500"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Description</label>
              <textarea
                {...register('description')}
                className="w-full md:w-[60%] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-500"
                rows="4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Status</label>
              <select
                {...register('status')}
                className="w-full md:w-[40%] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`mt-4 px-6 py-2 rounded-lg bg-maroon-600 text-white bg-gradient-to-r from-maroon-600 to-maroon-700 font-semibold hover:from-maroon-700 hover:to-maroon-800 focus:outline-none focus:ring-2 focus:ring-maroon-500 transition ${
                  loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>

        {/* Task List */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-maroon-600">Your Tasks</h2>
            <button
              onClick={fetchTasks}
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white bg-gradient-to-r from-maroon-600 to-maroon-700 font-medium hover:from-maroon-700 hover:to-maroon-800 focus:outline-none focus:ring-2 focus:ring-maroon-500 transition ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Refreshing...' : 'Refresh Tasks'}
            </button>
          </div>

          {tasks.length === 0 ? (
            <p className="text-center text-gray-600">No tasks yet. Create one above or refresh!</p>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-maroon-50 border border-maroon-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-lg font-medium text-maroon-700">{task.title}</h3>
                  <p className="text-sm text-gray-700">{task.description || 'No description'}</p>
                  <p className="text-sm text-gray-600">Status: {task.status}</p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
