export const RecruiterDashboard = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back! Here's your overview.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active Jobs</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <span className="text-emerald-600 text-xl">📋</span>
                        </div>
                    </div>
                    <p className="text-sm text-emerald-600 mt-3">+2 this week</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Candidates</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">248</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 text-xl">👥</span>
                        </div>
                    </div>
                    <p className="text-sm text-blue-600 mt-3">+24 this week</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pending Reviews</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">18</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-orange-600 text-xl">⏳</span>
                        </div>
                    </div>
                    <p className="text-sm text-orange-600 mt-3">5 urgent</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {[
                            { action: "New application", job: "UI UX Designer", time: "2 minutes ago" },
                            { action: "Interview scheduled", job: "Senior Developer", time: "1 hour ago" },
                            { action: "Job posted", job: "Frontend Engineer", time: "3 hours ago" },
                        ].map((activity, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600">📌</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-sm text-gray-500">{activity.job}</p>
                                </div>
                                <span className="text-sm text-gray-400">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
