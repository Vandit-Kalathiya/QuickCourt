import React, { useEffect, useState, useCallback } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Image from "../../../components/AppImage";
import { useAdmin } from "context/AdminContext";

const FacilityApprovalQueue = () => {
  const { getFacilityRequests } = useAdmin();
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [approvalComment, setApprovalComment] = useState("");
  const [pendingFacilities, setPendingFacilities] = useState([]);

  // Fetch facilities
  const fetchPendingFacilities = useCallback(async () => {
    try {
      const response = await getFacilityRequests();
      setPendingFacilities(response?.content || []);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      setPendingFacilities([]);
    }
  }, [getFacilityRequests]);

  useEffect(() => {
    fetchPendingFacilities();
  }, [fetchPendingFacilities]);

  const handleApprove = async (facilityId) => {
    try {
      console.log(`Approving ${facilityId} with comment: ${approvalComment}`);
      // await approveFacilityAPI(facilityId, approvalComment);
      await fetchPendingFacilities();
      resetSelection();
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  const handleReject = async (facilityId) => {
    try {
      console.log(`Rejecting ${facilityId} with comment: ${approvalComment}`);
      // await rejectFacilityAPI(facilityId, approvalComment);
      await fetchPendingFacilities();
      resetSelection();
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  const resetSelection = () => {
    setSelectedFacility(null);
    setApprovalComment("");
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "text-success bg-success/10";
      case "pending":
        return "text-warning bg-warning/10";
      case "rejected":
        return "text-error bg-error/10";
      default:
        return "text-text-secondary bg-muted";
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Facility Approval Queue
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            {pendingFacilities.length} facilities awaiting review
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

      {/* Facility list */}
      <div className="divide-y divide-border">
        {pendingFacilities.map((facility) => (
          <div key={facility?.id} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1 flex gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {facility?.photos?.[0] ? (
                    <Image
                      src={`http://localhost:7000/uploads${facility.photos[0]}`}
                      alt={facility?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{facility?.name}</h4>
                  <p className="text-sm text-text-secondary">
                    {facility?.location}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2 text-sm text-text-secondary">
                    <span>Owner: {facility?.owner}</span>
                    <span>•</span>
                    <span>Submitted: {facility?.submittedDate}</span>
                    <span>•</span>
                    <span>{facility?.courts} courts</span>
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

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Eye"
                  onClick={() => setSelectedFacility(facility)}
                >
                  Review
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  iconName="Check"
                  onClick={() => handleApprove(facility?.id)}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  iconName="X"
                  onClick={() => handleReject(facility?.id)}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Review: {selectedFacility?.name}
              </h3>
              <Button variant="ghost" size="icon" onClick={resetSelection}>
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  label="Facility Name"
                  value={selectedFacility?.name}
                />
                <InfoItem label="Owner" value={selectedFacility?.ownerName} />
                <InfoItem label="Email" value={selectedFacility?.ownerEmail} />
                <InfoItem label="Location" value={selectedFacility?.address} />
              </div>

              {/* Description */}
              {selectedFacility?.description && (
                <Section title="Description">
                  <p className="text-text-secondary whitespace-pre-line">
                    {selectedFacility.description}
                  </p>
                </Section>
              )}

              {/* Images */}
              {selectedFacility?.images?.length > 0 && (
                <Section title="Facility Images">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedFacility.images.map((img, i) => (
                      <div
                        key={i}
                        className="aspect-video rounded-lg overflow-hidden bg-muted"
                      >
                        <Image
                          src={img}
                          alt={`${selectedFacility?.name} - ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Documents */}
              {selectedFacility?.documents?.length > 0 && (
                <Section title="Documentation Status">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedFacility.documents.map((doc) => (
                      <div
                        key={doc?.name}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <span className="font-medium">{doc?.name}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentStatusColor(
                            doc?.status
                          )}`}
                        >
                          {doc?.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Amenities */}
              {selectedFacility?.amenities?.length > 0 && (
                <Section title="Amenities">
                  {selectedFacility.amenities.map((a) => (
                    <div key={a} className="flex items-center space-x-2">
                      <Icon name="Check" size={16} className="text-success" />
                      <span>{a}</span>
                    </div>
                  ))}
                </Section>
              )}

              {/* Pricing */}
              {selectedFacility?.pricing &&
                Object.keys(selectedFacility.pricing).length > 0 && (
                  <Section title="Pricing">
                    {Object.entries(selectedFacility.pricing).map(
                      ([sport, price]) => (
                        <div key={sport} className="flex justify-between">
                          <span className="capitalize">{sport}</span>
                          <span className="font-medium">{price}</span>
                        </div>
                      )
                    )}
                  </Section>
                )}

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Review Comment
                </label>
                <textarea
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="Add your review comments..."
                  className="w-full h-24 px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={resetSelection}>
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

// Small helper components for cleaner JSX
const Section = ({ title, children }) => (
  <div>
    <h4 className="font-medium mb-3">{title}</h4>
    {children}
  </div>
);

const InfoItem = ({ label, value }) => (
  <div>
    <label className="text-sm text-text-secondary">{label}</label>
    <p className="font-medium">{value || "—"}</p>
  </div>
);

export default FacilityApprovalQueue;