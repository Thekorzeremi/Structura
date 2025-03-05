import React from 'react';
import Calendar from '../components/assignement/Calendar';

const Assignement = () => {
  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-6 ml-4">Mes affectations</h1>
      <Calendar />
    </div>
  );
};

export default Assignement;
