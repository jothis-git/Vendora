import React from 'react';

const AdminCard = ({ title, icon: Icon, onClick, color }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group`}
    >
      <div className={`p-4 rounded-xl ${color} text-white text-3xl group-hover:scale-110 transition-transform`}>
        <Icon />
      </div>
      <h3 className="font-bold text-gray-800 text-lg text-center">{title}</h3>
      <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Manage Section</p>
    </div>
  );
};

export default AdminCard;
