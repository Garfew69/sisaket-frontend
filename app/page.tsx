'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  ClipboardList, 
  PackagePlus, 
  Box, 
  LogOut, 
  PlusCircle, 
  Trash2,
  LayoutDashboard
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [data, setData] = useState({
    totalShelters: 0,
    pendingRequests: 0,
    totalItems: 0,
  });

  // 1. ตรวจสอบสิทธิ์และสถานะการโหลด
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    setRole(userRole);

    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  // 2. ดึงข้อมูลจาก API Backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://sisaket-backend.onrender.com';

    axios.get(`${apiUrl}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setData(res.data))
      .catch(err => {
        console.error("Dashboard Error:", err);
        if (err.response?.status === 401) {
          localStorage.clear();
          router.replace('/login');
        }
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.replace('/login');
  };

  if (!mounted) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">
      กำลังโหลดระบบ...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="text-blue-600" size={24} />
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">ศูนย์สั่งการดิจิทัล</h1>
          </div>
          <p className="text-slate-500">
            สถานะสิทธิ์: <span className="font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md">{role}</span>
          </p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-red-100 text-red-500 rounded-2xl hover:bg-red-50 transition-all shadow-sm font-semibold active:scale-95"
        >
          <LogOut size={18} />
          ออกจากระบบ
        </button>
      </div>

      {/* Stats Grid - แยกสิทธิ์การมองเห็น */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Admin เห็น: ศูนย์พักพิง */}
        {role === 'admin' && (
          <StatCard 
            icon={<MapPin className="text-blue-600" size={24} />} 
            title="ค้นหาศูนย์พักพิง" 
            value={data.totalShelters} 
            unit="แห่ง" 
          />
        )}

        {/* Staff เห็น: คลังสินค้า */}
        {role === 'staff' && (
          <StatCard 
            icon={<Box className="text-teal-600" size={24} />} 
            title="จัดการสต็อกสินค้า" 
            value={data.totalItems?.toLocaleString()} 
            unit="รายการ" 
          />
        )}

        {/* Admin เห็น: ปุ่มเบิกของ */}
        {role === 'admin' && (
          <StatCard 
            icon={<PackagePlus className="text-orange-600" size={24} />} 
            title="รายการเบิกจ่าย" 
            value="สร้างใบเบิกใหม่" 
            isSpecial 
          />
        )}

        {/* ทั้งคู่เห็น: คำร้องขอ */}
        <StatCard 
          icon={<ClipboardList className="text-indigo-600" size={24} />} 
          title="คำร้องขอทั้งหมด" 
          value={data.pendingRequests} 
          unit="รายการ" 
        />
      </div>

      {/* แผงควบคุมพิเศษสำหรับ STAFF */}
      {role === 'staff' && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
            <PlusCircle className="text-teal-500" /> เครื่องมือจัดการคลังสินค้า
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-md shadow-teal-100 flex items-center gap-2 active:scale-95">
              <PlusCircle size={18} /> เพิ่มสินค้าใหม่
            </button>
            <button className="bg-white text-red-500 border border-red-100 px-6 py-2.5 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center gap-2 active:scale-95">
              <Trash2 size={18} /> ลบสินค้า/ปรับสต็อก
            </button>
          </div>
        </div>
      )}

      {/* รายการกิจกรรมล่าสุด */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold border-l-4 border-blue-600 pl-3 text-slate-800">กิจกรรมล่าสุดในระบบ</h2>
          <span className="text-xs font-medium text-slate-400">อัปเดตล่าสุด: {new Date().toLocaleTimeString('th-TH')}</span>
        </div>
        
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-t border-slate-50 italic">
          <ClipboardList size={48} className="mb-3 opacity-10" />
          <p>ระบบพร้อมใช้งาน ยังไม่มีกิจกรรมใหม่จากสิทธิ์ของคุณ</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, unit = "", isSpecial = false }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 transition-transform group-hover:scale-150 ${isSpecial ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
      <div className="mb-4 p-3 bg-slate-50 w-fit rounded-2xl group-hover:bg-white transition-colors">
        {icon}
      </div>
      <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">{title}</p>
      <div className={`text-2xl font-black ${isSpecial ? 'text-orange-600' : 'text-slate-800'}`}>
        {value} <span className="text-sm font-normal text-slate-400 ml-1 italic">{unit}</span>
      </div>
    </div>
  );
}