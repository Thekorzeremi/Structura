import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PencilIcon, TrashIcon } from 'lucide-react';

interface Worksite {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  place: string;
  description?: string;
  skills: string[];
  manager_id?: number;
}

interface User {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  roles: string[];
}

export default function Worksite() {
  const { token, user } = useAuth();
  const [worksites, setWorksites] = useState<Worksite[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [selectedWorksite, setSelectedWorksite] = useState<Worksite | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    start_date: '',
    end_date: '',
    place: '',
    description: '',
    skills: [] as string[],
    manager_id: undefined as number | undefined,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchWorksites();
    fetchManagers();
  }, []);

  const fetchWorksites = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/worksites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch worksites');
      const data = await response.json();
      setWorksites(data);
    } catch (error) {
      console.error('Error fetching worksites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/worksites/managers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch managers');
      const data = await response.json();
      setManagers(data);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const handleAddOrEditWorksite = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = selectedWorksite ? 'PUT' : 'POST';
    const url = selectedWorksite
      ? `http://localhost:8000/api/worksites/${selectedWorksite.id}`
      : 'http://localhost:8000/api/worksites';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to save worksite');
      fetchWorksites();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving worksite:', error);
    }
  };

  const handleDeleteWorksite = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this worksite?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/worksites/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete worksite');
      fetchWorksites();
    } catch (error) {
      console.error('Error deleting worksite:', error);
    }
  };

  const openEditModal = (worksite: Worksite) => {
    setSelectedWorksite(worksite);
    setFormData({
      title: worksite.title,
      start_date: worksite.start_date,
      end_date: worksite.end_date,
      place: worksite.place,
      description: worksite.description || '',
      skills: worksite.skills,
      manager_id: worksite.manager_id,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedWorksite(null);
    setFormData({
      title: '',
      start_date: '',
      end_date: '',
      place: '',
      description: '',
      skills: [],
      manager_id: undefined,
    });
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="pl-8 pt-6">
      <div className="flex justify-between items-center">
        <span className="text-3xl font-semibold">
          {user?.roles?.includes('ROLE_ADMIN') ? 'Gestion des chantiers' : 'Chantiers'}
        </span>
        {user?.roles?.includes('ROLE_ADMIN') && (
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="mr-8 px-4 py-2 bg-[#007AFF] text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Créer un chantier
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
        </div>
      ) : (
        <div className="mt-4">
          {worksites.map(worksite => {
            const manager = managers.find(m => m.id === worksite.manager_id);
            return (
              <div key={worksite.id} className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <img src={`/worksite/1.jpg`} className="w-12 h-12 object-cover rounded-full" />
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold">{worksite.title}</p>
                      <p className="text-gray-600 text-xs">Emplacement: {worksite.place}</p>
                      <p className="text-gray-600 text-xs">
                        Période:{' '}
                        {format(parseISO(worksite.start_date), 'dd MMMM yyyy', { locale: fr })} -{' '}
                        {format(parseISO(worksite.end_date), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                      {manager && (
                        <p className="text-gray-600 text-xs">
                          Manager: {manager.first_name} {manager.last_name} (ID: {manager.id})
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(worksite)}
                      className="border border-yellow-500 text-yellow-500 px-2 py-2 rounded"
                    >
                      <PencilIcon size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteWorksite(worksite.id)}
                      className="border border-red-500 text-red-500 px-2 py-2 rounded"
                    >
                      <TrashIcon size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">
              {selectedWorksite ? 'Edit Worksite' : 'Add Worksite'}
            </h2>
            <form onSubmit={handleAddOrEditWorksite} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Place</label>
                  <input
                    type="text"
                    placeholder="Place"
                    value={formData.place}
                    onChange={e => setFormData({ ...formData, place: e.target.value })}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Description</label>
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="skills" className="text-xs font-normal mb-1">
                    Compétences
                  </label>
                  <div className="flex flex-wrap gap-2 p-2 min-h-[42px] rounded bg-[#f7f9fc] border border-[#E5E5E5]">
                    {formData.skills.map((skill, index) => (
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
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={handleAddSkill}
                      className="text-sm bg-transparent outline-none placeholder:text-xs flex-1 min-w-[150px] focus:placeholder:text-[#007AFF]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Manager</label>
                  <div className="flex items-center gap-2 mb-2">
                    {formData.manager_id && (
                      <>
                        <span className="text-sm text-gray-700">Manager actuel :</span>
                        {(() => {
                          const currentManager = managers.find(
                            manager => manager.id === formData.manager_id
                          );
                          return (
                            currentManager && (
                              <span className="text-sm text-gray-700">
                                {currentManager.first_name} {currentManager.last_name}
                              </span>
                            )
                          );
                        })()}
                      </>
                    )}
                  </div>
                  <select
                    value={formData.manager_id !== undefined ? formData.manager_id.toString() : ''}
                    onChange={e => {
                      const managerId = e.target.value ? Number(e.target.value) : undefined;
                      setFormData({ ...formData, manager_id: managerId });
                    }}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  >
                    <option value="">Sélectionner un manager</option>
                    {managers.map(manager => (
                      <option key={manager.id} value={manager.id.toString()}>
                        {manager.first_name} {manager.last_name}
                      </option>
                    ))}
                  </select>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#007AFF] text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
