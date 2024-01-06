import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`Date : ${label}`}</p>
        <p className="intro">{`Total User : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};
const UserEnrollmentChart = ({ data }) => (
  
  <LineChart
    width={500}
    height={300}
    data={data}
    margin={{
      top: 5, right: 30, left: 20, bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip content={<CustomTooltip />} />
    <Legend />
    <Line type="monotone" dataKey="count" name="Total User" stroke="#8884d8" activeDot={{ r: 8 }} />
  </LineChart>
);
export default UserEnrollmentChart;