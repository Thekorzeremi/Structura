import { useState, useEffect } from "react";
import Select from "../components/ui/Select";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

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
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const filterItems = [
    { name: "Profil", value: 'profile'},
    { name: "Sécurité & Confidentialité", value: 'security'}
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
          phone: userData.phone ?? '',
          job: userData.job ?? '',
          skills: userData.skills ?? []
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return;
      }

      setUserData(data);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setPasswordError('');
      setPasswordSuccess('');

      const response = await fetch('http://localhost:8000/api/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: userData?.email,
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.error || 'Une erreur est survenue');
        return;
      }

      setPasswordSuccess('Mot de passe modifié avec succès');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setPasswordError('Une erreur est survenue lors de la modification du mot de passe');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteError('');

      const response = await fetch('http://localhost:8000/api/anonymize-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: userData?.email,
          password: deleteAccountPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setDeleteError(data.error || 'Une erreur est survenue');
        return;
      }

      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      setDeleteError('Une erreur est survenue lors de la suppression du compte');
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
                <div className="flex mt-4 gap-x-2 w-full">
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
        {filter === 'security' && (
          <div className="mt-6 flex flex-col">
            <div className="mb-4">
              <span className="text-lg font-semibold">Autorisations</span>
              <div className="flex flex-col w-fit justify-start gap-y-3 mt-4">
                <div className="flex items-center gap-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      name="demo"
                    />
                    <div className="w-9 h-5 bg-[#e5e5e5] border border-[#E5E5E5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#007AFF] peer-checked:after:bg-white"></div>
                  </label>
                  <label htmlFor="demo" className="text-xs font-normal cursor-pointer">M'envoyer des mails concernant les dernières offres et actualités de Structura Group</label>
                </div>
                <div className="flex items-center gap-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      name="demo"
                    />
                    <div className="w-9 h-5 bg-[#e5e5e5] border border-[#E5E5E5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#007AFF] peer-checked:after:bg-white"></div>
                  </label>
                  <label htmlFor="demo" className="text-xs font-normal cursor-pointer">J'autorise le partage de mes données de manière anonymisée avec Structura Group pour de l'analyse par des tiers </label>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-lg font-semibold">Zone danger</span>
              <div className="mt-6 max-w-md">
                <div className="p-6 border border-red-200 rounded-lg bg-red-50">
                  <h3 className="text-sm font-semibold text-red-800 mb-6">Modification du mot de passe</h3>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="currentPassword" className="text-xs text-gray-600">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 text-sm bg-[#f7f9fc] border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] placeholder:text-xs"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="newPassword" className="text-xs text-gray-600">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 text-sm bg-[#f7f9fc] border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] placeholder:text-xs"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="flex flex-row gap-1 justify-between items-center">
                      <>
                        {passwordError && (
                          <div className="text-xs text-red-600">{passwordError}</div>
                        )}
                        {passwordSuccess && (
                          <div className="text-xs text-green-600">{passwordSuccess}</div>
                        )}
                      </>
                      <div className="flex">
                        <button
                          onClick={handlePasswordChange}
                          disabled={!currentPassword || !newPassword}
                          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                            !currentPassword || !newPassword
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-[#007AFF] text-white hover:bg-[#0056b3]'
                          }`}
                        >
                          Modifier le mot de passe
                        </button>
                      </div>
                    </div>
                  </div>
                  
                </div>
                <div className="mt-6 p-6 border border-red-200 rounded-lg bg-red-50">
                  <h3 className="text-sm font-semibold text-red-800 mb-6">Anonymiser mon compte</h3>
                  <p className="text-xs text-red-600 mb-6">
                    Attention : L'annonymisation de votre compte est irréversible. Toutes vos données seront définitivement supprimées.
                  </p>
                  {!showDeleteConfirm ? (
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Anonymiser mon compte
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-col gap-1">
                        <label htmlFor="deleteAccountPassword" className="text-xs text-gray-600">
                          Confirmez votre mot de passe
                        </label>
                        <input
                          type="password"
                          id="deleteAccountPassword"
                          value={deleteAccountPassword}
                          onChange={(e) => setDeleteAccountPassword(e.target.value)}
                          className="w-full px-4 py-2 text-sm bg-[#f7f9fc] border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] placeholder:text-xs"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="flex flex-row gap-4 justify-end items-center">
                        {deleteError && (
                          <div className="text-xs text-red-600">{deleteError}</div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setShowDeleteConfirm(false);
                              setDeleteAccountPassword('');
                              setDeleteError('');
                            }}
                            className="px-4 py-2 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={handleDeleteAccount}
                            disabled={!deleteAccountPassword}
                            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                              !deleteAccountPassword
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            Confirmer
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}