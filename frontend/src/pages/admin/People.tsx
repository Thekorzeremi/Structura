import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roles: string[];
  skills: string[];
}

export default function People() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        if (isMounted) {
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="pl-8 pt-6">
      <h1 className="text-3xl font-semibold">Personnes</h1>
      <div className="mt-4">
        {users.map((user: User) => (
          <div key={user.id} className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={`/worksite/1.jpg`} className="w-12 h-12 object-cover rounded-full" />
                <div className="ml-4">
                  <p className="text-lg font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-gray-600">{user.phone}</p>
                <p className="text-gray-600">{user.roles.join(', ')}</p>
                <p className="text-gray-600">{user.skills.join(', ')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
