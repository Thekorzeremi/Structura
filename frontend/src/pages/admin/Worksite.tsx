import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Worksite {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  place: string;
  description?: string;
  skills: string[];
}

export default function Worksite() {
  const { token } = useAuth(); 
  const [worksites, setWorksites] = useState<Worksite[]>([]);
  const [selectedWorksite, setSelectedWorksite] = useState<Worksite | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    place: '',
    description: '',
    skills: [] as string[],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    fetchWorksites();
  }, []);

  const fetchWorksites = async () => {
    setIsLoading(true); 
    try {
      const response = await fetch('http://localhost:8000/api/worksites', {
        headers: {
          'Authorization': `Bearer ${token}`,
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
          'Authorization': `Bearer ${token}`,
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
          'Authorization': `Bearer ${token}`,
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
      startDate: worksite.startDate,
      endDate: worksite.endDate,
      place: worksite.place,
      description: worksite.description || '',
      skills: worksite.skills,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedWorksite(null);
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      place: '',
      description: '',
      skills: [],
    });
  };

  return (
    <div className="pl-8 pt-6">
      <span className="text-3xl font-semibold">Chantiers</span>
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
        </div>
      ) : (
        <div className="mt-4">
          {worksites.map((worksite) => (
            <div key={worksite.id} className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <img src={`/worksite/1.jpg`} className="w-12 h-12 object-cover rounded-full" />
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold">{worksite.title}</p>
                    <p className="text-gray-600 text-xs">Emplacement: {worksite.place}</p>
                    <p className="text-gray-600 text-xs">Période: {worksite.startDate} - {worksite.endDate}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(worksite)}
                    className="bg-[#007AFF] text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteWorksite(worksite.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
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
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Place</label>
                  <input
                    type="text"
                    placeholder="Place"
                    value={formData.place}
                    onChange={(e) => setFormData({...formData, place: e.target.value})}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Description</label>
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#007AFF]"
                  />
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