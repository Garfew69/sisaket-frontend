'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { User, Lock, ShieldCheck, UserCog } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ฟังก์ชันล็อกอินหลัก
  const handleLogin = async (e?: React.FormEvent, demoUser?: string, demoPass?: string) => {
    if (e) e.preventDefault();
    setLoading(true);

    // ใช้ค่าจากปุ่ม Demo หรือค่าจาก Input
    const loginData = {
      username: demoUser || username,
      password: demoPass || password
    };

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, loginData);
      
      // เก็บข้อมูลลง LocalStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      
      router.replace('/'); // ไปหน้า Dashboard
    } catch (err: any) {
      alert(err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Sisaket Ready</h1>
          <p className="text-slate-500">ระบบบริหารจัดการทรัพยากร</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อผู้ใช้</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="กรอกชื่อผู้ใช้"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่าน</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="กรอกรหัสผ่าน"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:bg-blue-300"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {/* --- ส่วนของปุ่ม Demo --- */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-center text-sm text-slate-400 mb-4">ทดสอบใช้งานด้วยบัญชี Demo</p>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleLogin(undefined, 'admin', 'admin123')}
              className="flex items-center justify-center gap-2 p-3 border border-blue-100 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition-all group"
            >
              <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-xs font-bold uppercase">Admin</p>
                <p className="text-[10px] opacity-70">เบิกของ/ดูศูนย์</p>
              </div>
            </button>

            <button 
              onClick={() => handleLogin(undefined, 'staff', 'staff123')}
              className="flex items-center justify-center gap-2 p-3 border border-teal-100 bg-teal-50 text-teal-700 rounded-2xl hover:bg-teal-100 transition-all group"
            >
              <UserCog size={20} className="group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-xs font-bold uppercase">Staff</p>
                <p className="text-[10px] opacity-70">จัดการคลังสินค้า</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}