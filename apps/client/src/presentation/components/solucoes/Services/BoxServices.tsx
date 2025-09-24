import React from 'react'
import { Car, CreditCard, Shield } from "lucide-react";

function BoxServices() {
    return (
        <div className='max-w-7xl mx-auto'>
            <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">
                Lorem Ipsum
            </h1>
            <p className="text-center text-gray-800">
                Lorem Ipsum comnun dollor sit amet, consectetur adipiscing elit. Sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="text-gray-800 flex flex-col gap-y-3 items-center text-center border-gray-300 border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 min-h-[200px]">
                    <Car size={48} className="text-orange-500" />
                    <h3 className="font-semibold text-lg">Lorem Ipsum Dolor</h3>
                    <p className="text-sm">
                        Lorem Ipsum comnun dollor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
                <div className="text-gray-800 flex flex-col gap-y-3 items-center text-center border-gray-300 border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 min-h-[200px]">
                    <CreditCard size={48} className="text-orange-500" />
                    <h3 className="font-semibold text-lg">Sit Amet Consectetur</h3>
                    <p className="text-sm">
                        Lorem Ipsum comnun dollor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
                <div className="text-gray-800 flex flex-col gap-y-3 items-center text-center border-gray-300 border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 min-h-[200px]">
                    <Shield size={48} className="text-orange-500" />
                    <h3 className="font-semibold text-lg">Adipiscing Elit Sed</h3>
                    <p className="text-sm">
                        Lorem Ipsum comnun dollor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default BoxServices