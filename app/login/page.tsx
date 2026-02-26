'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() { // ต้องมี export default แบบนี้
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      router.push('/');
    } catch (err) {
      alert('เข้าสู่ระบบไม่สำเร็จ');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">เข้าสู่ระบบ</h1>
        <input type="text" placeholder="Username" className="block w-full mb-2 p-2 border" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" className="block w-full mb-4 p-2 border" onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg">เข้าสู่ระบบ</button>
      </form>
    </div>
  );
}