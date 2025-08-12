import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Image from '../../../components/AppImage';

const UserManagementPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      userType: "user",
      status: "active",
      registrationDate: "2024-12-15",
      lastLogin: "2025-01-10",
      totalBookings: 23,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      joinedDays: 27
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      userType: "owner",
      status: "active",
      registrationDate: "2024-11-20",
      lastLogin: "2025-01-11",
      totalBookings: 0,
      facilities: 2,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      phone: "+1 (555) 987-6543",
      location: "Los Angeles, CA",
      joinedDays: 52
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      email: "mike.rodriguez@email.com",
      userType: "user",
      status: "suspended",
      registrationDate: "2024-10-05",
      lastLogin: "2025-01-05",
      totalBookings: 45,
      avatar: "https://randomuser.me/api/portraits/men/56.jpg",
      phone: "+1 (555) 456-7890",
      location: "Chicago, IL",
      joinedDays: 98
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@email.com",
      userType: "user",
      status: "active",
      registrationDate: "2025-01-02",
      lastLogin: "2025-01-11",
      totalBookings: 3,
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      phone: "+1 (555) 234-5678",
      location: "Miami, FL",
      joinedDays: 9
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.wilson@email.com",
      userType: "owner",
      status: "pending",
      registrationDate: "2025-01-08",
      lastLogin: "2025-01-10",
      totalBookings: 0,
      facilities: 1,
      avatar: "https://randomuser.me/api/portraits/men/72.jpg",
      phone: "+1 (555) 345-6789",
      location: "Seattle, WA",
      joinedDays: 3
    }
  ];

  

  const userTypeOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'user', label: 'Sports Enthusiasts' },
    { value: 'owner', label: 'Facility Owners' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'pending', label: 'Pending' }
  ];

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         user?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesType = userTypeFilter === 'all' || user?.userType === userTypeFilter;
    const matchesStatus = statusFilter === 'all' || user?.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev?.includes(userId) 
        ? prev?.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers?.length === filteredUsers?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers?.map(user => user?.id));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on users:`, selectedUsers);
    setSelectedUsers([]);
  };

  const handleUserAction = (userId, action) => {
    console.log(`Performing ${action} on user ${userId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'suspended': return 'text-error bg-error/10';
      case 'pending': return 'text-warning bg-warning/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case 'user': return 'User';
      case 'owner': return 'Building2';
      default: return 'User';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">User Management</h3>
            <p className="text-sm text-text-secondary mt-1">
              {filteredUsers?.length} users found
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Input
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="sm:w-64"
            />
            <Select
              options={userTypeOptions}
              value={userTypeFilter}
              onChange={setUserTypeFilter}
              className="sm:w-40"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              className="sm:w-32"
            />
          </div>
        </div>

        {selectedUsers?.length > 0 && (
          <div className="flex items-center justify-between mt-4 p-3 bg-accent/10 rounded-lg">
            <span className="text-sm font-medium text-foreground">
              {selectedUsers?.length} users selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('activate')}
                iconName="UserCheck"
              >
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('suspend')}
                iconName="UserX"
              >
                Suspend
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('message')}
                iconName="Mail"
              >
                Message
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4">
                <Checkbox
                  checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="text-left p-4 text-sm font-medium text-foreground">User</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Type</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Activity</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Joined</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers?.map((user) => (
              <tr key={user?.id} className="hover:bg-muted/50 transition-smooth">
                <td className="p-4">
                  <Checkbox
                    checked={selectedUsers?.includes(user?.id)}
                    onChange={() => handleUserSelect(user?.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user?.name}</p>
                      <p className="text-sm text-text-secondary">{user?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name={getUserTypeIcon(user?.userType)} size={16} className="text-text-secondary" />
                    <span className="text-sm text-foreground capitalize">{user?.userType}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user?.status)}`}>
                    {user?.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    {user?.userType === 'user' ? (
                      <>
                        <p className="text-foreground">{user?.totalBookings} bookings</p>
                        <p className="text-text-secondary">Last: {user?.lastLogin}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-foreground">{user?.facilities || 0} facilities</p>
                        <p className="text-text-secondary">Last: {user?.lastLogin}</p>
                      </>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <p className="text-foreground">{user?.joinedDays} days ago</p>
                    <p className="text-text-secondary">{user?.registrationDate}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                      iconName="Eye"
                    >
                      View
                    </Button>
                    {user?.status === 'active' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUserAction(user?.id, 'suspend')}
                        iconName="UserX"
                      >
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUserAction(user?.id, 'activate')}
                        iconName="UserCheck"
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">User Details</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedUser(null)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={selectedUser?.avatar}
                    alt={selectedUser?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-foreground">{selectedUser?.name}</h4>
                  <p className="text-text-secondary">{selectedUser?.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser?.status)}`}>
                      {selectedUser?.status}
                    </span>
                    <span className="text-sm text-text-secondary capitalize">
                      {selectedUser?.userType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-foreground mb-3">Contact Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="Phone" size={16} className="text-text-secondary" />
                      <span className="text-sm text-foreground">{selectedUser?.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="MapPin" size={16} className="text-text-secondary" />
                      <span className="text-sm text-foreground">{selectedUser?.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-foreground mb-3">Account Statistics</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">Registration Date:</span>
                      <span className="text-sm text-foreground">{selectedUser?.registrationDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">Last Login:</span>
                      <span className="text-sm text-foreground">{selectedUser?.lastLogin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">
                        {selectedUser?.userType === 'user' ? 'Total Bookings:' : 'Facilities:'}
                      </span>
                      <span className="text-sm text-foreground">
                        {selectedUser?.userType === 'user' ? selectedUser?.totalBookings : selectedUser?.facilities || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
                <Button variant="outline" iconName="Mail">
                  Send Message
                </Button>
                {selectedUser?.status === 'active' ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleUserAction(selectedUser?.id, 'suspend')}
                    iconName="UserX"
                  >
                    Suspend User
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    onClick={() => handleUserAction(selectedUser?.id, 'activate')}
                    iconName="UserCheck"
                  >
                    Activate User
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPanel;