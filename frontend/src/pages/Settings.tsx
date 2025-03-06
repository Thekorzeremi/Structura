import { useState } from "react";
import Select from "../components/ui/Select";

export default function Settings() {
  const [filter, setFilter] = useState('profile');

  const filterItems = [
    { name: "Profil", value: 'profile'},
    { name: "Paramètres", value: 'settings'}
  ]
  
  return (
    <div className="pl-8 pt-6">
      <span className="text-3xl font-semibold">Profil & Paramètres</span>
      <div className="mt-6 p-8 bg-white rounded-lg">
        <Select items={filterItems} value={filter} onChange={(value) => setFilter(value)} />
          
      </div>
    </div>
  );
}