// This component displays expense rows in a table.
function ExpenseTable({ expenses }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td>{expense.category}</td>
            <td>{expense.description || 'No description'}</td>
            <td>₹{Number(expense.amount).toLocaleString()}</td>
            <td>{expense.expense_date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ExpenseTable;
