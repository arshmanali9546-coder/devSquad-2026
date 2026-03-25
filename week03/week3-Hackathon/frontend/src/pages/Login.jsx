import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-brandPrimary">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-brandDark">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && <div className="text-red-500 text-sm text-center font-medium">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-brandDark uppercase tracking-wider">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brandHighlight focus:border-brandHighlight sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brandDark uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brandHighlight focus:border-brandHighlight sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-brandDark hover:bg-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandHighlight transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm font-medium">
             <Link to="/signup" className="text-brandHighlight hover:text-black transition-colors uppercase tracking-wider">
               Need an account? Sign up
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
