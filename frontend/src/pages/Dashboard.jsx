// This page shows the user dashboard with summary cards and a few sample charts.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { apiRequest } from '../services/api';
import ChartCard from '../components/ChartCard';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSummary() {
      try {
        const result = await apiRequest('/dashboard/summary');
        setSummary(result.data);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadSummary();
  }, []);

  if (error) {
    return (
      <section className="page dashboard-message">
        <div className="message-icon message-icon-error">!</div>
        <h2>We couldn't load your dashboard</h2>
        <p>{error}</p>
        <button className="primary-button" type="button" onClick={() => window.location.reload()}>
          Try again
        </button>
      </section>
    );
  }

  if (!summary) {
    return (
      <section className="page dashboard-message" aria-live="polite">
        <span className="loading-spinner" aria-hidden="true" />
        <p>Getting your finances ready...</p>
      </section>
    );
  }

  const chartData = (summary.categoryData || []).map((item) => ({
    name: item.category,
    value: Number(item.total),
  }));

  const recentExpenses = summary.recentExpenses || [];
  const upcomingSubscriptions = summary.upcomingSubscriptions || [];
  const monthlyBudget = Number(summary.budgetTotal || 0);
  const monthlyExpense = Number(summary.monthlyExpense || 0);
  const budgetPercent = monthlyBudget > 0
    ? Math.min((monthlyExpense / monthlyBudget) * 100, 100)
    : 0;

  return (
    <div className="dashboard-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="hero-eyebrow"><span className="hero-dot" /> YOUR MONEY, IN FOCUS</span>
          <h1>A clearer view of<br />your <span>finances.</span></h1>
          <p>Little by little, your spending story starts to make sense.</p>
        </div>
        <div className="hero-actions">
          <Link to="/add-expense" className="hero-primary-action">＋ Add expense</Link>
          <Link to="/budgets" className="hero-secondary-action">Manage budget <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="hero-sparkle">✦</div>
      </section>

      <div className="stats-grid">
        <div className="stat-card stat-card-indigo">
          <div className="stat-card-top"><span>Total expense</span><span className="stat-icon">↗</span></div>
          <strong>₹{Number(summary.totalExpense || 0).toLocaleString()}</strong>
          <small>All recorded spending</small>
        </div>
        <div className="stat-card stat-card-mint">
          <div className="stat-card-top"><span>This month</span><span className="stat-icon">◷</span></div>
          <strong>₹{Number(summary.monthlyExpense || 0).toLocaleString()}</strong>
          <small>Spending this month</small>
        </div>
        <div className="stat-card stat-card-amber">
          <div className="stat-card-top"><span>Monthly budget</span><span className="stat-icon">▤</span></div>
          <strong>₹{Number(summary.budgetTotal || 0).toLocaleString()}</strong>
          <small>Your planned limit</small>
        </div>
        <div className="stat-card stat-card-blue">
          <div className="stat-card-top"><span>Remaining</span><span className="stat-icon">✓</span></div>
          <strong>₹{Number(summary.remainingBudget || 0).toLocaleString()}</strong>
          <small>Available in your budget</small>
        </div>
      </div>

      <div className="dashboard-grid">
        <ChartCard title="Spending by category">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={chartData} margin={{ top: 12, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#e9edf5" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#7c879c', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#7c879c', fontSize: 11 }} />
                <Tooltip
                  cursor={{ fill: '#f4f5ff' }}
                  contentStyle={{ border: '1px solid #e8eaf3', borderRadius: 12, boxShadow: '0 12px 30px rgba(27, 39, 71, .1)' }}
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Spent']}
                />
                <Bar dataKey="value" fill="#625bf6" radius={[7, 7, 2, 2]} maxBarSize={42} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><span>◌</span><strong>No spending yet</strong><small>Add an expense to see your categories here.</small></div>
          )}
        </ChartCard>

        <section className="panel-card budget-panel">
          <div className="panel-heading">
            <div><span className="section-kicker">MONTHLY OVERVIEW</span><h2>Budget progress</h2></div>
            <Link to="/budgets" className="text-link">Details <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="budget-total-row">
            <strong>₹{monthlyExpense.toLocaleString()}</strong>
            <span>of ₹{monthlyBudget.toLocaleString()}</span>
          </div>
          <div className="budget-progress"><span style={{ width: `${budgetPercent}%` }} /></div>
          <div className="budget-caption"><span>{Math.round(budgetPercent)}% used</span><span>₹{Number(summary.remainingBudget || 0).toLocaleString()} left</span></div>
          <div className="budget-note">
            <span className="budget-note-icon">✦</span>
            <span>{monthlyBudget ? (budgetPercent >= 85 ? 'You are getting close to your monthly limit.' : 'You are on track with your monthly budget.') : 'Set a monthly budget to start tracking your progress.'}</span>
          </div>
        </section>
      </div>

      <div className="dashboard-grid lower-grid">
        <section className="panel-card transactions-panel">
          <div className="panel-heading">
            <div><span className="section-kicker">YOUR LATEST ACTIVITY</span><h2>Recent expenses</h2></div>
            <Link to="/expenses" className="text-link">View all <span aria-hidden="true">↗</span></Link>
          </div>
          {recentExpenses.length ? (
            <div className="table-scroll">
              <table className="data-table">
                <thead><tr><th>Expense</th><th>Date</th><th>Amount</th></tr></thead>
                <tbody>
                  {recentExpenses.slice(0, 5).map((item) => (
                    <tr key={item.id}>
                      <td><span className="expense-name"><span className="expense-category-mark">{(item.category || 'E').slice(0, 1).toUpperCase()}</span><span><strong>{item.description || item.category}</strong><small>{item.category}</small></span></span></td>
                      <td>{item.expense_date ? new Date(item.expense_date).toLocaleDateString() : '—'}</td>
                      <td className="amount-cell">−₹{Number(item.amount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state empty-state-short"><span>＋</span><strong>Your first expense starts here</strong><Link to="/add-expense" className="text-link">Add an expense <span aria-hidden="true">→</span></Link></div>
          )}
        </section>

        <section className="panel-card subscriptions-panel">
          <div className="panel-heading">
            <div><span className="section-kicker">RECURRING PAYMENTS</span><h2>Subscriptions</h2></div>
            <Link to="/subscriptions" className="text-link">Manage <span aria-hidden="true">↗</span></Link>
          </div>
          {upcomingSubscriptions.length ? (
            <ul className="subscription-list">
              {upcomingSubscriptions.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <span className="subscription-mark">{(item.name || 'S').slice(0, 1).toUpperCase()}</span>
                  <span className="subscription-description"><strong>{item.name}</strong><small>{item.next_payment_date ? `Next payment ${new Date(item.next_payment_date).toLocaleDateString()}` : item.billing_cycle}</small></span>
                  <strong className="subscription-amount">₹{Number(item.amount).toLocaleString()}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state empty-state-short"><span>◷</span><strong>No subscriptions added</strong><Link to="/add-subscription" className="text-link">Add a subscription <span aria-hidden="true">→</span></Link></div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
