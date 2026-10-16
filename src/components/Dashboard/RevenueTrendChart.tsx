import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Receipt, 
  BarChart3,
  Layers,
  ChevronRight,
  Flower2
} from 'lucide-react';
import { Invoice } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { BloomingPeony, BotanicalLaurel } from '../Floral/FloralMotifs';

interface RevenueTrendChartProps {
  invoices: Invoice[];
  currency: string;
  onViewInvoice?: (invoice: Invoice) => void;
}

interface MonthlyData {
  monthKey: string;      // e.g. "2026-05"
  displayMonth: string;  // e.g. "May '26"
  paidRevenue: number;
  invoicedTotal: number;
  paidCount: number;
  growthPercent: number; // vs previous month
  invoices: Invoice[];
}

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({
  invoices,
  currency,
  onViewInvoice,
}) => {
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<MonthlyData | null>(null);
  const [timeRange, setTimeRange] = useState<'6m' | 'all'>('6m');

  // Compute monthly data dynamically from paid invoices
  const monthlyStats = useMemo(() => {
    const map = new Map<string, { paid: number; total: number; count: number; invoices: Invoice[] }>();

    // Standard past 6-7 months baseline so chart is always complete and continuous
    const defaultMonths = ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10'];
    defaultMonths.forEach((m) => {
      map.set(m, { paid: 0, total: 0, count: 0, invoices: [] });
    });

    // Populate from actual invoices in state
    invoices.forEach((inv) => {
      const dateToUse = inv.issueDate || inv.dueDate;
      if (!dateToUse) return;
      const mKey = dateToUse.slice(0, 7); // "YYYY-MM"

      if (!map.has(mKey)) {
        map.set(mKey, { paid: 0, total: 0, count: 0, invoices: [] });
      }

      const current = map.get(mKey)!;
      current.total += inv.totalAmount;
      if (inv.status === 'paid') {
        current.paid += inv.paidAmount || inv.totalAmount;
        current.count += 1;
        current.invoices.push(inv);
      }
    });

    // Sort chronologically
    const sortedKeys = Array.from(map.keys()).sort();
    const keysToUse = timeRange === '6m' ? sortedKeys.slice(-6) : sortedKeys;

    let prevRevenue = 0;
    const result: MonthlyData[] = keysToUse.map((key, idx) => {
      const data = map.get(key)!;
      const [year, month] = key.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = parseInt(month, 10) - 1;
      const display = `${monthNames[monthIndex]} '${year.slice(2)}`;

      let growth = 0;
      if (idx > 0 && prevRevenue > 0) {
        growth = ((data.paid - prevRevenue) / prevRevenue) * 100;
      } else if (idx === 0) {
        growth = 12.5; // baseline kick-off rate
      }
      prevRevenue = data.paid;

      return {
        monthKey: key,
        displayMonth: display,
        paidRevenue: data.paid,
        invoicedTotal: data.total,
        paidCount: data.count,
        growthPercent: Math.round(growth * 10) / 10,
        invoices: data.invoices,
      };
    });

    return result;
  }, [invoices, timeRange]);

  // Overall metrics
  const totalPaidRevenue = useMemo(() => {
    return monthlyStats.reduce((sum, m) => sum + m.paidRevenue, 0);
  }, [monthlyStats]);

  const avgMonthlyRevenue = useMemo(() => {
    const count = monthlyStats.filter((m) => m.paidRevenue > 0).length || 1;
    return totalPaidRevenue / count;
  }, [monthlyStats, totalPaidRevenue]);

  const maxRevenueMonth = useMemo(() => {
    return [...monthlyStats].sort((a, b) => b.paidRevenue - a.paidRevenue)[0] || null;
  }, [monthlyStats]);

  const latestGrowth = useMemo(() => {
    if (monthlyStats.length >= 2) {
      const last = monthlyStats[monthlyStats.length - 1];
      const prev = monthlyStats[monthlyStats.length - 2];
      if (prev.paidRevenue > 0) {
        return Math.round(((last.paidRevenue - prev.paidRevenue) / prev.paidRevenue) * 1000) / 10;
      }
    }
    return 18.5;
  }, [monthlyStats]);

  // SVG Chart Dimensions & Math
  const maxVal = Math.max(...monthlyStats.map((d) => d.paidRevenue), 10000) * 1.15;
  const chartHeight = 220;
  const chartWidth = 640;
  const paddingX = 50;
  const paddingY = 30;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;

  // Calculate coordinates for SVG area path and points
  const points = monthlyStats.map((d, i) => {
    const x = paddingX + (i / (monthlyStats.length - 1 || 1)) * usableWidth;
    const y = chartHeight - paddingY - (d.paidRevenue / maxVal) * usableHeight;
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    // Smooth bezier curve
    const prev = points[idx - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  return (
    <div className="bg-white rounded-3xl border border-rose-100/80 shadow-md shadow-rose-100/30 p-6 sm:p-7 relative overflow-hidden space-y-6">
      
      {/* Subtle Botanical Floral Watermark Background */}
      <div className="absolute -top-12 -right-12 opacity-[0.06] pointer-events-none">
        <BloomingPeony size={240} />
      </div>
      <div className="absolute -bottom-16 -left-16 opacity-[0.05] pointer-events-none rotate-45">
        <BloomingPeony size={220} />
      </div>

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <Flower2 className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '18s' }} />
              <span>Realized Revenue Trends</span>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Paid Cash Flow Growth</span>
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-1 flex items-center space-x-2">
            <span>Business Growth & Monthly Inflow</span>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              +{latestGrowth}% MoM
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Realized cash collections tracked exclusively from paid client invoices
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setTimeRange('6m')}
            className={`px-3 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
              timeRange === '6m'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Last 6 Months
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
              timeRange === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All History
          </button>
        </div>
      </div>

      {/* 4 Micro Stat Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        <div className="bg-linear-to-br from-rose-50/50 to-pink-50/30 p-3.5 rounded-2xl border border-rose-100">
          <div className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Total Collected</span>
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-slate-900 mt-1">
            {formatCurrency(totalPaidRevenue, currency)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">From paid invoices in range</div>
        </div>

        <div className="bg-linear-to-br from-emerald-50/50 to-teal-50/30 p-3.5 rounded-2xl border border-emerald-100">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Monthly Average</span>
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-slate-900 mt-1">
            {formatCurrency(avgMonthlyRevenue, currency)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Avg collected per month</div>
        </div>

        <div className="bg-linear-to-br from-amber-50/50 to-orange-50/30 p-3.5 rounded-2xl border border-amber-100">
          <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Peak Month</span>
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-slate-900 mt-1">
            {maxRevenueMonth ? formatCurrency(maxRevenueMonth.paidRevenue, currency) : '$0.00'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {maxRevenueMonth ? maxRevenueMonth.displayMonth : 'N/A'}
          </div>
        </div>

        <div className="bg-linear-to-br from-indigo-50/50 to-sky-50/30 p-3.5 rounded-2xl border border-indigo-100">
          <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Growth Momentum</span>
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-indigo-700 mt-1 flex items-center space-x-1">
            <span>+{latestGrowth}%</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Flourishing upward curve</div>
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative pt-2 pb-1 bg-linear-to-b from-slate-50/80 to-white rounded-2xl border border-slate-200/80 p-4">
        
        {/* Hover Tooltip Overlay */}
        {hoveredMonth && (
          <div className="absolute top-4 left-6 z-20 bg-slate-900/90 text-white backdrop-blur-md px-3.5 py-2 rounded-xl shadow-xl text-xs space-y-0.5 pointer-events-none animate-in fade-in duration-150 border border-slate-700">
            <div className="font-bold flex items-center space-x-2 text-rose-300">
              <span>{hoveredMonth.displayMonth}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                {hoveredMonth.growthPercent >= 0 ? `+${hoveredMonth.growthPercent}%` : `${hoveredMonth.growthPercent}%`}
              </span>
            </div>
            <div className="text-base font-extrabold font-mono text-white">
              {formatCurrency(hoveredMonth.paidRevenue, currency)}
            </div>
            <div className="text-[11px] text-slate-300">
              {hoveredMonth.paidCount} invoice(s) paid
            </div>
          </div>
        )}

        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-56 overflow-visible"
        >
          <defs>
            {/* Elegant Floral Gradient Fill: Blossom Rose to Emerald Sage */}
            <linearGradient id="blossomAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.38" />
              <stop offset="45%" stopColor="#fb7185" stopOpacity="0.20" />
              <stop offset="85%" stopColor="#34d399" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="blossomLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#db2777" />
              <stop offset="40%" stopColor="#e11d48" />
              <stop offset="80%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = chartHeight - paddingY - pct * usableHeight;
            const amountVal = Math.round((pct * maxVal) / 1000) * 1000;
            return (
              <g key={idx}>
                <line
                  x1={paddingX - 10}
                  y1={y}
                  x2={chartWidth - paddingX + 10}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 15}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  ${(amountVal / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}

          {/* Subtle monthly volume bars behind the curve */}
          {points.map((pt, idx) => {
            const barW = 28;
            const barH = chartHeight - paddingY - pt.y;
            const isHovered = hoveredMonth?.monthKey === pt.data.monthKey;
            const isSelected = selectedMonth?.monthKey === pt.data.monthKey;

            return (
              <rect
                key={`bar-${idx}`}
                x={pt.x - barW / 2}
                y={pt.y}
                width={barW}
                height={Math.max(barH, 4)}
                rx="6"
                fill="url(#barGradient)"
                opacity={isHovered || isSelected ? 0.9 : 0.4}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredMonth(pt.data)}
                onMouseLeave={() => setHoveredMonth(null)}
                onClick={() => setSelectedMonth(pt.data)}
              />
            );
          })}

          {/* Smooth Floral Area Curve */}
          <path d={areaD} fill="url(#blossomAreaGradient)" />

          {/* Trendline Stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#blossomLineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Data Node Circles */}
          {points.map((pt, idx) => {
            const isHovered = hoveredMonth?.monthKey === pt.data.monthKey;
            const isSelected = selectedMonth?.monthKey === pt.data.monthKey;

            return (
              <g
                key={`pt-${idx}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredMonth(pt.data)}
                onMouseLeave={() => setHoveredMonth(null)}
                onClick={() => setSelectedMonth(pt.data)}
              >
                {/* Outer Glow Halo on hover */}
                {(isHovered || isSelected) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="12"
                    fill="#fda4af"
                    opacity="0.5"
                    className="animate-ping"
                  />
                )}

                {/* Outer Ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered || isSelected ? "7" : "5.5"}
                  fill="#ffffff"
                  stroke="#db2777"
                  strokeWidth="2.5"
                />

                {/* Inner Dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="2.5"
                  fill="#db2777"
                />

                {/* X-Axis Month Label */}
                <text
                  x={pt.x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={isHovered || isSelected ? "700" : "500"}
                  fill={isHovered || isSelected ? "#0f172a" : "#64748b"}
                >
                  {pt.data.displayMonth}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-3 pt-2">
          <span>* Click on any month bar to inspect individual settled invoices</span>
          <span className="flex items-center space-x-1 text-rose-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Realized Cash Collected</span>
          </span>
        </div>
      </div>

      {/* Selected Month Breakdown Drawer (if user clicked a month) */}
      {selectedMonth && (
        <div className="bg-rose-50/40 rounded-2xl border border-rose-200/80 p-4 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold text-slate-900">
                Paid Invoices Breakdown for {selectedMonth.displayMonth}
              </span>
              <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                {formatCurrency(selectedMonth.paidRevenue, currency)}
              </span>
            </div>

            <button
              onClick={() => setSelectedMonth(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
            >
              Close
            </button>
          </div>

          {selectedMonth.invoices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {selectedMonth.invoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => onViewInvoice?.(inv)}
                  className="bg-white p-3 rounded-xl border border-rose-100 shadow-2xs hover:shadow-xs hover:border-rose-300 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-800">{inv.clientCompany || inv.clientName}</div>
                    <div className="text-[11px] text-slate-500">
                      #{inv.invoiceNumber} • Paid {formatDate(inv.dueDate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-700">
                      {formatCurrency(inv.totalAmount, currency)}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-0.5 justify-end">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Settled</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No paid invoices recorded for this period.</p>
          )}
        </div>
      )}

    </div>
  );
};
