import { useState } from 'react';
import axios from 'axios';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_AUTH_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
          email: email,
          password: password
        });

        const token = response.data.access_token;
        localStorage.setItem('token', token);
        
        setSuccess('Prijava uspješna! Token je spremljen.');
        
        
      } else {
        await axios.post(`${API_URL}/api/auth/register`, {
          email: email,
          password: password,
          full_name: name
        });

        setSuccess('Uspješno ste se registrirali! Sada se možete prijaviti.');
        setIsLogin(true); 
        setPassword(''); 
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Došlo je do greške prilikom spajanja na server.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-black text-center text-slate-800 mb-2">
          {isLogin ? 'Dobrodošli natrag' : 'Kreirajte račun'}
        </h2>
        <p className="text-slate-400 text-center text-sm mb-6">
          {isLogin ? 'Prijavite se za pristup administratorskim rutama' : 'Registrirajte novi administratorski profil'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Ime i prezime</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800 text-sm"
                placeholder="Ivan Horvat"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email adresa</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800 text-sm"
              placeholder="admin@agregator.hr"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Lozinka</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800 text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-2 rounded-lg transition-colors text-sm mt-2 ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Obrada...' : (isLogin ? 'Prijavi se' : 'Registriraj se')}
          </button>
        </form>

        <hr className="border-slate-100 my-6" />

        <div className="text-center text-sm">
          <span className="text-slate-500">
            {isLogin ? 'Nemate račun?' : 'Već imate račun?'}
          </span>{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
            className="text-indigo-600 hover:underline font-bold"
          >
            {isLogin ? 'Registriraj se' : 'Prijavi se'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;