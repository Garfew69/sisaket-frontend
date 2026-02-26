'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // 1. เพิ่มการนำเข้า useRouter
import { MapPin, ClipboardList, PackagePlus, Box } from 'lucide-react';

export default function Home() {
  const router = useRouter(); // 2. ประกาศตัวแปร router
  const [data, setData] = useState({
    totalShelters: 0,
    pendingRequests: 0,
    totalItems: 0,
  });

  // เช็คสถานะการเข้าสู่ระบบ
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); 
    }
  }, [router]);

  // ดึงข้อมูล Dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // ดึงข้อมูลจาก API โดยใส่ Token แนบไปด้วย (เผื่อระบบต้องการ Auth)
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setData(res.data))
      .catch(err => {
        console.error("Dashboard Error:", err);
        // ถ้า Token หมดอายุ หรือ API พัง อาจจะให้กลับไป Login ใหม่
        if (err.response?.status === 401) router.push('/login');
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ศูนย์สั่งการดิจิทัล</h1>
          <p className="text-slate-500">Dashboard สรุปทรัพยากรและการช่วยเหลือ (Sisaket Ready)</p>
        </div>
        <button 
          onClick={() => { localStorage.clear(); router.push('/login'); }}
          className="text-sm text-red-500 hover:underline"
        >
          ออกจากระบบ
        </button>
      </div>

      {/* สรุปข้อมูล 4 ช่อง */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<MapPin className="text-blue-600" />} title="ศูนย์พักพิงทั้งหมด" value={data.totalShelters} unit="แห่ง" />
        <StatCard icon={<ClipboardList className="text-indigo-600" />} title="คำร้องขอ (รออนุมัติ)" value={data.pendingRequests} unit="รายการ" />
        <StatCard icon={<PackagePlus className="text-teal-600" />} title="เบิกจ่ายสิ่งของ" value="สร้างใบเบิกใหม่" isSpecial />
        <StatCard icon={<Box className="text-blue-600" />} title="คลังสินค้าทั้งหมด" value={data.totalItems?.toLocaleString() || 0} unit="ชิ้น" />
      </div>

      {/* ตารางจำลอง */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-lg font-bold mb-4 border-l-4 border-blue-600 pl-3">สถานะการเบิกจ่ายล่าสุด</h2>
        <div className="text-center py-10 text-slate-400 border-t">
          ยังไม่มีข้อมูลการเบิกจ่ายล่าสุดในระบบ
        </div>
      </div>
    </div>
  );
}

// Component สำหรับการ์ดสถิติ (คงเดิมแต่เพิ่มการป้องกันค่า undefined)
function StatCard({ icon, title, value, unit = "", isSpecial = false }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <p className="text-slate-500 text-sm">{title}</p>
      <div className={`text-2xl font-bold ${isSpecial ? 'text-blue-600' : ''}`}>
        {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
      </div>
    </div>
  );
}