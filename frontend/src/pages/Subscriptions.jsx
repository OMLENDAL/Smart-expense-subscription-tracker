// This page displays all subscriptions for the current user.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    async function loadSubscriptions() {
      const response = await apiRequest('/subscriptions');
      setSubscriptions(response.data || []);
    }

    loadSubscriptions();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Subscriptions</h2>
        <Link to="/add-subscription" className="primary-button">Add Subscription</Link>
      </div>

      <div className="card-grid">
        {subscriptions.map((subscription) => (
          <div key={subscription.id} className="card">
            <h3>{subscription.name}</h3>
            <p>{subscription.category}</p>
            <p>₹{Number(subscription.amount).toLocaleString()} / {subscription.billing_cycle}</p>
            <small>Next payment: {subscription.next_payment_date}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subscriptions;
