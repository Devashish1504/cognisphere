import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, ArrowRight, BookOpen, Users } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await register(name, email, password, role);
      if (user.role === 'student') navigate('/student');
      else if (user.role === 'mentor') navigate('/mentor');
      else navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 rounded-full bg-purple-200/50 blur-3xl opacity-60"></div>
      <div className="absolute top-20 left-0 -ml-20 w-72 h-72 rounded-full bg-blue-200/50 blur-3xl opacity-60"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="text-3xl font-black text-center block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 tracking-tighter mb-6">
          CogniSphere
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
            Sign in
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

          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-3 bg-slate-50 border focus:bg-white transition-colors"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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

            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-700 mb-3">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-xl shadow-sm text-sm font-medium transition-all ${role === 'student' ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50 text-purple-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  <BookOpen className="w-5 h-5 mr-2" /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('mentor')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-xl shadow-sm text-sm font-medium transition-all ${role === 'mentor' ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50 text-purple-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  <Users className="w-5 h-5 mr-2" /> Mentor
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-purple-500/30 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:scale-100"
              >
                {loading ? 'Creating account...' : 'Create account'} <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
