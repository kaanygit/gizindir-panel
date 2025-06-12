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

interface Interaction {
  id: number;
  user_email: string;
  shown_user_email: string;
  is_liked: boolean | null;
  created_at: string;
  user: User;
  shown_user: User;
  userName?: string;
  shownUserName?: string;
}

export default function InteractionsPage() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInteraction, setCurrentInteraction] = useState<Interaction | null>(null);
  const [formData, setFormData] = useState({
    user_email: '',
    shown_user_email: '',
    is_liked: 'null',
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'userName', label: 'Kullanıcı' },
    { key: 'shownUserName', label: 'Gösterilen Kullanıcı' },
    { key: 'is_liked', label: 'Beğendi mi?' },
    { key: 'created_at', label: 'Oluşturulma Tarihi' },
  ];

  useEffect(() => {
    fetchInteractions();
    fetchUsers();
  }, []);

  const fetchInteractions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/interactions');
      if (!res.ok) throw new Error('Etkileşimler getirilemedi');
      
      const data = await res.json();
      
      // Kullanıcı isimlerini ekle
      const formattedData = data.map((interaction: Interaction) => ({
        ...interaction,
        userName: interaction.user?.name || interaction.user?.email || 'Bilinmeyen',
        shownUserName: interaction.shown_user?.name || interaction.shown_user?.email || 'Bilinmeyen',
      }));
      
      setInteractions(formattedData);
    } catch (error) {
      console.error('Error fetching interactions:', error);
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

  const handleEdit = (interaction: Interaction) => {
    setCurrentInteraction(interaction);
    setFormData({
      user_email: interaction.user_email,
      shown_user_email: interaction.shown_user_email,
      is_liked: interaction.is_liked === null ? 'null' : interaction.is_liked ? 'true' : 'false',
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentInteraction(null);
    setFormData({
      user_email: '',
      shown_user_email: '',
      is_liked: 'null',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (interaction: Interaction) => {
    if (window.confirm('Bu etkileşimi silmek istediğinize emin misiniz?')) {
      try {
        const res = await fetch(`/api/interactions/${interaction.id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) throw new Error('Etkileşim silinemedi');
        
        fetchInteractions();
      } catch (error) {
        console.error('Error deleting interaction:', error);
        alert('Etkileşim silinirken bir hata oluştu');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let url = '/api/interactions';
      let method = 'POST';
      
      if (currentInteraction) {
        url = `/api/interactions/${currentInteraction.id}`;
        method = 'PUT';
      }
      
      // is_liked değerini uygun formata çevir
      let isLiked = null;
      if (formData.is_liked === 'true') isLiked = true;
      else if (formData.is_liked === 'false') isLiked = false;
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: formData.user_email,
          shown_user_email: formData.shown_user_email,
          is_liked: isLiked,
        }),
      });
      
      if (!res.ok) throw new Error('Etkileşim kaydedilemedi');
      
      setIsModalOpen(false);
      fetchInteractions();
    } catch (error) {
      console.error('Error saving interaction:', error);
      alert('Etkileşim kaydedilirken bir hata oluştu');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Etkileşimler</h1>
        <button
          onClick={handleCreate}
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" />
          Yeni Etkileşim
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={interactions}
          onEdit={(item) => handleEdit(item as Interaction)}
          onDelete={(item) => handleDelete(item as Interaction)}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentInteraction ? 'Etkileşim Düzenle' : 'Yeni Etkileşim'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kullanıcı</label>
            <select
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            >
              <option value="">Kullanıcı Seçin</option>
              {users.map(user => (
                <option key={`user-${user.id}`} value={user.email}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Gösterilen Kullanıcı</label>
            <select
              name="shown_user_email"
              value={formData.shown_user_email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            >
              <option value="">Kullanıcı Seçin</option>
              {users.map(user => (
                <option key={`shown-${user.id}`} value={user.email}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Beğendi mi?</label>
            <select
              name="is_liked"
              value={formData.is_liked}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            >
              <option value="null">Henüz Karar Vermedi</option>
              <option value="true">Evet, Beğendi</option>
              <option value="false">Hayır, Beğenmedi</option>
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
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
              disabled={formData.user_email === formData.shown_user_email}
            >
              {currentInteraction ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
          
          {formData.user_email === formData.shown_user_email && formData.user_email !== '' && (
            <p className="text-red-500 text-sm">Aynı kullanıcı kendisiyle etkileşimde bulunamaz!</p>
          )}
        </form>
      </Modal>
    </div>
  );
} 