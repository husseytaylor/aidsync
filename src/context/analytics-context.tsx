
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

// Defines the shape of the analytics data object
interface AnalyticsData {
  voice_analytics: {
    summary: {
      total_calls: number;
      average_duration_seconds: number;
      total_duration_seconds: number;
      total_cost: number;
      average_cost: number;
    };
    recent_calls: {
      id?: string;
      started_at: string;
      duration: number;
      transcript: string;
      status: string;
      from_number: string;
      price?: number;
    }[];
  };
  chat_analytics: {
    summary: {
      total_sessions: number;
      average_duration_seconds: number;
      average_message_count: number;
    };
    recent_sessions: {
      id?: string;
      started_at: string;
      duration: number;
      dialogue: { sender: string; text: string }[];
    }[];
  };
  voiceChartData: { date: string; calls: number }[];
  chatChartData: { date: string; sessions: number }[];
}

// Defines the shape of the context value
interface AnalyticsContextType {
  analytics: AnalyticsData | null;
  isLoading: boolean;
  fetchAnalytics: () => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

// Provider component that wraps parts of the app that need access to analytics data
export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch analytics data from the API
  const fetchAnalytics = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/analytics', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics in context:", error);
      setAnalytics(null); // Reset on error to allow retry
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const value = { analytics, isLoading, fetchAnalytics };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Custom hook to use the AnalyticsContext
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
