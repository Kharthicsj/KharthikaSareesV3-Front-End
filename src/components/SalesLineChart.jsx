import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const SalesLineChart = ({ salesData }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Sales Amount",
        data: [],
        borderColor: "rgba(0, 0, 255, 1)", // Dark blue color
        backgroundColor: "rgba(0, 0, 255, 0.2)", // Lighter background color
        fill: true,
        tension: 0, // No curve in the graph
        pointBackgroundColor: "rgba(0, 0, 255, 1)", // Dark blue points
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(0, 0, 255, 1)", // Hover effect for points
      },
    ],
  });

  useEffect(() => {
    // Transform salesData into chart-friendly format
    const labels = salesData.map((sale) => new Date(sale.date).getTime()); // Convert date to timestamp
    const sales = salesData.map((sale) => sale.totalAmount);

    setChartData({
      labels,
      datasets: [
        {
          label: "Daily Sales (₹)",
          data: sales,
          borderColor: "rgba(0, 0, 255, 1)", // Dark blue color for the line
          backgroundColor: "rgba(0, 0, 255, 0.2)", // Lighter background color
          fill: true,
          tension: 0, // No curve in the graph
          pointBackgroundColor: "rgba(0, 0, 255, 1)", // Dark blue points
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff", // White hover background color for points
          pointHoverBorderColor: "rgba(0, 0, 255, 1)", // Hover effect for points
        },
      ],
    });
  }, [salesData]);

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "linear", // Linear scale for numerical (timestamp) data
        position: "bottom",
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          callback: function (value) {
            const date = new Date(value); // Convert timestamp back to readable date
            return `${date.getDate()}/${
              date.getMonth() + 1
            }/${date.getFullYear()}`; // Display date format
          },
        },
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: "Sales Amount (₹)",
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.parsed) {
              const date = new Date(context.parsed.x); // Get the date from the x value
              const formattedDate = `${date.getDate()}/${
                date.getMonth() + 1
              }/${date.getFullYear()}`; // Format date
              const salesAmount = context.parsed.y; // Get the sales amount from the y value

              // Returning the date and sales amount, while skipping the first "big number" (timestamp)
              return [
                `Date: ${formattedDate}`, // Second line: Date
                `₹${salesAmount.toLocaleString()}`, // Third line: Sales amount
              ];
            }
            return ""; // Return an empty string if no valid data
          },
          title: function () {
            return ""; // Remove tooltip title (optional)
          },
        },
      },

      zoom: {
        pan: {
          enabled: true,
          mode: "x", // Enable dragging horizontally
          speed: 10,
          threshold: 10,
        },
        zoom: {
          enabled: true,
          mode: "x", // Enable zoom horizontally
        },
      },
    },
    hover: {
      mode: "nearest", // Ensures nearest data point is hovered
      intersect: true,
    },
    elements: {
      line: {
        borderWidth: 3, // Default line width
      },
      point: {
        radius: 5, // Default point size
      },
    },
    interaction: {
      mode: "nearest",
      intersect: false, // Ensures interaction even when not directly over the points
    },
    animation: {
      duration: 0, // Remove animation for quicker hover response
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg col-span-2 mb-8 flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Data</h3>
      <div className="w-full h-full flex justify-center cursor-text">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SalesLineChart;
