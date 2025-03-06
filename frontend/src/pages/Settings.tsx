import { useState } from "react";
import Select from "../components/ui/Select";

export default function Settings() {
  const [filter, setFilter] = useState('profile');
  const [skills, setSkills] = useState<string[]>(['Electricité', 'Equipe', 'Rigueur']);
  const [newSkill, setNewSkill] = useState('');

  const filterItems = [
    { name: "Profil", value: 'profile'},
    { name: "Paramètres", value: 'settings'}
  ]

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="pl-8 pt-6">
      <span className="text-3xl font-semibold">Profil & Paramètres</span>
      <div className="mt-6 p-8 bg-white rounded-lg">
        <Select items={filterItems} value={filter} onChange={(value) => setFilter(value)} />
        {filter === 'profile' && (
          <div className="mt-6">
            <div className="mb-4">
              <span className="text-lg font-semibold">Informations personnelles</span>
              <div className="flex mt-4 gap-x-2 w-1/2">
                <div className="flex flex-col w-[50%]">
                  <label htmlFor="first_name" className="text-xs font-normal mb-1">Prénom</label>
                  <input 
                    type="text" 
                    id="first_name" 
                    placeholder="Lilian" 
                    className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                    name="first_name"
                  />
                </div>
                <div className="flex flex-col w-[50%]">
                  <label htmlFor="last_name" className="text-xs font-normal mb-1">Nom</label>
                  <input 
                    type="text" 
                    id="last_name" 
                    placeholder="Duvar" 
                    className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                    name="last_name"
                  />
                </div>
              </div>
              <div className="flex mt-4 gap-x-2 w-1/2">
                <div className="flex flex-col w-[50%]">
                  <label htmlFor="phone" className="text-xs font-normal mb-1">Téléphone</label>
                  <input 
                    type="text" 
                    id="phone" 
                    placeholder="0612453215" 
                    className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                    name="phone"
                  />
                </div>
                <div className="w-[50%] opacity-0"></div>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-lg font-semibold">Informations professionnelles</span>
              <div className="flex mt-4 gap-x-2 w-1/2">
                <div className="flex flex-col w-[50%]">
                  <label htmlFor="roles" className="text-xs font-normal mb-1">Rôle <span className="text-gray-400">(non modifiable)</span></label>
                  <input 
                    type="text" 
                    id="roles" 
                    placeholder="EMPLOYÉ" 
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
                    placeholder="Electricien" 
                    className="text-sm rounded bg-[#f2f2f2] border border-[#E5E5E5] placeholder:text-xs" 
                    name="job"
                  />
                </div>
              </div>
              <div className="flex mt-4 gap-x-2 w-full">
                <div className="flex flex-col w-[50%]">
                  <label htmlFor="skills" className="text-xs font-normal mb-1">Compétences</label>
                  <div className="flex flex-wrap gap-2 p-2 min-h-[42px] rounded bg-[#f7f9fc] border border-[#E5E5E5]">
                    {skills.map((skill, index) => (
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
        )}
      </div>
    </div>
  );
}