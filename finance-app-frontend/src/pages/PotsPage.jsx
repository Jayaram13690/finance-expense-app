import { useEffect, useState } from 'react';
import { useDataStore } from '../stores/dataStore';
import { potApi } from '../services/api';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import PotCard from '../components/PotCard';
import AddPotModal from '../components/AddPotModal';

export default function PotsPage() {
  const pots = useDataStore((state) => state.pots);
  const setPots = useDataStore((state) => state.setPots);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadPots();
  }, []);

  const loadPots = async () => {
    try {
      const response = await potApi.getPots();
      setPots(response.data);
    } catch (error) {
      toast.error('Failed to load pots');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPot = async (data) => {
    try {
      const response = await potApi.createPot(data);
      useDataStore.getState().addPot(response.data);
      setShowModal(false);
      toast.success('Pot created');
      loadPots();
    } catch (error) {
      toast.error('Failed to create pot');
    }
  };

  const handleDeposit = async (potId, amount) => {
    try {
      await potApi.deposit(potId, amount);
      toast.success('Deposited successfully');
      loadPots();
    } catch (error) {
      toast.error('Failed to deposit');
    }
  };

  const handleWithdraw = async (potId, amount) => {
    try {
      await potApi.withdraw(potId, amount);
      toast.success('Withdrawn successfully');
      loadPots();
    } catch (error) {
      toast.error('Failed to withdraw');
    }
  };

  const handleDeletePot = async (id) => {
    try {
      await potApi.deletePot(id);
      toast.success('Pot deleted');
      loadPots();
    } catch (error) {
      toast.error('Failed to delete pot');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Savings Pots</h1>
          <p className="text-gray-600">Create savings goals and track your progress</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
        >
          <Plus className="w-5 h-5" />
          Add Pot
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <AddPotModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddPot}
        />
      )}

      {/* Pots Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div>
          {pots.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No pots yet. Create one to start saving!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pots.map((pot) => (
                <PotCard
                  key={pot.id}
                  pot={pot}
                  onDeposit={handleDeposit}
                  onWithdraw={handleWithdraw}
                  onDelete={handleDeletePot}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
