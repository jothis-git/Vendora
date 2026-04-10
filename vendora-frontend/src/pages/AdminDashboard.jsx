import React, { useState } from 'react';
import { 
  FaPlusCircle, FaTrash, FaUserEdit, FaUser, 
  FaCalendarDay, FaCalendarAlt, FaCalendarCheck, FaChartLine 
} from 'react-icons/fa';
import AdminCard from '../components/AdminCard';
import CustomModal from '../components/CustomModal';
import adminService from '../services/adminService';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'ADD_PRODUCT', 'DELETE_PRODUCT', etc.
    title: ''
  });

  const cards = [
    { id: 'ADD_PRODUCT', title: 'Add Product', icon: FaPlusCircle, color: 'bg-green-500' },
    { id: 'DELETE_PRODUCT', title: 'Delete Product', icon: FaTrash, color: 'bg-red-500' },
    { id: 'MODIFY_USER', title: 'Modify User', icon: FaUserEdit, color: 'bg-blue-500' },
    { id: 'VIEW_USER', title: 'View User', icon: FaUser, color: 'bg-purple-500' },
    { id: 'DAILY_BUSINESS', title: 'Daily Business', icon: FaCalendarDay, color: 'bg-orange-500' },
    { id: 'MONTHLY_BUSINESS', title: 'Monthly Business', icon: FaCalendarAlt, color: 'bg-yellow-500' },
    { id: 'YEARLY_BUSINESS', title: 'Yearly Business', icon: FaCalendarCheck, color: 'bg-indigo-500' },
    { id: 'OVERALL_BUSINESS', title: 'Overall Business', icon: FaChartLine, color: 'bg-pink-500' },
  ];

  const openModal = (type, title) => {
    setModalState({ isOpen: true, type, title });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, title: '' });
    setFormData({});
    setApiResult(null);
  };

  // --- Form States & Handlers ---
  const [formData, setFormData] = useState({});
  const [apiResult, setApiResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiResult(null);
    try {
      let res;
      switch (modalState.type) {
        case 'ADD_PRODUCT':
          res = await adminService.addProduct(formData);
          toast.success("Product added successfully!");
          break;
        case 'DELETE_PRODUCT':
          res = await adminService.deleteProduct(formData.productId);
          toast.success("Product deleted successfully!");
          break;
        case 'MODIFY_USER':
          // Map 'id' to 'userId' for backend compatibility
          const userData = { ...formData, userId: formData.id };
          res = await adminService.modifyUser(userData);
          toast.success("User modified successfully!");
          break;
        case 'VIEW_USER':
          res = await adminService.getUserById(formData.userId);
          setApiResult(res.data);
          break;
        case 'DAILY_BUSINESS':
          res = await adminService.getDailyBusiness(formData.date);
          setApiResult(res.data);
          break;
        case 'MONTHLY_BUSINESS':
          res = await adminService.getMonthlyBusiness(formData.month, formData.year);
          setApiResult(res.data);
          break;
        case 'YEARLY_BUSINESS':
          res = await adminService.getYearlyBusiness(formData.year);
          setApiResult(res.data);
          break;
        case 'OVERALL_BUSINESS':
          res = await adminService.getOverallBusiness();
          setApiResult(res.data);
          break;
        default: break;
      }
      if (['ADD_PRODUCT', 'DELETE_PRODUCT', 'MODIFY_USER'].includes(modalState.type)) {
        closeModal();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "Operation failed";
      toast.error(typeof msg === 'string' ? msg : "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (modalState.type) {
      case 'ADD_PRODUCT':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Product Name" className="w-full p-3 border rounded-xl" onChange={handleInputChange} required />
            <textarea name="description" placeholder="Product Description" className="w-full p-3 border rounded-xl" onChange={handleInputChange} required />
            <input type="number" name="price" placeholder="Price" className="w-full p-3 border rounded-xl" onChange={handleInputChange} required />
            <input type="number" name="stock" placeholder="Stock" className="w-full p-3 border rounded-xl" onChange={handleInputChange} required />
            <input type="number" name="categoryId" placeholder="Category ID" className="w-full p-3 border rounded-xl" onChange={handleInputChange} required />
            <input type="text" name="imageUrl" placeholder="Image URL" className="w-full p-3 border rounded-xl" onChange={handleInputChange} required />
            <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white p-3 rounded-xl font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors">
              {loading ? "Adding..." : "Add Product"}
            </button>
          </form>
        );
      case 'DELETE_PRODUCT':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="number" name="productId" placeholder="Product ID" className="w-full p-3 border rounded-xl" onChange={handleInputChange} required />
            <button type="submit" disabled={loading} className="w-full bg-red-500 text-white p-3 rounded-xl font-bold uppercase tracking-widest hover:bg-red-600 transition-colors">
              {loading ? "Deleting..." : "Delete Product"}
            </button>
          </form>
        );
      case 'MODIFY_USER':
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input type="number" name="id" placeholder="User ID" className="flex-1 p-3 border rounded-xl" onChange={handleInputChange} required />
              <button 
                type="button" 
                onClick={async () => {
                   if (!formData.id) {
                     toast.warning("Please enter a User ID first");
                     return;
                   }
                   setLoading(true);
                   try {
                     const res = await adminService.getUserById(formData.id);
                     setFormData({ ...formData, ...res.data });
                     toast.success("User details fetched!");
                   } catch (err) {
                     const msg = err.response?.data || "User not found";
                     toast.error(typeof msg === 'string' ? msg : "User not found");
                   } finally {
                     setLoading(false);
                   }
                }} 
                className="bg-blue-500 text-white px-4 rounded-xl font-bold"
              >
                Fetch
              </button>
            </div>
            {formData.username && (
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Username</label>
                  <input type="text" name="username" value={formData.username || ''} placeholder="Username" className="w-full p-3 border rounded-xl" onChange={handleInputChange} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Email</label>
                  <input type="email" name="email" value={formData.email || ''} placeholder="Email" className="w-full p-3 border rounded-xl" onChange={handleInputChange} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Role</label>
                  <select name="role" value={formData.role || ''} className="w-full p-3 border rounded-xl" onChange={handleInputChange}>
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white p-3 rounded-xl font-bold uppercase tracking-widest hover:bg-orange-700 transition-colors">
                  {loading ? "Saving..." : "Update User"}
                </button>
              </form>
            )}
          </div>
        );
      case 'VIEW_USER':
        return (
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input type="number" name="userId" placeholder="User ID" className="flex-1 p-3 border rounded-xl" onChange={handleInputChange} required />
              <button type="submit" disabled={loading} className="bg-purple-500 text-white px-6 p-3 rounded-xl font-bold hover:bg-purple-600 transition-colors">
                {loading ? "Fetching..." : "View"}
              </button>
            </form>
            {apiResult && (
              <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-3">
                  <p className="flex justify-between border-b pb-2"><span className="text-gray-500 uppercase text-[10px] font-black tracking-widest">User ID</span> <span className="font-bold"># {apiResult.userid || apiResult.id}</span></p>
                  <p className="flex justify-between border-b pb-2"><span className="text-gray-500 uppercase text-[10px] font-black tracking-widest">Username</span> <span className="font-bold">{apiResult.username}</span></p>
                  <p className="flex justify-between border-b pb-2"><span className="text-gray-500 uppercase text-[10px] font-black tracking-widest">Email</span> <span className="font-bold">{apiResult.email}</span></p>
                  <p className="flex justify-between border-b pb-2"><span className="text-gray-500 uppercase text-[10px] font-black tracking-widest">Role</span> <span className="font-bold text-orange-500">{apiResult.role}</span></p>
                  <p className="flex justify-between pb-1"><span className="text-gray-500 uppercase text-[10px] font-black tracking-widest">Joined</span> <span className="font-bold">{new Date(apiResult.createdAt).toLocaleDateString()}</span></p>
                </div>
              </div>
            )}
          </div>
        );
      case 'DAILY_BUSINESS':
        return (
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input type="date" name="date" className="flex-1 p-3 border rounded-xl" onChange={handleInputChange} required />
              <button type="submit" disabled={loading} className="bg-orange-500 text-white px-6 p-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
                {loading ? "Calculating..." : "Get Business"}
              </button>
            </form>
            {apiResult && renderAnalyticsResult(apiResult)}
          </div>
        );
      case 'MONTHLY_BUSINESS':
        return (
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input type="number" name="month" placeholder="Month (1-12)" min="1" max="12" className="p-3 border rounded-xl" onChange={handleInputChange} required />
              <input type="number" name="year" placeholder="Year" className="p-3 border rounded-xl" onChange={handleInputChange} required />
              <button type="submit" disabled={loading} className="col-span-2 bg-yellow-500 text-white p-3 rounded-xl font-bold hover:bg-yellow-600 transition-colors">
                {loading ? "Calculating..." : "Get Business"}
              </button>
            </form>
            {apiResult && renderAnalyticsResult(apiResult)}
          </div>
        );
      case 'YEARLY_BUSINESS':
        return (
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input type="number" name="year" placeholder="Year" className="flex-1 p-3 border rounded-xl" onChange={handleInputChange} required />
              <button type="submit" disabled={loading} className="bg-indigo-500 text-white px-6 p-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors">
                {loading ? "Calculating..." : "Get Business"}
              </button>
            </form>
            {apiResult && renderAnalyticsResult(apiResult)}
          </div>
        );
      case 'OVERALL_BUSINESS':
        return (
          <div className="space-y-4 text-center">
             <button onClick={handleSubmit} disabled={loading} className="w-full bg-pink-500 text-white p-3 rounded-xl font-bold hover:bg-pink-600 transition-colors">
                {loading ? "Calculating..." : "Get Overall Business Report"}
              </button>
              {apiResult && renderAnalyticsResult(apiResult)}
          </div>
        );
      default: return null;
    }
  };

  const renderAnalyticsResult = (data) => {
    return (
      <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="bg-gray-900 p-8 rounded-3xl text-white text-center">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-2">Total Revenue Generated</p>
          <h4 className="text-5xl font-black italic">₹{data.totalBusiness || data.totalRevenue || data.totalAmount || 0}</h4>
        </div>
        
        {data.categorySales && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h5 className="font-black italic uppercase text-sm mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-orange-500 rounded-full"></span>
              Category Breakdown (Units Sold)
            </h5>
            <div className="space-y-3">
              {Object.entries(data.categorySales).map(([category, quantity]) => (
                <div key={category} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                  <span className="font-bold text-gray-700">{category}</span>
                  <span className="font-black text-orange-600 italic">{quantity} Units</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-orange-500 font-black uppercase tracking-[0.3em] text-xs mb-2">Management Suite</p>
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight italic uppercase">Admin <span className="text-orange-500">Dashboard</span></h1>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Control Center Status</p>
            <p className="text-sm font-black text-green-500 flex items-center gap-2 italic">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              All Systems Operational
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card) => (
            <AdminCard 
              key={card.id} 
              {...card} 
              onClick={() => openModal(card.id, card.title)} 
            />
          ))}
        </div>
      </div>

      {/* Dynamic Modal */}
      <CustomModal 
        isOpen={modalState.isOpen} 
        onClose={closeModal} 
        title={modalState.title}
      >
        {renderForm()}
      </CustomModal>
    </div>
  );
};

export default AdminDashboard;
