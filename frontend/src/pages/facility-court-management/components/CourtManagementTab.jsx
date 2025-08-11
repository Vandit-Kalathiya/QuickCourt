import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CourtManagementTab = ({ courts, onCourtUpdate, onCourtAdd, onCourtDelete }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [newCourt, setNewCourt] = useState({
    name: '',
    sportType: '',
    hourlyRate: '',
    operatingHours: {
      start: '06:00',
      end: '22:00'
    },
    description: ''
  });

  const sportTypes = [
    { value: 'tennis', label: 'Tennis' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'badminton', label: 'Badminton' },
    { value: 'squash', label: 'Squash' },
    { value: 'volleyball', label: 'Volleyball' },
    { value: 'football', label: 'Football' },
    { value: 'cricket', label: 'Cricket' }
  ];

  const handleAddCourt = () => {
    const courtData = {
      id: Date.now(),
      ...newCourt,
      hourlyRate: parseFloat(newCourt?.hourlyRate),
      status: 'active',
      createdAt: new Date()?.toISOString()
    };
    
    onCourtAdd(courtData);
    setNewCourt({
      name: '',
      sportType: '',
      hourlyRate: '',
      operatingHours: { start: '06:00', end: '22:00' },
      description: ''
    });
    setShowAddModal(false);
  };

  const handleEditCourt = (court) => {
    setEditingCourt({ ...court });
  };

  const handleSaveEdit = () => {
    onCourtUpdate(editingCourt);
    setEditingCourt(null);
  };

  const handleDeleteCourt = (courtId) => {
    if (window.confirm('Are you sure you want to delete this court? This action cannot be undone.')) {
      onCourtDelete(courtId);
    }
  };

  const getSportIcon = (sportType) => {
    const icons = {
      tennis: 'Zap',
      basketball: 'Circle',
      badminton: 'Zap',
      squash: 'Square',
      volleyball: 'Circle',
      football: 'Circle',
      cricket: 'Circle'
    };
    return icons?.[sportType] || 'Activity';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Court Management</h2>
          <p className="text-text-secondary mt-1">Manage your courts and pricing</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} iconName="Plus" iconPosition="left">
          Add New Court
        </Button>
      </div>
      {/* Courts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courts?.map((court) => (
          <div key={court?.id} className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={getSportIcon(court?.sportType)} size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{court?.name}</h3>
                  <p className="text-sm text-text-secondary capitalize">{court?.sportType}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditCourt(court)}
                >
                  <Icon name="Edit" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCourt(court?.id)}
                  className="text-error hover:text-error"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Hourly Rate</span>
                <span className="font-semibold text-foreground">${court?.hourlyRate}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Operating Hours</span>
                <span className="text-sm text-foreground">
                  {court?.operatingHours?.start} - {court?.operatingHours?.end}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Status</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  court?.status === 'active' ?'bg-success/10 text-success' :'bg-error/10 text-error'
                }`}>
                  {court?.status}
                </span>
              </div>

              {court?.description && (
                <p className="text-sm text-text-secondary mt-3 pt-3 border-t border-border">
                  {court?.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Add Court Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Add New Court</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddModal(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Court Name"
                  type="text"
                  value={newCourt?.name}
                  onChange={(e) => setNewCourt(prev => ({ ...prev, name: e?.target?.value }))}
                  placeholder="e.g., Court A, Tennis Court 1"
                  required
                />

                <Select
                  label="Sport Type"
                  options={sportTypes}
                  value={newCourt?.sportType}
                  onChange={(value) => setNewCourt(prev => ({ ...prev, sportType: value }))}
                  placeholder="Select sport type"
                  required
                />

                <Input
                  label="Hourly Rate ($)"
                  type="number"
                  value={newCourt?.hourlyRate}
                  onChange={(e) => setNewCourt(prev => ({ ...prev, hourlyRate: e?.target?.value }))}
                  placeholder="25.00"
                  min="0"
                  step="0.01"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Opening Time"
                    type="time"
                    value={newCourt?.operatingHours?.start}
                    onChange={(e) => setNewCourt(prev => ({
                      ...prev,
                      operatingHours: { ...prev?.operatingHours, start: e?.target?.value }
                    }))}
                    required
                  />
                  
                  <Input
                    label="Closing Time"
                    type="time"
                    value={newCourt?.operatingHours?.end}
                    onChange={(e) => setNewCourt(prev => ({
                      ...prev,
                      operatingHours: { ...prev?.operatingHours, end: e?.target?.value }
                    }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description (Optional)</label>
                  <textarea
                    value={newCourt?.description}
                    onChange={(e) => setNewCourt(prev => ({ ...prev, description: e?.target?.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Additional details about this court..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddCourt}
                  disabled={!newCourt?.name || !newCourt?.sportType || !newCourt?.hourlyRate}
                >
                  Add Court
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Court Modal */}
      {editingCourt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Edit Court</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingCourt(null)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Court Name"
                  type="text"
                  value={editingCourt?.name}
                  onChange={(e) => setEditingCourt(prev => ({ ...prev, name: e?.target?.value }))}
                  required
                />

                <Select
                  label="Sport Type"
                  options={sportTypes}
                  value={editingCourt?.sportType}
                  onChange={(value) => setEditingCourt(prev => ({ ...prev, sportType: value }))}
                  required
                />

                <Input
                  label="Hourly Rate ($)"
                  type="number"
                  value={editingCourt?.hourlyRate}
                  onChange={(e) => setEditingCourt(prev => ({ ...prev, hourlyRate: parseFloat(e?.target?.value) }))}
                  min="0"
                  step="0.01"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Opening Time"
                    type="time"
                    value={editingCourt?.operatingHours?.start}
                    onChange={(e) => setEditingCourt(prev => ({
                      ...prev,
                      operatingHours: { ...prev?.operatingHours, start: e?.target?.value }
                    }))}
                    required
                  />
                  
                  <Input
                    label="Closing Time"
                    type="time"
                    value={editingCourt?.operatingHours?.end}
                    onChange={(e) => setEditingCourt(prev => ({
                      ...prev,
                      operatingHours: { ...prev?.operatingHours, end: e?.target?.value }
                    }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    value={editingCourt?.description || ''}
                    onChange={(e) => setEditingCourt(prev => ({ ...prev, description: e?.target?.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Additional details about this court..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setEditingCourt(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtManagementTab;