import { create } from 'zustand';

export const useDataStore = create((set) => ({
  transactions: [],
  budgets: [],
  pots: [],
  dashboard: null,

  setTransactions: (transactions) => set({ transactions }),
  setBudgets: (budgets) => set({ budgets }),
  setPots: (pots) => set({ pots }),
  setDashboard: (dashboard) => set({ dashboard }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  updateTransaction: (id, updated) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updated } : t
      ),
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  addBudget: (budget) =>
    set((state) => ({
      budgets: [budget, ...state.budgets],
    })),

  addPot: (pot) =>
    set((state) => ({
      pots: [pot, ...state.pots],
    })),

  updatePot: (id, updated) =>
    set((state) => ({
      pots: state.pots.map((p) =>
        p.id === id ? { ...p, ...updated } : p
      ),
    })),
}));
