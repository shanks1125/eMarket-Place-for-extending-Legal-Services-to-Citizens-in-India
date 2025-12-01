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
import { Upload, Save, AlertCircle } from "lucide-react";
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

export default function EditProviderProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [providerId, setProviderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        if (user.user_type !== 'provider') {
          navigate(createPageUrl("Home"));
          return;
        }
        const providers = await Provider.filter({ user_id: user.id });
        if (providers.length > 0) {
          setFormData(providers[0]);
          setProviderId(providers[0].id);
        } else {

          navigate(createPageUrl("JoinAsProvider"));
        }
      } catch (error) {
        navigate(createPageUrl("Login"));
      }
      setPageLoading(false);
    };
    loadData();
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      setLoading(true);
      try {
        const { file_url } = await UploadFile({ file });
        handleInputChange("profile_photo", file_url);
      } catch (error) { console.error("Error uploading photo:", error); }
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
    
      const updateData = { ...formData };
      delete updateData.id;
      delete updateData.created_date;
      delete updateData.updated_date;
      delete updateData.created_by;
      
      await Provider.update(providerId, updateData);
      navigate(createPageUrl("ProviderDashboard"));
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ submit: "Failed to update profile. Please try again." });
    }
    setLoading(false);
  };
  
  if (pageLoading || !formData) return <div>Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Edit Your Profile</h1>
          <p className="text-gray-600">Keep your information up to date to attract more clients.</p>
        </div>

        <div className="space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-6">
               <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="business_name">Business/Professional Name *</Label>
                    <Input id="business_name" value={formData.business_name} onChange={(e) => handleInputChange("business_name", e.target.value)} />
                </div>
                 <div>
                    <Label>Provider Type</Label>
                    <Input value={formData.provider_type} disabled />
                  </div>
               </div>
               <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone_number">Phone Number *</Label>
                    <Input id="phone_number" value={formData.phone_number} onChange={(e) => handleInputChange("phone_number", e.target.value)} />
                  </div>
                   <div>
                    <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                    <Input id="whatsapp_number" value={formData.whatsapp_number} onChange={(e) => handleInputChange("whatsapp_number", e.target.value)} />
                  </div>
               </div>
            </CardContent>
          </Card>
          
          {/* Professional Details */}
          <Card>
             <CardHeader><CardTitle>Professional Details</CardTitle></CardHeader>
             <CardContent className="space-y-6">
                <div>
                  <Label>Profile Photo</Label>
                  <div className="flex items-center gap-4 mt-2">
                    {formData.profile_photo && <img src={formData.profile_photo} alt="Profile" className="w-16 h-16 rounded-full object-cover" />}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
                    <Button type="button" variant="outline" onClick={() => document.getElementById('photo-upload').click()} disabled={loading}>
                       {loading ? "Uploading..." : "Change Photo"}
                    </Button>
                  </div>
                </div>
                 <div>
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea id="bio" value={formData.bio} onChange={(e) => handleInputChange("bio", e.target.value)} rows={4} />
                </div>
                 <div>
                  <Label>Legal Specializations *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {LEGAL_SPECIALIZATIONS.map(spec => (
                      <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox checked={formData.specializations.includes(spec)} onCheckedChange={() => handleSpecializationToggle(spec)} />
                        <span className="text-sm">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>
             </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
             <Button variant="outline" onClick={() => navigate(createPageUrl("ProviderDashboard"))}>Cancel</Button>
             <Button onClick={handleSubmit} disabled={loading} className="bg-slate-800 hover:bg-slate-700">
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
             </Button>
          </div>
          {errors.submit && <Alert variant="destructive"><AlertDescription>{errors.submit}</AlertDescription></Alert>}
        </div>
      </div>
    </div>
  );
}