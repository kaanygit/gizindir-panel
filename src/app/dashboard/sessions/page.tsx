'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import { FaPlus } from 'react-icons/fa';

interface User {
  id: number;
  name: string | null;
  email: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface Session {
  id: number;
  user_id: number;
  session_token: string;
  created_at: string;
  user: User;
  userName?: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    session_token: '',
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'userName', label: 'Kullanıcı' },
    { key: 'session_token', label: 'Oturum Tokeni' },
    { key: 'created_at', label: 'Oluşturulma Tarihi' },
  ];

  useEffect(() => {
    fetchSessions();
    fetchUsers();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sessions');
      if (!res.ok) throw new Error('Oturumlar getirilemedi');
      
      const data = await res.json();
      
      // Kullanıcı isimlerini ekle
      const formattedData = data.map((session: Session) => ({
        ...session,
        userName: session.user?.name || session.user?.email || 'Bilinmeyen',
      }));
      
      setSessions(formattedData);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Kullanıcılar getirilemedi');
      
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreate = () => {
    // Rastgele oturum tokenı oluştur
    const sessionToken = Array(32)
      .fill(0)
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('');
    
    setFormData({
      user_id: '',
      session_token: sessionToken,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (session: Session) => {
    if (window.confirm('Bu oturumu silmek istediğinize emin misiniz?')) {
      try {
        const res = await fetch(`/api/sessions/${session.id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) throw new Error('Oturum silinemedi');
        
        fetchSessions();
      } catch (error) {
        console.error('Error deleting session:', error);
        alert('Oturum silinirken bir hata oluştu');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(formData.user_id),
          session_token: formData.session_token,
        }),
      });
      
      if (!res.ok) throw new Error('Oturum oluşturulamadı');
      
      setIsModalOpen(false);
      fetchSessions();
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Oturum oluşturulurken bir hata oluştu');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Oturumlar</h1>
        <button
          onClick={handleCreate}
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" />
          Yeni Oturum
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-t-4 border-purple-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={sessions}
          onDelete={(item) => handleDelete(item as Session)}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yeni Oturum"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kullanıcı</label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            >
              <option value="">Kullanıcı Seçin</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Oturum Tokeni</label>
            <input
              type="text"
              name="session_token"
              value={formData.session_token}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
            >
              İptal
            </button>
            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg"
            >
              Oluştur
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 