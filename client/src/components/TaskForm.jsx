import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { useEffect, useState } from 'react';

const TaskForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { request, loading, error } = useApi();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await request('get', '/categories');
        setCategories(data);
      } catch (err) {}
    };
    fetchCategories();
  }, [request]);

  const onSubmit = async data => {
    try {
      await request('post', '/tasks', data);
      navigate('/');
    } catch (err) {}
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block">Title</label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full p-2 border rounded"
          />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block">Description</label>
          <textarea {...register('description')} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block">Due Date</label>
          <input type="date" {...register('dueDate')} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block">Status</label>
          <select {...register('status')} className="w-full p-2 border rounded">
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="block">Category</label>
          <select {...register('category')} className="w-full p-2 border rounded">
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? 'Saving...' : 'Save Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;