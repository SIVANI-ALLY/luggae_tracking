import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ConfidenceChart = ({ data = [] }) => {
  console.log("ConfidenceChart received data:", data);
  

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="score_range" fontSize={13}/>
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="cargo_count" fill="#2563eb" name="Number of Detections" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ConfidenceChart; 