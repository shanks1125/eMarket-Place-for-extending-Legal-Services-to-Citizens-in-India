
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { ServiceRequest } from "@/entities/ServiceRequest";
import { Review } from "@/entities/Review";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, CheckCircle, XCircle, Plus, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"; 

function StarRating({ rating, setRating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-8 h-8 cursor-pointer transition-colors ${
            star <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'
          }`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
}


export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingRequest, setReviewingRequest] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
    service_quality: 0,
    communication: 0,
    timeliness: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        const userRequests = await ServiceRequest.filter({ customer_id: user.id }, "-created_date");
        const reviews = await Review.filter({ customer_id: user.id });
        const reviewedRequestIds = new Set(reviews.map(r => r.service_request_id));
        
        const requestsWithReviewStatus = userRequests.map(req => ({
          ...req,
          is_reviewed: reviewedRequestIds.has(req.id)
        }));

        setRequests(requestsWithReviewStatus);
      } catch (error) {
        navigate(createPageUrl("Home")); 
      }
      setLoading(false);
    };
    loadData();
  }, [navigate]);

  const handleOpenReviewModal = (request) => {
    setReviewingRequest(request);
    setReviewData({ rating: 0, comment: "", service_quality: 0, communication: 0, timeliness: 0 });
  };

  const handleCloseReviewModal = () => {
    setReviewingRequest(null);
  };

  const handleSubmitReview = async () => {
    if (reviewData.rating === 0 || !reviewingRequest) return;

    try {
      await Review.create({
        customer_id: currentUser.id,
        provider_id: reviewingRequest.provider_id,
        service_request_id: reviewingRequest.id,
        ...reviewData,
      });

      
      setRequests(requests.map(req => 
        req.id === reviewingRequest.id ? { ...req, is_reviewed: true } : req
      ));
      
      handleCloseReviewModal();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };


  const getStatusInfo = (status) => {
    switch (status) {
      case "pending": return { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-3 h-3 mr-1" />, text: "Pending" };
      case "accepted": return { color: "bg-blue-100 text-blue-800", icon: <CheckCircle className="w-3 h-3 mr-1" />, text: "Accepted" };
      case "in_progress": return { color: "bg-purple-100 text-purple-800", icon: <Clock className="w-3 h-3 mr-1" />, text: "In Progress" };
      case "completed": return { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-3 h-3 mr-1" />, text: "Completed" };
      case "cancelled": return { color: "bg-red-100 text-red-800", icon: <XCircle className="w-3 h-3 mr-1" />, text: "Cancelled" };
      default: return { color: "bg-gray-100 text-gray-800", icon: null, text: status };
    }
  };

  const renderRequestList = (filteredRequests) => {
    if (filteredRequests.length === 0) {
      return (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No requests found</h3>
          <p className="text-gray-500 mb-6">You haven't made any requests in this category yet.</p>
          <Link to={createPageUrl("RequestService")}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Make a New Request
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredRequests.map(req => {
          const statusInfo = getStatusInfo(req.status);
          return (
            <Card key={req.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <Badge className={`${statusInfo.color} flex items-center`}>{statusInfo.icon} {statusInfo.text}</Badge>
                       <span className="text-sm text-gray-500">
                         Requested on {new Date(req.created_date).toLocaleDateString()}
                       </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{req.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{req.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {req.status === 'completed' && !req.is_reviewed && (
                      <Button variant="outline" onClick={() => handleOpenReviewModal(req)}>Leave Review</Button>
                    )}
                    {req.status === 'completed' && req.is_reviewed && (
                      <Badge variant="secondary">Review Submitted</Badge>
                    )}
                    <Button>View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Dashboard</h1>
          <p className="text-gray-600">Track and manage your legal service requests.</p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            {renderRequestList(requests.filter(r => ['pending', 'accepted', 'in_progress'].includes(r.status)))}
          </TabsContent>
          <TabsContent value="completed">
            {renderRequestList(requests.filter(r => r.status === 'completed'))}
          </TabsContent>
          <TabsContent value="cancelled">
            {renderRequestList(requests.filter(r => r.status === 'cancelled'))}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!reviewingRequest} onOpenChange={handleCloseReviewModal}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Rate your experience with the provider for the service: "{reviewingRequest?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Overall</Label>
              <div className="col-span-3">
                <StarRating rating={reviewData.rating} setRating={(r) => setReviewData({...reviewData, rating: r})} />
              </div>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Quality</Label>
              <div className="col-span-3">
                <StarRating rating={reviewData.service_quality} setRating={(r) => setReviewData({...reviewData, service_quality: r})} />
              </div>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Communication</Label>
              <div className="col-span-3">
                <StarRating rating={reviewData.communication} setRating={(r) => setReviewData({...reviewData, communication: r})} />
              </div>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Timeliness</Label>
              <div className="col-span-3">
                <StarRating rating={reviewData.timeliness} setRating={(r) => setReviewData({...reviewData, timeliness: r})} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comment" className="text-right">
                Comment
              </Label>
              <Textarea
                id="comment"
                value={reviewData.comment}
                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                className="col-span-3"
                placeholder="Share details of your own experience"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseReviewModal}>Cancel</Button>
            <Button onClick={handleSubmitReview} disabled={reviewData.rating === 0}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
