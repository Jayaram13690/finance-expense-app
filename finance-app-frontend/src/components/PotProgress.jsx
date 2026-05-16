import { formatCurrency } from '../utils/helpers';
import { TrendingUp } from 'lucide-react';

export default function PotProgress({ potsProgress, pots }) {
  const percentage = potsProgress.target > 0 
    ? (potsProgress.current / potsProgress.target) * 100 
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900">Savings Progress</h2>
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-600 text-sm mb-2">Total Progress</p>
        <p className="text-3xl font-bold text-gray-900">
          {formatCurrency(potsProgress.current)}
        </p>
        <p className="text-gray-600 text-sm">
          of {formatCurrency(potsProgress.target)}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 transition"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        <p className="text-center text-sm font-semibold text-gray-900">
          {Math.round(percentage)}% Complete
        </p>
      </div>

      {pots.length > 0 && (
        <div className="border-t pt-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">Your Pots ({pots.length})</p>
          <div className="space-y-2">
            {pots.map((pot) => (
              <div key={pot.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{pot.name}</span>
                <span className="font-semibold">{formatCurrency(pot.current_amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
