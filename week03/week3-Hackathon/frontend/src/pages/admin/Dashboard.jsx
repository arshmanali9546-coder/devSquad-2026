import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    fetchOrders();
    if (user?.role === 'superadmin') {
      fetchUsers();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/superadmin/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update order');
    }
  };

  const handleUserAction = async (userId, action, value) => {
    try {
      if (action === 'status') {
        await api.put(`/superadmin/users/${userId}/status`, { status: value });
      } else if (action === 'role') {
        await api.put(`/superadmin/users/${userId}/role`, { role: value });
      }
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Action failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-10 py-10 min-h-[60vh]">
       <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
       
       <div className="flex gap-4 mb-8 border-b border-gray-200 pb-2 overflow-x-auto">
         <button className={`uppercase font-bold tracking-widest text-[10px] pb-2 ${activeTab === 'orders' ? 'text-brandHighlight border-b-2 border-brandHighlight' : 'opacity-40'}`} onClick={() => setActiveTab('orders')}>Orders</button>
         <button className={`uppercase font-bold tracking-widest text-[10px] pb-2 ${activeTab === 'products' ? 'text-brandHighlight border-b-2 border-brandHighlight' : 'opacity-40'}`} onClick={() => setActiveTab('products')}>Products</button>
         {user?.role === 'superadmin' && (
           <button className={`uppercase font-bold tracking-widest text-[10px] pb-2 ${activeTab === 'users' ? 'text-brandHighlight border-b-2 border-brandHighlight' : 'opacity-40'}`} onClick={() => setActiveTab('users')}>Users</button>
         )}
       </div>

       {activeTab === 'orders' && (
         <div className="animate-fadeIn">
           <h2 className="text-xl font-bold mb-6 opacity-80 uppercase tracking-widest text-sm">Recent Orders</h2>
           <div className="bg-white border border-gray-100 overflow-x-auto shadow-sm">
             <table className="min-w-full divide-y divide-gray-100 text-xs font-semibold">
               <thead className="bg-[#F9F9F9]">
                 <tr>
                   <th className="px-6 py-4 text-left text-brandDark uppercase tracking-widest opacity-50">Order ID</th>
                   <th className="px-6 py-4 text-left text-brandDark uppercase tracking-widest opacity-50">Customer</th>
                   <th className="px-6 py-4 text-left text-brandDark uppercase tracking-widest opacity-50">Total</th>
                   <th className="px-6 py-4 text-left text-brandDark uppercase tracking-widest opacity-50">Status</th>
                   <th className="px-6 py-4 text-left text-brandDark uppercase tracking-widest opacity-50">Action</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-50">
                 {orders.map(order => (
                   <tr key={order._id} className="hover:bg-gray-50">
                     <td className="px-6 py-4 whitespace-nowrap opacity-60">#{order._id.substring(18)}</td>
                     <td className="px-6 py-4 whitespace-nowrap">{order.userId?.name || 'Guest'}</td>
                     <td className="px-6 py-4 whitespace-nowrap">€{order.total.toFixed(2)}</td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2 py-1 rounded-full text-[9px] uppercase tracking-wider ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 
                                       order.status === 'shipped' ? 'bg-blue-50 text-blue-700' : 
                                       order.status === 'delivered' ? 'bg-green-50 text-green-700' : 
                                       'bg-red-50 text-red-700'}`}>
                         {order.status}
                       </span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <select 
                          className="border border-gray-200 rounded-sm px-2 py-1 outline-none text-[10px] bg-transparent"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                       >
                         <option value="pending">Pending</option>
                         <option value="shipped">Shipped</option>
                         <option value="delivered">Delivered</option>
                         <option value="cancelled">Cancelled</option>
                       </select>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
       )}

       {activeTab === 'users' && user?.role === 'superadmin' && (
         <div className="animate-fadeIn">
            <h2 className="text-xl font-bold mb-6 opacity-80 uppercase tracking-widest text-sm">User Management</h2>
            <div className="bg-white border border-gray-100 overflow-x-auto shadow-sm">
             <table className="min-w-full divide-y divide-gray-100 text-xs font-semibold">
               <thead className="bg-[#F9F9F9]">
                 <tr>
                   <th className="px-6 py-4 text-left text-brandDark uppercase tracking-widest opacity-50">Name</th>
                   <th className="px-6 py-4 text-left text-brandDark uppercase tracking-widest opacity-50">Email</th>
                   <th className="px-6 py-4 text-left text-brandDark uppercase tracking-widest opacity-50">Role</th>
                   <th className="px-6 py-4 text-left text-brandDark uppercase tracking-widest opacity-50">Status</th>
                   <th className="px-6 py-4 text-left text-brandDark uppercase tracking-widest opacity-50">Actions</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-50">
                 {users.map(u => (
                   <tr key={u._id} className="hover:bg-gray-50">
                     <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                     <td className="px-6 py-4 whitespace-nowrap opacity-60">{u.email}</td>
                     <td className="px-6 py-4">
                       <select 
                          className="bg-transparent border border-gray-200 rounded-sm px-1 py-1"
                          value={u.role}
                          onChange={(e) => handleUserAction(u._id, 'role', e.target.value)}
                       >
                         <option value="user">User</option>
                         <option value="admin">Admin</option>
                         <option value="superadmin">Superadmin</option>
                       </select>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[9px] uppercase tracking-wider ${u.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {u.status}
                        </span>
                     </td>
                     <td className="px-6 py-4">
                       <button 
                         onClick={() => handleUserAction(u._id, 'status', u.status === 'active' ? 'blocked' : 'active')}
                         className={`text-[10px] uppercase tracking-widest font-bold underline ${u.status === 'active' ? 'text-red-600' : 'text-green-600'}`}
                       >
                         {u.status === 'active' ? 'Block' : 'Unblock'}
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
            </div>
         </div>
       )}

    </div>
  );
};

export default Dashboard;
