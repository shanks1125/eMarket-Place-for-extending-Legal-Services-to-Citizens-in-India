
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Provider } from "@/entities/Provider";
import { Review } from "@/entities/Review";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Briefcase, CheckCircle, MessageCircle, FileText, Award, User, GraduationCap, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderProfile() {
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const providerId = urlParams.get('id');
    if (providerId) {
      loadProviderData(providerId);
    } else {
      setLoading(false);
    }
  }, []);

  const loadProviderData = async (id) => {
    setLoading(true);
    try {
      const providerData = await Provider.get(id);
      setProvider(providerData);

      const reviewData = await Review.filter({ provider_id: id }, "-created_date");
      setReviews(reviewData);
    } catch (error) {
      console.error("Error loading provider data:", error);
    }
    setLoading(false);
  };
  
  const handleWhatsAppContact = () => {
    if (!provider) return;
    const message = `Hello ${provider.business_name}, I found your profile on LegalConnect and would like to inquire about your services.`;
    const phoneNumber = provider.whatsapp_number || provider.phone_number;
    const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-48 w-full mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Provider not found</h2>
        <p className="text-gray-600">The provider you are looking for does not exist.</p>
        <Link to={createPageUrl("Providers")}>
          <Button className="mt-4">Back to Providers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                <AvatarImage src={provider.profile_photo} alt={provider.business_name} />
                <AvatarFallback className="text-4xl">
                  {provider.business_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-slate-800">{provider.business_name}</h1>
                   <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> <span className="capitalize">{provider.provider_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {provider.city}, {provider.state}
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" /> {provider.experience_years} years of experience
                  </div>
                   {provider.license_number && (
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> {provider.license_number}
                    </div>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed">{provider.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader><CardTitle>Specializations</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {provider.specializations?.map(spec => (
                  <Badge key={spec} variant="secondary" className="px-3 py-1 text-sm">{spec}</Badge>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader><CardTitle>Services Offered</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {provider.services_offered?.map(service => (
                  <div key={service.service_name} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">{service.service_name}</h4>
                      <p className="font-bold text-green-700">{service.price_range}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Qualifications</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {provider.qualifications?.map(q => (
                    <li key={q} className="flex items-start">
                      <GraduationCap className="w-5 h-5 mr-3 mt-1 text-slate-600 flex-shrink-0" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Client Reviews ({reviews.length})</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {reviews.length > 0 ? reviews.map(review => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center mb-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                       <span className="ml-auto text-sm text-gray-500">{new Date(review.created_date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                )) : <p className="text-gray-500">No reviews yet.</p>}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-1 mx-auto mb-2">
                   <Star className="w-6 h-6 text-amber-400 fill-current" />
                   <span className="text-3xl font-bold text-slate-800">{provider.rating?.toFixed(1) || 'N/A'}</span>
                   <span className="text-gray-600 mt-2">/ 5</span>
                </div>
                 <p className="text-sm text-gray-500">Based on {provider.total_reviews || 0} reviews</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Link to={createPageUrl(`RequestService?provider=${provider.id}`)} className="w-full">
                  <Button className="w-full bg-slate-800 hover:bg-slate-700 h-12 text-base">
                    <FileText className="w-5 h-5 mr-2" />
                    Request Service
                  </Button>
                </Link>
                <Button variant="outline" className="w-full h-12 text-base" onClick={handleWhatsAppContact}>
                  <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
                  Contact on WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
