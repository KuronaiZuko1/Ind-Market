import React from 'react';
import { Key, Calendar, CheckCircle } from 'lucide-react';

const LicenseCard = ({ license }) => {
  return (
    <div className="card hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <Key className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{license.ea_name}</h3>
          <p className="text-sm text-gray-600">{license.strategy_name}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Key className="w-4 h-4 text-gray-400" />
          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
            {license.license_key}
          </code>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-gray-600">Active</span>
        </div>
      </div>
    </div>
  );
};

export default LicenseCard;
