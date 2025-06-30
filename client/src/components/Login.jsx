import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import useApi from '../hooks/useApi';

const Login = () => {
  const { login } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { request, loading, error } = useApi();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await request('post', '/auth/login', data);
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
        <h2 className="text-xl font-bold text-center mb-1">Task Management</h2>
        <p className="text-center text-maroon-100 text-sm mb-4">
          Login to access your dashboard
        </p>

        {error && <p className="text-red-300 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-[280px] p-[4px] px-3 py-2 mt-1 text-maroon-900 bg-white border border-maroon-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-maroon-400"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-200 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium ">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-[280px] px-3 p-[4px] py-2 mt-1 text-maroon-900 bg-white border border-maroon-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-maroon-400"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-200 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('remember')}
                className="h-4 w-4 text-maroon-600 border-gray-300 rounded"
              />
              <span className="ml-2">Remember Me</span>
            </label>
            <a href="/forgot-password" className="text-maroon-100 hover:underline">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-[50%] p-[4px] pl-[20px] py-2 bg-white text-maroon-700 font-semibold rounded-md text-sm hover:bg-maroon-100 focus:outline-none focus:ring-2 focus:ring-white transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-maroon-100">
          Don’t have an account?{' '}
          <a href="/register" className="text-white font-medium hover:underline">Add new user</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
