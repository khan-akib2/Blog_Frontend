'use client';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Trash2, UserX, UserCheck, Loader2, ChevronLeft, ChevronRight, Users, Shield, Search } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [confirmModal, setConfirmModal] = useState({ open: false, userId: null, userName: '' });

  useEffect(() => { fetchUsers(); }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/users?page=${page}&limit=10`);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const user = users.find((u) => u._id === id);
    setConfirmModal({ open: true, userId: id, userName: user?.name || 'this user' });
  };

  const handleConfirmDelete = async () => {
    const id = confirmModal.userId;
    setConfirmModal({ open: false, userId: null, userName: '' });
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggleStatus = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/toggle-status`);
      toast.success(data.isActive ? 'User activated' : 'User deactivated');
      fetchUsers();
    } catch { toast.error('Failed to update status'); }
  };

  const filteredUsers = search
    ? users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
    : users;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
            Manage Users
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{pagination.total} registered accounts</p>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl p-4" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
            style={{ background: '#060b18', border: '1px solid #1a2744' }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(79,142,247,0.4)'}
            onBlur={(e) => e.target.style.borderColor = '#1a2744'}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'rgba(17,29,53,0.8)', borderBottom: '1px solid #1a2744' }}>
                <tr>
                  <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500">User</th>
                  <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500 hidden sm:table-cell">Role</th>
                  <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500">Status</th>
                  <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500 hidden md:table-cell">Joined</th>
                  <th className="text-right px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-[#111d35] transition-colors" style={{ borderColor: '#1a2744' }}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-[#1a2744]" />
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={user.role === 'admin'
                          ? { background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }
                          : { background: 'rgba(122,144,184,0.1)', color: '#7a90b8', border: '1px solid rgba(122,144,184,0.2)' }
                        }>
                        {user.role === 'admin' && <Shield className="w-3 h-3 inline mr-1" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={user.isActive
                          ? { background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }
                          : { background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }
                        }>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="text-sm text-gray-400">{formatDate(user.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {user.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(user._id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                user.isActive
                                  ? 'text-gray-500 hover:text-amber-400 hover:bg-amber-950/20'
                                  : 'text-gray-500 hover:text-green-400 hover:bg-green-950/20'
                              }`}
                              title={user.isActive ? 'Deactivate' : 'Activate'}>
                              {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                              title="Delete user">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No users found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-gray-400 px-3">
            Page {page} of {pagination.pages}
          </span>
          <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
            className="p-2 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            style={{ background: '#0d1526', border: '1px solid #1a2744' }}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={confirmModal.open}
        title="Delete User"
        message={`Delete "${confirmModal.userName}" and all their blogs? This action cannot be undone.`}
        confirmText="Delete User"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ open: false, userId: null, userName: '' })}
      />
    </div>
  );
}
