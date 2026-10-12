// This component offers a simple card view for subscriptions.
function SubscriptionCard({ subscription }) {
  return (
    <div className="card">
      <h4>{subscription.name}</h4>
      <p>{subscription.category}</p>
      <strong>₹{Number(subscription.amount).toLocaleString()}</strong>
      <small>{subscription.next_payment_date}</small>
    </div>
  );
}

export default SubscriptionCard;
