import React from 'react';
import { TrendingUp, DollarSign, Info } from 'lucide-react';
import Button from '../common/Button';

const EACard = ({ ea, onPurchase }) => {
  return (
    <div className="card hover:shadow-xl transition-all duration-200 border border-gray-200">
      <div className="relative">
        <img
          src={ea.image_url || 'https://via.placeholder.com/400x200'}
          alt={ea.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg">
          <span className="text-sm font-semibold text-primary-600">v{ea.version}</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{ea.name}</h3>
        
        <div className="flex items-center gap-2 text-primary-600 mb-3">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">{ea.strategy_name}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {ea.description}
        </p>

        <div className="flex items-center justify-between mb-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-gray-800">
              ${ea.price || '99'}
            </span>
          </div>
          <button className="text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>

        <Button
          variant="primary"
          className="w-full"
          onClick={() => onPurchase(ea)}
        >
          Purchase License
        </Button>
      </div>
    </div>
  );
};

export default EACard;