'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, ClipboardList, PackagePlus, Box } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState({
    totalShelters: 0,
    pendingRequests: 0,
    totalItems: 0,
  });

  useEffect(() => {
    // ดึงข้อมูลจาก API ของเราที่รันอยู่ที่พอร์ต 5000
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">ศูนย์สั่งการดิจิทัล</h1>
        <p className="text-slate-500">Dashboard สรุปทรัพยากรและการช่วยเหลือ (Sisaket Ready)</p>
      </div>

      {/* สรุปข้อมูล 4 ช่อง */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<MapPin className="text-blue-600" />} title="ศูนย์พักพิงทั้งหมด" value={data.totalShelters} unit="แห่ง" />
        <StatCard icon={<ClipboardList className="text-indigo-600" />} title="คำร้องขอ (รออนุมัติ)" value={data.pendingRequests} unit="รายการ" />
        <StatCard icon={<PackagePlus className="text-teal-600" />} title="เบิกจ่ายสิ่งของ" value="สร้างใบเบิกใหม่" isSpecial />
        <StatCard icon={<Box className="text-blue-600" />} title="คลังสินค้าทั้งหมด" value={data.totalItems.toLocaleString()} unit="ชิ้น" />
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

// Component สำหรับการ์ดสถิติ
function StatCard({ icon, title, value, unit = "", isSpecial = false }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="mb-4">{icon}</div>
      <p className="text-slate-500 text-sm">{title}</p>
      <p className={`text-2xl font-bold ${isSpecial ? 'text-blue-600' : ''}`}>
        {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
      </p>
    </div>
  );
}