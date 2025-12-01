import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Provider } from "@/entities/Provider";
import { Search, Shield, Award, Clock, ArrowRight, Star, Users, CheckCircle, Scale, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProviders, setFeaturedProviders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadFeaturedProviders();
    checkCurrentUser();
  }, []);

  const loadFeaturedProviders = async () => {
    try {
      const providers = await Provider.filter({ verification_status: "verified" }, "-rating", 3);
      setFeaturedProviders(providers);
    } catch (error) {
      console.error("Error loading featured providers:", error);
    }
  };

  const checkCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = createPageUrl(`Providers?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              India's Premier
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500 block">
                Land Dispute Legal Platform
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect with verified advocates specializing in land disputes, property rights, 
              and real estate litigation. Get expert legal assistance for boundary disputes, 
              title issues, and property matters across India.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for land dispute advocates by location or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full h-14 pl-6 pr-32 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-xl shadow-2xl"
                />
                <Button 
                  onClick={handleSearch}
                  className="absolute right-2 top-2 h-10 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Providers")}>
                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-3 text-lg font-semibold rounded-xl h-auto">
                  Find Land Dispute Advocates
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link to={createPageUrl("JoinAsProvider")}>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3 text-lg font-semibold rounded-xl h-auto">
                  Join as Land Dispute Lawyer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">200+</div>
              <div className="text-gray-600 font-medium">Land Dispute Advocates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">5K+</div>
              <div className="text-gray-600 font-medium">Property Cases Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">4.8</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">28</div>
              <div className="text-gray-600 font-medium">States Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Land Dispute Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Land Dispute Legal Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive legal assistance for all types of property and land matters
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Boundary Disputes</h3>
                <p className="text-gray-600 leading-relaxed">
                  Resolution of property boundary conflicts, encroachment issues, and territorial disputes between neighbors.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Title & Ownership Issues</h3>
                <p className="text-gray-600 leading-relaxed">
                  Legal assistance for property title verification, ownership disputes, and documentation issues.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Scale className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Property Litigation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Court representation for property suits, land acquisition matters, and real estate litigation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      {featuredProviders.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                Top Land Dispute Advocates
              </h2>
              <p className="text-xl text-gray-600">
                Connect with India's most experienced property law experts
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredProviders.map((provider) => (
                <Card key={provider.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-48 bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center">
                      {provider.profile_photo ? (
                        <img 
                          src={provider.profile_photo} 
                          alt={provider.business_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="w-20 h-20 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                          <span className="font-semibold text-slate-800">{provider.rating || 5}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{provider.business_name}</h3>
                      <p className="text-gray-600 mb-2">Land Dispute Specialist</p>
                      <p className="text-sm text-gray-500 mb-4">{provider.city}, {provider.state}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {provider.specializations?.slice(0, 2).map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      
                      <Link to={createPageUrl(`ProviderProfile?id=${provider.id}`)}>
                        <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">
                          View Profile
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Need Help with Your Land Dispute?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Get expert legal guidance from experienced property law advocates
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("RequestService")}>
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-3 text-lg font-semibold rounded-xl h-auto">
                Get Legal Help Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to={createPageUrl("Blog")}>
              <Button variant="outline" className="border-2 border-gray-300 text-white hover:bg-white hover:text-slate-900 px-8 py-3 text-lg font-semibold rounded-xl h-auto">
                Learn About Land Laws
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}