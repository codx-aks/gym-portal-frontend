import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import Gym from "../assets/gym.jpg";
import { API_BASE_URL } from "../config";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";


type EndpointStat = {
  path: string;
  requests: number;
  avgLatency: number;
  success: number;
  error: number;
};

type HealthStats = {
  goroutines: number;
  memoryMB: number;
  inflight: number;
  totalRequests: number;
};

type TimePoint = {
  time: string;
  value: number;
};


function parsePrometheus(text: string) {
  const endpoints: Record<string, EndpointStat> = {};
  const latencySum: Record<string, number> = {};
  const latencyCount: Record<string, number> = {};

  const health: HealthStats = {
    goroutines: 0,
    memoryMB: 0,
    inflight: 0,
    totalRequests: 0,
  };

  const lines = text.split("\n");

  for (const line of lines) {
    if (line.startsWith("#") || !line.trim()) continue;

    if (line.startsWith("go_goroutines")) {
      health.goroutines = Number(line.split(" ").pop());
    }

    if (line.startsWith("process_resident_memory_bytes")) {
      health.memoryMB = Math.round(
        Number(line.split(" ").pop()) / 1024 / 1024
      );
    }

    if (line.startsWith("gymportal_http_requests_in_flight")) {
      health.inflight = Number(line.split(" ").pop());
    }

    if (line.startsWith("gymportal_http_requests_total")) {
      const m =
        /path="(.+?)".*status="(\d+)".*\s+(\d+)/.exec(line);
      if (!m) continue;

      const [, path, statusStr, countStr] = m;
      const status = Number(statusStr);
      const count = Number(countStr);

      health.totalRequests += count;

      if (!endpoints[path]) {
        endpoints[path] = {
          path,
          requests: 0,
          avgLatency: 0,
          success: 0,
          error: 0,
        };
      }

      endpoints[path].requests += count;

      if (status >= 200 && status < 300) {
        endpoints[path].success += count;
      } else {
        endpoints[path].error += count;
      }
    }

    if (
      line.startsWith(
        "gymportal_http_request_duration_seconds_sum"
      )
    ) {
      const m = /path="(.+?)".*\s+([\d.]+)/.exec(line);
      if (m) latencySum[m[1]] = Number(m[2]) * 1000;
    }

    if (
      line.startsWith(
        "gymportal_http_request_duration_seconds_count"
      )
    ) {
      const m = /path="(.+?)".*\s+(\d+)/.exec(line);
      if (m) latencyCount[m[1]] = Number(m[2]);
    }
  }

  Object.keys(latencySum).forEach((path) => {
    if (latencyCount[path] && endpoints[path]) {
      endpoints[path].avgLatency = Math.round(
        latencySum[path] / latencyCount[path]
      );
    }
  });

  return {
    health,
    endpoints: Object.values(endpoints),
  };
}


const Metrics: React.FC = () => {
  const [health, setHealth] = useState<HealthStats | null>(null);
  const [endpoints, setEndpoints] = useState<EndpointStat[]>([]);
  const [latencyTrend, setLatencyTrend] = useState<TimePoint[]>([]);
  const [requestTrend, setRequestTrend] = useState<TimePoint[]>([]);

  const lastTotalRequests = useRef<number>(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      const res = await fetch(`${API_BASE_URL}/metrics`, {
        credentials: "include",
      });
      const text = await res.text();
      const parsed = parsePrometheus(text);

      setHealth(parsed.health);
      setEndpoints(parsed.endpoints);

      const now = new Date().toLocaleTimeString();

      const avgLatency =
        parsed.endpoints.reduce(
          (a, b) => a + b.avgLatency,
          0
        ) / Math.max(parsed.endpoints.length, 1);

      setLatencyTrend((prev) =>
        [...prev, { time: now, value: Math.round(avgLatency) }].slice(-12)
      );

      const delta =
        parsed.health.totalRequests - lastTotalRequests.current;

      lastTotalRequests.current =
        parsed.health.totalRequests;

      setRequestTrend((prev) =>
        [...prev, { time: now, value: Math.max(delta, 0) }].slice(-12)
      );
    };

    fetchMetrics();
    const id = setInterval(fetchMetrics, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gray-900">
        <img
          src={Gym}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-br from-orange-600/80 to-red-900/80 mix-blend-multiply" />
      </div>

      <Header isLoggedIn variant="dark" />

      <div className="relative z-10 px-4 py-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-6">
          System Metrics
        </h1>

        {health && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Metric label="Goroutines" value={health.goroutines} />
            <Metric label="Memory (MB)" value={health.memoryMB} />
            <Metric label="In-flight" value={health.inflight} />
            <Metric
              label="Total Requests"
              value={health.totalRequests}
            />
          </div>
        )}

        <ChartCard title="Requests Over Time (15s window)">
          <LineChart data={requestTrend}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#facc15"
              strokeWidth={3}
            />
          </LineChart>
        </ChartCard>

        <ChartCard title="Endpoint Health">
          <BarChart data={endpoints}>
            <XAxis dataKey="path" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="success"
              stackId="a"
              fill="#4ade80"
              name="Success"
            />
            <Bar
              dataKey="error"
              stackId="a"
              fill="#f87171"
              name="Error"
            />
          </BarChart>
        </ChartCard>

        <ChartCard title="Average Latency (ms)">
          <BarChart data={endpoints}>
            <XAxis dataKey="path" hide />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="avgLatency"
              fill="#22d3ee"
            />
          </BarChart>
        </ChartCard>

        <ChartCard title="Latency Trend">
          <LineChart data={latencyTrend}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#34d399"
              strokeWidth={3}
            />
          </LineChart>
        </ChartCard>
      </div>
    </div>
  );
};


const Metric = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center shadow-xl">
    <div className="text-xs text-white/60 uppercase mb-1">
      {label}
    </div>
    <div className="text-3xl font-black text-white">
      {value}
    </div>
  </div>
);

const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl mb-6">
    <h2 className="text-lg font-bold text-white mb-3">
      {title}
    </h2>
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

export default Metrics;
