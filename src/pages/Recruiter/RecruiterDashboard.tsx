export const RecruiterDashboard = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển</h1>
                <p className="text-gray-500">Chào mừng bạn trở lại! Đây là tổng quan của bạn.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Việc làm đang hoạt động</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="text-primary text-xl">📋</span>
                        </div>
                    </div>
                    <p className="text-sm text-primary mt-3">+2 trong tuần này</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Tổng số ứng viên</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">248</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="text-primary text-xl">👥</span>
                        </div>
                    </div>
                    <p className="text-sm text-primary mt-3">+24 trong tuần này</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Chờ xem xét</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">18</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-orange-600 text-xl">⏳</span>
                        </div>
                    </div>
                    <p className="text-sm text-orange-600 mt-3">5 khẩn cấp</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {[
                            { action: "Ứng tuyển mới", job: "UI UX Designer", time: "2 phút trước" },
                            { action: "Đã lên lịch phỏng vấn", job: "Senior Developer", time: "1 giờ trước" },
                            { action: "Đã đăng việc làm", job: "Frontend Engineer", time: "3 giờ trước" },
                        ].map((activity, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="text-primary">📌</span>
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
