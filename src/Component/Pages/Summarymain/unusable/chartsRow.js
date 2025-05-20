import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);
const ChartsRow = ({ pieData, barData, tableData }) => {
  return (
    <div className="row mb-3" style={{ background: "lightgray" }}>
      <div className="col-md-4" style={{ width: '373px', height: '250px', marginLeft: "5px", background: "darkgray" }}>
        <h5>Pie Chart</h5>
        <div style={{ height: '220px', width: '373px' }}>
          <Doughnut data={pieData} />
        </div>
      </div>
      <div className="col-md-4" style={{ width: '373px', height: '250px', marginLeft: "5px", background: "darkgray" }}>
        <h5>Bar Chart</h5>
        <Bar data={barData} />
      </div>
      <div className="col-md-4" style={{ width: '373px', height: '250px', marginLeft: "5px", background: "darkgray" }}>
        <h5>Table Chart</h5>
        <table className="table">
          <thead>
            <tr>
              {tableData.headers.map((header, index) => (
                <th key={index}  >{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, index) => (
              <tr key={index} >
                {row.map((cell, i) => (
                  <td key={i} >{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChartsRow;
