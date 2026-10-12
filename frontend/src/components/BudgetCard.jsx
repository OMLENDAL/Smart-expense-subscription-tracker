// This component displays budget information in a compact card.
function BudgetCard({ budget }) {
  return (
    <div className="card budget-card">
      <strong>{budget.category}</strong>
      <p>Budget: ₹{Number(budget.limit_amount).toLocaleString()}</p>
      <small>Month: {budget.month}</small>
    </div>
  );
}

export default BudgetCard;
