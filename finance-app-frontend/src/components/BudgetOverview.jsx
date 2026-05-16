import { formatCurrency, getCategoryColor } from '../utils/helpers';
import { AlertCircle } from 'lucide-react';

export default function BudgetOverview({ budgets }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Budget Overview</h2>

      {budgets.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No budgets set</p>
      ) : (
        <div className="space-y-6">
          {budgets.map((budget) => {
            const percentage = (budget.spent_amount / budget.limit_amount) * 100;
            const isOverBudget = percentage > 100;

            return (
              <div key={budget.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getCategoryColor(budget.category)}`}>
                      {budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatCurrency(budget.spent_amount)} / {formatCurrency(budget.limit_amount)}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition ${
                      isOverBudget ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>

                {isOverBudget && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Over budget by {formatCurrency(budget.spent_amount - budget.limit_amount)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
