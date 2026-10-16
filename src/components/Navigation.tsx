import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  FileSpreadsheet, 
  MailCheck, 
  SpellCheck,
  Flame,
  CheckCheck
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  overdueCount: number;
  acceptedQuotesCount: number;
  unrepliedEmailsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  overdueCount,
  acceptedQuotesCount,
  unrepliedEmailsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Ops Cockpit',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Central control hub'
    },
    {
      id: 'invoices',
      label: 'Invoice Tracker',
      icon: Receipt,
      badge: overdueCount > 0 ? `${overdueCount} Overdue` : null,
      badgeColor: 'bg-rose-500 text-white',
      desc: 'Track & auto-remind'
    },
    {
      id: 'quotes',
      label: 'Quotations & Proposals',
      icon: FileSpreadsheet,
      badge: acceptedQuotesCount > 0 ? `${acceptedQuotesCount} Ready to Bill` : null,
      badgeColor: 'bg-emerald-500 text-white',
      desc: 'Create & convert to invoice'
    },
    {
      id: 'emails',
      label: 'Smart Email Replies',
      icon: MailCheck,
      badge: unrepliedEmailsCount > 0 ? `${unrepliedEmailsCount}` : null,
      badgeColor: 'bg-sky-500 text-white',
      desc: 'Auto-reply assistant'
    },
    {
      id: 'proofreader',
      label: 'Grammar & Polish',
      icon: SpellCheck,
      badge: 'Zero-Error AI',
      badgeColor: 'bg-indigo-100 text-indigo-700 font-semibold',
      desc: 'Spelling & tone doctor'
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
