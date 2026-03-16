import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'student') navigate('/student');
      else if (user.role === 'mentor') navigate('/mentor');
      else navigate('/admin');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-purple-200/50 blur-3xl opacity-60"></div>
      <div className="absolute top-40 left-0 -ml-20 w-72 h-72 rounded-full bg-blue-200/50 blur-3xl opacity-60"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="text-3xl font-black text-center block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 tracking-tighter mb-6">
          CogniSphere
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-white">
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-3 bg-slate-50 border focus:bg-white transition-colors"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-3 bg-slate-50 border focus:bg-white transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded" />
                <label className="ml-2 block text-sm text-slate-900">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-purple-600 hover:text-purple-500">Forgot password?</a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-purple-500/30 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:scale-100"
              >
                {loading ? 'Signing in...' : 'Sign in'} <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
