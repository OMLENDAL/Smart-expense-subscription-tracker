// This page creates a new subscription record.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';

const billingCycles = ['Weekly', 'Monthly', 'Yearly'];
const statuses = ['Active', 'Paused', 'Cancelled'];

function AddSubscription() {
  const [form, setForm] = useState({ name: '', amount: '', billing_cycle: 'Monthly', next_payment_date: '', category: 'Other', status: 'Active' });
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await apiRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    navigate('/subscriptions');
  };

  return (
    <div className="page">
      <h2>Add Subscription</h2>
      <form className="form-page" onSubmit={handleSubmit}>
        <input name="name" placeholder="Subscription Name" value={form.name} onChange={handleChange} />
        <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} />
        <select name="billing_cycle" value={form.billing_cycle} onChange={handleChange}>
          {billingCycles.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <input name="next_payment_date" type="date" value={form.next_payment_date} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange}>
          {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button type="submit">Save Subscription</button>
      </form>
    </div>
  );
}

export default AddSubscription;
