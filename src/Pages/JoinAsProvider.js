
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Provider } from "@/entities/Provider";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle, AlertCircle, User as UserIcon, FileText, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
];

const LEGAL_SPECIALIZATIONS = [
  "Civil Law", "Criminal Law", "Corporate Law", "Family Law", "Property Law", "Labour Law",
  "Tax Law", "Immigration Law", "Intellectual Property", "Banking Law", "Insurance Law",
  "Consumer Law", "Environmental Law", "Human Rights", "Cyber Law", "Constitutional Law"
];

export default function JoinAsProvider() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    provider_type: "",
    business_name: "",
    license_number: "",
    bio: "",
    phone_number: "",
    whatsapp_number: "",
    office_address: "",
    city: "",
    state: "",
    experience_years: "",
    qualifications: [],
    specializations: [],
    services_offered: [],
    profile_photo: "",
    verification_documents: []
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [errors, setErrors] = useState({});
  const [newQualification, setNewQualification] = useState("");
  const [newService, setNewService] = useState({ service_name: "", description: "", price_range: "" });

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        
        
        const providers = await Provider.filter({ user_id: user.id });
        if (providers.length > 0) {
          navigate(createPageUrl("ProviderDashboard"));
          return;
        }

      } catch (error) {
        
        await User.loginWithRedirect(window.location.href);
      }
    };
    checkUserAuth();
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleArrayAdd = (field, value) => {
    if (field === "services_offered") {
      if (value.service_name && value.service_name.trim() && value.price_range && value.price_range.trim()) {
        setFormData(prev => ({
          ...prev,
          [field]: [...prev[field], { 
            service_name: value.service_name.trim(),
            description: value.description?.trim() || "",
            price_range: value.price_range.trim()
          }]
        }));
        return true;
      }
      return false;
    } else {
      if (value && value.trim()) {
        setFormData(prev => ({
          ...prev,
          [field]: [...prev[field], value.trim()]
        }));
        return true;
      }
      return false;
    }
  };

  const handleArrayRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSpecializationToggle = (specialization) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadingPhoto(true);
      try {
        const { file_url } = await UploadFile({ file });
        handleInputChange("profile_photo", file_url);
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
      setUploadingPhoto(false);
    }
  };

  const handleDocumentUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setUploadingDocs(true);
      try {
        const uploadPromises = files.map(file => UploadFile({ file }));
        const results = await Promise.all(uploadPromises);
        const newDocUrls = results.map(result => result.file_url);
        
        setFormData(prev => ({
          ...prev,
          verification_documents: [...prev.verification_documents, ...newDocUrls]
        }));
      } catch (error) {
        console.error("Error uploading documents:", error);
      }
      setUploadingDocs(false);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.provider_type) newErrors.provider_type = "Provider type is required";
      
      if (formData.provider_type === 'advocate' && !formData.license_number.trim()) newErrors.license_number = "License number is required for advocates";
      if (!formData.business_name.trim()) newErrors.business_name = "Business name is required";
      if (!formData.phone_number.trim()) newErrors.phone_number = "Phone number is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
    }

    if (step === 2) {
      if (!formData.bio.trim()) newErrors.bio = "Professional bio is required";
      if (!formData.experience_years || formData.experience_years < 0) newErrors.experience_years = "Valid experience years required";
      if (formData.qualifications.length === 0) newErrors.qualifications = "At least one qualification is required";
      if (formData.specializations.length === 0) newErrors.specializations = "At least one specialization is required";
    }

    if (step === 3) {
      if (formData.services_offered.length === 0) newErrors.services_offered = "At least one service is required";
    }

    if (step === 4) {
      
      if (formData.verification_documents.length === 0) newErrors.verification_documents = "At least one verification document is required (e.g., ID, Bar Council Certificate).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    try {
      
      await User.updateMyUserData({ user_type: "provider" });

      
      await Provider.create({
        ...formData,
        user_id: currentUser.id,
        experience_years: parseInt(formData.experience_years),
        verification_status: "pending"
      });

      navigate(createPageUrl("ProviderDashboard"));
    } catch (error) {
      console.error("Error creating provider profile:", error);
      setErrors({ submit: "Failed to create profile. Please try again." });
    }
    setLoading(false);
  };

  const getStepIcon = (step) => {
    if (step < currentStep) return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (step === currentStep) return <div className="w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold">{step}</div>;
    return <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">{step}</div>;
  };

  if (!currentUser) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Join as Legal Provider</h1>
          <p className="text-gray-600">Complete your profile to start receiving client requests</p>
        </div>

        {/* Progress Indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {getStepIcon(1)}
              <span className={`ml-2 ${currentStep >= 1 ? 'text-slate-800 font-medium' : 'text-gray-500'}`}>
                Basic Info
              </span>
            </div>
            <div className="flex-1 mx-4 h-1 bg-gray-200 rounded">
              <div className={`h-1 rounded transition-all duration-300 ${currentStep > 1 ? 'bg-green-500 w-full' : 'bg-gray-200 w-0'}`} />
            </div>
            <div className="flex items-center">
              {getStepIcon(2)}
              <span className={`ml-2 ${currentStep >= 2 ? 'text-slate-800 font-medium' : 'text-gray-500'}`}>
                Professional Details
              </span>
            </div>
            <div className="flex-1 mx-4 h-1 bg-gray-200 rounded">
              <div className={`h-1 rounded transition-all duration-300 ${currentStep > 2 ? 'bg-green-500 w-full' : 'bg-gray-200 w-0'}`} />
            </div>
            <div className="flex items-center">
              {getStepIcon(3)}
              <span className={`ml-2 ${currentStep >= 3 ? 'text-slate-800 font-medium' : 'text-gray-500'}`}>
                Services
              </span>
            </div>
            <div className="flex-1 mx-4 h-1 bg-gray-200 rounded">
              <div className={`h-1 rounded transition-all duration-300 ${currentStep > 3 ? 'bg-green-500 w-full' : 'bg-gray-200 w-0'}`} />
            </div>
            <div className="flex items-center">
              {getStepIcon(4)}
              <span className={`ml-2 ${currentStep >= 4 ? 'text-slate-800 font-medium' : 'text-gray-500'}`}>
                Verification
              </span>
            </div>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <UserIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Basic Information</h2>
                  <p className="text-gray-600">Let's start with your basic details</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="provider_type">Provider Type *</Label>
                    <Select value={formData.provider_type} onValueChange={(value) => handleInputChange("provider_type", value)}>
                      <SelectTrigger className={errors.provider_type ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select provider type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="advocate">Advocate</SelectItem>
                        <SelectItem value="broker">Broker</SelectItem>
                        <SelectItem value="paralegal">Paralegal</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.provider_type && <p className="text-red-500 text-sm mt-1">{errors.provider_type}</p>}
                  </div>

                  <div>
                    <Label htmlFor="business_name">Business/Professional Name *</Label>
                    <Input
                      id="business_name"
                      value={formData.business_name}
                      onChange={(e) => handleInputChange("business_name", e.target.value)}
                      placeholder="Your firm name or professional name"
                      className={errors.business_name ? "border-red-500" : ""}
                    />
                    {errors.business_name && <p className="text-red-500 text-sm mt-1">{errors.business_name}</p>}
                  </div>
                  
                  {formData.provider_type === 'advocate' && (
                    <div className="md:col-span-2">
                        <Label htmlFor="license_number">Bar Council / License Number *</Label>
                        <Input
                          id="license_number"
                          value={formData.license_number}
                          onChange={(e) => handleInputChange("license_number", e.target.value)}
                          placeholder="e.g., MAH/1234/2023"
                          className={errors.license_number ? "border-red-500" : ""}
                        />
                        {errors.license_number && <p className="text-red-500 text-sm mt-1">{errors.license_number}</p>}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="phone_number">Phone Number *</Label>
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange("phone_number", e.target.value)}
                      placeholder="Your contact number"
                      className={errors.phone_number ? "border-red-500" : ""}
                    />
                    {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                  </div>

                  <div>
                    <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                    <Input
                      id="whatsapp_number"
                      value={formData.whatsapp_number}
                      onChange={(e) => handleInputChange("whatsapp_number", e.target.value)}
                      placeholder="For client communication"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="office_address">Office Address</Label>
                    <Textarea
                      id="office_address"
                      value={formData.office_address}
                      onChange={(e) => handleInputChange("office_address", e.target.value)}
                      placeholder="Your office address"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Your city"
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Professional Details</h2>
                  <p className="text-gray-600">Tell us about your professional background</p>
                </div>

                {/* Profile Photo */}
                <div>
                  <Label>Profile Photo</Label>
                  <div className="flex items-center gap-4 mt-2">
                    {formData.profile_photo && (
                      <img src={formData.profile_photo} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('photo-upload').click()}
                        disabled={uploadingPhoto}
                      >
                        {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell clients about your expertise and experience..."
                    rows={4}
                    className={errors.bio ? "border-red-500" : ""}
                  />
                  {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                </div>

                {/* Experience */}
                <div>
                  <Label htmlFor="experience_years">Years of Experience *</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    min="0"
                    value={formData.experience_years}
                    onChange={(e) => handleInputChange("experience_years", e.target.value)}
                    placeholder="Years of professional experience"
                    className={errors.experience_years ? "border-red-500" : ""}
                  />
                  {errors.experience_years && <p className="text-red-500 text-sm mt-1">{errors.experience_years}</p>}
                </div>

                {/* Qualifications */}
                <div>
                  <Label>Qualifications *</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newQualification}
                        onChange={(e) => setNewQualification(e.target.value)}
                        placeholder="e.g., LLB from Delhi University"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleArrayAdd("qualifications", newQualification);
                            setNewQualification("");
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          handleArrayAdd("qualifications", newQualification);
                          setNewQualification("");
                        }}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.qualifications.map((qual, index) => (
                        <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                          <span className="text-sm">{qual}</span>
                          <button
                            type="button"
                            onClick={() => handleArrayRemove("qualifications", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  {errors.qualifications && <p className="text-red-500 text-sm mt-1">{errors.qualifications}</p>}
                </div>

                {/* Specializations */}
                <div>
                  <Label>Legal Specializations *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {LEGAL_SPECIALIZATIONS.map(spec => (
                      <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={formData.specializations.includes(spec)}
                          onCheckedChange={() => handleSpecializationToggle(spec)}
                        />
                        <span className="text-sm">{spec}</span>
                      </label>
                    ))}
                  </div>
                  {errors.specializations && <p className="text-red-500 text-sm mt-1">{errors.specializations}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Services */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Services & Pricing</h2>
                  <p className="text-gray-600">Define the services you offer to clients</p>
                </div>

                {/* Add New Service */}
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Add New Service</h3>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Service name (e.g., Legal Consultation)"
                          value={newService.service_name}
                          onChange={(e) => setNewService(prev => ({ ...prev, service_name: e.target.value }))}
                        />
                        <Input
                          placeholder="Price range (e.g., ₹5,000 - ₹10,000)"
                          value={newService.price_range}
                          onChange={(e) => setNewService(prev => ({ ...prev, price_range: e.target.value }))}
                        />
                      </div>
                      <Textarea
                        placeholder="Service description (optional)"
                        value={newService.description}
                        onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                      />
                      <Button
                        onClick={() => {
                          if (handleArrayAdd("services_offered", newService)) {
                            setNewService({ service_name: "", description: "", price_range: "" });
                          }
                        }}
                        className="w-full"
                        disabled={!newService.service_name.trim() || !newService.price_range.trim()}
                      >
                        Add Service
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Services List */}
                <div>
                  <Label>Your Services *</Label>
                  {formData.services_offered.length === 0 ? (
                    <div className="mt-2 p-8 border-2 border-dashed border-gray-200 rounded-lg text-center">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No services added yet. Add your first service above.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 mt-2">
                      {formData.services_offered.map((service, index) => (
                        <Card key={index} className="bg-white border">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-800">{service.service_name}</h4>
                                {service.description && (
                                  <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                                )}
                                <p className="text-green-600 font-medium mt-2">{service.price_range}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleArrayRemove("services_offered", index)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  {errors.services_offered && <p className="text-red-500 text-sm mt-1">{errors.services_offered}</p>}
                </div>
              </div>
            )}

            {/* Step 4: Verification */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Verification Documents</h2>
                  <p className="text-gray-600">Upload documents to verify your credentials</p>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please upload clear images or PDFs of your legal credentials (e.g. Bar Council ID for advocates), and a government-issued ID proof. All documents will be reviewed for verification.
                  </AlertDescription>
                </Alert>

                {/* Document Upload */}
                <div>
                  <Label>Verification Documents *</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleDocumentUpload}
                      className="hidden"
                      id="doc-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('doc-upload').click()}
                      disabled={uploadingDocs}
                      className="w-full h-20 border-2 border-dashed border-gray-300 hover:border-gray-400"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                        <p>{uploadingDocs ? "Uploading..." : "Click to upload documents"}</p>
                        <p className="text-sm text-gray-500">PDF, JPG, PNG up to 10MB each</p>
                      </div>
                    </Button>
                  </div>

                  {/* Uploaded Documents */}
                  {formData.verification_documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label>Uploaded Documents:</Label>
                      {formData.verification_documents.map((doc, index) => (
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
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  verification_documents: prev.verification_documents.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-red-600"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.verification_documents && <p className="text-red-500 text-sm mt-1">{errors.verification_documents}</p>}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button onClick={nextStep} className="bg-slate-800 hover:bg-slate-700">
                  Next Step
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Submitting..." : "Submit for Verification"}
                </Button>
              )}
            </div>

            {errors.submit && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
