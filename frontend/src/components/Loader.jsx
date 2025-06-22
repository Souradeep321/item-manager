import React from 'react'

const Loader = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-emerald-500 mx-auto mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <p className="text-lg text-gray-300">Loading your experience...</p>
            </div>
        </div>
    )
}

export default Loader