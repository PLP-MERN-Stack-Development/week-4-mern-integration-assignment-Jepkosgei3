import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Landing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Task Manager</h1>
        <p className="text-xl mb-8">Organize your tasks efficiently and stay productive!</p>
        {user ? (
          <div>
            <p className="text-lg mb-4">Welcome back, {user.name}!</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-maroon-600 me-4 text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-maroon-600 text-white ms-10 px-6 py-3 pl-8 rounded-md font-medium hover:bg-blue-800 transition"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;