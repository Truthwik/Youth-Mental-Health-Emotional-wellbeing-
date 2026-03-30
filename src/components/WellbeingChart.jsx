import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const data = [
  { day: 'Mon', resilience: 65, balance: 40 },
  { day: 'Tue', resilience: 72, balance: 45 },
  { day: 'Wed', resilience: 68, balance: 58 },
  { day: 'Thu', resilience: 85, balance: 65 },
  { day: 'Fri', resilience: 78, balance: 75 },
  { day: 'Sat', resilience: 90, balance: 82 },
  { day: 'Sun', resilience: 95, balance: 88 },
];

export default function WellbeingChart() {
  return (
    <div className="w-full h-full min-h-[300px] relative overflow-hidden">
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorResilience" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
              fontSize: '12px',
              fontWeight: 700
            }}
          />
          <Area 
            type="monotone" 
            dataKey="resilience" 
            stroke="#818cf8" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorResilience)" 
          />
          <Area 
            type="monotone" 
            dataKey="balance" 
            stroke="#c084fc" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorBalance)" 
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
