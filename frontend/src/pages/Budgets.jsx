// This page shows monthly budget limits and spending summary.
import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

function Budgets() {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    async function loadBudgets() {
      const response = await apiRequest('/budgets');
      setBudgets(response.data || []);
    }

    loadBudgets();
  }, []);

  return (
    <div className="page">
      <h2>Budgets</h2>
      <div className="card-grid">
        {budgets.map((budget) => (
          <div className="card" key={budget.id}>
            <h3>{budget.category}</h3>
            <p>Limit: ₹{Number(budget.limit_amount).toLocaleString()}</p>
            <small>Month: {budget.month}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Budgets;
