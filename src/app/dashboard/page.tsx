'use client';

import { useEffect, useState } from 'react';
import { FaUser, FaUserFriends, FaComments, FaLock, FaHeart } from 'react-icons/fa';
import Link from 'next/link';

interface Counts {
  users: number;
  matches: number;
  messages: number;
  sessions: number;
  interactions: number;
}

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts>({
    users: 0,
    matches: 0,
    messages: 0,
    sessions: 0,
    interactions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [users, matches, messages, sessions, interactions] = await Promise.all([
          fetch('/api/users').then(res => res.json()),
          fetch('/api/matches').then(res => res.json()),
          fetch('/api/messages').then(res => res.json()),
          fetch('/api/sessions').then(res => res.json()),
          fetch('/api/interactions').then(res => res.json()),
        ]);

        setCounts({
          users: users.length,
          matches: matches.length,
          messages: messages.length,
          sessions: sessions.length,
          interactions: interactions.length,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    { name: 'Kullanıcılar', count: counts.users, href: '/dashboard/users', icon: FaUser, color: 'bg-blue-500' },
    { name: 'Eşleşmeler', count: counts.matches, href: '/dashboard/matches', icon: FaHeart, color: 'bg-pink-500' },
    { name: 'Mesajlar', count: counts.messages, href: '/dashboard/messages', icon: FaComments, color: 'bg-green-500' },
    { name: 'Oturumlar', count: counts.sessions, href: '/dashboard/sessions', icon: FaLock, color: 'bg-purple-500' },
    { name: 'Etkileşimler', count: counts.interactions, href: '/dashboard/interactions', icon: FaUserFriends, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Genel Bakış</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-t-4 border-pink-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link href={card.href} key={card.name}>
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className={`h-2 ${card.color}`}></div>
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{card.name}</h2>
                      <p className="text-3xl font-bold mt-2">{card.count}</p>
                    </div>
                    <div className={`p-4 rounded-full ${card.color} text-white`}>
                      <card.icon size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 