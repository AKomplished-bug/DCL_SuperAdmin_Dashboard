import React from 'react';
import { Phone, Clock, AlertTriangle, Users, Ambulance, Activity, Headphones } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import CallVolumeChart from '../components/dashboard/CallVolumeChart';
import CallPriorityChart from '../components/dashboard/CallPriorityChart';
import { mockDashboardStats, weeklyCallVolumeData, priorityDistributionData } from '../data/mockData';

const Dashboard: React.FC = () => {
  // Format time in minutes and seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-secondary-400">Last updated:</span>
          <span className="text-secondary-200">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          title="Active Calls"
          value={mockDashboardStats.activeCalls}
          icon={<Phone size={24} className="text-primary-400" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Waiting Calls"
          value={mockDashboardStats.waitingCalls}
          icon={<Clock size={24} className="text-warning" />}
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Critical Emergencies"
          value={mockDashboardStats.callsByPriority.critical}
          icon={<AlertTriangle size={24} className="text-danger" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Operators Online"
          value={`${mockDashboardStats.operatorPerformance.online}/${
            mockDashboardStats.operatorPerformance.online + 
            mockDashboardStats.operatorPerformance.available
          }`}
          icon={<Users size={24} className="text-info" />}
        />
      </div>

      {/* Second Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          title="Avg. Wait Time"
          value={formatTime(mockDashboardStats.averageWaitTime)}
          icon={<Clock size={24} className="text-secondary-400" />}
        />
        <StatCard
          title="Avg. Call Duration"
          value={formatTime(mockDashboardStats.averageCallDuration)}
          icon={<Activity size={24} className="text-secondary-400" />}
        />
        <StatCard
          title="Resources Dispatched"
          value="24"
          icon={<Ambulance size={24} className="text-success" />}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Completed Calls"
          value={mockDashboardStats.completedCalls}
          icon={<Phone size={24} className="text-success" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CallVolumeChart data={weeklyCallVolumeData} />
        </div>
        <div>
          <CallPriorityChart data={priorityDistributionData} />
        </div>
      </div>

      {/* Active Calls Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Active Emergency Calls</h2>
          <button className="btn btn-outline text-sm py-1">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-secondary-400 text-sm">
                <th className="pb-3 font-medium">Caller</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Priority</th>
                <th className="pb-3 font-medium">Duration</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-800">
              <tr className="text-secondary-200">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center">
                      <span className="text-primary-400 text-xs font-medium">AN</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Arjun Nair</p>
                      <p className="text-xs text-secondary-400">+91 9876543210</p>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <p className="text-sm">Ernakulam</p>
                </td>
                <td className="py-3">
                  <span className="badge badge-danger">Medical</span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-danger"></span>
                    <span className="text-sm">Critical</span>
                  </div>
                </td>
                <td className="py-3">
                  <p className="text-sm">3m 12s</p>
                </td>
                <td className="py-3">
                  <span className="badge badge-info">Active</span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded bg-secondary-800 hover:bg-secondary-700 transition-colors">
                      <Headphones size={16} className="text-secondary-400" />
                    </button>
                    <button className="p-1.5 rounded bg-secondary-800 hover:bg-secondary-700 transition-colors">
                      <Ambulance size={16} className="text-secondary-400" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="text-secondary-200">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center">
                      <span className="text-primary-400 text-xs font-medium">PM</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Priya Menon</p>
                      <p className="text-xs text-secondary-400">+91 9876543211</p>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <p className="text-sm">Thiruvananthapuram</p>
                </td>
                <td className="py-3">
                  <span className="badge badge-danger">Fire</span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-warning"></span>
                    <span className="text-sm">High</span>
                  </div>
                </td>
                <td className="py-3">
                  <p className="text-sm">5m 24s</p>
                </td>
                <td className="py-3">
                  <span className="badge badge-info">Active</span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded bg-secondary-800 hover:bg-secondary-700 transition-colors">
                      <Headphones size={16} className="text-secondary-400" />
                    </button>
                    <button className="p-1.5 rounded bg-secondary-800 hover:bg-secondary-700 transition-colors">
                      <Ambulance size={16} className="text-secondary-400" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;