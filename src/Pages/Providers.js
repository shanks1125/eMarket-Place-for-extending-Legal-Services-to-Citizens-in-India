import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Provider } from "@/entities/Provider";
import { Search, Filter, Star, MapPin, Users, CheckCircle, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");

  useEffect(() => {
    loadProviders();
    
   
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, []);

  useEffect(() => {
    filterProviders();
  }, [providers, searchQuery, selectedCity, selectedType, selectedSpecialization]);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const data = await Provider.filter({ verification_status: "verified" }, "-rating");
      setProviders(data);
    } catch (error) {
      console.error("Error loading providers:", error);
    }
    setLoading(false);
  };

  const filterProviders = () => {
    let filtered = providers;

    if (searchQuery) {
      filtered = filtered.filter(provider => 
        provider.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.specializations?.some(spec => 
          spec.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        provider.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCity !== "all") {
      filtered = filtered.filter(provider => provider.city === selectedCity);
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(provider => provider.provider_type === selectedType);
    }

    if (selectedSpecialization !== "all") {
      filtered = filtered.filter(provider => 
        provider.specializations?.includes(selectedSpecialization)
      );
    }

    setFilteredProviders(filtered);
  };

  const getUniqueValues = (field) => {
    return [...new Set(providers.map(provider => provider[field]).filter(Boolean))];
  };

  const getUniqueSpecializations = () => {
    const allSpecs = providers.flatMap(provider => provider.specializations || []);
    return [...new Set(allSpecs)];
  };

  const handleWhatsAppContact = (provider) => {
    const message = `Hello ${provider.business_name}, I found your profile on LegalConnect and would like to inquire about your legal services.`;
    const phoneNumber = provider.whatsapp_number || provider.phone_number;
    const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Find Legal Professionals
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse verified advocates, brokers, and paralegals across India
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                <Input
                  type="text"
                  placeholder="Search by name, specialization, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* City Filter */}
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {getUniqueValues('city').map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Provider Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="advocate">Advocate</SelectItem>
                <SelectItem value="broker">Broker</SelectItem>
                <SelectItem value="paralegal">Paralegal</SelectItem>
              </SelectContent>
            </Select>

            {/* Specialization Filter */}
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {getUniqueSpecializations().map(spec => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">
            {loading ? "Loading..." : `${filteredProviders.length} Providers Found`}
          </h2>
        </div>

        {/* Providers Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredProviders.map((provider) => (
              <Card key={provider.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                        {provider.profile_photo ? (
                          <img 
                            src={provider.profile_photo} 
                            alt={provider.business_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-current" />
                      <span className="font-semibold text-slate-800">{provider.rating || 5}</span>
                      <span className="text-gray-500 text-sm">({provider.total_reviews || 0})</span>
                    </div>
                  </div>

                  {/* Provider Info */}
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{provider.business_name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Badge variant="outline" className="text-xs capitalize">
                        {provider.provider_type}
                      </Badge>
                      <span className="text-sm">{provider.experience_years} years exp.</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{provider.city}, {provider.state}</span>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {provider.specializations?.slice(0, 3).map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {provider.specializations?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{provider.specializations.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {provider.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {provider.bio.substring(0, 120)}...
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link to={createPageUrl(`ProviderProfile?id=${provider.id}`)} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                    
                    {(provider.whatsapp_number || provider.phone_number) && (
                      <Button 
                        onClick={() => handleWhatsAppContact(provider)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-800">{provider.total_cases || 0}</div>
                      <div className="text-xs text-gray-500">Cases Handled</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">₹{provider.total_incentives || 0}</div>
                      <div className="text-xs text-gray-500">Earned</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* No Results */}
        {!loading && filteredProviders.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No providers found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria</p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCity("all");
                setSelectedType("all");
                setSelectedSpecialization("all");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}