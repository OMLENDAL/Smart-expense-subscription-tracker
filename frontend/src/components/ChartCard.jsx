// This component wraps a chart area in a reusable layout.
function ChartCard({ title, children }) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default ChartCard;
