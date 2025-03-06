import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  job?: string;
  roles: string[];
  skills: string[];
}

export default function People() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    job: '',
    roles: [] as string[],
    skills: [] as string[]
  });
  
  // Available role options
  const availableRoles = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_WORKER'];
  // Available skill options
  const availableSkills = ['Menuiserie', 'Électricité', 'Plomberie', 'Maçonnerie', 'Peinture', 'Management', 'Sécurité'];

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUsersEffect = async () => {
      if (isMounted) {
        await fetchUsers();
      }
    };

    fetchUsersEffect();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    const url = `http://localhost:8000/api/users/${selectedUser.id}`;
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          job: formData.job,
          roles: formData.roles,
          skills: formData.skills
        })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'opération');
      
      fetchUsers();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      fetchUsers();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      job: user.job || '',
      roles: user.roles,
      skills: user.skills || []
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      job: '',
      roles: [],
      skills: []
    });
  };

  const handleRoleToggle = (role: string) => {
    if (formData.roles.includes(role)) {
      setFormData({
        ...formData,
        roles: formData.roles.filter(r => r !== role)
      });
    } else {
      setFormData({
        ...formData,
        roles: [...formData.roles, role]
      });
    }
  };

  const handleSkillToggle = (skill: string) => {
    if (formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter(s => s !== skill)
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill]
      });
    }
  };

  return (
    <div className="pl-8 pt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Personnes</h1>
      </div>

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
                  {user.job && <p className="text-gray-600">Poste: {user.job}</p>}
                </div>
              </div>
              <div className="space-y-1">
                {user.phone && <p className="text-gray-600">Tél: {user.phone}</p>}
                <p className="text-gray-600">
                  <span className="font-medium">Rôles:</span> {user.roles.filter(role => role !== 'ROLE_USER').join(', ') || 'Utilisateur'}
                </p>
                {user.skills && user.skills.length > 0 && (
                  <p className="text-gray-600">
                    <span className="font-medium">Compétences:</span> {user.skills.join(', ')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(user)}
                  className="bg-[#007AFF] text-white px-3 py-1 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto animate-slideIn">
            <h2 className="text-2xl font-semibold mb-4">
              Modifier une personne
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Prénom</label>
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nom</label>
                  <input
                    type="text"
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Poste / Fonction</label>
                  <input
                    type="text"
                    placeholder="Poste ou fonction"
                    value={formData.job}
                    onChange={(e) => setFormData({...formData, job: e.target.value})}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Rôles</label>
                <div className="flex flex-wrap gap-2">
                  {availableRoles.map((role) => (
                    <div 
                      key={role}
                      onClick={() => handleRoleToggle(role)}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer border ${
                        formData.roles.includes(role) 
                          ? 'bg-[#007AFF] text-white border-[#007AFF]' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {role.replace('ROLE_', '')}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Compétences</label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map((skill) => (
                    <div 
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer border ${
                        formData.skills.includes(skill) 
                          ? 'bg-[#007AFF] text-white border-[#007AFF]' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#007AFF] text-white rounded hover:bg-blue-600"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
