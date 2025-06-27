import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { useZaps } from '@/hooks/useZaps';
import { useErrors } from '@/hooks/useErrors';
import MetricCard from '@/components/molecules/MetricCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Select from '@/components/atoms/Select';

const Performance = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [chartData, setChartData] = useState({
    runs: [],
    errors: [],
    success: []
  });

  const { zaps, loading: zapsLoading, error: zapsError } = useZaps();
  const { errors, loading: errorsLoading } = useErrors();

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
  ];

  // Generate mock chart data
  useEffect(() => {
    const generateMockData = () => {
      const days = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const interval = timeRange === '24h' ? 'hour' : 'day';
      
      const mockRuns = [];
      const mockErrors = [];
      const mockSuccess = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        if (interval === 'hour') {
          date.setHours(date.getHours() - i);
        } else {
          date.setDate(date.getDate() - i);
        }

        mockRuns.push({
          x: date.getTime(),
          y: Math.floor(Math.random() * 100) + 50
        });

        mockErrors.push({
          x: date.getTime(),
          y: Math.floor(Math.random() * 20)
        });

        mockSuccess.push({
          x: date.getTime(),
          y: Math.random() * 100 + 85
        });
      }

      setChartData({
        runs: mockRuns,
        errors: mockErrors,
        success: mockSuccess
      });
    };

    generateMockData();
  }, [timeRange]);

  const runsChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      background: 'transparent'
    },
    colors: ['#EF8354'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 3
    },
    tooltip: {
      theme: 'light'
    }
  };

  const errorsChartOptions = {
    chart: {
      type: 'column',
      height: 350,
      toolbar: { show: false },
      background: 'transparent'
    },
    colors: ['#EF476F'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 3
    },
    tooltip: {
      theme: 'light'
    }
  };

  const successChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      background: 'transparent'
    },
    colors: ['#06D6A0'],
    stroke: {
      curve: 'smooth',
      width: 4
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        formatter: (val) => val + '%',
        style: {
          colors: '#6B7280'
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 3
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val) => val + '%'
      }
    }
  };

  // Calculate metrics
  const totalRuns = zaps.reduce((sum, zap) => sum + (zap.successRate || 0), 0);
  const avgSuccessRate = zaps.length > 0 ? Math.round(totalRuns / zaps.length) : 0;
  const activeZaps = zaps.filter(z => z.status === 'active').length;
  const totalErrors = errors.length;
  const avgResponseTime = zaps.length > 0 
    ? Math.round(zaps.reduce((sum, zap) => sum + zap.avgDuration, 0) / zaps.length * 100) / 100
    : 0;

  if (zapsLoading || errorsLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <Loading type="metrics" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Loading type="cards" count={2} />
        </div>
      </div>
    );
  }

  if (zapsError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Error
          title="Failed to load performance data"
          message={zapsError}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary">Performance Analytics</h1>
        <div className="w-48">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={timeRangeOptions}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Total Runs"
          value={chartData.runs.reduce((sum, point) => sum + point.y, 0)}
          icon="Activity"
          gradient={true}
          change="12% from last period"
          trend="up"
        />
        <MetricCard
          title="Success Rate"
          value={`${avgSuccessRate}%`}
          icon="CheckCircle"
          change={avgSuccessRate > 95 ? "Excellent" : "Good"}
          trend={avgSuccessRate > 95 ? "up" : "neutral"}
        />
        <MetricCard
          title="Active Zaps"
          value={activeZaps}
          icon="Zap"
          change={`${Math.round((activeZaps / zaps.length) * 100)}% of total`}
          trend="up"
        />
        <MetricCard
          title="Avg Response Time"
          value={`${avgResponseTime}s`}
          icon="Timer"
          change={avgResponseTime < 5 ? "Fast" : "Normal"}
          trend={avgResponseTime < 5 ? "up" : "neutral"}
        />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Zap Runs Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-primary mb-4">Zap Runs Over Time</h3>
          <Chart
            options={runsChartOptions}
            series={[{ name: 'Runs', data: chartData.runs }]}
            type="area"
            height={350}
          />
        </motion.div>

        {/* Errors Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-primary mb-4">Errors Over Time</h3>
          <Chart
            options={errorsChartOptions}
            series={[{ name: 'Errors', data: chartData.errors }]}
            type="column"
            height={350}
          />
        </motion.div>
      </div>

      {/* Success Rate Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-primary mb-4">Success Rate Trend</h3>
        <Chart
          options={successChartOptions}
          series={[{ name: 'Success Rate', data: chartData.success }]}
          type="line"
          height={350}
        />
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-primary mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-primary mb-2">Top Performing Zaps</h4>
            <div className="space-y-2">
              {zaps
                .sort((a, b) => b.successRate - a.successRate)
                .slice(0, 3)
                .map((zap) => (
                  <div key={zap.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium truncate">{zap.name}</span>
                    <span className="text-sm text-success font-medium">{zap.successRate}%</span>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-primary mb-2">Zaps Needing Attention</h4>
            <div className="space-y-2">
              {zaps
                .filter(zap => zap.status === 'error' || zap.errorCount > 0)
                .slice(0, 3)
                .map((zap) => (
                  <div key={zap.Id} className="flex items-center justify-between p-3 bg-error/5 rounded-lg">
                    <span className="text-sm font-medium truncate">{zap.name}</span>
                    <span className="text-sm text-error font-medium">{zap.errorCount} errors</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Performance;