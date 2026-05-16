import { formatCurrency, getCategoryColor } from '../utils/helpers';
import { Trash2, AlertCircle } from 'lucide-react';

export default function BudgetCard({ budget, onDelete }) {
  const percentage = (budget.spent_amount / budget.limit_amount) * 100;
  const isOverBudget = percentage > 100;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getCategoryColor(budget.category)}`}>
          {budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}
        </span>
        <button
          onClick={() => onDelete(budget.id)}
          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 text-sm mb-1">Spent</p>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(budget.spent_amount)}
        </p>
        <p className="text-gray-600 text-sm">
          of {formatCurrency(budget.limit_amount)}
        </p>
      </div>

      <div className="space-y-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition ${
              isOverBudget ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {Math.round(percentage)}%
          </p>
        </div>
      </div>

      {isOverBudget && (
        <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 rounded-lg text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Over budget</span>
        </div>
      )}
    </div>
  );
}
