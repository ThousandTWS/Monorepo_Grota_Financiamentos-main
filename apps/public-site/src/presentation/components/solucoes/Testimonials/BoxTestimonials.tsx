import React from 'react'
import { User, Star } from "lucide-react";

function BoxTestimonials() {
    return (
        <div className="mt-16 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">
                Lorem Ipsum Testimonials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                            <User size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">João Silva</h4>
                            <p className="text-sm text-gray-600">Cliente Satisfeito</p>
                        </div>
                    </div>
                    <p className="text-gray-700 italic">
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    </p>
                    <div className="flex mt-4">
                        {Array.from({ length: 5 }, (_, i) => (
                            <Star
                                key={`testimonial-joao-silva-star-${i}`}
                                size={16}
                                className="text-yellow-400 fill-current"
                            />
                        ))}
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                            <User size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Maria Santos</h4>
                            <p className="text-sm text-gray-600">Cliente Satisfeito</p>
                        </div>
                    </div>
                    <p className="text-gray-700 italic">
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                        enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris."
                    </p>
                    <div className="flex mt-4">
                        {Array.from({ length: 5 }, (_, i) => (
                            <Star
                                key={`testimonial-maria-santos-star-${i}`}
                                size={16}
                                className="text-yellow-400 fill-current"
                            />
                        ))}
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                            <User size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">
                                Carlos Oliveira
                            </h4>
                            <p className="text-sm text-gray-600">Cliente Satisfeito</p>
                        </div>
                    </div>
                    <p className="text-gray-700 italic">
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                        aute irure dolor in reprehenderit in voluptate velit esse cillum
                        dolore."
                    </p>
                    <div className="flex mt-4">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={`testimonial-carlos-oliveira-star-${'carlos-oliveira'}-${i + 1}`}
                                size={16}
                                className="text-yellow-400 fill-current"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BoxTestimonials