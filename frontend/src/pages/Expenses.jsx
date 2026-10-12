// This page lists all user expenses along with a simple search bar.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import ExpenseTable from '../components/ExpenseTable';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadExpenses() {
      const response = await apiRequest('/expenses');
      setExpenses(response.data || []);
    }

    loadExpenses();
  }, []);

  const filteredExpenses = expenses.filter((expense) =>
    expense.category.toLowerCase().includes(search.toLowerCase()) ||
    (expense.description || '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="page">
      <div className="page-header">
        <h2>Expenses</h2>
        <Link to="/add-expense" className="primary-button">Add Expense</Link>
      </div>

      <input
        className="search-box"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by category or description"
      />

      <ExpenseTable expenses={filteredExpenses} />
    </div>
  );
}

export default Expenses;
