
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Scale, Home, Users, UserPlus, LogIn, LayoutDashboard, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import AILegalChatbot from "../components/AILegalChatbot";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (e) {
        setCurrentUser(null);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [location.pathname]);  

  const handleLogout = async () => {
    await User.logout();
    setCurrentUser(null);
    navigate(createPageUrl("Home"));
  };

  const handleCustomerLogin = async () => {
    await User.loginWithRedirect(createPageUrl("CustomerDashboard"));
  };

  const handleProviderLogin = async () => {
    await User.loginWithRedirect(createPageUrl("JoinAsProvider"));
  };

  const handleAdminLogin = async () => {
    
    await User.loginWithRedirect(createPageUrl("AdminDashboard"));
    setShowAdminLogin(false); 
  };

  const isActive = (pageName) => {
    return location.pathname === createPageUrl(pageName);
  };

  const getDashboardUrl = () => {
    if (!currentUser) return "#"; 
    if (currentUser.user_type === 'admin') {
      return createPageUrl("AdminDashboard");
    }
    return currentUser.user_type === 'provider' 
      ? createPageUrl("ProviderDashboard") 
      : createPageUrl("CustomerDashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',system-ui,sans-serif]">
      <style>
        {`
          :root {
            --primary-navy: #1e293b;
            --primary-gold: #f59e0b;
            --accent-gold: #fbbf24;
            --text-primary: #1f2937;
            --text-secondary: #6b7280;
            --bg-card: #ffffff;
            --border-color: #e5e7eb;
          }
        `}
      </style>
      
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">LandLaw Connect</h1>
                <p className="text-xs text-gray-500 -mt-1">India's Premier Land Dispute Legal Marketplace</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link 
                to={createPageUrl("Home")} 
                className={`text-sm font-medium transition-colors ${
                  isActive("Home") ? "text-amber-600" : "text-gray-600 hover:text-amber-600"
                }`}
              >
                Home
              </Link>
              <Link 
                to={createPageUrl("Providers")} 
                className={`text-sm font-medium transition-colors ${
                  isActive("Providers") ? "text-amber-600" : "text-gray-600 hover:text-amber-600"
                }`}
              >
                Find Land Lawyers
              </Link>
              <Link 
                to={createPageUrl("Blog")} 
                className={`text-sm font-medium transition-colors ${
                  isActive("Blog") ? "text-amber-600" : "text-gray-600 hover:text-amber-600"
                }`}
              >
                Blog
              </Link>
              <Link 
                to={createPageUrl("LegalChatbot")} 
                className={`text-sm font-medium transition-colors ${
                  isActive("LegalChatbot") ? "text-amber-600" : "text-gray-600 hover:text-amber-600"
                }`}
              >
                AI Assistant
              </Link>

              {!isLoading && (
                <>
                  {currentUser ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={currentUser.avatar_url} />
                            <AvatarFallback>{currentUser.full_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{currentUser.full_name}</span>
                          <Badge 
                              variant={
                                  currentUser.user_type === 'admin' ? 'destructive' :
                                  currentUser.user_type === 'provider' ? 'default' : 'secondary'
                              }
                              className="capitalize text-xs"
                          >
                              {currentUser.user_type === 'customer' ? 'User' : currentUser.user_type}
                          </Badge>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={getDashboardUrl()}>
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            My Dashboard
                          </Link>
                        </DropdownMenuItem>
                        {currentUser.user_type === 'provider' && (
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl("ProviderServiceManagement")}>
                              <Users className="w-4 h-4 mr-2" />
                              Service Management
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {currentUser.user_type === 'admin' && (
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl("AdminDashboard")}>
                              <Users className="w-4 h-4 mr-2" />
                              Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900" 
                        onClick={handleCustomerLogin}
                      >
                        <LogIn className="w-4 h-4" />
                        <span className="font-medium">Login / Sign Up</span>
                      </Button>
                      <Button 
                        className="bg-slate-800 text-white hover:bg-slate-700 font-medium px-4 py-2" 
                        onClick={handleProviderLogin}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Join as Land Lawyer
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="md:hidden">
              {/* Mobile menu can be implemented here */}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-slate-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-lg font-semibold mb-4">LandLaw Connect</h2>
              <p className="text-gray-400 text-sm">
                The modern way to resolve land disputes in India. Verified, efficient, and reliable.
              </p>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to={createPageUrl("Home")} className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to={createPageUrl("Providers")} className="text-gray-400 hover:text-white">Find Land Lawyers</Link></li>
                <li><Link to={createPageUrl("JoinAsProvider")} className="text-gray-400 hover:text-white">Join as Land Lawyer</Link></li>
                <li><Link to={createPageUrl("Blog")} className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link to={createPageUrl("LegalChatbot")} className="text-gray-400 hover:text-white">AI Assistant</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-4">Contact</h3>
              <p className="text-gray-400 text-sm">support@landlawconnect.in</p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-sm text-gray-500 flex justify-between items-center">
            <span>© {new Date().getFullYear()} LandLaw Connect. All rights reserved.</span>
            <button 
              onClick={() => setShowAdminLogin(true)} 
              className="text-gray-600 hover:text-gray-400 text-xs"
            >
              Admin Login
            </button>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin1188"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input 
                  type="password" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowAdminLogin(false)}
                  className="flex-1 py-3 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdminLogin}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Note: Admin access is secured through Google authentication for enhanced security
              </p>
            </div>
          </div>
        </div>
      )}

      <AILegalChatbot />
    </div>
  );
}
