
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Provider } from "@/entities/Provider";
import { ServiceRequest } from "@/entities/ServiceRequest";
import { Review } from "@/entities/Review";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User as UserIcon, 
  Star, 
  DollarSign, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Edit,
  MessageCircle,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ProviderDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [providerProfile, setProviderProfile] = useState(null);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      if (user.user_type === "provider") {
        const providers = await Provider.filter({ user_id: user.id });
        if (providers.length > 0) {
          setProviderProfile(providers[0]);
          
    
          const requests = await ServiceRequest.filter({ provider_id: providers[0].id }, "-created_date");
          setServiceRequests(requests);

          
          const providerReviews = await Review.filter({ provider_id: providers[0].id }, "-created_date");
          setReviews(providerReviews);
        }
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
    setLoading(false);
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      let updateData = {};
      if (action === "accept") {
        updateData = { status: "accepted", accepted_at: new Date().toISOString() };
      } else if (action === "complete") {
        updateData = { status: "completed", completed_at: new Date().toISOString() };
      } else if (action === "cancel") {
        updateData = { status: "cancelled" };
      }

      await ServiceRequest.update(requestId, updateData);
      loadDashboardData(); 
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.user_type !== "provider" || !providerProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Provider Access Required</h2>
            <p className="text-gray-600 mb-4">
              You need to complete your provider registration to access this dashboard.
            </p>
            <Button 
              onClick={() => window.location.href = "/join-as-provider"}
              className="bg-slate-800 hover:bg-slate-700"
            >
              Complete Registration
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Provider Dashboard</h1>
              <p className="text-gray-600">Welcome back, {providerProfile.business_name}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className={`${
                providerProfile.verification_status === "verified" ? "bg-green-100 text-green-800" :
                providerProfile.verification_status === "pending" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
                {providerProfile.verification_status === "verified" && <CheckCircle className="w-3 h-3 mr-1" />}
                {providerProfile.verification_status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                {providerProfile.verification_status === "rejected" && <AlertCircle className="w-3 h-3 mr-1" />}
                {providerProfile.verification_status}
              </Badge>
              
              <Link to={createPageUrl("EditProviderProfile")}>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-slate-800">{serviceRequests.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed Cases</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {serviceRequests.filter(r => r.status === "completed").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-slate-800">{providerProfile.rating || 5}.0</p>
                </div>
                <Star className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-slate-800">₹{providerProfile.total_incentives || 0}</p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="profile">Profile Overview</TabsTrigger>
          </TabsList>

          {/* Service Requests */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Service Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {serviceRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No requests yet</h3>
                    <p className="text-gray-500">Your service requests will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {serviceRequests.map((request) => (
                      <Card key={request.id} className="border">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{request.title}</h3>
                              <p className="text-gray-600 mb-3">{request.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="outline">{request.service_type}</Badge>
                                <Badge variant="outline">{request.urgency} priority</Badge>
                                <Badge variant="outline">{request.budget_range}</Badge>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>📧 {request.customer_email}</span>
                                <span>📱 {request.customer_phone}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-3">
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                              
                              <div className="flex gap-2">
                                {request.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleRequestAction(request.id, "accept")}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleRequestAction(request.id, "cancel")}
                                    >
                                      Decline
                                    </Button>
                                  </>
                                )}
                                
                                {request.status === "accepted" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleRequestAction(request.id, "complete")}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    Mark Complete
                                  </Button>
                                )}

                                {(request.customer_phone || request.customer_email) && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      if (request.customer_phone) {
                                        const message = `Hello! I'm responding to your legal service request: ${request.title}`;
                                        window.open(`https://wa.me/91${request.customer_phone}?text=${encodeURIComponent(message)}`, '_blank');
                                      }
                                    }}
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-400">
                            Requested on {new Date(request.created_date).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Client Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No reviews yet</h3>
                    <p className="text-gray-500">Complete your first case to receive reviews</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id} className="border">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 font-medium">{review.rating}/5</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_date).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {review.comment && (
                            <p className="text-gray-700 mb-3">{review.comment}</p>
                          )}
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Service Quality:</span>
                              <div className="font-medium">{review.service_quality}/5</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Communication:</span>
                              <div className="font-medium">{review.communication}/5</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Timeliness:</span>
                              <div className="font-medium">{review.timeliness}/5</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Overview */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Business Name</label>
                      <p className="text-lg font-semibold">{providerProfile.business_name}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bio</label>
                      <p className="text-gray-700">{providerProfile.bio}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Experience</label>
                        <p>{providerProfile.experience_years} years</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Location</label>
                        <p>{providerProfile.city}, {providerProfile.state}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Specializations</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {providerProfile.specializations?.map((spec, index) => (
                          <Badge key={index} variant="outline">{spec}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Services Offered</label>
                      <div className="space-y-2 mt-1">
                        {providerProfile.services_offered?.map((service, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{service.service_name}</h4>
                                <p className="text-sm text-gray-600">{service.description}</p>
                              </div>
                              <span className="text-green-600 font-medium">{service.price_range}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Performance Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Cases</span>
                      <span className="font-bold">{providerProfile.total_cases || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate</span>
                      <span className="font-bold text-green-600">95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time</span>
                      <span className="font-bold">2 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Client Satisfaction</span>
                      <span className="font-bold text-blue-600">4.8/5</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Update Profile
                    </Button>
                    <Button className="w-full" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      View Public Profile
                    </Button>
                    <Button className="w-full" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
