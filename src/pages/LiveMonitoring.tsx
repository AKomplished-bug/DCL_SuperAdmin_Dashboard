import React, { useState } from "react";
import {
  MapPin,
  Headphones,
  HelpCircle,
  PhoneCall,
  Clock,
  ChevronDown,
  ChevronUp,
  Languages,
  Activity,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { mockCalls } from "../data/mockData";
import { Call } from "../types";

// Example custom marker icons for active vs. waiting
const activeIcon = L.icon({
  iconUrl: "/markers/marker-icon-active.png", // Replace with your icon path
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const waitingIcon = L.icon({
  iconUrl: "/markers/marker-icon-waiting.png", // Replace with your icon path
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LiveMonitoring: React.FC = () => {
  const [expandedCall, setExpandedCall] = useState<string | null>(null);
  const [takeoverModalOpen, setTakeoverModalOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [showAllCalls, setShowAllCalls] = useState(false);

  // Filter active vs. waiting calls
  const activeCalls = mockCalls.filter((call) => call.status === "active");
  const waitingCalls = mockCalls.filter((call) => call.status === "waiting");

  // Conditionally display calls
  const displayCalls = showAllCalls ? [...activeCalls, ...waitingCalls] : activeCalls;

  // Toggle expanded call details
  const toggleCallDetails = (callId: string) => {
    setExpandedCall(expandedCall === callId ? null : callId);
  };

  // Modal logic
  const handleTakeover = (call: Call) => {
    setSelectedCall(call);
    setTakeoverModalOpen(true);
  };

  const confirmTakeover = () => {
    console.log("Taking over call:", selectedCall?.id);
    setTakeoverModalOpen(false);
    // You would typically update the state or make an API call here
  };

  // Helpers
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-danger";
      case "high":
        return "bg-warning";
      case "medium":
        return "bg-info";
      default:
        return "bg-success";
    }
  };

  const getEmergencyTypeBadge = (type: string) => {
    switch (type) {
      case "medical":
        return "badge-danger";
      case "fire":
        return "badge-warning";
      case "police":
        return "badge-primary";
      case "natural_disaster":
        return "badge-critical";
      default:
        return "badge-secondary";
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderEmotionData = (emotionData: any) => {
    if (!emotionData) return null;

    const emotions = [
      { name: "Distress", value: emotionData.distress || 0, color: "bg-danger" },
      { name: "Panic", value: emotionData.panic || 0, color: "bg-critical" },
      { name: "Fear", value: emotionData.fear || 0, color: "bg-warning" },
      { name: "Anger", value: emotionData.anger || 0, color: "bg-error" },
      { name: "Sadness", value: emotionData.sadness || 0, color: "bg-info" },
    ];

    return (
      <div className="grid grid-cols-2 gap-2 mt-2">
        {emotions.map((emotion) => (
          <div key={emotion.name} className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-secondary-400">{emotion.name}</span>
              <span className="text-xs font-bold text-secondary-200">{emotion.value}%</span>
            </div>
            <div className="h-1.5 bg-secondary-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${emotion.color}`}
                style={{ width: `${emotion.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Live Monitoring</h1>
        <div className="flex items-center gap-4">
          {/* Priority stats */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-danger mr-1"></div>
              <span className="text-secondary-200 text-sm">
                Critical: {activeCalls.filter((c) => c.priority === "critical").length}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-warning mr-1"></div>
              <span className="text-secondary-200 text-sm">
                High: {activeCalls.filter((c) => c.priority === "high").length}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-info mr-1"></div>
              <span className="text-secondary-200 text-sm">
                Medium: {activeCalls.filter((c) => c.priority === "medium").length}
              </span>
            </div>
          </div>
          {/* Last Updated */}
          <div className="h-4 w-px bg-secondary-700"></div>
          <div className="flex items-center gap-2">
            <span className="text-secondary-400">Last updated:</span>
            <span className="text-secondary-200">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Calls Section */}
        <div className="lg:col-span-3">
          <div className="card p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">
                {showAllCalls ? "All Calls" : "Active Calls"} ({displayCalls.length})
              </h2>
              <div className="flex items-center gap-2">
                <button
                  className="text-sm text-secondary-400 hover:text-secondary-200 transition-colors flex items-center gap-1"
                  onClick={() => setShowAllCalls(!showAllCalls)}
                >
                  {showAllCalls ? "Show Active Only" : "Show All Calls"}
                </button>
                <select className="bg-secondary-800 text-secondary-200 rounded p-1 text-sm border border-secondary-700">
                  <option>Sort by Priority</option>
                  <option>Sort by Time</option>
                  <option>Sort by District</option>
                </select>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-260px)]">
              {displayCalls.length === 0 ? (
                <div className="text-center py-6 text-secondary-400">
                  <HelpCircle size={32} className="mx-auto mb-2" />
                  <p>No active calls at the moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayCalls.map((call) => (
                    <div
                      key={call.id}
                      className="bg-secondary-850 rounded-lg border border-secondary-800 overflow-hidden"
                    >
                      <div
                        className="p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer"
                        onClick={() => toggleCallDetails(call.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <PhoneCall
                              size={20}
                              className={`${
                                call.priority === "critical"
                                  ? "text-danger"
                                  : call.priority === "high"
                                  ? "text-warning"
                                  : "text-info"
                              }`}
                            />
                            {call.status === "active" && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-white text-sm font-medium">{call.callerName}</p>
                              <span className={`badge ${getEmergencyTypeBadge(call.emergencyType)}`}>
                                {call.emergencyType.replace("_", " ")}
                              </span>
                            </div>
                            <p className="text-xs text-secondary-400">{call.phoneNumber}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 mt-2 md:mt-0">
                          <div className="hidden md:flex items-center gap-2">
                            <MapPin size={16} className="text-secondary-400" />
                            <p className="text-sm text-secondary-200">{call.location.district}</p>
                          </div>

                          <div className="hidden md:flex items-center gap-2">
                            <Clock size={16} className="text-secondary-400" />
                            <p className="text-sm text-secondary-200">{formatDuration(call.duration)}</p>
                          </div>

                          <div className="hidden md:flex items-center gap-2">
                            <Languages size={16} className="text-secondary-400" />
                            <p className="text-sm text-secondary-200 capitalize">{call.language}</p>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${getPriorityColor(call.priority)}`}></span>
                            <span className="text-sm text-secondary-200 capitalize mr-2">
                              {call.priority}
                            </span>
                            {expandedCall === call.id ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </div>
                        </div>
                      </div>

                      {expandedCall === call.id && (
                        <div className="px-4 pb-4 border-t border-secondary-800 pt-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-secondary-400 text-xs uppercase font-medium mb-2">
                                  Call Details
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-xs text-secondary-400 mb-1">Start Time</p>
                                    <p className="text-sm text-secondary-200">
                                      {new Date(call.startTime).toLocaleTimeString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-secondary-400 mb-1">Duration</p>
                                    <p className="text-sm text-secondary-200">
                                      {formatDuration(call.duration)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-secondary-400 mb-1">Status</p>
                                    <p className="text-sm text-secondary-200 capitalize">
                                      {call.status === "active" ? (
                                        <span className="flex items-center gap-1">
                                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                          Active
                                        </span>
                                      ) : (
                                        call.status
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-secondary-400 mb-1">Language</p>
                                    <p className="text-sm text-secondary-200 capitalize">
                                      {call.language}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-secondary-400 mb-1">Location</p>
                                    <p className="text-sm text-secondary-200">
                                      {call.location.district}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-secondary-400 mb-1">
                                      Emergency Type
                                    </p>
                                    <p className="text-sm text-secondary-200 capitalize">
                                      {call.emergencyType.replace("_", " ")}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-secondary-400 text-xs uppercase font-medium mb-2">
                                  Emotion Analysis
                                </h4>
                                {renderEmotionData(call.emotionData)}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-secondary-400 text-xs uppercase font-medium mb-2">
                                Call Transcript
                              </h4>
                              <div className="bg-secondary-900 p-3 rounded-lg text-sm text-secondary-200 max-h-36 overflow-y-auto">
                                {call.transcript}
                              </div>

                              <div className="grid grid-cols-2 gap-2 mt-4">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleTakeover(call)}
                                >
                                  <Headphones size={16} className="mr-1" />
                                  Take Over Call
                                </button>
                                <button className="btn btn-secondary">
                                  <Activity size={16} className="mr-1" />
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right-Side Panels: Priority & Language Distribution */}
        <div className="lg:col-span-2 space-y-6">
          {/* Call Priority Distribution */}
          <div className="card p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Call Priority Distribution</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-400">Critical</span>
                <span className="text-sm text-secondary-200">
                  {displayCalls.filter((c) => c.priority === "critical").length}
                </span>
              </div>
              <div className="h-2 bg-secondary-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-danger"
                  style={{
                    width: `${
                      (displayCalls.filter((c) => c.priority === "critical").length /
                        displayCalls.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-400">High</span>
                <span className="text-sm text-secondary-200">
                  {displayCalls.filter((c) => c.priority === "high").length}
                </span>
              </div>
              <div className="h-2 bg-secondary-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning"
                  style={{
                    width: `${
                      (displayCalls.filter((c) => c.priority === "high").length /
                        displayCalls.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-400">Medium</span>
                <span className="text-sm text-secondary-200">
                  {displayCalls.filter((c) => c.priority === "medium").length}
                </span>
              </div>
              <div className="h-2 bg-secondary-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-info"
                  style={{
                    width: `${
                      (displayCalls.filter((c) => c.priority === "medium").length /
                        displayCalls.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-400">Low</span>
                <span className="text-sm text-secondary-200">
                  {displayCalls.filter((c) => c.priority === "low").length}
                </span>
              </div>
              <div className="h-2 bg-secondary-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-success"
                  style={{
                    width: `${
                      (displayCalls.filter((c) => c.priority === "low").length /
                        displayCalls.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Language Distribution */}
          <div className="card p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Language Distribution</h2>
            <div className="space-y-3">
              {["malayalam", "english", "hindi"].map((language) => {
                const count = displayCalls.filter((c) => c.language === language).length;
                const percentage = (count / displayCalls.length) * 100;
                return (
                  <div key={language} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-400 capitalize">{language}</span>
                      <span className="text-sm text-secondary-200">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-secondary-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          language === "malayalam"
                            ? "bg-primary-400"
                            : language === "english"
                            ? "bg-info"
                            : "bg-warning"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Take Over Call Modal */}
      {takeoverModalOpen && selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-secondary-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Take Over Call</h3>
            <p className="text-secondary-200 mb-4">
              You are about to take over the call from{" "}
              <span className="text-white font-medium">{selectedCall.callerName}</span>.
              This will redirect the caller to your operator station.
            </p>

            <div className="bg-secondary-800 p-3 rounded-lg mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedCall.priority)}`}></div>
                <span className="text-secondary-200 capitalize">{selectedCall.priority} Priority</span>
                <span className="badge ml-auto">
                  {selectedCall.emergencyType.replace("_", " ")}
                </span>
              </div>
              <div className="text-sm text-secondary-400 mb-1">Call Transcript:</div>
              <div className="text-secondary-200 text-sm">
                {selectedCall.transcript
                  ? selectedCall.transcript.substring(0, 100)
                  : ""}
                ...
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
              <button className="btn btn-secondary" onClick={() => setTakeoverModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmTakeover}>
                Confirm Take Over
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMonitoring;
