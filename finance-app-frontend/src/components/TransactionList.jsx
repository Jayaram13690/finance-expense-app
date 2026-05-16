import { formatCurrency, formatDate, getCategoryIcon, getCategoryColor } from '../utils/helpers';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

export default function TransactionList({ transactions, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No transactions yet</p>
        </div>
      ) : (
        <div className="divide-y">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-6 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${getCategoryColor(transaction.category || 'other')}`}>
                  {getCategoryIcon(transaction.category || 'other')}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{transaction.title}</p>
                  <p className="text-sm text-gray-600">
                    {transaction.category ? transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1) : 'No category'} • {formatDate(transaction.created_at, 'MMM dd, yyyy')}
                  </p>
                  {transaction.description && (
                    <p className="text-sm text-gray-500 mt-1">{transaction.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-right">
                  {transaction.type === 'income' ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                  <span
                    className={`font-semibold text-lg ${
                      transaction.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(transaction.id)}
                  disabled={deletingId === transaction.id}
                  className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
