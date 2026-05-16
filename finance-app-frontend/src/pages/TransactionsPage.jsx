import { useEffect, useState } from 'react';
import { useDataStore } from '../stores/dataStore';
import { transactionApi } from '../services/api';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import TransactionList from '../components/TransactionList';
import AddTransactionModal from '../components/AddTransactionModal';

export default function TransactionsPage() {
  const transactions = useDataStore((state) => state.transactions);
  const setTransactions = useDataStore((state) => state.setTransactions);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadTransactions();
  }, [page]);

  const loadTransactions = async () => {
    try {
      const response = await transactionApi.getTransactions(page, 10);
      setTransactions(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (data) => {
    try {
      const response = await transactionApi.createTransaction(data);
      useDataStore.getState().addTransaction(response.data);
      setShowModal(false);
      toast.success('Transaction added');
      loadTransactions();
    } catch (error) {
      toast.error('Failed to add transaction');
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await transactionApi.deleteTransaction(id);
      useDataStore.getState().deleteTransaction(id);
      toast.success('Transaction deleted');
      loadTransactions();
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Track all your income and expenses</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddTransaction}
        />
      )}

      {/* Transactions List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div>
          <TransactionList
            transactions={transactions}
            onDelete={handleDeleteTransaction}
          />

          {/* Pagination */}
          {total > 10 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 10 >= total}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
