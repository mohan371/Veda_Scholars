"use client";

import { useState, useEffect, useCallback } from "react";
import { gql } from "@apollo/client";
import { client } from "../../../lib/apollo-client";
import { useRouter } from "next/navigation";

// 1. Define the GraphQL query to get our stats
const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalUsers
      totalUniversities
      totalJobs
      totalApplications
    }
  }
`;

// 2. Define the structure for our stats
interface DashboardStats {
  totalUsers: number;
  totalUniversities: number;
  totalJobs: number;
  totalApplications: number;
}
// This interface wraps the stats
interface DashboardStatsData {
  dashboardStats: DashboardStats;
}

export default function Dashboard() {
  const router = useRouter();
  // 3. Use state to hold the live data, loading, and error
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 4. Fetch data from the API
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await client.query<DashboardStatsData>({
        query: GET_DASHBOARD_STATS,
        fetchPolicy: "network-only", // Always get fresh data
      });
      if (data && data.dashboardStats) {
        setStats(data.dashboardStats);
      }
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch dashboard stats:", err);
      if (err.message.includes("Authentication required")) {
        router.push("/admin"); // Redirect to login if session expires
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // 5. Create the array of stat cards using the live data
  // We use optional chaining (stats?.totalUsers) in case stats is null
  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers.toString() || "0",
      // --- ADD DUMMY PERCENTAGE ---
      change: "+12.5%",
      changeType: "positive",
      // --- END ADD ---
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Universities",
      value: stats?.totalUniversities.toString() || "0",
      // --- ADD DUMMY PERCENTAGE ---
      change: "+3.2%",
      changeType: "positive",
      // --- END ADD ---
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Applications",
      value: stats?.totalApplications.toString() || "0",
      // --- ADD DUMMY PERCENTAGE ---
      change: "+8.1%",
      changeType: "positive",
      // --- END ADD ---
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Total Jobs", // Renamed from "Active Jobs"
      value: stats?.totalJobs.toString() || "0",
      // --- ADD DUMMY PERCENTAGE ---
      change: "-2.3%",
      changeType: "negative",
      // --- END ADD ---
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  // Mock data for Recent Activity (can be made dynamic later)
  const recentActivities = [
    {
      type: "user",
      title: "New user registered",
      description: "John Doe joined the platform",
      time: "2 minutes ago",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bgColor: "bg-[var(--gold)]/10",
      iconColor: "text-[var(--gold)]",
    },
    {
      type: "application",
      title: "New application submitted",
      description: "Application for Computer Science at MIT",
      time: "15 minutes ago",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      type: "university",
      title: "University added",
      description: "Harvard University added to the platform",
      time: "1 hour ago",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        </svg>
      ),
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      type: "job",
      title: "New job posted",
      description: "Software Engineer position at Google",
      time: "2 hours ago",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  // 6. Handle loading and error states
  if (loading) return <div className="p-6 text-center text-gray-500">Loading dashboard data...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}. Please log out and log in again.</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center ${stat.iconColor}`}>
                {stat.icon}
              </div>
              {/* --- RE-ADD THIS BLOCK --- */}
              <span
                className={`text-sm font-medium ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
              >
                {stat.change}
              </span>
              {/* --- END RE-ADD --- */}
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-[var(--gold)] hover:text-[var(--gold-hover)] cursor-pointer font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg ${activity.bgColor} flex items-center justify-center flex-shrink-0 ${activity.iconColor}`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button onClick={() => router.push('/admin/users')} className="w-full px-4 py-3 bg-[var(--gold)] text-gray-900 rounded-lg font-semibold hover:bg-[var(--gold-hover)] transition-colors cursor-pointer text-left flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Add New User
            </button>
            <button onClick={() => router.push('/admin/universities')} className="w-full px-4 py-3 bg-white border-2 border-[var(--gold)] text-[var(--gold)] rounded-lg font-semibold hover:bg-[var(--gold)]/10 transition-colors cursor-pointer text-left flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Add University
            </button>
            <button onClick={() => router.push('/admin/jobs')} className="w-full px-4 py-3 bg-white border-2 border-[var(--gold)] text-[var(--gold)] rounded-lg font-semibold hover:bg-[var(--gold)]/10 transition-colors cursor-pointer text-left flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Post New Job
            </button>
            <button onClick={() => router.push('/admin/applications')} className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer text-left flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Applications
            </button>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Applications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Applications</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-[var(--gold)]">A{i}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Application #{1000 + i}</p>
                    <p className="text-xs text-gray-500">Computer Science - MIT</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-xs font-medium bg-[var(--gold)] text-gray-900 rounded hover:bg-[var(--gold-hover)] transition-colors cursor-pointer">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Server Status</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-gray-900">Operational</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-gray-900">Connected</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-gray-900">Active</span>
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Storage Usage</span>
                <span className="text-sm font-medium text-gray-900">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[var(--gold)] h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}