import { formatCurrency } from '../utils/helpers';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

export default function PotCard({ pot, onDeposit, onWithdraw, onDelete }) {
  const [showActions, setShowActions] = useState(false);
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);

  const percentage = (pot.current_amount / pot.target_amount) * 100;

  const handleAction = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      if (action === 'deposit') {
        await onDeposit(pot.id, parseFloat(amount));
      } else {
        await onWithdraw(pot.id, parseFloat(amount));
      }
      setAmount('');
      setAction(null);
      setShowActions(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{pot.name}</h3>
        <button
          onClick={() => onDelete(pot.id)}
          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 text-sm mb-1">Saved</p>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(pot.current_amount)}
        </p>
        <p className="text-gray-600 text-sm">
          of {formatCurrency(pot.target_amount)}
        </p>
      </div>

      <div className="space-y-2 mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm font-semibold text-gray-900 text-right">
          {Math.round(percentage)}%
        </p>
      </div>

      {!showActions && (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setAction('deposit');
              setShowActions(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-600 py-2 rounded-lg hover:bg-green-100 transition font-medium"
          >
            <Plus className="w-4 h-4" />
            Deposit
          </button>
          <button
            onClick={() => {
              setAction('withdraw');
              setShowActions(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition font-medium"
          >
            <Minus className="w-4 h-4" />
            Withdraw
          </button>
        </div>
      )}

      {showActions && (
        <div className="space-y-3 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ({action === 'deposit' ? 'Add' : 'Remove'})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAction}
              disabled={loading}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                action === 'deposit'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } disabled:opacity-50`}
            >
              {loading ? 'Processing...' : action === 'deposit' ? 'Deposit' : 'Withdraw'}
            </button>
            <button
              onClick={() => {
                setShowActions(false);
                setAmount('');
                setAction(null);
              }}
              className="flex-1 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
