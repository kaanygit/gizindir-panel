'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaUser, 
  FaUserFriends, 
  FaComments, 
  FaLock, 
  FaHeart 
} from 'react-icons/fa';

const sidebarItems = [
  { name: 'Kullanıcılar', href: '/dashboard/users', icon: FaUser },
  { name: 'Eşleşmeler', href: '/dashboard/matches', icon: FaHeart },
  { name: 'Mesajlar', href: '/dashboard/messages', icon: FaComments },
  { name: 'Oturumlar', href: '/dashboard/sessions', icon: FaLock },
  { name: 'Etkileşimler', href: '/dashboard/interactions', icon: FaUserFriends },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 font-bold text-xl">
        <Link href="/dashboard">
          <span className="text-pink-500">Gizindir</span> Panel
        </Link>
      </div>
      <nav className="mt-6">
        <ul>
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.name} className="mb-2">
                <Link href={item.href}>
                  <div
                    className={`flex items-center p-3 mx-3 rounded-lg transition-colors ${
                      isActive 
                      ? 'bg-pink-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3">
                      <item.icon size={20} />
                    </span>
                    <span>{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
} 