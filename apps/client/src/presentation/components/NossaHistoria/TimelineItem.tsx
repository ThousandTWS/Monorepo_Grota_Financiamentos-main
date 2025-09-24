function TimelineItem({
  year,
  title,
  icon,
}: {
  year: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative flex items-start">
      <div className="absolute left-6 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg" />
      <div className="ml-20 bg-white rounded-lg border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-orange-100 p-2 rounded-lg">{icon}</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{year}</h3>
              <p className="text-orange-600 font-semibold">{title}</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">{title}</div>
        </div>
        <p className="text-gray-600 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua ut enim ad minim
          veniam.
        </p>
      </div>
    </div>
  );
}

export default TimelineItem;