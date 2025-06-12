'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import { FaPlus } from 'react-icons/fa';

interface User {
  id: number;
  name: string | null;
  email: string;
  full_name: string | null;
  gender: string | null;
  interested_in: string | null;
  created_at: string;
  birth_date?: string | null;
  bio?: string | null;
  profile_image_url?: string | null;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    full_name: '',
    gender: '',
    interested_in: '',
    birth_date: '',
    bio: '',
    profile_image_url: '',
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Kullanıcı Adı' },
    { key: 'email', label: 'E-posta' },
    { key: 'full_name', label: 'Tam Ad' },
    { key: 'gender', label: 'Cinsiyet' },
    { key: 'interested_in', label: 'İlgi Alanı' },
    { key: 'created_at', label: 'Oluşturulma Tarihi' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Kullanıcılar getirilemedi');
      
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setFormData({
      name: user.name || '',
      email: user.email,
      password: '',
      full_name: user.full_name || '',
      gender: user.gender || '',
      interested_in: user.interested_in || '',
      birth_date: user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : '',
      bio: user.bio || '',
      profile_image_url: user.profile_image_url || '',
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      full_name: '',
      gender: '',
      interested_in: '',
      birth_date: '',
      bio: '',
      profile_image_url: '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`${user.name || user.email} kullanıcısını silmek istediğinize emin misiniz?`)) {
      try {
        const res = await fetch(`/api/users/${user.id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) throw new Error('Kullanıcı silinemedi');
        
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Kullanıcı silinirken bir hata oluştu');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let url = '/api/users';
      let method = 'POST';
      
      if (currentUser) {
        url = `/api/users/${currentUser.id}`;
        method = 'PUT';
      }
      
      // Password alanı boşsa, PUT isteğinde göndermiyoruz
      const dataToSend = { ...formData } as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (method === 'PUT' && !dataToSend.password) {
        dataToSend.password = undefined;
      }
      
      // Doğum tarihini işle
      if (dataToSend.birth_date) {
        dataToSend.birth_date = new Date(dataToSend.birth_date).toISOString();
      }
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      if (!res.ok) throw new Error('Kullanıcı kaydedilemedi');
      
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Kullanıcı kaydedilirken bir hata oluştu');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kullanıcılar</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" />
          Yeni Kullanıcı
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-t-4 border-pink-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          onEdit={(item) => handleEdit(item as User)}
          onDelete={(item) => handleDelete(item as User)}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kullanıcı Adı</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">E-posta</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Şifre {currentUser && '(Boş bırakılırsa değişmez)'}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!currentUser}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tam Ad</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cinsiyet</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              >
                <option value="">Seçiniz</option>
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
                <option value="other">Diğer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">İlgi Alanı</label>
              <select
                name="interested_in"
                value={formData.interested_in}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              >
                <option value="">Seçiniz</option>
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
                <option value="both">Her ikisi</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Doğum Tarihi</label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Biyografi</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Profil Resmi URL</label>
            <input
              type="text"
              name="profile_image_url"
              value={formData.profile_image_url}
              onChange={handleChange}
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
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              {currentUser ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 