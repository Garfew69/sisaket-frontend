'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { MapPin, ClipboardList, PackagePlus, Box } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false); // เช็คว่า Client โหลดเสร็จหรือยัง
  const [data, setData] = useState({
    totalShelters: 0,
    pendingRequests: 0,
    totalItems: 0,
  });

  // 1. ตรวจสอบสิทธิ์การเข้าใช้งาน (Auth Guard)
  useEffect(() => {
    setMounted(true); // ยืนยันว่าโหลดที่ฝั่ง Client แล้ว
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (!token) {
      router.replace('/login'); // ใช้ replace เพื่อไม่ให้ผู้ใช้กดย้อนกลับมาหน้า Dashboard ได้
    }
  }, [router]);

  // 2. ดึงข้อมูล Dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setData(res.data))
      .catch(err => {
        console.error("Dashboard Error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.replace('/login');
        }
      });
  }, [router]);

  // ป้องกัน Error ระหว่าง Server-side Rendering
  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">กำลังโหลด...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ศูนย์สั่งการดิจิทัล</h1>
          <p className="text-slate-500">Dashboard สรุปทรัพยากรและการช่วยเหลือ (Sisaket Ready)</p>
        </div>
        <button 
          onClick={() => { 
            localStorage.removeItem('token'); 
            localStorage.removeItem('role');
            router.replace('/login'); 
          }}
          className="px-4 py-2 bg-white border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium shadow-sm"
        >
          ออกจากระบบ
        </button>
      </div>

      {/* สรุปข้อมูล 4 ช่อง */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<MapPin className="text-blue-600" size={24} />} title="ศูนย์พักพิงทั้งหมด" value={data.totalShelters} unit="แห่ง" />
        <StatCard icon={<ClipboardList className="text-indigo-600" size={24} />} title="คำร้องขอ (รออนุมัติ)" value={data.pendingRequests} unit="รายการ" />
        <StatCard icon={<PackagePlus className="text-teal-600" size={24} />} title="เบิกจ่ายสิ่งของ" value="สร้างใบเบิกใหม่" isSpecial />
        <StatCard icon={<Box className="text-blue-600" size={24} />} title="คลังสินค้าทั้งหมด" value={data.totalItems?.toLocaleString() || 0} unit="ชิ้น" />
      </div>

      {/* ตารางจำลอง */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold mb-4 border-l-4 border-blue-600 pl-3">สถานะการเบิกจ่ายล่าสุด</h2>
        <div className="text-center py-16 text-slate-400 border-t border-slate-100">
          <ClipboardList className="mx-auto mb-2 opacity-20" size={48} />
          <p>ยังไม่มีข้อมูลการเบิกจ่ายล่าสุดในระบบ</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, unit = "", isSpecial = false }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-default">
      <div className="mb-4 p-2 bg-slate-50 w-fit rounded-lg">{icon}</div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <div className={`text-2xl font-bold mt-1 ${isSpecial ? 'text-blue-600' : 'text-slate-800'}`}>
        {value} <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
      </div>
    </div>
  );
}