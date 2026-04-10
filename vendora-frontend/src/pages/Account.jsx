import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { toast } from "react-toastify";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

function Account() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/orders");
        const data = Array.isArray(res.data) ? res.data : [];
        setOrders(data);
        
        // Process data for the chart (grouped by base date string for consistency)
        const grouped = data.reduce((acc, order) => {
          const rawDate = new Date(order.createdAt || Date.now());
          const dateStr = rawDate.toISOString().split('T')[0]; // YYYY-MM-DD for accurate sorting
          acc[dateStr] = (acc[dateStr] || 0) + (order.totalAmount || 0);
          return acc;
        }, {});

        // Sort keys (dates) ascending
        const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));

        const chartArr = sortedDates.map(date => ({
          date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          amount: grouped[date]
        })).slice(-7); // Last 7 unique transaction dates

        setChartData(chartArr);
      } catch (err) {
        console.error("Chart fetch failed:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  // 🔥 DEBUG: Log the user object to help the user see exactly what's fetched
  useEffect(() => {
    if (user) console.log("👤 Profile Data Loaded:", user);
  }, [user]);

  // Enhanced date resolution to handle strings, arrays, and field name variations
  const resolveDate = (date) => {
    if (!date) return null;
    // Handle Jackson array format: [2024, 4, 1, 10, 30]
    if (Array.isArray(date)) {
      return new Date(date[0], date[1] - 1, date[2]).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
    }
    // Handle standard string format
    const parsed = new Date(date);
    return isNaN(parsed) ? null : parsed.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const rawDate = user?.createdAt || user?.CreatedAt || user?.created_at || user?.createdDate;
  const memberSince = resolveDate(rawDate) || "April 2024";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2 italic uppercase">Account Insights</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Your personal profile and shopping journey</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-10">
          <div className="md:flex">
            {/* Sidebar / Profile Summary */}
            <div className="md:w-1/3 bg-gray-900 p-8 text-white flex flex-col items-center border-r border-gray-800">
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-5xl font-black shadow-xl border-4 border-white mb-6 transform transition-transform group-hover:scale-105 italic">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="absolute bottom-6 right-2 w-8 h-8 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1 truncate w-full text-center px-4">{user?.username}</h2>
              <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">{user?.role || "Member"}</p>
              
              <div className="w-full space-y-6 pt-8 border-t border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-orange-500 font-black text-sm italic">@</div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Contact</p>
                    <p className="text-[11px] font-bold text-white truncate">{user?.email || 'No email'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-orange-500 font-black text-sm italic">📅</div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Joined</p>
                    <p className="text-[11px] font-bold text-white whitespace-nowrap">{memberSince}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content (Chart Area) */}
            <div className="md:w-2/3 p-10 bg-white">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 uppercase italic">
                  <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                  Purchase Timeline
                </h3>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Recent Activity</p>
                  <p className="text-sm font-black text-orange-600 italic">Total: ₹{orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0)}</p>
                </div>
              </div>

              <div className="h-64 w-full">
                {loadingOrders ? (
                  <div className="w-full h-full bg-gray-50 rounded-2xl animate-pulse flex items-center justify-center">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Generating Visuals...</p>
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', background: '#fff' }}
                        itemStyle={{ fontWeight: 800, fontSize: '12px', color: '#f97316' }}
                        labelStyle={{ fontWeight: 800, fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#f97316" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorAmount)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-100">
                     <span className="text-4xl mb-4 grayscale italic opacity-20">🛒</span>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No order patterns detected yet.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-10 pt-8 border-t border-gray-100 flex justify-center">
                <button 
                  onClick={() => window.location.href='/orders'}
                  className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-gray-200"
                >
                  View Full History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
