import api from './api';

const adminService = {
  // Product Management
  addProduct: (productData) => api.post('/admin/products/add', productData),
  deleteProduct: (productId) => api.delete('/admin/products/delete', { data: { productId } }),

  // User Management
  getUserById: (userId) => api.post('/admin/user/getbyid', { userId }), 
  modifyUser: (userData) => api.put('/admin/user/modify', userData),

  // Business Analytics
  getDailyBusiness: (date) => api.get('/admin/business/daily', { params: { date } }),
  getMonthlyBusiness: (month, year) => api.get('/admin/business/monthly', { params: { month, year } }),
  getYearlyBusiness: (year) => api.get('/admin/business/yearly', { params: { year } }),
  getOverallBusiness: () => api.get('/admin/business/overall'),
};

export default adminService;
