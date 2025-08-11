import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    accent: 'bg-accent/10 text-accent border-accent/20'
  };

  const gradientClasses = {
    primary: 'from-primary/5 to-transparent',
    success: 'from-success/5 to-transparent',
    warning: 'from-warning/5 to-transparent',
    accent: 'from-accent/5 to-transparent'
  };

  return (
    <div className={`bg-gradient-to-br ${gradientClasses[color]} bg-card border border-border rounded-xl p-6 shadow-subtle hover:shadow-medium transition-all duration-300 group`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-2 tracking-wide uppercase">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-1 tracking-tight">{value}</p>
          {trend && (
            <div className="flex items-center mt-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${trend === 'up' ? 'bg-success/10' : 'bg-error/10'}`}>
                <Icon 
                  name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  size={14} 
                  className={trend === 'up' ? 'text-success' : 'text-error'} 
                />
              </div>
              <span className={`text-sm font-semibold ${trend === 'up' ? 'text-success' : 'text-error'}`}>
                {trendValue}
              </span>
              <span className="text-xs text-text-secondary ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorClasses?.[color]} group-hover:scale-105 transition-transform duration-200 shadow-sm`}>
          <Icon name={icon} size={26} />
        </div>
      </div>
    </div>
  );
};

export default QuickStatsCard;
