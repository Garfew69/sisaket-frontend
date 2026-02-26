'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { MapPin, ClipboardList, PackagePlus, Box, LogOut } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState({
    totalShelters: 0,
    pendingRequests: 0,
    totalItems: 0,
  });

  // 1. ตรวจสอบสิทธิ์การเข้าใช้งาน (ถ้าไม่มี Token ให้เด้งไปหน้า Login)
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  // 2. ดึงข้อมูลจาก API Backend (Render)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://sisaket-backend.onrender.com';

    axios.get(`${apiUrl}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error("Dashboard Error:", err);
        // ถ้า Token หมดอายุ (Unauthorized) ให้ล้างค่าและกลับไป Login
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.replace('/login');
        }
      });
  }, [router]);

  // ฟังก์ชันสำหรับออกจากระบบ
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.replace('/login');
  };

  // ป้องกัน Error ระหว่างการโหลดหน้าเว็บครั้งแรก
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 animate-pulse">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
      {/* ส่วนหัว (Header) พร้อมปุ่มออกจากระบบ */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">ศูนย์สั่งการดิจิทัล</h1>
          <p className="text-slate-500 text-sm md:text-base">Dashboard สรุปทรัพยากรและการช่วยเหลือ (Sisaket Ready)</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-all shadow-sm font-medium w-fit"
        >
          <LogOut size={18} />
          ออกจากระบบ
        </button>
      </div>

      {/* สรุปข้อมูล 4 ช่อง (Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          icon={<MapPin className="text-blue-600" size={24} />} 
          title="ศูนย์พักพิงทั้งหมด" 
          value={data.totalShelters} 
          unit="แห่ง" 
        />
        <StatCard 
          icon={<ClipboardList className="text-indigo-600" size={24} />} 
          title="คำร้องขอ (รออนุมัติ)" 
          value={data.pendingRequests} 
          unit="รายการ" 
        />
        <StatCard 
          icon={<PackagePlus className="text-teal-600" size={24} />} 
          title="เบิกจ่ายสิ่งของ" 
          value="สร้างใบเบิกใหม่" 
          isSpecial 
        />
        <StatCard 
          icon={<Box className="text-blue-600" size={24} />} 
          title="คลังสินค้าทั้งหมด" 
          value={data.totalItems?.toLocaleString() || 0} 
          unit="ชิ้น" 
        />
      </div>

      {/* ตารางแสดงสถานะล่าสุด */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold border-l-4 border-blue-600 pl-3">สถานะการเบิกจ่ายล่าสุด</h2>
          <button className="text-sm text-blue-600 hover:underline">ดูทั้งหมด</button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 border-t border-slate-50">
          <ClipboardList size={48} className="mb-3 opacity-20" />
          <p>ยังไม่มีข้อมูลการเบิกจ่ายล่าสุดในระบบ</p>
        </div>
      </div>
    </div>
  );
}

// Component ย่อยสำหรับการ์ดสถิติ
function StatCard({ icon, title, value, unit = "", isSpecial = false }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group">
      <div className="mb-4 p-3 bg-slate-50 w-fit rounded-2xl group-hover:bg-white transition-colors">
        {icon}
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <div className={`text-2xl font-bold mt-1 ${isSpecial ? 'text-blue-600' : 'text-slate-800'}`}>
        {value} <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
      </div>
    </div>
  );
}