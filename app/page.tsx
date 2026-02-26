'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { MapPin, ClipboardList, PackagePlus, Box, LogOut, PlusCircle, Trash2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null); // เก็บสิทธิ์ของผู้ใช้
  const [data, setData] = useState({ totalShelters: 0, pendingRequests: 0, totalItems: 0 });

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); // ดึง role จาก storage
    setRole(userRole);

    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setData(res.data))
    .catch(err => console.error(err));
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ศูนย์สั่งการดิจิทัล</h1>
          <p className="text-slate-500">เข้าใช้งานในฐานะ: <span className="font-bold text-blue-600 uppercase">{role}</span></p>
        </div>
        <button onClick={() => { localStorage.clear(); router.replace('/login'); }} className="text-red-500 flex items-center gap-2 border p-2 rounded-lg hover:bg-red-50">
          <LogOut size={18} /> ออกจากระบบ
        </button>
      </div>

      {/* บัตรสถิติ - แยกสิทธิ์การมองเห็น */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        
        {/* Admin เท่านั้นที่เห็น: ค้นหาศูนย์พักพิง */}
        {role === 'admin' && (
          <StatCard icon={<MapPin className="text-blue-600" />} title="ค้นหาศูนย์พักพิง" value={data.totalShelters} unit="แห่ง" />
        )}

        {/* Staff เท่านั้นที่เห็น: จัดการสต๊อก (เพิ่ม/ลบสินค้า) */}
        {role === 'staff' && (
          <StatCard icon={<Box className="text-teal-600" />} title="จัดการคลังสินค้า" value={data.totalItems} unit="รายการ" />
        )}

        {/* Admin เท่านั้นที่เห็น: ปุ่มเบิกของ */}
        {role === 'admin' && (
          <StatCard icon={<PackagePlus className="text-orange-600" />} title="ทำรายการเบิกของ" value="สร้างใบเบิก" isSpecial />
        )}

        {/* ทั้งคู่เห็นได้: รายการเบิกที่รอตรวจสอบ */}
        <StatCard icon={<ClipboardList className="text-indigo-600" />} title="รายการเบิกทั้งหมด" value={data.pendingRequests} unit="รายการ" />
      </div>

      {/* ส่วนจัดการข้อมูลสำหรับ STAFF */}
      {role === 'staff' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <PlusCircle className="text-green-500" /> จัดการสินค้า (สิทธิ์ Staff)
          </h2>
          <div className="flex gap-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg">+ เพิ่มสินค้าใหม่</button>
            <button className="bg-slate-100 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2">
              <Trash2 size={18} /> ลบสินค้าออก
            </button>
          </div>
        </div>
      )}

      {/* ตารางแสดงผลล่าสุด */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border text-center py-20 text-slate-400">
        ยังไม่มีรายการกิจกรรมล่าสุด
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, unit = "", isSpecial = false }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="mb-4">{icon}</div>
      <p className="text-slate-500 text-sm">{title}</p>
      <div className={`text-2xl font-bold ${isSpecial ? 'text-blue-600' : ''}`}>
        {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
      </div>
    </div>
  );
}