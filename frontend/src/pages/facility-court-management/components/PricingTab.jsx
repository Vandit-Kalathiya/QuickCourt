import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PricingTab = ({ courts, pricingRules, onPricingUpdate }) => {
  const [selectedCourt, setSelectedCourt] = useState(courts?.[0]?.id || '');
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    type: 'peak_hours',
    conditions: {
      days: [],
      timeStart: '18:00',
      timeEnd: '22:00',
      dateStart: '',
      dateEnd: ''
    },
    adjustment: {
      type: 'percentage',
      value: 20
    },
    active: true
  });

  const ruleTypes = [
    { value: 'peak_hours', label: 'Peak Hours' },
    { value: 'weekend', label: 'Weekend Pricing' },
    { value: 'seasonal', label: 'Seasonal Pricing' },
    { value: 'holiday', label: 'Holiday Pricing' },
    { value: 'bulk_booking', label: 'Bulk Booking Discount' }
  ];

  const adjustmentTypes = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed Amount ($)' }
  ];

  const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const courtOptions = courts?.map(court => ({
    value: court?.id,
    label: `${court?.name} (${court?.sportType})`
  }));

  const selectedCourtData = courts?.find(court => court?.id === selectedCourt);
  const courtRules = pricingRules?.filter(rule => rule?.courtId === selectedCourt);

  const handleAddRule = () => {
    const ruleData = {
      id: Date.now(),
      courtId: selectedCourt,
      ...newRule,
      createdAt: new Date()?.toISOString()
    };
    
    onPricingUpdate([...pricingRules, ruleData]);
    setNewRule({
      name: '',
      type: 'peak_hours',
      conditions: {
        days: [],
        timeStart: '18:00',
        timeEnd: '22:00',
        dateStart: '',
        dateEnd: ''
      },
      adjustment: {
        type: 'percentage',
        value: 20
      },
      active: true
    });
    setShowAddRule(false);
  };

  const handleToggleRule = (ruleId) => {
    const updatedRules = pricingRules?.map(rule =>
      rule?.id === ruleId ? { ...rule, active: !rule?.active } : rule
    );
    onPricingUpdate(updatedRules);
  };

  const handleDeleteRule = (ruleId) => {
    if (window.confirm('Are you sure you want to delete this pricing rule?')) {
      const updatedRules = pricingRules?.filter(rule => rule?.id !== ruleId);
      onPricingUpdate(updatedRules);
    }
  };

  const calculateAdjustedPrice = (basePrice, rule) => {
    if (rule?.adjustment?.type === 'percentage') {
      return basePrice + (basePrice * rule?.adjustment?.value / 100);
    } else {
      return basePrice + rule?.adjustment?.value;
    }
  };

  const getRuleIcon = (type) => {
    const icons = {
      peak_hours: 'Clock',
      weekend: 'Calendar',
      seasonal: 'Sun',
      holiday: 'Star',
      bulk_booking: 'Users'
    };
    return icons?.[type] || 'DollarSign';
  };

  const handleDayChange = (day, checked) => {
    setNewRule(prev => ({
      ...prev,
      conditions: {
        ...prev?.conditions,
        days: checked 
          ? [...prev?.conditions?.days, day]
          : prev?.conditions?.days?.filter(d => d !== day)
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Pricing Rules</h2>
          <p className="text-text-secondary mt-1">Configure dynamic pricing for your courts</p>
        </div>
        <Button onClick={() => setShowAddRule(true)} iconName="Plus" iconPosition="left">
          Add Pricing Rule
        </Button>
      </div>
      {/* Court Selection */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Select Court"
            options={courtOptions}
            value={selectedCourt}
            onChange={setSelectedCourt}
          />
          
          {selectedCourtData && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Base Rate</label>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-semibold text-foreground">
                  ${selectedCourtData?.hourlyRate}
                </span>
                <span className="text-text-secondary">/hour</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Active Rules */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">Active Pricing Rules</h3>
          <p className="text-sm text-text-secondary mt-1">
            {courtRules?.length} rule{courtRules?.length !== 1 ? 's' : ''} configured for this court
          </p>
        </div>

        <div className="divide-y divide-border">
          {courtRules?.length === 0 ? (
            <div className="p-8 text-center">
              <Icon name="DollarSign" size={48} className="text-text-secondary mx-auto mb-4" />
              <h4 className="font-medium text-foreground mb-2">No pricing rules configured</h4>
              <p className="text-text-secondary mb-4">Add pricing rules to implement dynamic pricing</p>
              <Button onClick={() => setShowAddRule(true)} iconName="Plus" iconPosition="left">
                Add First Rule
              </Button>
            </div>
          ) : (
            courtRules?.map((rule) => (
              <div key={rule?.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={getRuleIcon(rule?.type)} size={20} className="text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-foreground">{rule?.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          rule?.active 
                            ? 'bg-success/10 text-success' :'bg-muted text-text-secondary'
                        }`}>
                          {rule?.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4 text-sm text-text-secondary">
                          <span>Type: {ruleTypes?.find(t => t?.value === rule?.type)?.label}</span>
                          <span>
                            Adjustment: {rule?.adjustment?.type === 'percentage' ? '+' : '$'}
                            {rule?.adjustment?.value}{rule?.adjustment?.type === 'percentage' ? '%' : ''}
                          </span>
                        </div>
                        
                        {rule?.conditions?.days?.length > 0 && (
                          <div className="text-sm text-text-secondary">
                            Days: {rule?.conditions?.days?.map(day => 
                              dayOptions?.find(d => d?.value === day)?.label
                            )?.join(', ')}
                          </div>
                        )}
                        
                        {rule?.conditions?.timeStart && rule?.conditions?.timeEnd && (
                          <div className="text-sm text-text-secondary">
                            Time: {rule?.conditions?.timeStart} - {rule?.conditions?.timeEnd}
                          </div>
                        )}
                        
                        <div className="text-sm">
                          <span className="text-text-secondary">Adjusted Rate: </span>
                          <span className="font-semibold text-foreground">
                            ${calculateAdjustedPrice(selectedCourtData?.hourlyRate || 0, rule)?.toFixed(2)}/hour
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleRule(rule?.id)}
                    >
                      <Icon name={rule?.active ? "Pause" : "Play"} size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRule(rule?.id)}
                      className="text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Add Rule Modal */}
      {showAddRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Add Pricing Rule</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddRule(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Rule Name"
                    type="text"
                    value={newRule?.name}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e?.target?.value }))}
                    placeholder="e.g., Evening Peak Hours"
                    required
                  />

                  <Select
                    label="Rule Type"
                    options={ruleTypes}
                    value={newRule?.type}
                    onChange={(value) => setNewRule(prev => ({ ...prev, type: value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Adjustment Type"
                    options={adjustmentTypes}
                    value={newRule?.adjustment?.type}
                    onChange={(value) => setNewRule(prev => ({
                      ...prev,
                      adjustment: { ...prev?.adjustment, type: value }
                    }))}
                  />

                  <Input
                    label={`Adjustment Value ${newRule?.adjustment?.type === 'percentage' ? '(%)' : '($)'}`}
                    type="number"
                    value={newRule?.adjustment?.value}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      adjustment: { ...prev?.adjustment, value: parseFloat(e?.target?.value) }
                    }))}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Applicable Days
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {dayOptions?.map((day) => (
                      <Checkbox
                        key={day?.value}
                        label={day?.label}
                        checked={newRule?.conditions?.days?.includes(day?.value)}
                        onChange={(e) => handleDayChange(day?.value, e?.target?.checked)}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Time"
                    type="time"
                    value={newRule?.conditions?.timeStart}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      conditions: { ...prev?.conditions, timeStart: e?.target?.value }
                    }))}
                  />

                  <Input
                    label="End Time"
                    type="time"
                    value={newRule?.conditions?.timeEnd}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      conditions: { ...prev?.conditions, timeEnd: e?.target?.value }
                    }))}
                  />
                </div>

                {(newRule?.type === 'seasonal' || newRule?.type === 'holiday') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Start Date"
                      type="date"
                      value={newRule?.conditions?.dateStart}
                      onChange={(e) => setNewRule(prev => ({
                        ...prev,
                        conditions: { ...prev?.conditions, dateStart: e?.target?.value }
                      }))}
                    />

                    <Input
                      label="End Date"
                      type="date"
                      value={newRule?.conditions?.dateEnd}
                      onChange={(e) => setNewRule(prev => ({
                        ...prev,
                        conditions: { ...prev?.conditions, dateEnd: e?.target?.value }
                      }))}
                    />
                  </div>
                )}

                {selectedCourtData && (
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Price Preview</h4>
                    <div className="flex items-center space-x-4">
                      <div>
                        <span className="text-sm text-text-secondary">Base Rate:</span>
                        <span className="ml-2 font-semibold">${selectedCourtData?.hourlyRate}/hour</span>
                      </div>
                      <Icon name="ArrowRight" size={16} className="text-text-secondary" />
                      <div>
                        <span className="text-sm text-text-secondary">New Rate:</span>
                        <span className="ml-2 font-semibold text-primary">
                          ${calculateAdjustedPrice(selectedCourtData?.hourlyRate, newRule)?.toFixed(2)}/hour
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowAddRule(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddRule}
                  disabled={!newRule?.name || !newRule?.type}
                >
                  Add Rule
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingTab;