import React, { useState } from 'react';
import {
  OrderItem,
  CRPWorkcenter,
  ProductionTeam,
  SystemAlert,
  ReportFilterPeriod,
  NavigationTarget,
  ClusterId,
} from '../types/mes';
import {
  PARETO_DEFECT_DATA,
  REWORK_STATS_SUMMARY,
  REWORK_TEAM_BREAKDOWN,
  EXECUTIVE_MEETING_KPIS,
} from '../data/mockData';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Clock,
  RotateCcw,
  Target,
  Calendar,
  Filter,
  Users,
  CheckCircle,
  AlertOctagon,
  Timer,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  PieChart,
  BarChart2,
} from 'lucide-react';

interface ExecutiveDashboardProps {
  orders: OrderItem[];
  workcenters: CRPWorkcenter[];
  teams: ProductionTeam[];
  alerts: SystemAlert[];
  onNavigateTab: (tab: string) => void;
  onSelectOrder: (order: OrderItem) => void;
  onNavigate?: (target: NavigationTarget) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  orders,
  workcenters,
  teams,
  alerts,
  onNavigateTab,
  onSelectOrder,
  onNavigate,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportFilterPeriod>('WEEK_44');
  const [activeSection, setActiveSection] = useState<'MEETING' | 'QUALITY_PARETO' | 'CRP'>('MEETING');

  // Chart type toggles (Cột / Đường / Tròn)
  const [healthChartType, setHealthChartType] = useState<'BAR' | 'LINE' | 'PIE'>('BAR');
  const [leadTimeChartType, setLeadTimeChartType] = useState<'BAR' | 'LINE' | 'PIE'>('BAR');
  const [paretoChartType, setParetoChartType] = useState<'PARETO_COMBO' | 'BAR' | 'PIE'>('PARETO_COMBO');
  const [clusterChartType, setClusterChartType] = useState<'BAR' | 'LINE' | 'PIE'>('BAR');

  const periodData = EXECUTIVE_MEETING_KPIS[selectedPeriod] || EXECUTIVE_MEETING_KPIS['WEEK_44'];

  // Critical alerts
  const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL' && !a.acknowledged);

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Báo Cáo Quản Trị &amp; Điều Hành Sản Xuất
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Báo cáo tổng hợp Ban Giám Đốc: Tiến độ giao xe OTD, OEE, Lead time chu kỳ, Pareto lỗi KCS 80/20 và Tùy biến đa dạng biểu đồ Cột, Đường, Tròn
          </p>
        </div>

        {/* Navigation Quick Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('scheduling')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
          >
            Lập Lịch &amp; Dispatch
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors shadow-2xs"
          >
            Tracking Hành Trình Đơn
          </button>
        </div>
      </div>

      {/* FILTER BAR THEO TUẦN / THÁNG (MEETING FILTER TOOLBAR) */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold shrink-0">
          <Filter className="w-4 h-4 text-amber-500" />
          <span>Kỳ Báo Cáo / Họp Sản Xuất:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'WEEK_44', label: 'Tuần 44 (Hiện Tại: 02/11 - 07/11)' },
              { id: 'WEEK_45', label: 'Tuần 45 (09/11 - 14/11)' },
              { id: 'MONTH_10', label: 'Tháng 10/2026' },
              { id: 'MONTH_11', label: 'Tháng 11/2026 (Cao Điểm)' },
              { id: 'ALL_Q4', label: 'Toàn Quý IV/2026' },
            ] as const
          ).map((p) => {
            const isSelected = selectedPeriod === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPeriod(p.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-amber-400 font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <span className="text-[11px] font-mono text-slate-400 self-end md:self-center">
          {periodData.dateRangeDesc}
        </span>
      </div>

      {/* SUBTABS SWITCHER */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveSection('MEETING')}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'MEETING'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-500" />
          <span>01. Họp Giao Ban: Tiến Độ, Hiệu Suất &amp; Lead Time Đơn</span>
        </button>

        <button
          onClick={() => setActiveSection('QUALITY_PARETO')}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'QUALITY_PARETO'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-rose-500" />
          <span>02. Báo Cáo Chất Lượng &amp; Biểu Đồ Pareto 80/20 (Giờ Sửa Hàng)</span>
        </button>

        <button
          onClick={() => setActiveSection('CRP')}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'CRP'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>03. Tải Trọng Năng Lực 6 Xưởng &amp; 95 Thợ (CRP)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: PRODUCTION MEETING, OTD, EFFICIENCY, LEAD TIME     */}
      {/* ======================================================== */}
      {activeSection === 'MEETING' && (
        <div className="space-y-6">
          {/* PRIMARY KPI CARDS DRIVEN BY PERIOD FILTER */}
          {/* PRIMARY KPI CARDS DRIVEN BY PERIOD FILTER (CLICK TO DRILL-DOWN) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Total Orders */}
            <div
              onClick={() => {
                if (onNavigate) {
                  onNavigate({ tab: 'orders', subView: 'LIST', sourceDesc: 'KPI Tổng Lệnh Sản Xuất' });
                } else {
                  onNavigateTab('orders');
                }
              }}
              className="bg-white border border-slate-200 hover:border-slate-400 rounded-lg p-5 shadow-2xs space-y-2 cursor-pointer transition-all hover:shadow-xs group"
              title="Bấm để xem danh sách toàn bộ Lệnh sản xuất"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span className="group-hover:text-slate-900 transition-colors">Tổng Lệnh Sản Xuất</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {periodData.totalOrders}
                </span>
                <span className="text-xs text-slate-500">đơn trong kỳ</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600">
                <span>{periodData.orderMix.gCount} Bán (G) · {periodData.orderMix.tCount} Triển lãm (T)</span>
                <span className="text-amber-700 font-bold">{periodData.orderMix.bCount} Bảo hành (B)</span>
              </div>
            </div>

            {/* KPI 2: On-Time Delivery Rate */}
            <div
              onClick={() => {
                if (onNavigate) {
                  onNavigate({
                    tab: 'orders',
                    subView: 'JOURNEY_TRACKING',
                    orderId: 'B2610002',
                    sourceDesc: 'KPI Tỷ Lệ Đúng Hẹn (OTD) - Đơn Nguy Cơ',
                  });
                } else {
                  onNavigateTab('orders');
                }
              }}
              className="bg-white border border-slate-200 hover:border-emerald-400 rounded-lg p-5 shadow-2xs space-y-2 cursor-pointer transition-all hover:shadow-xs group"
              title="Bấm để xem hành trình các đơn trễ cần giải cứu"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span className="group-hover:text-emerald-900 transition-colors">Tỷ Lệ Đúng Hẹn (OTD)</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-500 group-hover:text-emerald-700 transition-colors" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
                  {periodData.otdRatePercent}%
                </span>
                <span className="text-xs text-slate-500">Mục tiêu ≥ 95%</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <span>Đúng tiến độ: {periodData.healthBreakdown.onTrack} xe</span>
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <span>{periodData.healthBreakdown.delayed + periodData.healthBreakdown.rework} xe cần cứu</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* KPI 3: Workshop Efficiency OEE */}
            <div
              onClick={() => {
                if (onNavigate) {
                  onNavigate({
                    tab: 'scheduling',
                    subView: 'DAILY_DISPATCH',
                    sourceDesc: 'KPI Hiệu Suất Xưởng (OEE)',
                  });
                } else {
                  onNavigateTab('scheduling');
                }
              }}
              className="bg-white border border-slate-200 hover:border-amber-400 rounded-lg p-5 shadow-2xs space-y-2 cursor-pointer transition-all hover:shadow-xs group"
              title="Bấm để xem điều phối lịch trình theo ngày của 17 tổ"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span className="group-hover:text-amber-900 transition-colors">Hiệu Suất Xưởng (OEE)</span>
                <ArrowUpRight className="w-4 h-4 text-amber-500 group-hover:text-amber-700 transition-colors" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {periodData.efficiencyRatePercent}%
                </span>
                <span className="text-xs text-slate-500">95 thợ lành nghề</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <span>Định biên ca: 8h/ngày</span>
                <span className="text-emerald-700 font-semibold">+2.4% vs tháng trước</span>
              </div>
            </div>

            {/* KPI 4: Average Lead Time */}
            <div
              onClick={() => {
                if (onNavigate) {
                  onNavigate({
                    tab: 'matrix',
                    sourceDesc: 'KPI Lead Time Bình Quân Chế Tác',
                  });
                } else {
                  onNavigateTab('matrix');
                }
              }}
              className="bg-white border border-slate-200 hover:border-indigo-400 rounded-lg p-5 shadow-2xs space-y-2 cursor-pointer transition-all hover:shadow-xs group"
              title="Bấm để xem ma trận tiến độ 17 tổ qua 14 ngày chuyền"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span className="group-hover:text-indigo-900 transition-colors">Lead Time Chế Tác Bình Quân</span>
                <ArrowUpRight className="w-4 h-4 text-indigo-500 group-hover:text-indigo-700 transition-colors" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-indigo-700 font-mono tabular-nums">
                  {periodData.avgLeadTimeDays}
                </span>
                <span className="text-xs text-slate-500">ngày / xe</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600">
                <span>Chuẩn: {periodData.standardLeadTimeDays} ngày</span>
                <span className="text-emerald-700 font-bold">Rút ngắn {Math.abs(periodData.leadTimeGapDays)} ngày</span>
              </div>
            </div>
          </div>

          {/* TWO COLUMN ROW: ORDER PROGRESS HEALTH + LEAD TIME VARIANCE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT (6 cols): PROGRESS & HEALTH BREAKDOWN */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Phân Bổ Tiến Độ &amp; Sức Khỏe Đơn Hàng (Health Distribution)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Trạng thái tiến độ thực tế phục vụ chỉ đạo họp giao ban sản xuất
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {periodData.totalOrders} LSX
                </span>
              </div>

              {/* Stacked Health Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-4 bg-slate-100 rounded-md overflow-hidden flex">
                  <div
                    style={{
                      width: `${(periodData.healthBreakdown.onTrack / periodData.totalOrders) * 100}%`,
                    }}
                    className="bg-emerald-500 h-full"
                    title={`Đúng tiến độ: ${periodData.healthBreakdown.onTrack}`}
                  />
                  <div
                    style={{
                      width: `${(periodData.healthBreakdown.atRisk / periodData.totalOrders) * 100}%`,
                    }}
                    className="bg-amber-400 h-full"
                    title={`Nguy cơ chậm: ${periodData.healthBreakdown.atRisk}`}
                  />
                  <div
                    style={{
                      width: `${(periodData.healthBreakdown.delayed / periodData.totalOrders) * 100}%`,
                    }}
                    className="bg-rose-500 h-full"
                    title={`Trễ hạn: ${periodData.healthBreakdown.delayed}`}
                  />
                  <div
                    style={{
                      width: `${(periodData.healthBreakdown.rework / periodData.totalOrders) * 100}%`,
                    }}
                    className="bg-purple-600 h-full"
                    title={`Vướng lỗi KCS / Rework: ${periodData.healthBreakdown.rework}`}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="p-2.5 rounded bg-emerald-50 border border-emerald-100">
                    <span className="text-emerald-800 text-[11px] block font-medium">Đúng Tiến Độ (On-Track)</span>
                    <strong className="text-emerald-900 text-lg font-mono">
                      {periodData.healthBreakdown.onTrack}
                    </strong>
                    <span className="text-[10px] text-emerald-700 block">
                      {Math.round((periodData.healthBreakdown.onTrack / periodData.totalOrders) * 100)}%
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-amber-50 border border-amber-100">
                    <span className="text-amber-800 text-[11px] block font-medium">Nguy Cơ Chậm (At-Risk)</span>
                    <strong className="text-amber-900 text-lg font-mono">
                      {periodData.healthBreakdown.atRisk}
                    </strong>
                    <span className="text-[10px] text-amber-700 block">Lệch 1 ngày</span>
                  </div>

                  <div
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate({
                          tab: 'orders',
                          subView: 'JOURNEY_TRACKING',
                          orderId: 'B2610002',
                          sourceDesc: 'Báo cáo: Đơn Trễ Hạn Cần Bù Tiến Độ',
                        });
                      } else {
                        onNavigateTab('orders');
                      }
                    }}
                    className="p-2.5 rounded bg-rose-50 border border-rose-200 hover:border-rose-400 cursor-pointer transition-all"
                    title="Bấm để mở trực tiếp đơn hàng trễ tiến độ B2610002"
                  >
                    <span className="text-rose-800 text-[11px] block font-medium flex items-center justify-between">
                      <span>Trễ Hạn (Delayed)</span>
                      <ArrowUpRight className="w-3 h-3 text-rose-500" />
                    </span>
                    <strong className="text-rose-900 text-lg font-mono">
                      {periodData.healthBreakdown.delayed}
                    </strong>
                    <span className="text-[10px] text-rose-700 block font-semibold">Cần tăng ca · Xem chi tiết</span>
                  </div>

                  <div
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate({
                          tab: 'orders',
                          subView: 'JOURNEY_TRACKING',
                          orderId: 'B2610002',
                          sourceDesc: 'Báo cáo: Đơn Vướng Lỗi KCS Sửa Hàng',
                        });
                      } else {
                        onNavigateTab('orders');
                      }
                    }}
                    className="p-2.5 rounded bg-purple-50 border border-purple-200 hover:border-purple-400 cursor-pointer transition-all"
                    title="Bấm để mở trực tiếp đơn hàng vướng lỗi KCS B2610002"
                  >
                    <span className="text-purple-800 text-[11px] block font-medium flex items-center justify-between">
                      <span>Sửa Hàng (Rework)</span>
                      <ArrowUpRight className="w-3 h-3 text-purple-500" />
                    </span>
                    <strong className="text-purple-900 text-lg font-mono">
                      {periodData.healthBreakdown.rework}
                    </strong>
                    <span className="text-[10px] text-purple-700 block font-semibold">Lỗi KCS · Xem chi tiết</span>
                  </div>
                </div>
              </div>

              {/* Warning for unstable orders with direct clickable links */}
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg text-xs space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Chỉ Đạo Nóng Từ Ban Giám Đốc Cho Tuần Này (Click để xử lý):</span>
                </div>
                <p className="text-slate-800 text-[11px] leading-relaxed">
                  Tập trung ưu tiên cao độ cho đơn{' '}
                  <button
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate({
                          tab: 'orders',
                          subView: 'JOURNEY_TRACKING',
                          orderId: 'B2610002',
                          sourceDesc: 'Chỉ đạo Ban Giám Đốc: Đơn B2610002',
                        });
                      } else {
                        onNavigateTab('orders');
                      }
                    }}
                    className="font-bold underline text-rose-800 hover:text-rose-950 bg-rose-100/70 px-1 rounded cursor-pointer"
                  >
                    B2610002 (Bảo hành VIP - hạn 04/11) ↗
                  </button>{' '}
                  và đơn{' '}
                  <button
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate({
                          tab: 'orders',
                          subView: 'JOURNEY_TRACKING',
                          orderId: 'G2610023',
                          sourceDesc: 'Chỉ đạo Ban Giám Đốc: Đơn G2610023',
                        });
                      } else {
                        onNavigateTab('orders');
                      }
                    }}
                    className="font-bold underline text-amber-900 hover:text-amber-950 bg-amber-100/80 px-1 rounded cursor-pointer"
                  >
                    G2610023 (Tour Liên Minh Sài Gòn - hạn 15/11) ↗
                  </button>
                  . Yêu cầu Quản đốc Cụm 4 giải phóng ngay xe tại{' '}
                  <button
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate({
                          tab: 'scheduling',
                          subView: 'DAILY_DISPATCH',
                          teamId: 'T16',
                          clusterId: 4,
                          sourceDesc: 'Chỉ đạo BGĐ: Điều phối Tổ 16',
                        });
                      } else {
                        onNavigateTab('scheduling');
                      }
                    }}
                    className="font-bold underline text-indigo-900 hover:text-indigo-950 bg-indigo-100 px-1 rounded cursor-pointer"
                  >
                    Tổ 16 (Lắp Ghế VIP Điện) ↗
                  </button>
                  .
                </p>
              </div>
            </div>

            {/* RIGHT (6 cols): LEAD TIME ACTUAL VS STANDARD BY VEHICLE MODEL */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    So Sánh Lead Time Thực Tế vs Định Mức Từng Dòng Xe
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chuẩn định mức 14 ngày chuyền tuyến tính qua 4 Cụm &amp; 17 Tổ
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Chuẩn 14 ngày
                </span>
              </div>

              <div className="space-y-3">
                {periodData.modelLeadTimes.map((m) => {
                  const isFaster = m.varianceDays < 0;
                  const isSlower = m.varianceDays > 0;

                  return (
                    <div key={m.modelName} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{m.modelName}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-slate-500 text-[11px]">
                            Thực tế: <strong>{m.actualDays} ngày</strong> (Chuẩn {m.targetDays}d)
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              isFaster
                                ? 'bg-emerald-100 text-emerald-800'
                                : isSlower
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {m.varianceDays > 0 ? `+${m.varianceDays}d (Chậm)` : `${m.varianceDays}d (Nhanh)`}
                          </span>
                        </div>
                      </div>

                      {/* Bar Visualization */}
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${Math.min(100, (m.actualDays / 16) * 100)}%` }}
                          className={`h-full rounded-full transition-all ${
                            m.status === 'OPTIMAL'
                              ? 'bg-emerald-500'
                              : m.status === 'ACCEPTABLE'
                              ? 'bg-slate-800'
                              : 'bg-rose-500'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CLUSTER WORKLOAD & BOTTLENECK ANALYSIS */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Hiệu Suất &amp; Tải Trọng 4 Cụm Phân Xưởng (Giao Ban Báo Cáo)
                </h3>
                <p className="text-xs text-slate-500">
                  Theo dõi giờ công kế hoạch vs thực tế và điểm nghẽn trọng yếu tại các cụm
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                17 Tổ Sản Xuất
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {periodData.clusterPerformance.map((c) => {
                const isOver = c.utilizationPercent > 100;

                return (
                  <div
                    key={c.clusterId}
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate({
                          tab: 'scheduling',
                          subView: 'DAILY_DISPATCH',
                          clusterId: c.clusterId as ClusterId,
                          sourceDesc: `Tải trọng ${c.clusterName}`,
                        });
                      } else {
                        onNavigateTab('scheduling');
                      }
                    }}
                    className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 rounded-lg space-y-3 cursor-pointer transition-all hover:shadow-xs group"
                    title={`Bấm để mở lịch trình chi tiết của Cụm ${c.clusterId}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 group-hover:text-amber-800 transition-colors flex items-center gap-1">
                        <span>{c.clusterName}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700" />
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          isOver ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {c.utilizationPercent}% Tải
                      </span>
                    </div>

                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Kế hoạch: {c.plannedHours}h</span>
                        <span>Thực tế: {c.actualHours}h</span>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span>Chất lượng KCS:</span>
                        <strong className="text-emerald-700">{c.qualityRatePercent}%</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                      <span className="text-slate-400 block text-[10px]">Điểm nghẽn cần tháo gỡ:</span>
                      <span className="font-medium text-slate-800">{c.bottleneckNotes}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: QUALITY PARETO 80/20 & REWORK ANALYSIS            */}
      {/* ======================================================== */}
      {activeSection === 'QUALITY_PARETO' && (
        <div className="space-y-6">
          {/* Top Metric Cards for Quality & Rework */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Tổng Số Lỗi KCS Ghi Nhận</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {REWORK_STATS_SUMMARY.totalDefectsRecorded}
                </span>
                <span className="text-xs text-slate-500">vụ việc</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                <span>Bình quân</span>
                <span>{REWORK_STATS_SUMMARY.avgHoursPerDefect} giờ / lỗi</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Thời Gian Sửa Hàng (Rework)</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-rose-600 font-mono tabular-nums">
                  {REWORK_STATS_SUMMARY.totalReworkHours}
                </span>
                <span className="text-xs text-slate-500">giờ công</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                <span>Tỷ lệ giờ sửa / tổng giờ</span>
                <span className="text-rose-600 font-bold">{REWORK_STATS_SUMMARY.reworkRatioPercent}%</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Quy Luật Pareto 80/20</span>
                <Target className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-indigo-700 font-mono tabular-nums">
                  79.5%
                </span>
                <span className="text-xs text-slate-500">tập trung tại 3 lỗi đầu</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                <span>Tổ 16 (Ghế điện) + Tổ 07 (May) + Tổ 04 (Mộc)</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Chi Phí Giờ Công Hao Phí</span>
                <RotateCcw className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                  ~23.7 Tr
                </span>
                <span className="text-xs text-slate-500">VNĐ</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Đơn giá: 200.000 đ/giờ thợ</span>
                <span className="text-emerald-700 font-semibold">-12% vs tuần trước</span>
              </div>
            </div>
          </div>

          {/* PARETO 80/20 ANALYSIS CHART */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-rose-600 uppercase tracking-wider block">
                  Công Cụ Kiểm Soát Chất Lượng Nâng Cao (QC 7 Tools)
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Biểu Đồ Pareto Lỗi KCS &amp; Phân Bổ Thời Gian Sửa Hàng
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Xác định 20% nhóm nguyên nhân cốt lõi gây ra 80% thời gian sửa hàng
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-rose-500 rounded-xs inline-block" />
                  <span>Số ca lỗi</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-amber-500 inline-block" />
                  <span>% Tích lũy (Đường Pareto)</span>
                </span>
              </div>
            </div>

            {/* Pareto Bars (Clickable to drill down into team schedule) */}
            <div className="space-y-4">
              {PARETO_DEFECT_DATA.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate({
                        tab: 'scheduling',
                        subView: 'DAILY_DISPATCH',
                        teamId: item.relatedTeam,
                        sourceDesc: `Phân tích Pareto 80/20: ${item.categoryName}`,
                      });
                    } else {
                      onNavigateTab('scheduling');
                    }
                  }}
                  className="space-y-1.5 text-xs p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-all border border-transparent hover:border-slate-200 group"
                  title={`Bấm để chuyển sang lịch điều phối của ${item.relatedTeam}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-400 w-5">0{idx + 1}.</span>
                      <span className="font-bold text-slate-900 group-hover:text-rose-700 transition-colors flex items-center gap-1">
                        <span>{item.categoryName}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600" />
                      </span>
                      <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded font-bold">
                        {item.relatedTeam} ↗
                      </span>
                    </div>
                    <div className="flex items-center gap-4 font-mono">
                      <span>{item.defectCount} lỗi ({item.percentage}%)</span>
                      <span className="font-bold text-rose-600">{item.reworkHours}h sửa</span>
                      <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.2 rounded">
                        Tích lũy: {item.cumulativePercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${(item.defectCount / 18) * 100}%` }}
                      className="bg-rose-500 h-full rounded-full transition-all group-hover:bg-rose-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rework hours breakdown table (Clickable rows) */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs space-y-2">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Thống Kê Chi Tiết Giờ Sửa Hàng &amp; Hành Động Khắc Phục (CAPA)
                </h3>
                <p className="text-xs text-slate-500">
                  Bấm vào từng tổ để điều chuyển trực tiếp sang lịch làm việc và phân công thợ
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">Click dòng để mở tổ ↗</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Tổ Chuyền</th>
                    <th className="py-2.5 px-3">Cụm Phân Xưởng</th>
                    <th className="py-2.5 px-2 text-center">Số Ca Lỗi</th>
                    <th className="py-2.5 px-3 text-right">Giờ Sửa Hàng</th>
                    <th className="py-2.5 px-3 text-right">Chi Phí (VNĐ)</th>
                    <th className="py-2.5 px-2 text-center">Tỷ Lệ Giờ</th>
                    <th className="py-2.5 px-3 text-center">Tác Vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {REWORK_TEAM_BREAKDOWN.map((t) => (
                    <tr
                      key={t.teamId}
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate({
                            tab: 'scheduling',
                            subView: 'DAILY_DISPATCH',
                            teamId: t.teamId,
                            sourceDesc: `Báo cáo Rework: ${t.teamName}`,
                          });
                        } else {
                          onNavigateTab('scheduling');
                        }
                      }}
                      className="hover:bg-slate-50 cursor-pointer group transition-colors"
                      title={`Bấm để mở lịch sản xuất của ${t.teamName}`}
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-900 font-sans group-hover:text-indigo-700 flex items-center gap-1.5">
                        <span>{t.teamName}</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-sans">{t.clusterName}</td>
                      <td className="py-2.5 px-2 text-center text-rose-600 font-bold">{t.totalDefects}</td>
                      <td className="py-2.5 px-3 text-right text-rose-600 font-bold">{t.reworkHours}h</td>
                      <td className="py-2.5 px-3 text-right text-slate-700">
                        {t.reworkCostVND.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-2.5 px-2 text-center">{t.reworkRatioPercent}%</td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        <span className="px-2 py-0.5 text-[10px] bg-slate-100 group-hover:bg-indigo-100 text-slate-700 group-hover:text-indigo-800 rounded font-semibold transition-colors">
                          Mở Điều Phối ↗
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CRP WORKCENTERS CAPACITY                           */}
      {/* ======================================================== */}
      {activeSection === 'CRP' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Năng Lực Khả Dụng &amp; Tải Trọng 6 Xưởng (CRP Capacity)
              </h3>
              <p className="text-xs text-slate-500">
                Định biên 95 thợ lành nghề phân bổ theo 4 cụm sản xuất DCAR Coachbuilder
              </p>
            </div>
            <div className="text-xs font-mono text-slate-600">
              Tiêu chuẩn ca: 8h/ngày · 6 ngày/tuần
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workcenters.map((wc) => (
              <div
                key={wc.workcenterId}
                className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-500">{wc.workcenterId}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      wc.status === 'OVERLOAD'
                        ? 'bg-rose-100 text-rose-800'
                        : wc.status === 'STARVATION'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {wc.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{wc.workcenterName}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Định biên: <strong>{wc.headcount} thợ lành nghề</strong>
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Mức độ lấp đầy:</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {wc.utilizationRate}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        wc.status === 'OVERLOAD'
                          ? 'bg-rose-500'
                          : wc.status === 'STARVATION'
                          ? 'bg-amber-400'
                          : 'bg-slate-900'
                      }`}
                      style={{ width: `${Math.min(100, wc.utilizationRate)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                    <span>Đã lên lịch: {wc.scheduledHours}h</span>
                    <span>Khả dụng: {wc.weeklyCapacityHours}h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
