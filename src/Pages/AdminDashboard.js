import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { Provider } from "@/entities/Provider";
import { ServiceRequest } from "@/entities/ServiceRequest";
import { Review } from "@/entities/Review";
import { AuditLog } from "@/entities/AuditLog";
import { Service } from "@/entities/Service";
import { SendEmail } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Shield,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Search,
  AlertTriangle,
  Activity,
  BookUser,
  Briefcase,
  TrendingUp,
  Gift
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [providers, setProviders] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isProviderDetailsOpen, setIsProviderDetailsOpen] = useState(false);
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({ name: '', description: '' });
  const [analyticsData, setAnalyticsData] = useState({ providersByMonth: [], requestsByMonth: [] });

  const generateAnalytics = useCallback((providers, requests) => {
    const providersByMonth = {};
    const requestsByMonth = {};
    
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < 12; i++) {
        const monthKey = `${currentYear}-${String(i).padStart(2, '0')}`;
        providersByMonth[monthKey] = 0;
        requestsByMonth[monthKey] = 0;
    }

    providers.forEach(p => {
        const date = new Date(p.created_date);
        if (date.getFullYear() === currentYear) {
            const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
            if (providersByMonth[monthKey] !== undefined) providersByMonth[monthKey]++;
        }
    });

    requests.forEach(r => {
        const date = new Date(r.created_date);
        if (date.getFullYear() === currentYear) {
            const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
            if (requestsByMonth[monthKey] !== undefined) requestsByMonth[monthKey]++;
        }
    });
    
    const formattedProviders = Object.keys(providersByMonth).map((key, index) => ({
        name: monthNames[index],
        Providers: providersByMonth[key]
    }));

    const formattedRequests = Object.keys(requestsByMonth).map((key, index) => ({
        name: monthNames[index],
        Requests: requestsByMonth[key]
    }));

    setAnalyticsData({ providersByMonth: formattedProviders, requestsByMonth: formattedRequests });
  }, []);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [providersData, requestsData, reviewsData, logsData, servicesData] = await Promise.all([
        Provider.list("-created_date"),
        ServiceRequest.list("-created_date"),
        Review.list("-created_date"),
        AuditLog.list("-created_date", 50),
        Service.list("-created_date")
      ]);

      setProviders(providersData);
      setServiceRequests(requestsData);
      setReviews(reviewsData);
      setAuditLogs(logsData);
      setServices(servicesData);
      generateAnalytics(providersData, requestsData);
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
    setLoading(false);
  }, [generateAnalytics]);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const user = await User.me();
        
        if (user.email === 'shashankgowdaa11@gmail.com') {
          if (user.role !== 'admin') {
            await User.update(user.id, { role: 'admin' });
            const updatedUser = await User.me();
            setCurrentUser(updatedUser);
            await loadDashboardData();
            return;
          }
        }
        
        if (user.role !== 'admin') {
          navigate(createPageUrl("Home"));
          return;
        }
        setCurrentUser(user);
        await loadDashboardData();
      } catch (error) {
        await User.loginWithRedirect(window.location.href);
      }
    };
    checkAdminAuth();
  }, [navigate, loadDashboardData]);

  const createAuditLog = async (action, target, details = "") => {
    if (!currentUser) return;
    try {
      let targetName = "Unknown";
      if (target.name) {
        targetName = target.name;
      } else if (target.business_name) {
        targetName = target.business_name;
      } else if (target.title) {
        targetName = target.title;
      }

      await AuditLog.create({
        admin_email: currentUser.email,
        action: action,
        target_id: target.id,
        target_name: targetName,
        details: details
      });
    } catch (error) {
      console.error("Failed to create audit log:", error);
    }
  };

  const handleProviderVerification = async (provider, status, reason = "") => {
    try {
      await Provider.update(provider.id, {
        verification_status: status,
        verification_reason: reason
      });

      await createAuditLog(
        status === "verified" ? "Provider Verified" : "Provider Rejected",
        provider,
        `Reason: ${reason || "N/A"}`
      );

      const providerUser = await User.filter({ id: provider.user_id });
      if (providerUser.length > 0 && providerUser[0].email) {
        await SendEmail({
          to: providerUser[0].email,
          subject: `Your LandLaw Connect Profile has been ${status}`,
          body: `Hi ${provider.business_name},<br><br>Your provider profile on LandLaw Connect has been reviewed and its status is now: <strong>${status}</strong>.<br><br>${reason ? `Reason: ${reason}<br><br>` : ''}${status === 'verified' ? 'You can now receive service requests from clients. Congratulations!' : 'Please review your profile and make the necessary changes.'}<br><br>Thank you,<br>The LandLaw Connect Team`
        });
      }

      await loadDashboardData();
      if (isProviderDetailsOpen) setIsProviderDetailsOpen(false);
      if (isRejectDialogOpen) setIsRejectDialogOpen(false);
      setRejectionReason("");
    } catch (error) {
      console.error("Error updating provider:", error);
    }
  };

  const openRejectDialog = (provider) => {
    setSelectedProvider(provider);
    setIsRejectDialogOpen(true);
  };

  const handleProviderStatusToggle = async (provider, isActive) => {
    try {
      await Provider.update(provider.id, { is_available: isActive });
      await createAuditLog(
        isActive ? "Provider Activated" : "Provider Suspended",
        provider
      );
      await loadDashboardData();
    } catch (error) {
      console.error("Error toggling provider status:", error);
    }
  };

  const handleServiceFormChange = (e) => {
    const { name, value } = e.target;
    setServiceFormData(prev => ({ ...prev, [name]: value }));
  };

  const openServiceFormDialog = (service = null) => {
    setCurrentService(service);
    setServiceFormData(service ? { name: service.name, description: service.description } : { name: '', description: '' });
    setIsAddServiceDialogOpen(true);
  };

  const handleSaveService = async () => {
    if (!serviceFormData.name.trim()) {
      alert("Service name cannot be empty.");
      return;
    }
    try {
      if (currentService) {
        await Service.update(currentService.id, serviceFormData);
        await createAuditLog("Service Updated", { id: currentService.id, name: serviceFormData.name }, `Updated service '${currentService.name}' to '${serviceFormData.name}'`);
      } else {
        const newService = await Service.create(serviceFormData);
        await createAuditLog("Service Created", newService, `New service '${newService.name}' added`);
      }
      await loadDashboardData();
      setIsAddServiceDialogOpen(false);
      setCurrentService(null);
      setServiceFormData({ name: '', description: '' });
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service. Please try again.");
    }
  };

  const handleDeleteService = async (serviceId, serviceName) => {
    if (!window.confirm(`Are you sure you want to delete the service "${serviceName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await Service.delete(serviceId);
      await createAuditLog("Service Deleted", { id: serviceId, name: serviceName }, `Service '${serviceName}' removed`);
      await loadDashboardData();
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRequestStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProviders = providers.filter(provider =>
    provider.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.provider_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalProviders: providers.length,
    verifiedProviders: providers.filter(p => p.verification_status === "verified").length,
    pendingProviders: providers.filter(p => p.verification_status === "pending").length,
    totalRequests: serviceRequests.length,
    activeRequests: serviceRequests.filter(r => ["pending", "accepted", "in_progress"].includes(r.status)).length,
    completedRequests: serviceRequests.filter(r => r.status === "completed").length,
    totalReviews: reviews.length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You need admin privileges to access this dashboard.
            </p>
            <Button onClick={() => navigate(createPageUrl("Home"))}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-gray-600">Manage providers, requests, and platform operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Providers</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.totalProviders}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Verification</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.pendingProviders}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Requests</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.activeRequests}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.totalReviews}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="providers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
          </TabsList>

          {/* Provider Management */}
          <TabsContent value="providers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Provider Management ({filteredProviders.length})
                  </CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        placeholder="Search providers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredProviders.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No providers found</h3>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProviders.map((provider) => (
                      <Card key={provider.id} className="border">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-lg">{provider.business_name}</h3>
                                <Badge className={getStatusColor(provider.verification_status)}>
                                  {provider.verification_status}
                                </Badge>
                                {!provider.is_available && (
                                  <Badge variant="outline" className="text-red-600">
                                    Suspended
                                  </Badge>
                                )}
                              </div>

                              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                                <div>Type: <span className="font-medium capitalize">{provider.provider_type}</span></div>
                                <div>Location: <span className="font-medium">{provider.city}, {provider.state}</span></div>
                                <div>Experience: <span className="font-medium">{provider.experience_years} years</span></div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-3">
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

                              <div className="text-xs text-gray-500">
                                Registered: {new Date(provider.created_date).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              {provider.verification_status === "pending" && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleProviderVerification(provider, "verified")}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Verify
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => openRejectDialog(provider)}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => { setSelectedProvider(provider); setIsProviderDetailsOpen(true); }}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Details
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleProviderStatusToggle(provider, !provider.is_available)}
                                  className={provider.is_available ? "text-red-600" : "text-green-600"}
                                >
                                  {provider.is_available ? (
                                    <>
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Suspend
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Activate
                                    </>
                                  )}
                                </Button>
                              </div>
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

          {/* Service Requests */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Service Requests ({serviceRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {serviceRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No service requests yet</h3>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {serviceRequests.slice(0, 20).map((request) => (
                      <Card key={request.id} className="border">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold">{request.title}</h3>
                                <Badge className={getRequestStatusColor(request.status)}>
                                  {request.status}
                                </Badge>
                              </div>

                              <p className="text-gray-600 text-sm mb-3">{request.description}</p>

                              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
                                <div>Service: <span className="font-medium">{request.service_type}</span></div>
                                <div>Budget: <span className="font-medium">{request.budget_range}</span></div>
                                <div>Urgency: <span className="font-medium capitalize">{request.urgency}</span></div>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>📧 {request.customer_email}</span>
                                <span>📱 {request.customer_phone}</span>
                                <span>📅 {new Date(request.created_date).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View Full
                              </Button>
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

          {/* Reviews */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Reviews ({reviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No reviews yet</h3>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.slice(0, 20).map((review) => (
                      <Card key={review.id} className="border">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span key={i} className={`text-lg ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="font-semibold">{review.rating}/5</span>
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

          {/* Service Management */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Service Management ({services.length})
                  </CardTitle>
                  <Button onClick={() => openServiceFormDialog()}>
                    Add New Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No services defined yet.</h3>
                    <p className="text-gray-500">Define services that providers can offer and clients can request.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <Card key={service.id} className="border">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-lg">{service.name}</h4>
                            {service.description && (
                              <p className="text-sm text-gray-600">{service.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => openServiceFormDialog(service)}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteService(service.id, service.name)}>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookUser className="w-5 h-5" />
                  Admin Activity Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {auditLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <BookUser className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600">No admin activity recorded yet.</h3>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {auditLogs.map(log => (
                      <div key={log.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{log.action}</p>
                          <p className="text-sm text-gray-600">
                            Target: <span className="font-medium">{log.target_name}</span> ({log.target_id})
                          </p>
                          {log.details && (
                            <p className="text-sm text-gray-500 mt-1">Details: {log.details}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">
                            Performed by: <span className="font-medium">{log.admin_email}</span>
                          </p>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          {new Date(log.created_date).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Provider Details Dialog */}
        <Dialog open={isProviderDetailsOpen} onOpenChange={setIsProviderDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-start">
                {selectedProvider?.business_name}
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogTitle>
              {selectedProvider && (
                <div className="flex gap-2 mt-2">
                  <Badge className={getStatusColor(selectedProvider.verification_status)}>
                    {selectedProvider.verification_status}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {selectedProvider.provider_type}
                  </Badge>
                </div>
              )}
            </DialogHeader>
            <div className="space-y-6 py-4">
              {selectedProvider && (
                <>
                  <div>
                    <h3 className="font-semibold mb-2">Professional Bio</h3>
                    <p className="text-gray-700">{selectedProvider.bio}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>Phone: {selectedProvider.phone_number}</div>
                      <div>WhatsApp: {selectedProvider.whatsapp_number || "Not provided"}</div>
                      <div>City: {selectedProvider.city}</div>
                      <div>State: {selectedProvider.state}</div>
                    </div>
                    {selectedProvider.office_address && (
                      <div className="mt-2 text-sm">
                        <strong>Address:</strong> {selectedProvider.office_address}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Professional Details</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {selectedProvider.license_number && (
                        <div>License Number: {selectedProvider.license_number}</div>
                      )}
                      <div>Experience: {selectedProvider.experience_years} years</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Qualifications</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedProvider.qualifications?.map((qual, index) => (
                        <li key={index} className="text-sm">{qual}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProvider.specializations?.map((spec, index) => (
                        <Badge key={index} variant="outline">{spec}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Services Offered</h3>
                    <div className="space-y-2">
                      {selectedProvider.services_offered?.map((service, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{service.service_name}</h4>
                              {service.description && (
                                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                              )}
                            </div>
                            <span className="text-green-600 font-medium">{service.price_range}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Verification Documents</h3>
                    <div className="space-y-2">
                      {selectedProvider.verification_documents?.map((doc, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded">
                          <span className="text-sm">Document {index + 1}</span>
                          <Button size="sm" variant="outline" onClick={() => window.open(doc, '_blank')}>
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedProvider.verification_status === "pending" && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-4">Admin Actions</h3>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleProviderVerification(selectedProvider, "verified")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Verify Provider
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            openRejectDialog(selectedProvider);
                            setIsProviderDetailsOpen(false);
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Provider
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Rejection Reason Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Provider Profile</DialogTitle>
              <DialogDescription>
                Provide a reason for rejecting "{selectedProvider?.business_name}". This will be sent to the provider.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="e.g., Verification documents are unclear or missing. Please upload valid proof of license."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => handleProviderVerification(selectedProvider, "rejected", rejectionReason)}
                disabled={!rejectionReason.trim()}
              >
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Service Dialog */}
        <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentService ? "Edit Service" : "Add New Service"}</DialogTitle>
              <DialogDescription>
                {currentService ? "Update the details for this service." : "Enter the details for the new service."}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <Input
                name="name"
                placeholder="Service Name (e.g., Family Law, Contract Drafting)"
                value={serviceFormData.name}
                onChange={handleServiceFormChange}
              />
              <Textarea
                name="description"
                placeholder="Brief description of the service"
                value={serviceFormData.description}
                onChange={handleServiceFormChange}
                rows={3}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSaveService} disabled={!serviceFormData.name.trim()}>
                {currentService ? "Save Changes" : "Add Service"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}