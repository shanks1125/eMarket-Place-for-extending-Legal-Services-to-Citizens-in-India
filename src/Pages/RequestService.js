
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Provider } from "@/entities/Provider";
import { ServiceRequest } from "@/entities/ServiceRequest";
import { UploadFile } from "@/integrations/Core";
import { SendEmail } from "@/integrations/Email"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText, CheckCircle, Scale, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SERVICE_TYPES = [
  "Boundary Dispute Resolution",
  "Property Title Verification", 
  "Land Encroachment Cases",
  "Property Ownership Disputes",
  "Agricultural Land Issues",
  "Real Estate Litigation",
  "Land Acquisition Matters",
  "Property Documentation",
  "Inheritance & Succession",
  "Easement & Rights of Way",
  "Property Registration Issues",
  "Land Revenue Disputes"
];

const URGENCY_LEVELS = [
  { value: "low", label: "Low - Within a month", color: "text-green-600" },
  { value: "medium", label: "Medium - Within 2 weeks", color: "text-yellow-600" },
  { value: "high", label: "High - Within a week", color: "text-orange-600" },
  { value: "urgent", label: "Urgent - ASAP", color: "text-red-600" }
];

const BUDGET_RANGES = [
  "Under ₹5,000", "₹5,000 - ₹15,000", "₹15,000 - ₹50,000", 
  "₹50,000 - ₹1,00,000", "Above ₹1,00,000", "Open to discussion"
];

export default function RequestService() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    service_type: "",
    title: "",
    description: "",
    budget_range: "",
    urgency: "",
    preferred_communication: "whatsapp",
    customer_phone: "",
    customer_email: "",
    documents: [],
    provider_id: "" 
  });
  const [providers, setProviders] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    checkUserAuth();
    loadProviders();
    
    
    const urlParams = new URLSearchParams(window.location.search);
    const providerId = urlParams.get('provider');
    if (providerId) {
      setFormData(prev => ({ ...prev, provider_id: providerId }));
    }
  }, []);

  const checkUserAuth = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      if (user.user_type === 'provider') {
        
        return;
      }
      setFormData(prev => ({
        ...prev,
        customer_email: user.email,
        customer_phone: user.phone_number || ""
      }));
    } catch (error) {
      
    }
  };

  const loadProviders = async () => {
    try {
      const data = await Provider.filter({ verification_status: "verified" }, "-rating");
      setProviders(data);
    } catch (error) {
      console.error("Error loading providers:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setUploading(true);
      try {
        const uploadPromises = files.map(file => UploadFile({ file }));
        const results = await Promise.all(uploadPromises);
        const newDocUrls = results.map(result => result.file_url);
        
        setFormData(prev => ({
          ...prev,
          documents: [...prev.documents, ...newDocUrls]
        }));
      } catch (error) {
        console.error("Error uploading files:", error);
      }
      setUploading(false);
    }
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.service_type) newErrors.service_type = "Service type is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.budget_range) newErrors.budget_range = "Budget range is required";
    if (!formData.urgency) newErrors.urgency = "Urgency level is required";
    if (!formData.customer_email.trim()) newErrors.customer_email = "Email is required";
    if (!formData.customer_phone.trim()) newErrors.customer_phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const requestData = {
        ...formData,
        customer_id: currentUser?.id || null
      };

      
      if (!formData.provider_id) {
        delete requestData.provider_id;
      }

      await ServiceRequest.create(requestData);
      
      
      if(requestData.provider_id) {
        const provider = await Provider.get(requestData.provider_id);
        const providerUser = await User.get(provider.user_id);
        if (providerUser && providerUser.email) {
          await SendEmail({
            to: providerUser.email,
            subject: "You have a new direct service request on LegalConnect!",
            body: `Hi ${provider.business_name},<br><br>A new service request titled "<strong>${requestData.title}</strong>" has been submitted directly to you on LegalConnect.<br><br>Please log in to your provider dashboard to view the details and respond to the client.<br><br>Thank you,<br>The LegalConnect Team`
          });
        }
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting request:", error);
      setErrors({ submit: "Failed to submit request. Please try again." });
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <Card className="max-w-2xl w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Request Submitted Successfully!
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your land dispute request has been submitted. Our verified professionals will review your request 
              and reach out to you within 24 hours through your preferred communication method.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Qualified professionals will review your request</li>
                <li>• You'll receive responses via {formData.preferred_communication === 'whatsapp' ? 'WhatsApp' : 'phone/email'}</li>
                <li>• Compare proposals and choose the best professional</li>
                <li>• Get expert legal assistance for your land dispute needs</li>
              </ul>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => navigate(createPageUrl("Home"))}
                className="bg-slate-800 hover:bg-slate-700"
              >
                Back to Home
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    service_type: "",
                    title: "",
                    description: "",
                    budget_range: "",
                    urgency: "",
                    preferred_communication: "whatsapp",
                    customer_phone: currentUser?.phone_number || "",
                    customer_email: currentUser?.email || "",
                    documents: [],
                    provider_id: ""
                  });
                }}
              >
                Submit Another Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentUser && currentUser.user_type === 'provider') {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
            <Alert variant="destructive" className="max-w-xl mx-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                As a registered provider, you cannot submit service requests. This page is for customers only. You can manage your services and client requests from your Provider Dashboard.
              </AlertDescription>
              <Button onClick={() => navigate(createPageUrl("ProviderDashboard"))} className="mt-4">
                  Go to My Dashboard
              </Button>
            </Alert>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Request Land Dispute Legal Service</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Describe your land dispute needs and get connected with verified professionals across India
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Land Dispute Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="service_type">Type of Land Dispute *</Label>
                  <Select value={formData.service_type} onValueChange={(value) => handleInputChange("service_type", value)}>
                    <SelectTrigger className={errors.service_type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select dispute type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.service_type && <p className="text-red-500 text-sm mt-1">{errors.service_type}</p>}
                </div>

                <div>
                  <Label htmlFor="urgency">Urgency Level *</Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                    <SelectTrigger className={errors.urgency ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      {URGENCY_LEVELS.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          <span className={level.color}>{level.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.urgency && <p className="text-red-500 text-sm mt-1">{errors.urgency}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="title">Case Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Brief title for your land dispute case"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Provide detailed information about your land dispute, including property location, timeline, parties involved, and any specific requirements..."
                  rows={6}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <Label htmlFor="budget_range">Budget Range *</Label>
                <Select value={formData.budget_range} onValueChange={(value) => handleInputChange("budget_range", value)}>
                  <SelectTrigger className={errors.budget_range ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_RANGES.map(range => (
                      <SelectItem key={range} value={range}>{range}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.budget_range && <p className="text-red-500 text-sm mt-1">{errors.budget_range}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="customer_email">Email Address *</Label>
                  <Input
                    id="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => handleInputChange("customer_email", e.target.value)}
                    placeholder="your@email.com"
                    className={errors.customer_email ? "border-red-500" : ""}
                  />
                  {errors.customer_email && <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>}
                </div>

                <div>
                  <Label htmlFor="customer_phone">Phone Number *</Label>
                  <Input
                    id="customer_phone"
                    value={formData.customer_phone}
                    onChange={(e) => handleInputChange("customer_phone", e.target.value)}
                    placeholder="Your contact number"
                    className={errors.customer_phone ? "border-red-500" : ""}
                  />
                  {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>}
                </div>
              </div>

              <div>
                <Label>Preferred Communication Method</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.preferred_communication === "whatsapp"}
                      onCheckedChange={() => handleInputChange("preferred_communication", "whatsapp")}
                    />
                    <span>WhatsApp (Recommended)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.preferred_communication === "phone"}
                      onCheckedChange={() => handleInputChange("preferred_communication", "phone")}
                    />
                    <span>Phone Call</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.preferred_communication === "email"}
                      onCheckedChange={() => handleInputChange("preferred_communication", "email")}
                    />
                    <span>Email</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Supporting Documents (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload').click()}
                    disabled={uploading}
                    className="w-full h-20 border-2 border-dashed border-gray-300 hover:border-gray-400"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                      <p>{uploading ? "Uploading..." : "Click to upload documents"}</p>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX, Images up to 10MB each</p>
                    </div>
                  </Button>
                </div>

                {formData.documents.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Documents:</Label>
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Document {index + 1}</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(doc, '_blank')}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeDocument(index)}
                            className="text-red-600"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Provider Selection (Optional) */}
          {providers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Specific Professional (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={formData.provider_id} 
                  onValueChange={(value) => handleInputChange("provider_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a specific professional or leave blank for all professionals" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>All Professionals</SelectItem> 
                    {providers.map(provider => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.business_name} - {provider.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          <div className="text-center">
            {errors.submit && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}
            
            <Button
              type="submit"
              disabled={loading}
              className="bg-slate-800 hover:bg-slate-700 px-12 py-3 text-lg"
            >
              {loading ? "Submitting Request..." : "Submit Request"}
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              By submitting this request, you agree to be contacted by verified legal professionals.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
