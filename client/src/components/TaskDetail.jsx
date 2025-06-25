import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';

const TaskDetail = () => {
  const { id } = useParams();
  const { request, loading, error } = useApi();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await request('get', `/tasks/${id}`);
        setTask(data);
      } catch (err) {}
    };
    fetchTask();
  }, [id, request]);

  const handleDelete = async () => {
    try {
      await request('delete', `/tasks/${id}`);
      navigate('/');
    } catch (err) {}
  };

  const handleComment = async e => {
    e.preventDefault();
    try {
      const text = e.target.comment.value;
      await request('post', `/tasks/${id}/comments`, { text });
      const updatedTask = await request('get', `/tasks/${id}`);
      setTask(updatedTask);
      e.target.reset();
    } catch (err) {}
  };

  const handleFileUpload = async e => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        await request('post', `/tasks/${id}/attachments`, formData);
        const updatedTask = await request('get', `/tasks/${id}`);
        setTask(updatedTask);
      } catch (err) {}
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!task) return null;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
      <p className="mb-2">{task.description || 'No description'}</p>
      <p className="mb-2">Status: <span className="text-blue-600">{task.status}</span></p>
      {task.dueDate && <p className="mb-2">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
      {task.category && <p className="mb-4">Category: {task.category.name}</p>}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Attachments</h3>
        {task.attachments.length > 0 ? (
          task.attachments.map((attachment, index) => (
            <a key={index} href={`/${attachment}`} target="_blank" className="text-blue-500 block">
              {attachment.split('/').pop()}
            </a>
          ))
        ) : (
          <p>No attachments</p>
        )}
        <input type="file" onChange={handleFileUpload} className="mt-2" />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        {task.comments.length > 0 ? (
          task.comments.map(comment => (
            <p key={comment._id} className="border-b py-2">
              {comment.text} <span className="text-gray-500">({new Date(comment.createdAt).toLocaleString()})</span>
            </p>
          ))
        ) : (
          <p>No comments</p>
        )}
        <form onSubmit={handleComment} className="mt-2">
          <input name="comment" className="w-full p-2 border rounded" placeholder="Add a comment" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Comment</button>
        </form>
      </div>
      <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete Task</button>
    </div>
  );
};

export default TaskDetail;