import { useEffect, useState } from 'react';
import { useDataStore } from '../stores/dataStore';
import { dashboardApi } from '../services/api';
import toast from 'react-hot-toast';
import { TrendingUp, TrendingDown, Target, PieChart } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import StatCard from '../components/StatCard';
import RecentTransactions from '../components/RecentTransactions';
import BudgetOverview from '../components/BudgetOverview';
import PotProgress from '../components/PotProgress';

export default function DashboardPage() {
  const dashboard = useDataStore((state) => state.dashboard);
  const setDashboard = useDataStore((state) => state.setDashboard);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardApi.getOverview();
      setDashboard(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const { total_balance, total_income, total_expenses, latest_transactions, budgets, pots, pots_progress } = dashboard;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your financial overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<PieChart className="w-8 h-8" />}
          label="Total Balance"
          value={formatCurrency(total_balance)}
          color="purple"
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          label="Total Income"
          value={formatCurrency(total_income)}
          color="green"
        />
        <StatCard
          icon={<TrendingDown className="w-8 h-8" />}
          label="Total Expenses"
          value={formatCurrency(total_expenses)}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <RecentTransactions transactions={latest_transactions} />
        </div>

        {/* Pots Progress */}
        <div>
          <PotProgress potsProgress={pots_progress} pots={pots} />
        </div>
      </div>

      {/* Budget Overview */}
      {budgets && budgets.length > 0 && (
        <div>
          <BudgetOverview budgets={budgets} />
        </div>
      )}
    </div>
  );
}
