import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

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
  const { token, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const userEmail = decodedToken?.username;

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        if(!userEmail || !token) return;
        const response = await fetch('http://localhost:8000/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    getAllUsers();
  }, [userEmail, token]);

  return (
    <div className="pl-8 pt-6">
      <span className="text-3xl font-semibold">Personnes</span>
      <div className="mt-6 p-8 bg-white rounded-lg">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Nom</th>
              <th className="text-left">Prénom</th>
              <th className="text-left">Email</th>
              <th className="text-left">Téléphone</th>
              <th className="text-left">Rôle</th>
              <th className="text-left">Skills</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.lastName}</td>
                <td>{user.firstName}</td>
                <td>{user.email}</td>
                <td>{user.phone || '-'}</td>
                <td>{user.roles?.join(', ') || '-'}</td>
                <td>{user.skills?.join(', ') || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}