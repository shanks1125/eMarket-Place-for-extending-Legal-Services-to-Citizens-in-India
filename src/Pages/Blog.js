import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, User, ArrowRight, FileText, Scale, MapPin } from "lucide-react";

const blogArticles = [
  {
    id: 1,
    title: "Understanding Property Title Verification in India",
    excerpt: "A comprehensive guide to verifying property titles, checking encumbrances, and ensuring clear ownership before purchase.",
    content: "Property title verification is crucial before any real estate transaction. Here's what you need to know...",
    category: "Property Documentation",
    author: "Legal Team",
    date: "2024-01-15",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
  },
  {
    id: 2,
    title: "Common Land Boundary Disputes and How to Resolve Them",
    excerpt: "Learn about the most frequent types of boundary disputes between neighbors and the legal remedies available.",
    content: "Boundary disputes are among the most common land-related legal issues in India...",
    category: "Boundary Issues",
    author: "Legal Team",
    date: "2024-01-12",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400"
  },
  {
    id: 3,
    title: "Essential Documents for Land Purchase in India",
    excerpt: "Complete checklist of documents required for buying agricultural land, residential plots, and commercial properties.",
    content: "When purchasing land in India, having the right documents is essential for a smooth transaction...",
    category: "Documentation",
    author: "Legal Team",
    date: "2024-01-10",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400"
  },
  {
    id: 4,
    title: "Rights of Way and Easement Laws in Property Disputes",
    excerpt: "Understanding easement rights, rights of way, and how they affect property ownership and usage.",
    content: "Easement rights and rights of way are important aspects of property law that can significantly impact...",
    category: "Property Rights",
    author: "Legal Team",
    date: "2024-01-08",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400"
  },
  {
    id: 5,
    title: "Land Acquisition Laws: Rights of Property Owners",
    excerpt: "Know your rights when the government acquires private land for public projects and fair compensation procedures.",
    content: "Land acquisition by the government is a complex legal process that affects many property owners...",
    category: "Land Acquisition",
    author: "Legal Team",
    date: "2024-01-05",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400"
  },
  {
    id: 6,
    title: "Property Inheritance Laws and Succession Rights",
    excerpt: "Complete guide to property inheritance, succession certificates, and legal procedures for transferring inherited land.",
    content: "Property inheritance in India follows specific legal procedures that vary by religion and local laws...",
    category: "Inheritance",
    author: "Legal Team",
    date: "2024-01-03",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
  }
];

const categories = ["All", "Property Documentation", "Boundary Issues", "Documentation", "Property Rights", "Land Acquisition", "Inheritance"];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles = blogArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Land Dispute Legal Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert insights, legal guides, and essential information about land disputes, property law, and real estate litigation in India
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-xs">
                    {article.category}
                  </Badge>
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <Link to={createPageUrl(`BlogPost?id=${article.id}`)}>
                  <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">
                    Read Full Article
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
        
        {/* CTA Section */}
        <section className="mt-16 bg-slate-800 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Legal Help with Your Land Dispute?</h2>
          <p className="text-gray-300 mb-6">
            Connect with experienced advocates who specialize in property and land law
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("RequestService")}>
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                Get Legal Assistance
              </Button>
            </Link>
            <Link to={createPageUrl("Providers")}>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-800">
                Find Advocates
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}