import { Card } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const pageViewsData = [
  { date: "Jan 20", views: 1000 },
  { date: "Jan 21", views: 1200 },
  { date: "Jan 22", views: 900 },
  { date: "Jan 23", views: 1500 },
  { date: "Jan 24", views: 1300 },
  { date: "Jan 25", views: 1800 },
  { date: "Jan 26", views: 2000 },
];

const sourceData = [
  { source: "Job Board", value: 2800 },
  { source: "Website", value: 2200 },
  { source: "Social Media", value: 1800 },
  { source: "Careers Page", value: 1600 },
  { source: "Internal", value: 1000 },
  { source: "Referral", value: 800 },
];

export const DashboardCharts = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8">
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-base font-medium">Page Views</h3>
          <div className="text-2xl font-bold">10,934</div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pageViewsData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FEC6A1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FEC6A1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#FEC6A1"
                fillOpacity={1}
                fill="url(#colorViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-base font-medium">Source Distribution</h3>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sourceData}>
              <XAxis 
                dataKey="source" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#D3E4FD" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};