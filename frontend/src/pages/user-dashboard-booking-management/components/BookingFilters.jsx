import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const BookingFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'CREATED', label: 'Created' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'COMPLETED', label: 'Completed' }
  ];

  const sportOptions = [
    { value: '', label: 'All Sports' },
    { value: 'Tennis', label: 'Tennis' },
    { value: 'Basketball', label: 'Basketball' },
    { value: 'Badminton', label: 'Badminton' },
    { value: 'Football', label: 'Football' },
    { value: 'Cricket', label: 'Cricket' },
    { value: 'Swimming', label: 'Swimming' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'venue-asc', label: 'Venue A-Z' },
    { value: 'amount-desc', label: 'Highest Amount' },
    { value: 'amount-asc', label: 'Lowest Amount' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filter Bookings</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          iconName="X"
        >
          Clear All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <Input
          type="search"
          placeholder="Search venues..."
          value={filters?.search}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
          className="w-full"
        />

        {/* Status Filter */}
        <Select
          placeholder="Filter by status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        {/* Sport Filter */}
        <Select
          placeholder="Filter by sport"
          options={sportOptions}
          value={filters?.sport}
          onChange={(value) => onFilterChange('sport', value)}
        />

        {/* Sort */}
        <Select
          placeholder="Sort by"
          options={sortOptions}
          value={filters?.sort}
          onChange={(value) => onFilterChange('sort', value)}
        />
      </div>
      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Input
          type="date"
          label="From Date"
          value={filters?.dateFrom}
          onChange={(e) => onFilterChange('dateFrom', e?.target?.value)}
        />
        <Input
          type="date"
          label="To Date"
          value={filters?.dateTo}
          onChange={(e) => onFilterChange('dateTo', e?.target?.value)}
        />
      </div>
      {/* Active Filters Display */}
      {(filters?.search || filters?.status || filters?.sport || filters?.dateFrom || filters?.dateTo) && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm font-medium text-foreground">Active Filters:</span>
          {filters?.search && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              Search: {filters?.search}
            </span>
          )}
          {filters?.status && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              Status: {filters?.status}
            </span>
          )}
          {filters?.sport && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              Sport: {filters?.sport}
            </span>
          )}
          {filters?.dateFrom && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              From: {filters?.dateFrom}
            </span>
          )}
          {filters?.dateTo && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              To: {filters?.dateTo}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingFilters;