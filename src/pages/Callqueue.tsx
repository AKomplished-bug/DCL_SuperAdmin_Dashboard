import React, { useState, useRef } from "react";
import {
  PhoneCall,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader,
  AlertTriangle,
  Search,
  PhoneForwarded,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { mockCalls } from "../data/mockData";
import { Call } from "../types";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// RotatingCube Component: Rotates continuously and its color reflects transfer/resolution status.
const RotatingCube: React.FC<{ color: string }> = ({ color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Callqueue: React.FC = () => {
  const [expandedCall, setExpandedCall] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [callTransferStatus, setCallTransferStatus] = useState<{
    [callId: string]: { transferring: boolean; department?: string };
  }>({});
  const [callResolutionStatus, setCallResolutionStatus] = useState<{
    [callId: string]: "resolved" | "unresolved" | null;
  }>({});

  // Filter waiting calls from mock data
  const waitingCalls = mockCalls.filter((call: Call) => call.status === "waiting");

  // Filter waiting calls based on caller name or phone number
  const filteredCalls = waitingCalls.filter(
    (call: Call) =>
      call.callerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.phoneNumber.includes(searchQuery)
  );

  const toggleCallDetails = (callId: string) => {
    setExpandedCall(expandedCall === callId ? null : callId);
  };

  // Utility: Format duration (in ms) to mm:ss format
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate waiting duration from call start time
  const getWaitingDuration = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    return formatDuration(now.getTime() - start.getTime());
  };

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

  // Handle call transfer simulation (replace with your actual AI transfer logic)
  const handleTransferCall = (callId: string, department: string) => {
    setCallTransferStatus((prev) => ({
      ...prev,
      [callId]: { transferring: true, department },
    }));

    // Simulate transfer delay
    setTimeout(() => {
      setCallTransferStatus((prev) => ({
        ...prev,
        [callId]: { transferring: false, department },
      }));
      // Simulate call resolution
      setCallResolutionStatus((prev) => ({
        ...prev,
        [callId]: Math.random() > 0.5 ? "resolved" : "unresolved",
      }));
    }, 2000);
  };

  // Determine cube color based on transfer/resolution status
  const getCubeColor = (call: Call) => {
    const transferInfo = callTransferStatus[call.id];
    const resolution = callResolutionStatus[call.id];
    if (transferInfo?.transferring) return "#f39c12"; // Orange when transferring
    if (resolution === "resolved") return "#2ecc71"; // Green when resolved
    if (resolution === "unresolved") return "#e74c3c"; // Red when unresolved
    return "#3498db"; // Default blue
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Call Queue</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search queue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary-800 text-white rounded pl-10 pr-4 py-2 text-sm border border-secondary-700 focus:outline-none focus:border-primary-400"
            />
            <Search
              size={16}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 text-secondary-400"
            />
          </div>
          <div className="flex items-center gap-1">
            <Loader size={16} className="animate-spin text-secondary-400" />
            <p className="text-secondary-200 text-sm">{filteredCalls.length} waiting</p>
          </div>
        </div>
      </div>

      {/* Call List */}
      {filteredCalls.length === 0 ? (
        <div className="text-center py-6 text-secondary-400">
          <AlertTriangle size={32} className="mx-auto mb-2" />
          <p>No calls in the queue.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCalls.map((call: Call) => (
            <div
              key={call.id}
              className="bg-secondary-850 rounded-lg border border-secondary-800 overflow-hidden"
            >
              <div
                className="p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer"
                onClick={() => toggleCallDetails(call.id)}
              >
                <div className="flex items-center gap-3">
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
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-secondary-400" />
                    <p className="text-sm text-secondary-200">{getWaitingDuration(call.startTime)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {expandedCall === call.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {expandedCall === call.id && (
                <div className="px-4 pb-4 border-t border-secondary-800 pt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Existing call details */}
                    <div>
                      <p className="text-secondary-400">Start Time:</p>
                      <p className="text-secondary-200">{new Date(call.startTime).toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <p className="text-secondary-400">Waiting Duration:</p>
                      <p className="text-secondary-200">{getWaitingDuration(call.startTime)}</p>
                    </div>
                    <div>
                      <p className="text-secondary-400">Priority:</p>
                      <p className="text-secondary-200 capitalize">
                        <span className={`w-2 h-2 rounded-full inline-block mr-1 ${getPriorityColor(call.priority)}`}></span>
                        {call.priority}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-400">Language:</p>
                      <p className="text-secondary-200 capitalize">{call.language}</p>
                    </div>
                    <div>
                      <p className="text-secondary-400">District:</p>
                      <p className="text-secondary-200">{call.location.district}</p>
                    </div>
                    <div>
                      <p className="text-secondary-400">Transcript:</p>
                      <p className="text-secondary-200 truncate">{call.transcript}</p>
                    </div>
                    {/* 3D Transfer & Resolution Status */}
                    <div>
                      <p className="text-secondary-400">Resolution Status:</p>
                      <p className="text-secondary-200 capitalize">
                        {callResolutionStatus[call.id] === "resolved" ? (
                          <CheckCircle size={16} className="text-green-500 inline-block mr-1" />
                        ) : callResolutionStatus[call.id] === "unresolved" ? (
                          <XCircle size={16} className="text-red-500 inline-block mr-1" />
                        ) : (
                          "Pending"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 space-x-2">
                    {callTransferStatus[call.id]?.transferring ? (
                      <p className="text-sm text-secondary-400">
                        Transferring to {callTransferStatus[call.id]?.department}...
                      </p>
                    ) : (
                      <>
                        <button
                          className="btn btn-primary text-xs"
                          onClick={() => handleTransferCall(call.id, "fire")}
                        >
                          <PhoneForwarded size={16} className="mr-1" />
                          Fire
                        </button>
                        <button
                          className="btn btn-primary text-xs"
                          onClick={() => handleTransferCall(call.id, "police")}
                        >
                          <PhoneForwarded size={16} className="mr-1" />
                          Police
                        </button>
                        <button
                          className="btn btn-primary text-xs"
                          onClick={() => handleTransferCall(call.id, "medical")}
                        >
                          <PhoneForwarded size={16} className="mr-1" />
                          Medical
                        </button>
                      </>
                    )}
                  </div>
                  {/* 3D Visualization Section */}
                  <div style={{ width: "100%", height: "200px", marginTop: "1rem" }}>
                    <Canvas>
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} />
                      <RotatingCube color={getCubeColor(call)} />
                    </Canvas>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Callqueue;
