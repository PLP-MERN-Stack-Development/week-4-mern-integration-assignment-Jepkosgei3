import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import useApi from '../hooks/useApi';

const Register = () => {
  const { login } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { request, loading, error } = useApi();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await request('post', '/auth/register', data);
      if (response?.token && response?.user) {
        login(response.user, response.token);
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-maroon-50 via-white to-maroon-100 px-4">
      <div className="bg-maroon-600 text-white rounded-xl shadow-2xl border border-maroon-700 p-6" style={{ width: '340px' }}>
        <h2 className="text-xl font-bold text-center mb-1">Register</h2>
        <p className="text-center text-maroon-100 text-sm mb-4">
          Create an account to manage your tasks
        </p>

        {error && <p className="text-red-300 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-[280px] pl-4 py-2 mt-1 text-maroon-900 bg-white border border-maroon-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-maroon-400"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-200 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
              })}
              className="w-[280px] pl-4 py-2 mt-1 text-maroon-900 bg-white border border-maroon-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-maroon-400"
              placeholder="yourusername"
            />
            {errors.username && <p className="text-red-200 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="w-[280px] pl-4 py-2 mt-1 text-maroon-900 bg-white border border-maroon-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-maroon-400"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-200 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className="w-[280px] pl-4 py-2 mt-1 text-maroon-900 bg-white border border-maroon-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-maroon-400"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-200 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-[280px] p-[4px] py-2 bg-white text-maroon-700 font-semibold rounded-md text-sm hover:bg-maroon-100 focus:outline-none focus:ring-2 focus:ring-white transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-maroon-100">
          Already have an account?{' '}
          <a href="/login" className="text-white font-medium hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
