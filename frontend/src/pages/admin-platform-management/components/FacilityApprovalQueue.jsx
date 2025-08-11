import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const FacilityApprovalQueue = () => {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [approvalComment, setApprovalComment] = useState('');

  const pendingFacilities = [
    {
      id: 1,
      name: "Elite Sports Complex",
      owner: "John Smith",
      ownerEmail: "john.smith@email.com",
      location: "Downtown Sports District, New York",
      submittedDate: "2025-01-08",
      sports: ["Tennis", "Basketball", "Swimming"],
      courts: 8,
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
      ],
      amenities: ["Parking", "Locker Rooms", "Cafeteria", "Pro Shop"],
      description: `Elite Sports Complex is a state-of-the-art facility featuring modern courts and premium amenities. The complex includes professional-grade tennis courts with LED lighting, indoor basketball courts with maple flooring, and an Olympic-size swimming pool.\n\nOur facility is designed to cater to both recreational players and professional athletes, with dedicated training areas and equipment rental services.`,
      documents: [
        { name: "Business License", status: "verified" },
        { name: "Insurance Certificate", status: "verified" },
        { name: "Safety Inspection", status: "pending" },
        { name: "Zoning Permit", status: "verified" }
      ],
      pricing: {
        tennis: "$45/hour",
        basketball: "$35/hour",
        swimming: "$25/hour"
      }
    },
    {
      id: 2,
      name: "Community Recreation Center",
      owner: "Sarah Johnson",
      ownerEmail: "sarah.johnson@email.com",
      location: "Westside Community, Los Angeles",
      submittedDate: "2025-01-09",
      sports: ["Badminton", "Table Tennis", "Yoga"],
      courts: 4,
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800"
      ],
      amenities: ["Parking", "Locker Rooms", "Equipment Rental"],
      description: `Community Recreation Center focuses on providing affordable sports facilities for local residents. Our facility features well-maintained badminton courts, table tennis areas, and dedicated spaces for yoga and fitness classes.\n\nWe pride ourselves on creating an inclusive environment where people of all ages and skill levels can enjoy sports and fitness activities.`,
      documents: [
        { name: "Business License", status: "verified" },
        { name: "Insurance Certificate", status: "pending" },
        { name: "Safety Inspection", status: "verified" },
        { name: "Zoning Permit", status: "verified" }
      ],
      pricing: {
        badminton: "$20/hour",
        tabletennis: "$15/hour",
        yoga: "$12/session"
      }
    },
    {
      id: 3,
      name: "Premier Football Academy",
      owner: "Mike Rodriguez",
      ownerEmail: "mike.rodriguez@email.com",
      location: "Sports Valley, Chicago",
      submittedDate: "2025-01-10",
      sports: ["Football", "Soccer Training"],
      courts: 3,
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
      ],
      amenities: ["Parking", "Training Equipment", "Medical Room"],
      description: `Premier Football Academy specializes in professional football training with regulation-size fields and advanced training equipment. Our facility is designed for serious athletes looking to improve their skills.\n\nWe offer both individual training sessions and group coaching programs with certified trainers.`,
      documents: [
        { name: "Business License", status: "verified" },
        { name: "Insurance Certificate", status: "verified" },
        { name: "Safety Inspection", status: "verified" },
        { name: "Zoning Permit", status: "pending" }
      ],
      pricing: {
        football: "$60/hour",
        training: "$40/session"
      }
    }
  ];

  const handleApprove = (facilityId) => {
    console.log(`Approving facility ${facilityId} with comment: ${approvalComment}`);
    setSelectedFacility(null);
    setApprovalComment('');
  };

  const handleReject = (facilityId) => {
    console.log(`Rejecting facility ${facilityId} with comment: ${approvalComment}`);
    setSelectedFacility(null);
    setApprovalComment('');
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'rejected': return 'text-error bg-error/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Facility Approval Queue</h3>
            <p className="text-sm text-text-secondary mt-1">
              {pendingFacilities?.length} facilities awaiting review
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Filter">
              Filter
            </Button>
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {pendingFacilities?.map((facility) => (
          <div key={facility?.id} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={facility?.images?.[0]}
                      alt={facility?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{facility?.name}</h4>
                        <p className="text-sm text-text-secondary">{facility?.location}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-text-secondary">
                          <span>Owner: {facility?.owner}</span>
                          <span>•</span>
                          <span>Submitted: {facility?.submittedDate}</span>
                          <span>•</span>
                          <span>{facility?.courts} courts</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFacility(facility)}
                          iconName="Eye"
                        >
                          Review
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApprove(facility?.id)}
                          iconName="Check"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(facility?.id)}
                          iconName="X"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {facility?.sports?.map((sport) => (
                        <span
                          key={sport}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Detailed Review Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">
                  Review: {selectedFacility?.name}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFacility(null)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-text-secondary">Facility Name</label>
                    <p className="font-medium text-foreground">{selectedFacility?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary">Owner</label>
                    <p className="font-medium text-foreground">{selectedFacility?.owner}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary">Email</label>
                    <p className="font-medium text-foreground">{selectedFacility?.ownerEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary">Location</label>
                    <p className="font-medium text-foreground">{selectedFacility?.location}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Description</h4>
                <p className="text-text-secondary whitespace-pre-line">{selectedFacility?.description}</p>
              </div>

              {/* Images */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Facility Images</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedFacility?.images?.map((image, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={image}
                        alt={`${selectedFacility?.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Documentation Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedFacility?.documents?.map((doc) => (
                    <div key={doc?.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium text-foreground">{doc?.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentStatusColor(doc?.status)}`}>
                        {doc?.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities & Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3">Amenities</h4>
                  <div className="space-y-2">
                    {selectedFacility?.amenities?.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Icon name="Check" size={16} className="text-success" />
                        <span className="text-text-secondary">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-3">Pricing</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedFacility?.pricing)?.map(([sport, price]) => (
                      <div key={sport} className="flex items-center justify-between">
                        <span className="text-text-secondary capitalize">{sport}</span>
                        <span className="font-medium text-foreground">{price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment Section */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Review Comment
                </label>
                <textarea
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e?.target?.value)}
                  placeholder="Add your review comments here..."
                  className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setSelectedFacility(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedFacility?.id)}
                  iconName="X"
                >
                  Reject
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleApprove(selectedFacility?.id)}
                  iconName="Check"
                >
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityApprovalQueue;