import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const DamageChart = ({ data = [] }) => {
  // Transform data to match chart requirements
  const chartData = data.map(item => ({
    name: item.defect_class,
    value: item.count
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          innerRadius={60}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
          <Tooltip 
            formatter={(value, name) => [`${value}`, name]}
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          />
          <Legend 
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{
              paddingTop: '20px'
            }}
          />
      </PieChart>
    </ResponsiveContainer>
    </div>
  );
};

export default DamageChart; 