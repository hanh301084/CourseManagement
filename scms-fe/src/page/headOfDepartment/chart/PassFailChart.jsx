import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PassFailChart = ({ data }) => (
  <BarChart
    width={500}
    height={300}
    data={data}
    margin={{
      top: 20, right: 30, left: 20, bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="semester" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="passed" stackId="a" fill="#82ca9d" />
    <Bar dataKey="notPassed" stackId="a" fill="#ff6347" />
  </BarChart>
);
export default PassFailChart;
