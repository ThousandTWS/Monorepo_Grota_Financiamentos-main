function StatItem({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="text-center">
      {value}
      <p className="text-gray-600">{label}</p>
    </div>
  );
}

export default StatItem;