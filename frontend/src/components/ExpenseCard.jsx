// This small card displays a quick summary for each expense entry.
function ExpenseCard({ item }) {
  return (
    <div className="card expense-card">
      <div className="card-header-row">
        <strong>{item.category}</strong>
        <span className="amount">₹{Number(item.amount).toLocaleString()}</span>
      </div>
      <p>{item.description}</p>
      <small>{item.expense_date}</small>
    </div>
  );
}

export default ExpenseCard;
