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

interface Match {
  id: number;
  user1_id: number;
  user2_id: number;
  matched_at: string;
  user1: User;
  user2: User;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    user1_id: '',
    user2_id: '',
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'user1Name', label: 'Kullanıcı 1' },
    { key: 'user2Name', label: 'Kullanıcı 2' },
    { key: 'matched_at', label: 'Eşleşme Tarihi' },
  ];

  useEffect(() => {
    fetchMatches();
    fetchUsers();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/matches');
      if (!res.ok) throw new Error('Eşleşmeler getirilemedi');
      
      const data = await res.json();
      
      // Kullanıcı isimlerini ekle
      const formattedData = data.map((match: Match) => ({
        ...match,
        user1Name: match.user1?.name || match.user1?.email || 'Bilinmeyen',
        user2Name: match.user2?.name || match.user2?.email || 'Bilinmeyen',
      }));
      
      setMatches(formattedData);
    } catch (error) {
      console.error('Error fetching matches:', error);
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
    setFormData({
      user1_id: '',
      user2_id: '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (match: Match) => {
    if (window.confirm('Bu eşleşmeyi silmek istediğinize emin misiniz?')) {
      try {
        const res = await fetch(`/api/matches/${match.id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) throw new Error('Eşleşme silinemedi');
        
        fetchMatches();
      } catch (error) {
        console.error('Error deleting match:', error);
        alert('Eşleşme silinirken bir hata oluştu');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user1_id: parseInt(formData.user1_id),
          user2_id: parseInt(formData.user2_id),
        }),
      });
      
      if (!res.ok) throw new Error('Eşleşme oluşturulamadı');
      
      setIsModalOpen(false);
      fetchMatches();
    } catch (error) {
      console.error('Error creating match:', error);
      alert('Eşleşme oluşturulurken bir hata oluştu');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Eşleşmeler</h1>
        <button
          onClick={handleCreate}
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" />
          Yeni Eşleşme
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-t-4 border-pink-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={matches}
          onDelete={(item) => handleDelete(item as Match)}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yeni Eşleşme"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kullanıcı 1</label>
            <select
              name="user1_id"
              value={formData.user1_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            >
              <option value="">Kullanıcı Seçin</option>
              {users.map(user => (
                <option key={`user1-${user.id}`} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Kullanıcı 2</label>
            <select
              name="user2_id"
              value={formData.user2_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            >
              <option value="">Kullanıcı Seçin</option>
              {users.map(user => (
                <option key={`user2-${user.id}`} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
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
              className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg"
              disabled={formData.user1_id === formData.user2_id}
            >
              Oluştur
            </button>
          </div>
          
          {formData.user1_id === formData.user2_id && formData.user1_id !== '' && (
            <p className="text-red-500 text-sm">Aynı kullanıcı ile eşleşme oluşturulamaz!</p>
          )}
        </form>
      </Modal>
    </div>
  );
} 