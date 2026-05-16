import { useEffect, useState } from 'react';
import { useDataStore } from '../stores/dataStore';
import { budgetApi } from '../services/api';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import BudgetCard from '../components/BudgetCard';
import AddBudgetModal from '../components/AddBudgetModal';

export default function BudgetsPage() {
  const budgets = useDataStore((state) => state.budgets);
  const setBudgets = useDataStore((state) => state.setBudgets);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const response = await budgetApi.getBudgets();
      setBudgets(response.data);
    } catch (error) {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async (data) => {
    try {
      const response = await budgetApi.createBudget(data);
      useDataStore.getState().addBudget(response.data);
      setShowModal(false);
      toast.success('Budget created');
      loadBudgets();
    } catch (error) {
      toast.error('Failed to create budget');
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
      await budgetApi.deleteBudget(id);
      toast.success('Budget deleted');
      loadBudgets();
    } catch (error) {
      toast.error('Failed to delete budget');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600">Set and manage your spending limits</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
        >
          <Plus className="w-5 h-5" />
          Add Budget
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <AddBudgetModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddBudget}
        />
      )}

      {/* Budgets Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div>
          {budgets.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No budgets yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  onDelete={handleDeleteBudget}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
