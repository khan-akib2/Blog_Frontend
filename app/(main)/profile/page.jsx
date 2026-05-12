'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Camera, Loader2, Save, User, Mail, FileText, Zap } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth?mode=login');
    if (user) setForm({ name: user.name || '', bio: user.bio || '' });
  }, [user, authLoading]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const { data } = await api.put('/auth/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data.user);
      toast.success('Avatar updated!');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" /> Account Settings
        </p>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
          Edit Profile
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update your personal information and bio</p>
      </div>

      <div className="rounded-3xl border border-gray-100 dark:border-[#1a2744] bg-white dark:bg-[#0d1526] overflow-hidden shadow-sm">

        {/* Avatar section */}
        <div className="px-8 py-8 border-b border-gray-100 dark:border-[#1a2744]"
          style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.03), rgba(124,58,237,0.03))' }}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-[#0d1526] shadow-xl" />
              ) : (
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <label className="absolute -bottom-2 -right-2 p-2 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                {uploadingAvatar
                  ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                  : <Camera className="w-4 h-4 text-white" />}
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" disabled={uploadingAvatar} />
              </label>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user?.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Click the camera icon to update your photo</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-8 space-y-6">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400 mb-2">
              <User className="w-3.5 h-3.5" /> Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors text-sm font-medium"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400 mb-2">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-[#1a2744] bg-gray-100 dark:bg-[#111d35] text-gray-400 dark:text-gray-500 cursor-not-allowed text-sm"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">Email cannot be changed</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400 mb-2">
              <FileText className="w-3.5 h-3.5" /> Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              maxLength={200}
              placeholder="Tell readers about yourself, your expertise, and what you write about..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#1a2744] bg-gray-50 dark:bg-[#060b18] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/50 transition-colors resize-none text-sm"
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-gray-400 dark:text-gray-500">A good bio helps readers connect with you</p>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500">{form.bio.length}/200</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              boxShadow: '0 4px 20px rgba(37,99,235,0.25)'
            }}
          >
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving changes...</>
              : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}
