import { Award, Calendar, CheckCircle, TrendingUp } from "lucide-react";
import TimelineItem from "./TimelineItem";

function Timeline() {
  return (
    <div className="mb-32 bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Lorem Ipsum Dolor Sit
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipiscing elit sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-16">
            <TimelineItem year="2009" title="Lorem Ipsum" icon={<Calendar className="w-5 h-5 text-orange-600" />} />
            <TimelineItem year="2015" title="Dolor Sit" icon={<TrendingUp className="w-5 h-5 text-orange-600" />} />
            <TimelineItem year="2020" title="Amet Consectetur" icon={<Award className="w-5 h-5 text-orange-600" />} />
            <TimelineItem year="2024" title="Adipiscing Elit" icon={<CheckCircle className="w-5 h-5 text-orange-600" />} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;