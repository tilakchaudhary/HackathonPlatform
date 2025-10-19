import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('participant');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
  e.preventDefault();
  const res = await register({ name, email, password, role });
  if (res.ok) {
    const newRole = res.user.role.toLowerCase();
    if (newRole === "organizer") navigate("/organizer");
    else if (newRole === "judge") navigate("/judge");
    else navigate("/participant");
  } else {
    setError(res.message);
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full mt-1 p-2 border rounded">
              <option value="participant">Participant</option>
              <option value="judge">Judge</option>
              <option value="organizer">Organizer</option>  
              
            </select>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="w-full py-2 rounded bg-green-600 text-white">Register</button>
        </form>
        <div className="mt-4 text-sm">
          Already registered? <Link className="text-blue-600" to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}