import { useState, useMemo } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, BarChart, Bar,
} from "recharts";
import "./ProfileCharts.css";

const RANGE_OPTIONS = [
  { key: 7,  label: "7 Days"  },
  { key: 30, label: "30 Days" },
];

const buildDailyData = (todos, days) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const dayKey = day.toDateString();

    const completedThatDay = todos.filter(
      (t) => t.status === "done" && t.updatedAt && new Date(t.updatedAt).toDateString() === dayKey
    ).length;

    const tasksUpToDay = todos.filter(
      (t) => t.createdAt && new Date(t.createdAt) <= day
    );
    const doneUpToDay = tasksUpToDay.filter((t) => {
      if (t.status !== "done" || !t.updatedAt) return false;
      return new Date(t.updatedAt) <= new Date(day.getTime() + 86399999);
    });
    const rate = tasksUpToDay.length ? Math.round((doneUpToDay.length / tasksUpToDay.length) * 100) : 0;

    result.push({
      date: day,
      dateLabel: day.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
      completed: completedThatDay,
      rate,
    });
  }
  return result;
};

const buildHeatmapWeeks = (todos, weeks = 12) => {
  const totalDays = weeks * 7;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const dayKey = day.toDateString();
    const completed = todos.filter(
      (t) => t.status === "done" && t.updatedAt && new Date(t.updatedAt).toDateString() === dayKey
    ).length;
    days.push({ date: day, dateLabel: day.toLocaleDateString(undefined, { day: "numeric", month: "short" }), completed });
  }

  const maxCompleted = Math.max(1, ...days.map((d) => d.completed));

  const grid = [];
  for (let w = 0; w < weeks; w++) {
    grid.push(days.slice(w * 7, w * 7 + 7));
  }

  const monthLabels = grid.map((week, wi) => {
    const firstDay = week[0]?.date;
    if (!firstDay) return null;
    const prevWeekFirst = wi > 0 ? grid[wi - 1][0]?.date : null;
    const isNewMonth = !prevWeekFirst || firstDay.getMonth() !== prevWeekFirst.getMonth();
    return isNewMonth ? firstDay.toLocaleDateString(undefined, { month: "short" }) : null;
  });

  return { grid, maxCompleted, monthLabels };
};

const getHeatLevel = (count, max) => {
  if (count === 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5)  return 2;
  if (ratio <= 0.75) return 3;
  return 4;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="chart-tooltip-row" style={{ color: p.color }}>
          {p.name}: <strong>{p.value}{p.dataKey === "rate" ? "%" : ""}</strong>
        </p>
      ))}
    </div>
  );
};

const ProfileCharts = ({ todos }) => {
  const [range, setRange] = useState(7);

  const dailyData = useMemo(() => buildDailyData(todos, range), [todos, range]);
  const { grid: heatmapWeeks, maxCompleted, monthLabels } = useMemo(
    () => buildHeatmapWeeks(todos, 12),
    [todos]
  );

  const isEmpty = todos.length === 0;

  return (
    <>
      <div className="profile-section-title-row">
        <div className="profile-section-title">Completion Rate Over Time</div>
        <div className="range-toggle">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`range-toggle-btn ${range === opt.key ? "active" : ""}`}
              onClick={() => setRange(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="profile-chart-card neu-card">
        {isEmpty ? (
          <div className="chart-empty">Complete some tasks to see your trend here.</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#667eea" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="dateLabel"
                tick={{ fontSize: 11, fill: "var(--chart-text)" }}
                axisLine={false}
                tickLine={false}
                interval={range === 30 ? 3 : 0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--chart-text)" }}
                axisLine={false}
                tickLine={false}
                width={36}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="rate"
                name="Completion Rate"
                stroke="#667eea"
                strokeWidth={2.5}
                fill="url(#rateGradient)"
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="profile-section-title">Activity Heatmap</div>
      <div className="profile-chart-card neu-card heatmap-card">
        {isEmpty ? (
          <div className="chart-empty">Your activity heatmap will appear once you complete tasks.</div>
        ) : (
          <div className="heatmap-wrap">
            <div className="heatmap-months">
              {monthLabels.map((label, wi) => (
                <div key={wi} className="heatmap-month-label">{label || ""}</div>
              ))}
            </div>

            <div className="heatmap-grid">
              {heatmapWeeks.map((week, wi) => (
                <div className="heatmap-col" key={wi}>
                  {week.map((day, di) => {
                    const level = getHeatLevel(day.completed, maxCompleted);
                    return (
                      <div
                        key={di}
                        className={`heatmap-cell heatmap-level-${level}`}
                        title={`${day.dateLabel}: ${day.completed} completed`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="heatmap-legend">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((lvl) => (
                <span key={lvl} className={`heatmap-cell heatmap-level-${lvl} heatmap-legend-cell`} />
              ))}
              <span>More</span>
            </div>
          </div>
        )}
      </div>

      <div className="profile-section-title">Daily Completions</div>
      <div className="profile-chart-card neu-card">
        {isEmpty ? (
          <div className="chart-empty">Complete tasks to see daily breakdown here.</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="dateLabel"
                tick={{ fontSize: 11, fill: "var(--chart-text)" }}
                axisLine={false}
                tickLine={false}
                interval={range === 30 ? 3 : 0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--chart-text)" }}
                axisLine={false}
                tickLine={false}
                width={28}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="completed"
                name="Completed"
                fill="#10b981"
                radius={[5, 5, 0, 0]}
                animationDuration={500}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
};

export default ProfileCharts;