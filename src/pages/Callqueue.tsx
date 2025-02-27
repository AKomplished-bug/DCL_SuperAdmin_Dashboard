import React from "react";
import { MapPin, Headphones, AlertTriangle, PhoneCall } from "lucide-react";
import { mockCalls } from "../data/mockData";

const Callqueue: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Live Monitoring</h1>
        <div className="flex items-center gap-2">
          <span className="text-secondary-400">Last updated:</span>
          <span className="text-secondary-200">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Active Calls</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-secondary-400 text-sm">
                    <th className="pb-3 font-medium">Caller</th>
                    <th className="pb-3 font-medium">Location</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Priority</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-800">
                  {mockCalls.filter(call => call.status === "active").map(call => (
                    <tr key={call.id} className="text-secondary-200">
                      <td className="py-3 flex items-center gap-2">
                        <PhoneCall size={20} className="text-primary-400" />
                        <div>
                          <p className="text-white text-sm font-medium">{call.callerName}</p>
                          <p className="text-xs text-secondary-400">{call.phoneNumber}</p>
                        </div>
                      </td>
                      <td className="py-3 flex items-center gap-2">
                        <MapPin size={16} className="text-secondary-400" />
                        <p className="text-sm">{call.location.district}</p>
                      </td>
                      <td className="py-3">
                        <span className="badge badge-danger">{call.emergencyType}</span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${call.priority === "critical" ? "bg-danger" : call.priority === "high" ? "bg-warning" : "bg-info"}`}></span>
                          <span className="text-sm capitalize">{call.priority}</span>
                        </div>
                      </td>
                      <td className="py-3 flex gap-2">
                        <button className="p-1.5 rounded bg-secondary-800 hover:bg-secondary-700 transition-colors">
                          <Headphones size={16} className="text-secondary-400" />
                        </button>
                        <button className="p-1.5 rounded bg-secondary-800 hover:bg-secondary-700 transition-colors">
                          <AlertTriangle size={16} className="text-secondary-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <div className="card p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Call Locations</h2>
            <div className="h-64 bg-secondary-800 flex items-center justify-center">
              <span className="text-secondary-400">[Map Integration Here]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Callqueue;