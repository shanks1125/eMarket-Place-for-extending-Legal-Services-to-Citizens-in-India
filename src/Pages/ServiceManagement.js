
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Provider } from "@/entities/Provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ServiceManagement() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    service_name: "",
    description: "",
    price_range: ""
  });
  const [errors, setErrors] = useState({});

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);

      if (user.user_type !== "provider") {
        navigate(createPageUrl("Home"));
        return;
      }

      const providers = await Provider.filter({ user_id: user.id });
      if (providers.length > 0) {
        setProvider(providers[0]);
        setServices(providers[0].services_offered || []);
      } else {
        navigate(createPageUrl("JoinAsProvider"));
      }
    } catch (error) {
      navigate(createPageUrl("Home"));
    }
    setLoading(false);
  }, [navigate]); 

  useEffect(() => {
    loadData();
  }, [loadData]); 

  const validateService = (service) => {
    const newErrors = {};
    if (!service.service_name.trim()) newErrors.service_name = "Service name is required";
    if (!service.price_range.trim()) newErrors.price_range = "Price range is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddService = async () => {
    if (!validateService(newService)) return;

    try {
      const updatedServices = [...services, { ...newService }];
      await Provider.update(provider.id, { services_offered: updatedServices });
      setServices(updatedServices);
      setNewService({ service_name: "", description: "", price_range: "" });
      setIsAddingService(false);
      setErrors({});
    } catch (error) {
      setErrors({ submit: "Failed to add service. Please try again." });
    }
  };

  const handleEditService = async (index) => {
    if (!validateService(editingService)) return;

    try {
      const updatedServices = [...services];
      updatedServices[index] = { ...editingService };
      await Provider.update(provider.id, { services_offered: updatedServices });
      setServices(updatedServices);
      setEditingService(null);
      setErrors({});
    } catch (error) {
      setErrors({ submit: "Failed to update service. Please try again." });
    }
  };

  const handleDeleteService = async (index) => {
    try {
      const updatedServices = services.filter((_, i) => i !== index);
      await Provider.update(provider.id, { services_offered: updatedServices });
      setServices(updatedServices);
    } catch (error) {
      setErrors({ submit: "Failed to delete service. Please try again." });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p>Loading service management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Service Management</h1>
          <p className="text-gray-600">Manage the services you offer to clients</p>
        </div>

        {errors.submit && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        {/* Add Service Button */}
        <div className="mb-6">
          <Button
            onClick={() => setIsAddingService(true)}
            className="bg-slate-800 hover:bg-slate-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Service
          </Button>
        </div>

        {/* Add Service Dialog */}
        <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="service_name">Service Name *</Label>
                <Input
                  id="service_name"
                  value={newService.service_name}
                  onChange={(e) => setNewService(prev => ({ ...prev, service_name: e.target.value }))}
                  placeholder="e.g., Legal Consultation"
                  className={errors.service_name ? "border-red-500" : ""}
                />
                {errors.service_name && <p className="text-red-500 text-sm mt-1">{errors.service_name}</p>}
              </div>
              <div>
                <Label htmlFor="price_range">Price Range *</Label>
                <Input
                  id="price_range"
                  value={newService.price_range}
                  onChange={(e) => setNewService(prev => ({ ...prev, price_range: e.target.value }))}
                  placeholder="e.g., ₹5,000 - ₹10,000"
                  className={errors.price_range ? "border-red-500" : ""}
                />
                {errors.price_range && <p className="text-red-500 text-sm mt-1">{errors.price_range}</p>}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your service..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddingService(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddService} className="bg-slate-800 hover:bg-slate-700">
                  <Save className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Services List */}
        <div className="grid gap-6">
          {services.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Plus className="w-12 h-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No services yet</h3>
                <p className="text-gray-500 mb-6">Start by adding your first service to attract clients</p>
                <Button onClick={() => setIsAddingService(true)} className="bg-slate-800 hover:bg-slate-700">
                  Add Your First Service
                </Button>
              </CardContent>
            </Card>
          ) : (
            services.map((service, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {editingService && editingService.index === index ? (
                        <div className="space-y-4">
                          <Input
                            value={editingService.service_name}
                            onChange={(e) => setEditingService(prev => ({ ...prev, service_name: e.target.value }))}
                            className={errors.service_name ? "border-red-500" : ""}
                          />
                          <Input
                            value={editingService.price_range}
                            onChange={(e) => setEditingService(prev => ({ ...prev, price_range: e.target.value }))}
                            className={errors.price_range ? "border-red-500" : ""}
                          />
                          <Textarea
                            value={editingService.description}
                            onChange={(e) => setEditingService(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                          />
                        </div>
                      ) : (
                        <>
                          <CardTitle className="text-xl text-slate-800">{service.service_name}</CardTitle>
                          <p className="text-lg font-semibold text-green-600 mt-1">{service.price_range}</p>
                        </>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {editingService && editingService.index === index ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleEditService(index)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingService(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingService({ ...service, index })}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteService(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                {service.description && !(editingService && editingService.index === index) && (
                  <CardContent>
                    <p className="text-gray-700">{service.description}</p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate(createPageUrl("ProviderDashboard"))}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
