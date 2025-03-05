import React from 'react';

const People = () => {
  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-6">Mes employés</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cards des People iront ici */}
      </div>
    </div>
  );
};

export default People;
