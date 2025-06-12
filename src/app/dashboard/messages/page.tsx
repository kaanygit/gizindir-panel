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

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  sent_at: string;
  is_read: boolean;
  sender: User;
  receiver: User;
  senderName?: string;
  receiverName?: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [formData, setFormData] = useState({
    sender_id: '',
    receiver_id: '',
    content: '',
    is_read: false,
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'senderName', label: 'Gönderen' },
    { key: 'receiverName', label: 'Alıcı' },
    { key: 'content', label: 'İçerik' },
    { key: 'sent_at', label: 'Gönderim Tarihi' },
    { key: 'is_read', label: 'Okundu mu?' },
  ];

  useEffect(() => {
    fetchMessages();
    fetchUsers();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/messages');
      if (!res.ok) throw new Error('Mesajlar getirilemedi');
      
      const data = await res.json();
      
      // Kullanıcı isimlerini ekle
      const formattedData = data.map((message: Message) => ({
        ...message,
        senderName: message.sender?.name || message.sender?.email || 'Bilinmeyen',
        receiverName: message.receiver?.name || message.receiver?.email || 'Bilinmeyen',
      }));
      
      setMessages(formattedData);
    } catch (error) {
      console.error('Error fetching messages:', error);
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

  const handleEdit = (message: Message) => {
    setCurrentMessage(message);
    setFormData({
      sender_id: message.sender_id.toString(),
      receiver_id: message.receiver_id.toString(),
      content: message.content,
      is_read: message.is_read,
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentMessage(null);
    setFormData({
      sender_id: '',
      receiver_id: '',
      content: '',
      is_read: false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (message: Message) => {
    if (window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) {
      try {
        const res = await fetch(`/api/messages/${message.id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) throw new Error('Mesaj silinemedi');
        
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Mesaj silinirken bir hata oluştu');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let url = '/api/messages';
      let method = 'POST';
      
      if (currentMessage) {
        url = `/api/messages/${currentMessage.id}`;
        method = 'PUT';
      }
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: parseInt(formData.sender_id),
          receiver_id: parseInt(formData.receiver_id),
          content: formData.content,
          is_read: formData.is_read,
        }),
      });
      
      if (!res.ok) throw new Error('Mesaj kaydedilemedi');
      
      setIsModalOpen(false);
      fetchMessages();
    } catch (error) {
      console.error('Error saving message:', error);
      alert('Mesaj kaydedilirken bir hata oluştu');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mesajlar</h1>
        <button
          onClick={handleCreate}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" />
          Yeni Mesaj
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={messages}
          onEdit={(item) => handleEdit(item as Message)}
          onDelete={(item) => handleDelete(item as Message)}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentMessage ? 'Mesaj Düzenle' : 'Yeni Mesaj'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Gönderen</label>
            <select
              name="sender_id"
              value={formData.sender_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            >
              <option value="">Kullanıcı Seçin</option>
              {users.map(user => (
                <option key={`sender-${user.id}`} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Alıcı</label>
            <select
              name="receiver_id"
              value={formData.receiver_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            >
              <option value="">Kullanıcı Seçin</option>
              {users.map(user => (
                <option key={`receiver-${user.id}`} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Mesaj İçeriği</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_read"
              checked={formData.is_read}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Okundu olarak işaretle
            </label>
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
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
            >
              {currentMessage ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 