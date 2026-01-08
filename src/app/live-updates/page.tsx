"use client";

import { useState, useEffect } from "react";
import { GoogleAdSense } from "@/components/public/google-adsense"; // ✅ Fixed import name
import { mockData } from "@/lib/mock-data";

interface LiveUpdate {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  priority: "breaking" | "urgent" | "normal";
  category: string;
  location?: string;
  author: string;
  tags: string[];
}

export default function LiveUpdatesPage() {
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Generate mock live updates
  const generateMockUpdates = (): LiveUpdate[] => {
    const mockUpdates: LiveUpdate[] = [
      {
        id: "1",
        title: "Breaking: Parliament Session Extended for Budget Discussion",
        content:
          "The Lok Sabha session has been extended by two hours to accommodate the ongoing budget discussion. Finance Minister is expected to address key economic reforms.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        priority: "breaking",
        category: "Politics",
        location: "New Delhi",
        author: "Political Correspondent",
        tags: ["parliament", "budget", "politics"],
      },
      {
        id: "2",
        title: "Stock Market Update: Sensex Crosses 75,000 Mark",
        content:
          "BSE Sensex has crossed the historic 75,000 mark amid positive investor sentiment. Banking and IT stocks are leading the rally.",
        timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
        priority: "urgent",
        category: "Economy",
        location: "Mumbai",
        author: "Market Reporter",
        tags: ["sensex", "stock-market", "economy"],
      },
      {
        id: "3",
        title: "Weather Alert: Heavy Rainfall Expected in Northern States",
        content:
          "IMD has issued a red alert for heavy to very heavy rainfall in Punjab, Haryana, and parts of Uttar Pradesh over the next 48 hours.",
        timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
        priority: "urgent",
        category: "Weather",
        location: "National",
        author: "Weather Desk",
        tags: ["weather", "rainfall", "alert"],
      },
      {
        id: "4",
        title: "Technology: India Launches New Satellite Mission",
        content:
          "ISRO successfully launched the communication satellite GSAT-24 from Sriharikota. The satellite will enhance broadband connectivity across rural areas.",
        timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
        priority: "normal",
        category: "Technology",
        location: "Sriharikota",
        author: "Science Reporter",
        tags: ["isro", "satellite", "technology"],
      },
      {
        id: "5",
        title: "Sports: India Wins Cricket Series Against Australia",
        content:
          "Team India clinched the ODI series 3-2 against Australia with a thrilling 6-wicket victory in the final match at Melbourne.",
        timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
        priority: "normal",
        category: "Sports",
        location: "Melbourne",
        author: "Sports Correspondent",
        tags: ["cricket", "india", "australia"],
      },
    ];
    return mockUpdates.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  };

  useEffect(() => {
    // Initialize with mock updates
    setUpdates(generateMockUpdates());

    // Simulate live updates every 30 seconds
    const interval = setInterval(() => {
      if (isLive) {
        // Add a new mock update occasionally
        if (Math.random() > 0.7) {
          const newUpdate: LiveUpdate = {
            id: Date.now().toString(),
            title: `Live Update: ${
              ["Market", "Political", "Weather", "Sports"][
                Math.floor(Math.random() * 4)
              ]
            } Development`,
            content:
              "This is a simulated live update to demonstrate real-time functionality. In a real application, this would come from a live news feed.",
            timestamp: new Date(),
            priority: ["breaking", "urgent", "normal"][
              Math.floor(Math.random() * 3)
            ] as "breaking" | "urgent" | "normal",
            category: ["Politics", "Economy", "Sports", "Technology"][
              Math.floor(Math.random() * 4)
            ],
            author: "Live Desk",
            tags: ["live", "update"],
          };
          setUpdates((prev) => [newUpdate, ...prev].slice(0, 20)); // Keep only latest 20 updates
        }
        setLastUpdate(new Date());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "breaking":
        return "bg-red-600 text-white";
      case "urgent":
        return "bg-orange-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "breaking":
        return "🚨";
      case "urgent":
        return "⚡";
      default:
        return "📰";
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    isLive ? "bg-green-400 animate-pulse" : "bg-gray-400"
                  }`}
                ></span>
                Live Updates
              </h1>
              <p className="text-xl text-red-100">
                Real-time news and breaking updates
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setIsLive(!isLive)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isLive
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  }`}
                >
                  {isLive ? "LIVE" : "PAUSED"}
                </button>
              </div>
              <p className="text-sm text-red-200">
                Last updated: {formatTimeAgo(lastUpdate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Breaking News Banner */}
            {updates.filter((update) => update.priority === "breaking").length >
              0 && (
              <div className="bg-red-600 text-white p-4 rounded-lg mb-8 animate-pulse">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🚨</span>
                  <span className="font-bold text-lg">BREAKING NEWS</span>
                </div>
                <h2 className="text-xl font-bold">
                  {
                    updates.find((update) => update.priority === "breaking")
                      ?.title
                  }
                </h2>
              </div>
            )}

            {/* Live Updates Feed */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Live Feed</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Auto-updating</span>
                </div>
              </div>

              {updates.map((update, index) => (
                <div
                  key={update.id}
                  className={`bg-white rounded-lg shadow-sm border-l-4 ${
                    update.priority === "breaking"
                      ? "border-red-500"
                      : update.priority === "urgent"
                      ? "border-orange-500"
                      : "border-blue-500"
                  } ${index === 0 ? "animate-fadeIn" : ""}`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(
                            update.priority
                          )}`}
                        >
                          {getPriorityIcon(update.priority)}{" "}
                          {update.priority.toUpperCase()}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                          {update.category}
                        </span>
                        {update.location && (
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            📍 {update.location}
                          </span>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>{formatTimeAgo(update.timestamp)}</div>
                        <div className="text-xs">
                          {update.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {update.title}
                    </h3>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {update.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          By {update.author}
                        </span>
                        {update.tags.length > 0 && (
                          <div className="flex gap-1">
                            {update.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-red-600 transition-colors">
                          ❤️
                        </button>
                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                          🔄
                        </button>
                        <button className="text-gray-400 hover:text-green-600 transition-colors">
                          📤
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
                Load Earlier Updates
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            {/* Ad Space */}
            <div className="mb-8">
              <GoogleAdSense
                adSlot="live-updates-sidebar-ad"
                adFormat="rectangle"
                className="w-full"
              />{" "}
              {/* ✅ Fixed component name */}
            </div>

            {/* Live Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                📊 Live Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Updates Today</span>
                  <span className="font-bold text-gray-900">
                    {updates.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Breaking News</span>
                  <span className="font-bold text-red-600">
                    {updates.filter((u) => u.priority === "breaking").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Urgent Updates</span>
                  <span className="font-bold text-orange-600">
                    {updates.filter((u) => u.priority === "urgent").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Readers</span>
                  <span className="font-bold text-green-600">2,847</span>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔥 Trending Now
              </h3>
              <div className="space-y-3">
                {[
                  "Parliament Session",
                  "Stock Market Rally",
                  "Weather Alert",
                  "Cricket Victory",
                  "ISRO Launch",
                ].map((topic, index) => (
                  <div
                    key={topic}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900">{topic}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {Math.floor(Math.random() * 50) + 10}k
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📂 Quick Access
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {mockData.categories.slice(0, 8).map((category) => (
                  <a
                    key={category._id}
                    href={`/category/${category.slug}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-white text-xs"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {category.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
