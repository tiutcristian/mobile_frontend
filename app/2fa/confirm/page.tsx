"use client";
export default function Confirm2FA() {
    function handleEnable2FA(): void {
        alert("2FA enabled clicked");
    }

    function handleCancel(): void {
        if (confirm("Are you sure you want to cancel?")) {
            window.location.href = "/";
        }
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <p className="mt-10 text-center text-xl font-bold tracking-tight text-gray-300">
                    Are you sure you want to enable Two-Factor Authentication (2FA)?
                </p>
            </div>
            <div className="display flex justify-center mt-6 space-x-4">
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                    onClick={handleEnable2FA}>
                        Enable 2FA
                </button>
                <button 
                    className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-600"
                    onClick={handleCancel}>
                        Cancel
                </button>
            </div>
        </div>
    );
}