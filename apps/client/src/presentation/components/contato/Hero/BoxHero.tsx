import Image from 'next/image'
import React from 'react'


function BoxHero() {
    return (
        <section className="relative pt-32 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden -mt-24 h-[40rem]">
            <div className="absolute inset-0">
                <Image
                    src="https://placehold.net/800x600.png"
                    alt="Slide Image"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90" />
            </div>
            <div className="relative max-w-4xl mx-auto text-center mt-5">
                <h1 className="text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                    Lorem Ipsum{' '}
                    <span className="text-orange-500 block">Dolor Sit Amet</span>
                </h1>
                <p className="text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                        Lorem Ipsum
                    </button>
                    <button className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-sm">
                        Dolor Sit Amet
                    </button>
                </div>
            </div>
        </section>
    )
}

export default BoxHero