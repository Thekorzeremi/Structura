import { useState, useEffect } from "react";
import Select from "../components/ui/Select";
import { useAuth } from "../contexts/AuthContext";

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  job: string;
  roles: string[];
  skills: string[];
}

export default function Settings() {
  const { token, user } = useAuth();
  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const userEmail = decodedToken?.username;
  const [filter, setFilter] = useState('profile');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [newSkill, setNewSkill] = useState('');

  const filterItems = [
    { name: "Profil", value: 'profile'},
    { name: "Sécurité & Confidentialité", value: 'settings'}
  ]

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userEmail || !token) return;

        const response = await fetch('http://localhost:8000/api/users/me', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email: userEmail
          })
        });

        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userEmail, token]);

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      if (!userData?.skills.includes(newSkill.trim())) {
        setUserData(prev => prev ? {
          ...prev,
          skills: [...prev.skills, newSkill.trim()]
        } : null);
      }
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setUserData(prev => prev ? {
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    } : null);
  };

  const handleSave = async () => {
    if (!userData || !token || !userEmail) return;
    
    try {
      const response = await fetch('http://localhost:8000/api/users/me/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          job: userData.job,
          skills: userData.skills
        })
      });

      if (!response.ok) throw new Error('Failed to update user data');
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div className="pl-8 pt-6">
      <span className="text-3xl font-semibold">Profil & Paramètres</span>
      <div className="mt-6 p-8 bg-white rounded-lg">
        <Select items={filterItems} value={filter} onChange={(value) => setFilter(value)} />
        {filter === 'profile' && (
          <div className="mt-6 flex">
            <div className="w-1/2">
              <div className="mb-4">
                <span className="text-lg font-semibold">Informations personnelles</span>
                <div className="flex mt-4 gap-x-2 w-full">
                  <div className="flex flex-col w-[50%]">
                    <label htmlFor="first_name" className="text-xs font-normal mb-1">Prénom</label>
                    <input 
                      type="text" 
                      id="first_name" 
                      value={userData?.firstName || ''}
                      onChange={(e) => setUserData(prev => prev ? {...prev, firstName: e.target.value} : null)}
                      className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                      name="first_name"
                    />
                  </div>
                  <div className="flex flex-col w-[50%]">
                    <label htmlFor="last_name" className="text-xs font-normal mb-1">Nom</label>
                    <input 
                      type="text" 
                      id="last_name" 
                      value={userData?.lastName || ''}
                      onChange={(e) => setUserData(prev => prev ? {...prev, lastName: e.target.value} : null)}
                      className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                      name="last_name"
                    />
                  </div>
                </div>
                <div className="flex mt-4 gap-x-2 w-full">
                  <div className="flex flex-col w-[50%]">
                    <label htmlFor="email" className="text-xs font-normal mb-1">Adresse e-mail <span className="text-gray-400">(non modifiable)</span></label>
                    <input 
                      type="email" 
                      id="email" 
                      value={userData?.email || ''}
                      onChange={(e) => setUserData(prev => prev ? {...prev, email: e.target.value} : null)}
                      className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                      name="email"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col w-[50%]">
                    <label htmlFor="phone" className="text-xs font-normal mb-1">Téléphone</label>
                    <input 
                      type="text" 
                      id="phone" 
                      value={userData?.phone || ''}
                      onChange={(e) => setUserData(prev => prev ? {...prev, phone: e.target.value} : null)}
                      className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                      name="phone"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-lg font-semibold">Informations professionnelles</span>
                <div className="flex mt-4 gap-x-2 w-    full">
                  <div className="flex flex-col w-[50%]">
                    <label htmlFor="roles" className="text-xs font-normal mb-1">Rôle <span className="text-gray-400">(non modifiable)</span></label>
                    <input 
                      type="text" 
                      id="roles" 
                      value={userData?.roles?.[0] || ''}
                      className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                      name="roles"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col w-[50%]">
                    <label htmlFor="job" className="text-xs font-normal mb-1">Métier</label>
                    <input 
                      type="text" 
                      id="job" 
                      value={userData?.job || ''}
                      onChange={(e) => setUserData(prev => prev ? {...prev, job: e.target.value} : null)}
                      className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                      name="job"
                    />
                  </div>
                </div>
                <div className="flex mt-4 gap-x-2 w-full">
                  <div className="flex flex-col w-full">
                    <label htmlFor="skills" className="text-xs font-normal mb-1">Compétences</label>
                    <div className="flex flex-wrap gap-2 p-2 min-h-[42px] rounded bg-[#f7f9fc] border border-[#E5E5E5]">
                      {userData?.skills.map((skill, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-[#E5E5E5] hover:border-[#007AFF] transition-colors"
                        >
                          <span className="text-sm">{skill}</span>
                          <button
                            onClick={() => removeSkill(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            type="button"
                            aria-label="Supprimer la compétence"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <input 
                        type="text"
                        placeholder="Ajouter une compétence"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={handleAddSkill}
                        className="text-sm bg-transparent outline-none placeholder:text-xs flex-1 min-w-[150px] focus:placeholder:text-[#007AFF]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2 flex items-start justify-end">
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-[#ffffff] text-black border border-black text-xs rounded hover:bg-[#0056b3] hover:text-white transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}