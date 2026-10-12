// This page displays a form for creating a new expense.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';

const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Health', 'Other'];
const paymentMethods = ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Other'];

function AddExpense() {
  const [form, setForm] = useState({ amount: '', category: 'Food', description: '', expense_date: '', payment_method: 'UPI' });
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await apiRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    navigate('/expenses');
  };

  return (
    <div className="page">
      <h2>Add Expense</h2>
      <form className="form-page" onSubmit={handleSubmit}>
        <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} />
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="expense_date" type="date" value={form.expense_date} onChange={handleChange} />
        <select name="payment_method" value={form.payment_method} onChange={handleChange}>
          {paymentMethods.map((method) => <option key={method} value={method}>{method}</option>)}
        </select>
        <button type="submit">Save Expense</button>
      </form>
    </div>
  );
}

export default AddExpense;
