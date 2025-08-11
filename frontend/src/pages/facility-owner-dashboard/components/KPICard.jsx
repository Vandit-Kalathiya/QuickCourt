import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary/10 text-primary border-primary/20',
      success: 'bg-success/10 text-success border-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      accent: 'bg-accent/10 text-accent border-accent/20'
    };
    return colors?.[color] || colors?.primary;
  };

  const getGradientClasses = (color) => {
    const gradients = {
      primary: 'from-primary/5 to-transparent',
      success: 'from-success/5 to-transparent',
      warning: 'from-warning/5 to-transparent',
      accent: 'from-accent/5 to-transparent'
    };
    return gradients?.[color] || gradients?.primary;
  };

  const getChangeColor = (type) => {
    if (type === 'positive') return 'text-success';
    if (type === 'negative') return 'text-error';
    return 'text-text-secondary';
  };

  const getChangeIcon = (type) => {
    if (type === 'positive') return 'TrendingUp';
    if (type === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className={`bg-gradient-to-br ${getGradientClasses(color)} bg-card border border-border/50 rounded-xl p-6 shadow-subtle hover:shadow-medium transition-all duration-300 group`}>
      <div className="flex items-center justify-between mb-5">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${getColorClasses(color)} group-hover:scale-105 transition-transform duration-200 shadow-sm`}>
          <Icon name={icon} size={26} />
        </div>
        {change && (
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full bg-card/50 border border-border/50 ${getChangeColor(changeType)}`}>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${changeType === 'positive' ? 'bg-success/10' : changeType === 'negative' ? 'bg-error/10' : 'bg-muted/50'}`}>
              <Icon 
                name={getChangeIcon(changeType)}
                size={12} 
              />
            </div>
            <span className="text-sm font-semibold">{change}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-foreground mb-2 tracking-tight">{value}</h3>
        <p className="text-text-secondary text-sm font-medium uppercase tracking-wide">{title}</p>
        {change && (
          <p className="text-xs text-text-secondary mt-2 opacity-75">vs last period</p>
        )}
      </div>
    </div>
  );
};

export default KPICard;
