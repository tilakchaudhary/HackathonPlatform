import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

async function handleSubmit(e) {
  e.preventDefault();
  const res = await login({ email, password });
  if (res.ok) {
    const role = res.user.role.toLowerCase();
    
      if (role === "admin") navigate("/admin"); 
    if (role === "organizer") navigate("/organizer");
    else if (role === "judge") navigate("/judge");
    else navigate("/participant"); 
  } else {
    setError(res.message);
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full mt-1 p-2 border rounded" />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="w-full py-2 rounded bg-blue-600 text-white">Login</button>
        </form>

        
        <div className="mt-4 text-sm">
          Don't have an account? <Link className="text-blue-600" to="/register">Register</Link>
        </div>
      </div>
    </div>

    
  );

  
}