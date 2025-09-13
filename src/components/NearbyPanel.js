'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, MapPin, Info, X, Star, Clock, DollarSign, ExternalLink } from 'lucide-react';
import { Button, Card, Badge, Icon } from '@/components/ui';
import { searchPlaces, searchPlacesMulti } from '@/utils/placeSearch';
import { suggestPlaceQueries } from '@/utils/geminiSuggest';
import { needsLocation } from '@/utils/iconUtils';

const NearbyPanel = ({ 
  isOpen, 
  onClose, 
  onAddActivity,
  userLocation,
  selectedDay,
  activityContext = null // New prop for activity context
}) => {
  // State management
  const [places, setPlaces] = useState([]);
  const [placeQuery, setPlaceQuery] = useState('restaurants coffee parks');
  const [isLoading, setIsLoading] = useState(false);
  const [useAISuggestions, setUseAISuggestions] = useState(true); // Enable AI by default
  const [searchRadius, setSearchRadius] = useState(50000); // 50km default for better results
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Search for places
  const searchPlacesNearby = useCallback(async (query, forceRefresh = false) => {
    if (!query.trim()) return;
    
    // Don't search again if it's the same query and not forced
    if (!forceRefresh && query === lastSearchQuery && places.length > 0) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setLastSearchQuery(query);

    try {
      let searchQueries = [query];
      
      // Use AI suggestions if enabled
      if (useAISuggestions) {
        const suggestions = await suggestPlaceQueries({
          seed: query,
          budget: 'any',
          context: `Searching near ${userLocation ? 'current location' : 'area'}`,
          location: userLocation
        });
        if (suggestions.length > 0) {
          searchQueries = suggestions.slice(0, 5); // Limit to 5 queries
        }
      }

      // Search with multiple queries for better results
      const searchPromises = searchQueries.map(searchQuery => 
        searchPlacesMulti({
          seedQuery: searchQuery,
          latitude: userLocation?.latitude,
          longitude: userLocation?.longitude,
          limit: 10,
          radiusMeters: searchRadius
        })
      );

      const results = await Promise.all(searchPromises);
      const allPlaces = results.flat();
      
      // Remove duplicates and sort by distance
      const uniquePlaces = allPlaces.filter((place, index, self) => 
        index === self.findIndex(p => p.id === place.id)
      ).sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0));

      setPlaces(uniquePlaces.slice(0, 20)); // Limit to 20 results
      setHasSearched(true);
    } catch (err) {
      console.error('Error searching places:', err);
      setError('Failed to search places. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [lastSearchQuery, places.length, useAISuggestions, searchRadius, userLocation]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (placeQuery.trim()) {
      searchPlacesNearby(placeQuery.trim(), true);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    if (lastSearchQuery) {
      searchPlacesNearby(lastSearchQuery, true);
    }
  };

  // Generate smart search query based on activity context
  const generateSmartQuery = (activity) => {
    if (!activity) return 'restaurants coffee parks';
    
    const name = activity.name?.toLowerCase() || '';
    const category = activity.category?.toLowerCase() || '';
    
    // Map activities to relevant place types
    const activityToPlaces = {
      'brunch': 'brunch restaurants breakfast cafes brunch spots morning cafes',
      'breakfast': 'breakfast restaurants cafes diners morning spots',
      'lunch': 'restaurants lunch spots cafes lunch restaurants',
      'dinner': 'restaurants dinner fine dining dinner spots',
      'coffee': 'coffee shops cafes espresso bars coffee houses',
      'drinks': 'bars pubs lounges cocktail bars wine bars',
      'hiking': 'hiking trails nature parks outdoor recreation hiking areas',
      'walking': 'parks walking trails scenic routes nature walks',
      'shopping': 'shopping malls retail stores boutiques shopping centers',
      'movies': 'movie theaters cinemas entertainment film theaters',
      'gym': 'gyms fitness centers sports facilities workout centers',
      'spa': 'spas massage therapy wellness centers beauty salons',
      'museum': 'museums art galleries cultural centers art centers',
      'park': 'parks gardens green spaces public parks',
      'beach': 'beaches waterfronts lakes water activities',
      'gaming': 'gaming cafes arcades board game cafes game centers',
      'social': 'social venues meeting places community centers',
      'creative': 'art galleries creative spaces art centers cultural venues',
      'wellness': 'wellness centers spas fitness centers health clubs',
      'entertainment': 'entertainment venues theaters fun activities',
      'outdoor': 'outdoor activities nature spots parks outdoor venues'
    };
    
    // Check for exact matches first
    for (const [key, places] of Object.entries(activityToPlaces)) {
      if (name.includes(key) || category.includes(key)) {
        return places;
      }
    }
    
    // Fallback to category-based mapping
    const categoryToPlaces = {
      'food': 'restaurants cafes food places',
      'outdoor': 'parks outdoor recreation nature',
      'entertainment': 'entertainment venues theaters',
      'relaxation': 'spas wellness centers',
      'social': 'bars cafes social venues',
      'creative': 'art galleries creative spaces',
      'errands': 'shopping stores services'
    };
    
    return categoryToPlaces[category] || `${name} places`;
  };

  // Auto-search when panel opens or activity context changes
  useEffect(() => {
    if (isOpen) {
      if (activityContext) {
        const smartQuery = generateSmartQuery(activityContext);
        setPlaceQuery(smartQuery);
        searchPlacesNearby(smartQuery, true);
      } else if (placeQuery && !hasSearched) {
        searchPlacesNearby(placeQuery, true);
      }
    }
  }, [isOpen, activityContext, hasSearched, placeQuery, searchPlacesNearby]);

  // Handle add activity
  const handleAddActivity = (place) => {
    const activity = {
      id: `place_${place.id}_${Date.now()}`,
      name: place.name,
      category: 'entertainment', // Default category for places
      duration: 120, // Default 2 hours
      description: place.displayName,
      location: place.address?.formatted || place.displayName,
      rating: place.rating,
      priceLevel: place.priceLevel,
      url: place.url,
      isPlace: true,
      placeId: place.id
    };

    // Prompt for time
    const timeInput = prompt('Add at what time? (HH:MM, e.g., 09:00, 14:30)');
    if (!timeInput) return;
    
    const timeRegex = /^([0-1]?\d|2[0-3]):[0-5]\d$/;
    if (!timeRegex.test(timeInput.trim())) {
      alert('Please enter a valid time in HH:MM 24-hour format.');
      return;
    }

    onAddActivity?.(activity, timeInput.trim());
  };

  // Get price level display
  const getPriceLevelDisplay = (priceLevel) => {
    if (priceLevel == null) return null;
    return '$'.repeat(Math.max(1, priceLevel));
  };

  // Get activity icon based on place type
  const getPlaceIcon = (place) => {
    // For places that don't need location, use info icon
    if (!place.lat || !place.lon) {
      return <Info size={16} className="text-blue-500" />;
    }
    
    // For places with location, use map pin
    return <MapPin size={16} className="text-red-500" />;
  };

  // Get category color
  const getCategoryColor = (place) => {
    const type = place.type?.toLowerCase() || '';
    if (type.includes('restaurant') || type.includes('food')) return 'coral';
    if (type.includes('park') || type.includes('outdoor')) return 'green';
    if (type.includes('entertainment') || type.includes('movie')) return 'purple';
    if (type.includes('shopping') || type.includes('store')) return 'blue';
    if (type.includes('museum') || type.includes('art')) return 'orange';
    return 'gray';
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Search size={24} />
              Nearby Places
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={placeQuery}
                  onChange={(e) => setPlaceQuery(e.target.value)}
                  placeholder="Search for places (e.g., coffee, restaurants, parks)..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading || !placeQuery.trim()}
                className="px-6"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search size={16} />
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading || !lastSearchQuery}
                className="px-3"
                title="Refresh search"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              </Button>
            </div>

          </form>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[60vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Searching for places...</p>
              </div>
            </div>
          ) : places.length === 0 && lastSearchQuery ? (
            <div className="text-center py-12">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No places found</p>
              <p className="text-gray-400 text-sm">Try a different search term or adjust your filters</p>
            </div>
          ) : places.length === 0 && !hasSearched ? (
            <div className="text-center py-12">
              <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">Searching for nearby places...</p>
              <p className="text-gray-400 text-sm">Finding restaurants, coffee shops, and parks near you</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>Found {places.length} places</span>
                <span>Adding to {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</span>
              </div>

              <div className="grid gap-4">
                <AnimatePresence>
                  {places.map((place, index) => (
                    <motion.div
                      key={place.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getPlaceIcon(place)}
                              <h3 className="font-semibold text-gray-800">{place.name}</h3>
                              {place.priceLevel != null && (
                                <Badge variant="outline" className="text-xs">
                                  <DollarSign size={12} className="mr-1" />
                                  {getPriceLevelDisplay(place.priceLevel)}
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">{place.displayName}</p>
                            
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                              {place.distanceMeters != null && (
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} />
                                  {(place.distanceMeters / 1000).toFixed(1)} km
                                </span>
                              )}
                              {place.rating != null && (
                                <span className="flex items-center gap-1">
                                  <Star size={12} className="text-yellow-500" />
                                  {place.rating.toFixed(1)}
                                  {place.userRatingsTotal && ` (${place.userRatingsTotal})`}
                                </span>
                              )}
                              {place.openNow != null && (
                                <span className={`flex items-center gap-1 ${
                                  place.openNow ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  <Clock size={12} />
                                  {place.openNow ? 'Open now' : 'Closed'}
                                </span>
                              )}
                            </div>

                            {place.url && (
                              <a
                                href={place.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-coral-600 hover:text-coral-700 hover:underline"
                              >
                                <ExternalLink size={12} />
                                View on map
                              </a>
                            )}
                          </div>

                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAddActivity(place)}
                            className="ml-4 flex-shrink-0"
                          >
                            Add
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NearbyPanel;
