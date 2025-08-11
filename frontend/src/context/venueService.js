// src/services/venueService.js
import api from './api';

export const venueService = {
    // Get all approved facilities - matches VenueController.getFacilities()
    getFacilities: async (sports = [], name = '', page = 0, size = 12) => {
        try {
            const params = {
                page,
                size
            };

            // Add sports filter if provided
            if (sports && sports.length > 0) {
                params.sports = sports.join(',');
            }

            // Add name filter if provided
            if (name && name.trim()) {
                params.name = name.trim();
            }

            const response = await api.get('/venues', { params });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch venues');
        }
    },

    // Get facility by ID - matches VenueController.getFacility()
    getFacilityById: async (id) => {
        try {
            const response = await api.get(`/venues/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch venue details');
        }
    },

    // Get facility reviews - matches VenueController.getFacilityReviews()
    getFacilityReviews: async (id, page = 0, size = 10) => {
        try {
            const params = { page, size };
            const response = await api.get(`/venues/${id}/reviews`, { params });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
        }
    }
};
