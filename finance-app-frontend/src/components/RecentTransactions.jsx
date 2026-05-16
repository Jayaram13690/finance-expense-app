import { formatCurrency, formatDate, getCategoryIcon, getCategoryColor } from '../utils/helpers';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function RecentTransactions({ transactions }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No transactions yet</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getCategoryColor(transaction.category || 'other')}`}>
                  {getCategoryIcon(transaction.category || 'other')}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{transaction.title}</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(transaction.created_at, 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
