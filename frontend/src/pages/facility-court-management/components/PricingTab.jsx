import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useOwner } from '../../../context/OwnerContext';
import toast from 'react-hot-toast';

const PricingTab = ({ courts, facilityId }) => {
  const [selectedCourt, setSelectedCourt] = useState(courts?.[0]?.id || '');
  const [showAddRule, setShowAddRule] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pricingRules, setPricingRules] = useState([]);
  const [newRule, setNewRule] = useState({
    name: '',
    type: 'PEAK_HOURS',
    adjustmentType: 'PERCENTAGE',
    adjustmentValue: 20,
    applicableDays: [],
    startTime: '18:00',
    endTime: '22:00',
    startDate: '',
    endDate: '',
    active: true,
    priority: 1
  });

  const { 
    createPricingRule, 
    updatePricingRule, 
    deletePricingRule, 
    togglePricingRule, 
    getFacilityPricingRules,
    getCourtPricingRules 
  } = useOwner();

  const ruleTypes = [
    { value: 'PEAK_HOURS', label: 'Peak Hours' },
    { value: 'WEEKEND', label: 'Weekend Pricing' },
    { value: 'SEASONAL', label: 'Seasonal Pricing' },
    { value: 'HOLIDAY', label: 'Holiday Pricing' },
    { value: 'BULK_BOOKING', label: 'Bulk Booking Discount' },
    { value: 'EARLY_BIRD', label: 'Early Bird Discount' },
    { value: 'LATE_NIGHT', label: 'Late Night Pricing' }
  ];

  const adjustmentTypes = [
    { value: 'PERCENTAGE', label: 'Percentage (%)' },
    { value: 'FIXED_AMOUNT', label: 'Fixed Amount (₹)' }
  ];

  const dayOptions = [
    { value: 'MONDAY', label: 'Monday' },
    { value: 'TUESDAY', label: 'Tuesday' },
    { value: 'WEDNESDAY', label: 'Wednesday' },
    { value: 'THURSDAY', label: 'Thursday' },
    { value: 'FRIDAY', label: 'Friday' },
    { value: 'SATURDAY', label: 'Saturday' },
    { value: 'SUNDAY', label: 'Sunday' }
  ];

  const courtOptions = courts?.map(court => ({
    value: court?.id,
    label: `${court?.name} (${court?.sportType})`
  }));

  const selectedCourtData = courts?.find(court => court?.id === selectedCourt);
  const courtRules = pricingRules?.filter(rule => rule?.courtId === selectedCourt);

  // Fetch pricing rules when component mounts or facility changes
  useEffect(() => {
    if (facilityId) {
      fetchPricingRules();
    }
  }, [facilityId]);

  // Update selected court when courts change
  useEffect(() => {
    if (courts?.length > 0 && !selectedCourt) {
      setSelectedCourt(courts[0].id);
    }
  }, [courts]);

  const fetchPricingRules = async () => {
    if (!facilityId) return;
    
    setLoading(true);
    try {
      const rules = await getFacilityPricingRules(facilityId);
      setPricingRules(rules || []);
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
      toast.error('Failed to fetch pricing rules');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = async () => {
    if (!selectedCourt || !newRule.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const ruleData = {
        courtId: selectedCourt,
        name: newRule.name,
        type: newRule.type,
        adjustmentType: newRule.adjustmentType,
        adjustmentValue: parseFloat(newRule.adjustmentValue),
        applicableDays: newRule.applicableDays,
        startTime: newRule.startTime || null,
        endTime: newRule.endTime || null,
        startDate: newRule.startDate || null,
        endDate: newRule.endDate || null,
        active: newRule.active,
        priority: newRule.priority
      };

      await createPricingRule(ruleData);
      await fetchPricingRules(); // Refresh the list
      
      // Reset form
      setNewRule({
        name: '',
        type: 'PEAK_HOURS',
        adjustmentType: 'PERCENTAGE',
        adjustmentValue: 20,
        applicableDays: [],
        startTime: '18:00',
        endTime: '22:00',
        startDate: '',
        endDate: '',
        active: true,
        priority: 1
      });
      setShowAddRule(false);
    } catch (error) {
      console.error('Error creating pricing rule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRule = async (ruleId) => {
    setLoading(true);
    try {
      await togglePricingRule(ruleId);
      await fetchPricingRules(); // Refresh the list
    } catch (error) {
      console.error('Error toggling pricing rule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (!window.confirm('Are you sure you want to delete this pricing rule?')) {
      return;
    }

    setLoading(true);
    try {
      await deletePricingRule(ruleId);
      await fetchPricingRules(); // Refresh the list
    } catch (error) {
      console.error('Error deleting pricing rule:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAdjustedPrice = (basePrice, rule) => {
    if (rule?.adjustmentType === 'PERCENTAGE') {
      return basePrice + (basePrice * rule?.adjustmentValue / 100);
    } else {
      return basePrice + rule?.adjustmentValue;
    }
  };

  const getRuleIcon = (type) => {
    const icons = {
      PEAK_HOURS: 'Clock',
      WEEKEND: 'Calendar',
      SEASONAL: 'Sun',
      HOLIDAY: 'Star',
      BULK_BOOKING: 'Users',
      EARLY_BIRD: 'Sunrise',
      LATE_NIGHT: 'Moon'
    };
    return icons?.[type] || 'DollarSign';
  };

  const handleDayChange = (day, checked) => {
    setNewRule(prev => ({
      ...prev,
      applicableDays: checked 
        ? [...prev?.applicableDays, day]
        : prev?.applicableDays?.filter(d => d !== day)
    }));
  };

  if (loading && pricingRules.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
          <span className="text-foreground">Loading pricing rules...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Pricing Rules</h2>
          <p className="text-text-secondary mt-1">Configure dynamic pricing for your courts</p>
        </div>
        <Button 
          onClick={() => setShowAddRule(true)} 
          iconName="Plus" 
          iconPosition="left"
          disabled={loading}
        >
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
                  ₹{selectedCourtData?.pricePerHour}
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
              <Button 
                onClick={() => setShowAddRule(true)} 
                iconName="Plus" 
                iconPosition="left"
                disabled={loading}
              >
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
                            Adjustment: {rule?.adjustmentType === 'PERCENTAGE' ? '+' : '+₹'}
                            {rule?.adjustmentValue}{rule?.adjustmentType === 'PERCENTAGE' ? '%' : ''}
                          </span>
                        </div>
                        
                        {rule?.applicableDays?.length > 0 && (
                          <div className="text-sm text-text-secondary">
                            Days: {rule?.applicableDays?.map(day => 
                              dayOptions?.find(d => d?.value === day)?.label
                            )?.join(', ')}
                          </div>
                        )}
                        
                        {rule?.startTime && rule?.endTime && (
                          <div className="text-sm text-text-secondary">
                            Time: {rule?.startTime} - {rule?.endTime}
                          </div>
                        )}
                        
                        <div className="text-sm">
                          <span className="text-text-secondary">Adjusted Rate: </span>
                          <span className="font-semibold text-foreground">
                            ₹{calculateAdjustedPrice(selectedCourtData?.pricePerHour || 0, rule)?.toFixed(2)}/hour
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
                      disabled={loading}
                    >
                      <Icon name={rule?.active ? "Pause" : "Play"} size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRule(rule?.id)}
                      className="text-error hover:text-error"
                      disabled={loading}
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
                  disabled={loading}
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
                    value={newRule?.adjustmentType}
                    onChange={(value) => setNewRule(prev => ({
                      ...prev,
                      adjustmentType: value
                    }))}
                  />

                  <Input
                    label={`Adjustment Value ${newRule?.adjustmentType === 'PERCENTAGE' ? '(%)' : '(₹)'}`}
                    type="number"
                    value={newRule?.adjustmentValue}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      adjustmentValue: parseFloat(e?.target?.value) || 0
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
                        checked={newRule?.applicableDays?.includes(day?.value)}
                        onChange={(e) => handleDayChange(day?.value, e?.target?.checked)}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Time"
                    type="time"
                    value={newRule?.startTime}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      startTime: e?.target?.value
                    }))}
                  />

                  <Input
                    label="End Time"
                    type="time"
                    value={newRule?.endTime}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      endTime: e?.target?.value
                    }))}
                  />
                </div>

                {(newRule?.type === 'SEASONAL' || newRule?.type === 'HOLIDAY') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Start Date"
                      type="date"
                      value={newRule?.startDate}
                      onChange={(e) => setNewRule(prev => ({
                        ...prev,
                        startDate: e?.target?.value
                      }))}
                    />

                    <Input
                      label="End Date"
                      type="date"
                      value={newRule?.endDate}
                      onChange={(e) => setNewRule(prev => ({
                        ...prev,
                        endDate: e?.target?.value
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
                        <span className="ml-2 font-semibold">₹{selectedCourtData?.pricePerHour}/hour</span>
                      </div>
                      <Icon name="ArrowRight" size={16} className="text-text-secondary" />
                      <div>
                        <span className="text-sm text-text-secondary">New Rate:</span>
                        <span className="ml-2 font-semibold text-primary">
                          ₹{calculateAdjustedPrice(selectedCourtData?.pricePerHour, newRule)?.toFixed(2)}/hour
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddRule(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddRule}
                  disabled={!newRule?.name || !newRule?.type || loading}
                >
                  {loading ? 'Adding...' : 'Add Rule'}
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