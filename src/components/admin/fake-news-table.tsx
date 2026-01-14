// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Search, MoreHorizontal, Eye, Edit, Trash2, AlertTriangle, Plus } from "lucide-react";
// import { format } from "date-fns";
// import { CategoryOption, FakeNewsReport } from "@/lib/mock-data/fake-type";

// interface FakeNewsTableProps {
//   reports: FakeNewsReport[];
//   loading: boolean;
//   categories: CategoryOption[];
//   categoriesLoading: boolean;
//   searchQuery: string;
//   selectedCategory: string;
//   selectedStatus: string;
//   pagination: {
//     total: number;
//     page: number;
//     limit: number;
//     pages: number;
//   };
//   onSearchChange: (query: string) => void;
//   onCategoryChange: (category: string) => void;
//   onStatusChange: (status: string) => void;
//   onPageChange: (page: number) => void;
//   onEdit: (report: FakeNewsReport) => void;
//   onDelete: (id: string) => void;
//   onRefresh: () => void;
// }

// const severityOptions = [
//   { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
//   { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
//   { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
//   { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
// ];

// const statusOptions = [
//   { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
//   { value: "published", label: "Published", color: "bg-blue-100 text-blue-800" },
//   { value: "archived", label: "Archived", color: "bg-purple-100 text-purple-800" },
// ];

// export default function FakeNewsTable({
//   reports,
//   loading,
//   categories,
//   categoriesLoading,
//   searchQuery,
//   selectedCategory,
//   selectedStatus,
//   pagination,
//   onSearchChange,
//   onCategoryChange,
//   onStatusChange,
//   onPageChange,
//   onEdit,
//   onDelete,
//   onRefresh,
// }: FakeNewsTableProps) {
//   const router = useRouter();

//   // Filter reports locally
//   const filteredReports = reports.filter((report) => {
//     if (selectedCategory !== "all" && report.category !== selectedCategory)
//       return false;
//     if (selectedStatus !== "all" && report.status !== selectedStatus)
//       return false;
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       return (
//         (report.title?.toLowerCase() || "").includes(query) ||
//         (report.fakeClaim?.toLowerCase() || "").includes(query) ||
//         (report.tags?.some((tag) => tag.toLowerCase().includes(query)) || false)
//       );
//     }
//     return true;
//   });

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <CardTitle>All Fake News Reports</CardTitle>
//           <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Search reports..."
//                 value={searchQuery}
//                 onChange={(e) => onSearchChange(e.target.value)}
//                 className="pl-10 w-full"
//               />
//             </div>
//             <Select
//               value={selectedCategory}
//               onValueChange={onCategoryChange}
//               disabled={categoriesLoading}
//             >
//               <SelectTrigger className="w-full sm:w-[180px]">
//                 <SelectValue placeholder="Category" />
//                 {categoriesLoading && (
//                   <span className="absolute right-8">...</span>
//                 )}
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Categories</SelectItem>
//                 {categories.map((cat) => (
//                   <SelectItem key={cat.value} value={cat.value}>
//                     {cat.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select value={selectedStatus} onValueChange={onStatusChange}>
//               <SelectTrigger className="w-full sm:w-[180px]">
//                 <SelectValue placeholder="Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 {statusOptions.map((status) => (
//                   <SelectItem key={status.value} value={status.value}>
//                     {status.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {loading ? (
//           <div className="flex items-center justify-center p-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
//             <span className="ml-3">Loading reports...</span>
//           </div>
//         ) : (
//           <>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Title</TableHead>
//                   <TableHead>Category</TableHead>
//                   <TableHead>Severity</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Views</TableHead>
//                   <TableHead>Created</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredReports.map((report) => (
//                   <TableRow key={report._id}>
//                     <TableCell className="font-medium">
//                       <div className="flex items-center gap-2">
//                         <AlertTriangle className="h-4 w-4 text-orange-500" />
//                         <div>
//                           <div>{report.title}</div>
//                           <div className="text-xs text-muted-foreground truncate max-w-[300px]">
//                             {report.fakeClaim}
//                           </div>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="outline">
//                         {categories.find(cat => cat.value === report.category)?.label || 
//                          report.category.charAt(0).toUpperCase() + report.category.slice(1)}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         className={
//                           severityOptions.find(
//                             (s) => s.value === report.severity
//                           )?.color
//                         }
//                       >
//                         {severityOptions.find(
//                           (s) => s.value === report.severity
//                         )?.label || report.severity}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant="outline"
//                         className={
//                           statusOptions.find((s) => s.value === report.status)
//                             ?.color
//                         }
//                       >
//                         {statusOptions.find((s) => s.value === report.status)
//                           ?.label || report.status}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <Eye className="h-4 w-4 text-gray-400" />
//                         {report.views?.toLocaleString() || 0}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       {format(new Date(report.createdAt), "MMM d, yyyy")}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" className="h-8 w-8 p-0">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                           <DropdownMenuItem
//                             onClick={() =>
//                               router.push(`/fake-news/${report._id}`)
//                             }
//                           >
//                             <Eye className="mr-2 h-4 w-4" />
//                             View Public
//                           </DropdownMenuItem>
//                           <DropdownMenuItem onClick={() => onEdit(report)}>
//                             <Edit className="mr-2 h-4 w-4" />
//                             Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem
//                             className="text-destructive"
//                             onClick={() => onDelete(report._id)}
//                           >
//                             <Trash2 className="mr-2 h-4 w-4" />
//                             Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             {filteredReports.length === 0 && (
//               <div className="text-center py-8">
//                 <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold mb-2">
//                   No reports found
//                 </h3>
//                 <p className="text-gray-600 mb-4">
//                   {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
//                     ? "Try adjusting your search or filters"
//                     : "Get started by creating your first fake news report"}
//                 </p>
//                 {!searchQuery && selectedCategory === "all" && selectedStatus === "all" && (
//                   <Button onClick={onRefresh}>
//                     <Plus className="mr-2 h-4 w-4" />
//                     Create First Report
//                   </Button>
//                 )}
//               </div>
//             )}

//             {filteredReports.length > 0 && (
//               <div className="flex items-center justify-between mt-4">
//                 <div className="text-sm text-muted-foreground">
//                   Showing {filteredReports.length} of {reports.length} reports
//                   {pagination.total > 0 && ` (Total: ${pagination.total})`}
//                 </div>
//                 <div className="flex space-x-2">
//                   <Button
//                     variant="outline"
//                     disabled={pagination.page === 1}
//                     onClick={() => onPageChange(pagination.page - 1)}
//                   >
//                     Previous
//                   </Button>
//                   <span className="px-3 py-2 text-sm">
//                     Page {pagination.page} of {pagination.pages}
//                   </span>
//                   <Button
//                     variant="outline"
//                     disabled={pagination.page === pagination.pages}
//                     onClick={() => onPageChange(pagination.page + 1)}
//                   >
//                     Next
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// }



























// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Search, MoreHorizontal, Eye, Edit, Trash2, AlertTriangle, Plus, RefreshCw } from "lucide-react";
// import { format } from "date-fns";
// import { CategoryOption, FakeNewsReport } from "@/lib/mock-data/fake-type";
// import { toast } from "sonner";

// interface FakeNewsTableProps {
//   categories: CategoryOption[];
//   categoriesLoading: boolean;
//   onEdit: (report: FakeNewsReport) => void;
//   onDelete: (id: string) => void;
//   onCreateNew: () => void;
// }

// const severityOptions = [
//   { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
//   { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
//   { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
//   { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
// ];

// const statusOptions = [
//   { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
//   { value: "published", label: "Published", color: "bg-blue-100 text-blue-800" },
//   { value: "archived", label: "Archived", color: "bg-purple-100 text-purple-800" },
// ];

// export default function FakeNewsTable({
//   categories,
//   categoriesLoading,
//   onEdit,
//   onDelete,
//   onCreateNew,
// }: FakeNewsTableProps) {
//   const router = useRouter();
//   const [reports, setReports] = useState<FakeNewsReport[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const [pagination, setPagination] = useState({
//     total: 0,
//     page: 1,
//     limit: 10,
//     pages: 0,
//   });

//   // Fetch reports from API
//   const fetchReports = async (page = 1, limit = 10, search = "", category = "", status = "") => {
//     try {
//       setLoading(true);
      
//       // Build query parameters
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//       });

//       // Add optional filters
//       if (search && search.trim() !== "") {
//         params.append("search", search.trim());
//       }
//       if (category && category !== "all") {
//         params.append("category", category);
//       }
//       if (status && status !== "all") {
//         params.append("status", status);
//       }

//       const url = `/api/admin/fake-news?${params.toString()}`;
      
//       // For demo purposes, we'll include credentials in headers
//       // In production, use proper authentication (JWT in Authorization header)
//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "X-User-Email": "arbaazkhanark23@gmail.com",
//           "X-User-Password": "ask@462002",
//           "X-User-Role": "user"
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           toast.error("Authentication failed. Please check your credentials.");
//         } else if (response.status === 403) {
//           toast.error("You don't have permission to access this resource.");
//         } else {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return;
//       }

//       const data = await response.json();
      
//       if (data.success === false) {
//         toast.error(data.message || "Failed to load reports");
//         return;
//       }
      
//       setReports(data.reports || []);
//       setPagination(data.pagination || {
//         total: 0,
//         page: page,
//         limit: limit,
//         pages: 0,
//       });
      
//     } catch (error) {
//       console.error("Error fetching reports:", error);
//       toast.error("Failed to load reports. Please try again.");
//       setReports([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchReports();
//   }, []);

//   // Handle search change with debouncing
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchReports(
//         1, 
//         pagination.limit, 
//         searchQuery, 
//         selectedCategory !== "all" ? selectedCategory : "", 
//         selectedStatus !== "all" ? selectedStatus : ""
//       );
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   // Handle category/status change
//   useEffect(() => {
//     if (selectedCategory !== "all" || selectedStatus !== "all") {
//       fetchReports(
//         1, 
//         pagination.limit, 
//         searchQuery, 
//         selectedCategory !== "all" ? selectedCategory : "", 
//         selectedStatus !== "all" ? selectedStatus : ""
//       );
//     }
//   }, [selectedCategory, selectedStatus]);

//   // Filter reports locally (for immediate UI updates while API loads)
//   const filteredReports = reports.filter((report) => {
//     // Category filter
//     if (selectedCategory !== "all" && report.category !== selectedCategory)
//       return false;
    
//     // Status filter
//     if (selectedStatus !== "all" && report.status !== selectedStatus)
//       return false;
    
//     // Search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       return (
//         (report.title?.toLowerCase() || "").includes(query) ||
//         (report.fakeClaim?.toLowerCase() || "").includes(query) ||
//         (report.tags?.some((tag) => tag.toLowerCase().includes(query)) || false) ||
//         (report.titleHi?.toLowerCase() || "").includes(query) ||
//         (report.fakeClaimHi?.toLowerCase() || "").includes(query)
//       );
//     }
    
//     return true;
//   });

//   // Handle page change
//   const handlePageChange = (page: number) => {
//     fetchReports(
//       page, 
//       pagination.limit, 
//       searchQuery, 
//       selectedCategory !== "all" ? selectedCategory : "", 
//       selectedStatus !== "all" ? selectedStatus : ""
//     );
//   };

//   // Handle refresh
//   const handleRefresh = () => {
//     fetchReports(
//       pagination.page, 
//       pagination.limit, 
//       searchQuery, 
//       selectedCategory !== "all" ? selectedCategory : "", 
//       selectedStatus !== "all" ? selectedStatus : ""
//     );
//   };

//   // Handle search change
//   const handleSearchChange = (query: string) => {
//     setSearchQuery(query);
//   };

//   // Handle category change
//   const handleCategoryChange = (category: string) => {
//     setSelectedCategory(category);
//   };

//   // Handle status change
//   const handleStatusChange = (status: string) => {
//     setSelectedStatus(status);
//   };

//   // Handle delete with confirmation
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
//       return;
//     }

//     try {
//       // In a real app, you would call your delete API here
//       // For now, we'll just call the onDelete prop and refresh the list
//       onDelete(id);
//       toast.success("Report deleted successfully");
      
//       // Refresh the list after deletion
//       setTimeout(() => {
//         handleRefresh();
//       }, 500);
//     } catch (error) {
//       console.error("Error deleting report:", error);
//       toast.error("Failed to delete report");
//     }
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <CardTitle className="text-2xl">All Fake News Reports</CardTitle>
//           <div className="flex items-center gap-3">
//             <Button
//               variant="outline"
//               onClick={handleRefresh}
//               disabled={loading}
//               size="sm"
//               className="flex items-center gap-2"
//             >
//               <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
//               Refresh
//             </Button>
//             <Button onClick={onCreateNew} size="sm" className="flex items-center gap-2">
//               <Plus className="h-4 w-4" />
//               New Report
//             </Button>
//           </div>
//         </div>
        
//         <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <Input
//               placeholder="Search reports by title, claim, or tags..."
//               value={searchQuery}
//               onChange={(e) => handleSearchChange(e.target.value)}
//               className="pl-10 w-full"
//               disabled={loading}
//             />
//           </div>
//           <Select
//             value={selectedCategory}
//             onValueChange={handleCategoryChange}
//             disabled={categoriesLoading || loading}
//           >
//             <SelectTrigger className="w-full sm:w-[180px]">
//               <SelectValue placeholder="All Categories" />
//               {categoriesLoading && (
//                 <span className="absolute right-8">...</span>
//               )}
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Categories</SelectItem>
//               {categories.map((cat) => (
//                 <SelectItem key={cat.value} value={cat.value}>
//                   {cat.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Select 
//             value={selectedStatus} 
//             onValueChange={handleStatusChange}
//             disabled={loading}
//           >
//             <SelectTrigger className="w-full sm:w-[180px]">
//               <SelectValue placeholder="All Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               {statusOptions.map((status) => (
//                 <SelectItem key={status.value} value={status.value}>
//                   {status.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {loading && reports.length === 0 ? (
//           <div className="flex items-center justify-center p-12">
//             <div className="flex flex-col items-center gap-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
//               <span className="text-gray-600">Loading reports...</span>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="rounded-md border overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-50 hover:bg-gray-50">
//                     <TableHead className="font-semibold">Title</TableHead>
//                     <TableHead className="font-semibold">Category</TableHead>
//                     <TableHead className="font-semibold">Severity</TableHead>
//                     <TableHead className="font-semibold">Status</TableHead>
//                     <TableHead className="font-semibold">Views</TableHead>
//                     <TableHead className="font-semibold">Created</TableHead>
//                     <TableHead className="text-right font-semibold">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredReports.length > 0 ? (
//                     filteredReports.map((report) => (
//                       <TableRow key={report._id} className="hover:bg-gray-50">
//                         <TableCell className="font-medium py-4">
//                           <div className="flex items-start gap-3">
//                             <div className="mt-0.5">
//                               <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
//                             </div>
//                             <div className="min-w-0 flex-1">
//                               <div className="font-semibold text-gray-900 line-clamp-1">
//                                 {report.title || "Untitled Report"}
//                               </div>
//                               <div className="text-sm text-gray-600 line-clamp-2 mt-1">
//                                 {report.fakeClaim || "No claim provided"}
//                               </div>
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell className="py-4">
//                           <Badge variant="outline" className="font-medium">
//                             {categories.find(cat => cat.value === report.category)?.label || 
//                              report.category?.charAt(0).toUpperCase() + report.category?.slice(1) || "Uncategorized"}
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="py-4">
//                           <Badge
//                             className={
//                               severityOptions.find(
//                                 (s) => s.value === report.severity
//                               )?.color + " font-medium" || "bg-gray-100 text-gray-800 font-medium"
//                             }
//                           >
//                             {severityOptions.find(
//                               (s) => s.value === report.severity
//                             )?.label || report.severity?.charAt(0).toUpperCase() + report.severity?.slice(1) || "Unknown"}
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="py-4">
//                           <Badge
//                             variant="outline"
//                             className={
//                               statusOptions.find((s) => s.value === report.status)
//                                 ?.color + " font-medium" || "bg-gray-100 text-gray-800 font-medium"
//                             }
//                           >
//                             {statusOptions.find((s) => s.value === report.status)
//                               ?.label || report.status?.charAt(0).toUpperCase() + report.status?.slice(1) || "Unknown"}
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="py-4">
//                           <div className="flex items-center gap-2">
//                             <Eye className="h-4 w-4 text-gray-400" />
//                             <span className="font-medium">{report.views?.toLocaleString() || 0}</span>
//                           </div>
//                         </TableCell>
//                         <TableCell className="py-4">
//                           <div className="text-gray-700">
//                             {report.createdAt ? format(new Date(report.createdAt), "MMM d, yyyy") : "N/A"}
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-right py-4">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" className="h-8 w-8 p-0">
//                                 <MoreHorizontal className="h-4 w-4" />
//                                 <span className="sr-only">Open menu</span>
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end" className="w-48">
//                               <DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
//                               <DropdownMenuSeparator />
//                               <DropdownMenuItem
//                                 onClick={() =>
//                                   router.push(`/fake-news/${report._id}`)
//                                 }
//                                 className="cursor-pointer"
//                               >
//                                 <Eye className="mr-2 h-4 w-4" />
//                                 <span>View Public</span>
//                               </DropdownMenuItem>
//                               <DropdownMenuItem 
//                                 onClick={() => onEdit(report)}
//                                 className="cursor-pointer"
//                               >
//                                 <Edit className="mr-2 h-4 w-4" />
//                                 <span>Edit</span>
//                               </DropdownMenuItem>
//                               <DropdownMenuSeparator />
//                               <DropdownMenuItem
//                                 className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
//                                 onClick={() => handleDelete(report._id)}
//                               >
//                                 <Trash2 className="mr-2 h-4 w-4" />
//                                 <span>Delete</span>
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={7} className="text-center py-12">
//                         <div className="flex flex-col items-center justify-center">
//                           <AlertTriangle className="h-12 w-12 text-gray-300 mb-4" />
//                           <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                             No reports found
//                           </h3>
//                           <p className="text-gray-500 mb-6 max-w-md">
//                             {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
//                               ? "No reports match your search criteria. Try adjusting your filters."
//                               : "There are no fake news reports yet. Create your first report to get started."}
//                           </p>
//                           {!searchQuery && selectedCategory === "all" && selectedStatus === "all" && (
//                             <Button onClick={onCreateNew} className="gap-2">
//                               <Plus className="h-4 w-4" />
//                               Create First Report
//                             </Button>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>

//             {filteredReports.length > 0 && pagination.pages > 1 && (
//               <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-6 border-t">
//                 <div className="text-sm text-gray-600 mb-4 sm:mb-0">
//                   <span className="font-medium">Showing {filteredReports.length} reports</span>
//                   {pagination.total > 0 && (
//                     <span className="ml-2">of {pagination.total} total</span>
//                   )}
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     disabled={pagination.page === 1 || loading}
//                     onClick={() => handlePageChange(pagination.page - 1)}
//                     className="px-4"
//                   >
//                     Previous
//                   </Button>
//                   <div className="flex items-center space-x-1">
//                     {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
//                       let pageNum;
//                       if (pagination.pages <= 5) {
//                         pageNum = i + 1;
//                       } else if (pagination.page <= 3) {
//                         pageNum = i + 1;
//                       } else if (pagination.page >= pagination.pages - 2) {
//                         pageNum = pagination.pages - 4 + i;
//                       } else {
//                         pageNum = pagination.page - 2 + i;
//                       }
                      
//                       return (
//                         <Button
//                           key={pageNum}
//                           variant={pagination.page === pageNum ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => handlePageChange(pageNum)}
//                           disabled={loading}
//                           className="w-10 h-10"
//                         >
//                           {pageNum}
//                         </Button>
//                       );
//                     })}
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     disabled={pagination.page === pagination.pages || loading}
//                     onClick={() => handlePageChange(pagination.page + 1)}
//                     className="px-4"
//                   >
//                     Next
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
















// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Search, MoreHorizontal, Eye, Edit, Trash2, AlertTriangle, Plus, RefreshCw } from "lucide-react";
// import { format } from "date-fns";
// import { CategoryOption, FakeNewsReport } from "@/lib/mock-data/fake-type";
// import { toast } from "sonner";

// interface FakeNewsTableProps {
//   categories: CategoryOption[];
//   categoriesLoading: boolean;
//   onCreateNew: () => void;
// }

// const severityOptions = [
//   { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
//   { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
//   { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
//   { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
// ];

// const statusOptions = [
//   { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
//   { value: "published", label: "Published", color: "bg-blue-100 text-blue-800" },
//   { value: "archived", label: "Archived", color: "bg-purple-100 text-purple-800" },
// ];


// export default function FakeNewsTable({
//   categories,
//   categoriesLoading,
//   onCreateNew,
// }: FakeNewsTableProps) {
//   const router = useRouter();
//   const [reports, setReports] = useState<FakeNewsReport[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const [pagination, setPagination] = useState({
//     total: 0,
//     page: 1,
//     limit: 10,
//     pages: 0,
//   });

//   // Fetch reports from API
//   const fetchReports = async (page = 1, limit = 10, search = "", category = "", status = "") => {
//     try {
//       setLoading(true);
      
//       // Build query parameters
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//       });

//       // Add optional filters
//       if (search && search.trim() !== "") {
//         params.append("search", search.trim());
//       }
//       if (category && category !== "all") {
//         params.append("category", category);
//       }
//       if (status && status !== "all") {
//         params.append("status", status);
//       }

//       const url = `/api/admin/fake-news?${params.toString()}`;
      
//       const response = await fetch(url, {
//         method: "GET"
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           toast.error("Authentication failed. Please check your credentials.");
//         } else if (response.status === 403) {
//           toast.error("You don't have permission to access this resource.");
//         } else {
//           toast.error(`Failed to load reports: ${response.statusText}`);
//         }
//         return;
//       }

//       const data = await response.json();
      
//       if (data.success === false) {
//         toast.error(data.message || "Failed to load reports");
//         return;
//       }
      
//       setReports(data.reports || []);
//       setPagination(data.pagination || {
//         total: 0,
//         page: page,
//         limit: limit,
//         pages: 0,
//       });
      
//     } catch (error) {
//       console.error("Error fetching reports:", error);
//       toast.error("Failed to load reports. Please check your network connection.");
//       setReports([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchReports();
//   }, []);

//   // Handle search change with debouncing
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchReports(
//         1, 
//         pagination.limit, 
//         searchQuery, 
//         selectedCategory !== "all" ? selectedCategory : "", 
//         selectedStatus !== "all" ? selectedStatus : ""
//       );
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   // Handle category/status change
//   useEffect(() => {
//     if (selectedCategory !== "all" || selectedStatus !== "all") {
//       fetchReports(
//         1, 
//         pagination.limit, 
//         searchQuery, 
//         selectedCategory !== "all" ? selectedCategory : "", 
//         selectedStatus !== "all" ? selectedStatus : ""
//       );
//     }
//   }, [selectedCategory, selectedStatus]);

//   // Handle edit report
//   const handleEdit = async (report: FakeNewsReport) => {
//     try {
//       // Navigate to edit page or open edit modal
//       // For now, we'll show a toast and open edit modal
//       toast.info("Edit functionality would open edit form");
//       // In your actual implementation, you would:
//       // 1. Open a modal with the report data
//       // 2. On save, call the PATCH API
//       // 3. Refresh the list after successful update
//     } catch (error) {
//       console.error("Error preparing edit:", error);
//     }
//   };

//   // Handle delete with confirmation
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
//       return;
//     }

//     try {
//       setLoading(true);
      
//       const response = await fetch(`/api/admin/fake-news/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Authentication failed");
//         } else if (response.status === 404) {
//           throw new Error("Report not found");
//         } else {
//           throw new Error(`Failed to delete: ${response.statusText}`);
//         }
//       }

//       const data = await response.json();
      
//       if (data.success === false) {
//         throw new Error(data.message || "Failed to delete report");
//       }

//       toast.success("Report deleted successfully");
      
//       // Remove the deleted report from local state immediately
//       setReports(prevReports => prevReports.filter(report => report._id !== id));
      
//       // Also update pagination total
//       setPagination(prev => ({
//         ...prev,
//         total: Math.max(0, prev.total - 1)
//       }));

//     } catch (error) {
//       console.error("Error deleting report:", error);
//       toast.error(error instanceof Error ? error.message : "Failed to delete report");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle quick status update
//   const handleStatusUpdate = async (id: string, newStatus: string) => {
//     try {
//       const response = await fetch(`/api/admin/fake-news/${id}`, {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to update status: ${response.statusText}`);
//       }

//       const data = await response.json();
      
//       if (data.success === false) {
//         throw new Error(data.message || "Failed to update status");
//       }

//       // Update local state
//       setReports(prevReports =>
//         prevReports.map(report =>
//           report._id === id ? { ...report, status: newStatus } : report
//         )
//       );

//       toast.success(`Status updated to ${newStatus}`);
//     } catch (error) {
//       console.error("Error updating status:", error);
//       toast.error(error instanceof Error ? error.message : "Failed to update status");
//     }
//   };

//   // Handle page change
//   const handlePageChange = (page: number) => {
//     fetchReports(
//       page, 
//       pagination.limit, 
//       searchQuery, 
//       selectedCategory !== "all" ? selectedCategory : "", 
//       selectedStatus !== "all" ? selectedStatus : ""
//     );
//   };

//   // Handle refresh
//   const handleRefresh = () => {
//     fetchReports(
//       pagination.page, 
//       pagination.limit, 
//       searchQuery, 
//       selectedCategory !== "all" ? selectedCategory : "", 
//       selectedStatus !== "all" ? selectedStatus : ""
//     );
//   };

//   // Handle search change
//   const handleSearchChange = (query: string) => {
//     setSearchQuery(query);
//   };

//   // Handle category change
//   const handleCategoryChange = (category: string) => {
//     setSelectedCategory(category);
//   };

//   // Handle status change
//   const handleStatusChange = (status: string) => {
//     setSelectedStatus(status);
//   };

//   // Handle view report details
//   const handleViewDetails = async (id: string) => {
//     try {
//       // Fetch full report details
//       const response = await fetch(`/api/admin/fake-news/${id}`, {
//         method: "GET",
//         headers: getAuthHeaders(),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch details: ${response.statusText}`);
//       }

//       const data = await response.json();
      
//       if (data.success === false) {
//         throw new Error(data.message || "Failed to fetch details");
//       }

//       // Navigate to view page with full details
//       router.push(`/admin/fake-news/${id}`);
//     } catch (error) {
//       console.error("Error viewing details:", error);
//       toast.error(error instanceof Error ? error.message : "Failed to view details");
//     }
//   };

//   // Filter reports locally (for immediate UI updates while API loads)
//   const filteredReports = reports.filter((report) => {
//     // Category filter
//     if (selectedCategory !== "all" && report.category !== selectedCategory)
//       return false;
    
//     // Status filter
//     if (selectedStatus !== "all" && report.status !== selectedStatus)
//       return false;
    
//     // Search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       return (
//         (report.title?.toLowerCase() || "").includes(query) ||
//         (report.fakeClaim?.toLowerCase() || "").includes(query) ||
//         (report.tags?.some((tag) => tag.toLowerCase().includes(query)) || false) ||
//         (report.titleHi?.toLowerCase() || "").includes(query) ||
//         (report.fakeClaimHi?.toLowerCase() || "").includes(query)
//       );
//     }
    
//     return true;
//   });

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <CardTitle className="text-2xl">All Fake News Reports</CardTitle>
//           <div className="flex items-center gap-3">
//             <Button
//               variant="outline"
//               onClick={handleRefresh}
//               disabled={loading}
//               size="sm"
//               className="flex items-center gap-2"
//             >
//               <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
//               Refresh
//             </Button>
//             <Button onClick={onCreateNew} size="sm" className="flex items-center gap-2">
//               <Plus className="h-4 w-4" />
//               New Report
//             </Button>
//           </div>
//         </div>
        
//         <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <Input
//               placeholder="Search reports by title, claim, or tags..."
//               value={searchQuery}
//               onChange={(e) => handleSearchChange(e.target.value)}
//               className="pl-10 w-full"
//               disabled={loading}
//             />
//           </div>
//           <Select
//             value={selectedCategory}
//             onValueChange={handleCategoryChange}
//             disabled={categoriesLoading || loading}
//           >
//             <SelectTrigger className="w-full sm:w-[180px]">
//               <SelectValue placeholder="All Categories" />
//               {categoriesLoading && (
//                 <span className="absolute right-8">...</span>
//               )}
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Categories</SelectItem>
//               {categories.map((cat) => (
//                 <SelectItem key={cat.value} value={cat.value}>
//                   {cat.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Select 
//             value={selectedStatus} 
//             onValueChange={handleStatusChange}
//             disabled={loading}
//           >
//             <SelectTrigger className="w-full sm:w-[180px]">
//               <SelectValue placeholder="All Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               {statusOptions.map((status) => (
//                 <SelectItem key={status.value} value={status.value}>
//                   {status.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {loading && reports.length === 0 ? (
//           <div className="flex items-center justify-center p-12">
//             <div className="flex flex-col items-center gap-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
//               <span className="text-gray-600">Loading reports...</span>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="rounded-md border overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-50 hover:bg-gray-50">
//                     <TableHead className="font-semibold">Title</TableHead>
//                     <TableHead className="font-semibold">Category</TableHead>
//                     <TableHead className="font-semibold">Severity</TableHead>
//                     <TableHead className="font-semibold">Status</TableHead>
//                     <TableHead className="font-semibold">Views</TableHead>
//                     <TableHead className="font-semibold">Created</TableHead>
//                     <TableHead className="text-right font-semibold">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredReports.length > 0 ? (
//                     filteredReports.map((report) => (
//                       <TableRow key={report._id} className="hover:bg-gray-50">
//                         <TableCell className="font-medium py-4">
//                           <div className="flex items-start gap-3">
//                             <div className="mt-0.5">
//                               <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
//                             </div>
//                             <div className="min-w-0 flex-1">
//                               <div className="font-semibold text-gray-900 line-clamp-1">
//                                 {report.title || "Untitled Report"}
//                               </div>
//                               <div className="text-sm text-gray-600 line-clamp-2 mt-1">
//                                 {report.fakeClaim || "No claim provided"}
//                               </div>
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell className="py-4">
//                           <Badge variant="outline" className="font-medium">
//                             {categories.find(cat => cat.value === report.category)?.label || 
//                              report.category?.charAt(0).toUpperCase() + report.category?.slice(1) || "Uncategorized"}
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="py-4">
//                           <Badge
//                             className={
//                               severityOptions.find(
//                                 (s) => s.value === report.severity
//                               )?.color + " font-medium" || "bg-gray-100 text-gray-800 font-medium"
//                             }
//                           >
//                             {severityOptions.find(
//                               (s) => s.value === report.severity
//                             )?.label || report.severity?.charAt(0).toUpperCase() + report.severity?.slice(1) || "Unknown"}
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="py-4">
//                           <div className="flex items-center gap-2">
//                             <Badge
//                               variant="outline"
//                               className={
//                                 statusOptions.find((s) => s.value === report.status)
//                                   ?.color + " font-medium" || "bg-gray-100 text-gray-800 font-medium"
//                               }
//                             >
//                               {statusOptions.find((s) => s.value === report.status)
//                                 ?.label || report.status?.charAt(0).toUpperCase() + report.status?.slice(1) || "Unknown"}
//                             </Badge>
//                             <DropdownMenu>
//                               <DropdownMenuTrigger asChild>
//                                 <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
//                                   <MoreHorizontal className="h-3 w-3" />
//                                 </Button>
//                               </DropdownMenuTrigger>
//                               <DropdownMenuContent align="end">
//                                 <DropdownMenuLabel>Change Status</DropdownMenuLabel>
//                                 {statusOptions.map((status) => (
//                                   report.status !== status.value && (
//                                     <DropdownMenuItem
//                                       key={status.value}
//                                       onClick={() => handleStatusUpdate(report._id, status.value)}
//                                     >
//                                       {status.label}
//                                     </DropdownMenuItem>
//                                   )
//                                 ))}
//                               </DropdownMenuContent>
//                             </DropdownMenu>
//                           </div>
//                         </TableCell>
//                         <TableCell className="py-4">
//                           <div className="flex items-center gap-2">
//                             <Eye className="h-4 w-4 text-gray-400" />
//                             <span className="font-medium">{report.views?.toLocaleString() || 0}</span>
//                           </div>
//                         </TableCell>
//                         <TableCell className="py-4">
//                           <div className="text-gray-700">
//                             {report.createdAt ? format(new Date(report.createdAt), "MMM d, yyyy") : "N/A"}
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-right py-4">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" className="h-8 w-8 p-0">
//                                 <MoreHorizontal className="h-4 w-4" />
//                                 <span className="sr-only">Open menu</span>
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end" className="w-48">
//                               <DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
//                               <DropdownMenuSeparator />
//                               <DropdownMenuItem
//                                 onClick={() => handleViewDetails(report._id)}
//                                 className="cursor-pointer"
//                               >
//                                 <Eye className="mr-2 h-4 w-4" />
//                                 <span>View Details</span>
//                               </DropdownMenuItem>
//                               <DropdownMenuItem 
//                                 onClick={() => handleEdit(report)}
//                                 className="cursor-pointer"
//                               >
//                                 <Edit className="mr-2 h-4 w-4" />
//                                 <span>Edit</span>
//                               </DropdownMenuItem>
//                               <DropdownMenuSeparator />
//                               <div className="px-2 py-1.5">
//                                 <p className="text-xs font-medium text-gray-500">Quick Status</p>
//                                 <div className="flex flex-wrap gap-1 mt-1">
//                                   {statusOptions.map((status) => (
//                                     report.status !== status.value && (
//                                       <Button
//                                         key={status.value}
//                                         size="sm"
//                                         variant="ghost"
//                                         className="h-6 text-xs px-2"
//                                         onClick={() => handleStatusUpdate(report._id, status.value)}
//                                       >
//                                         {status.label}
//                                       </Button>
//                                     )
//                                   ))}
//                                 </div>
//                               </div>
//                               <DropdownMenuSeparator />
//                               <DropdownMenuItem
//                                 className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
//                                 onClick={() => handleDelete(report._id)}
//                               >
//                                 <Trash2 className="mr-2 h-4 w-4" />
//                                 <span>Delete</span>
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={7} className="text-center py-12">
//                         <div className="flex flex-col items-center justify-center">
//                           <AlertTriangle className="h-12 w-12 text-gray-300 mb-4" />
//                           <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                             No reports found
//                           </h3>
//                           <p className="text-gray-500 mb-6 max-w-md">
//                             {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
//                               ? "No reports match your search criteria. Try adjusting your filters."
//                               : "There are no fake news reports yet. Create your first report to get started."}
//                           </p>
//                           {!searchQuery && selectedCategory === "all" && selectedStatus === "all" && (
//                             <Button onClick={onCreateNew} className="gap-2">
//                               <Plus className="h-4 w-4" />
//                               Create First Report
//                             </Button>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>

//             {filteredReports.length > 0 && pagination.pages > 1 && (
//               <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-6 border-t">
//                 <div className="text-sm text-gray-600 mb-4 sm:mb-0">
//                   <span className="font-medium">Showing {filteredReports.length} of {reports.length} reports</span>
//                   {pagination.total > 0 && (
//                     <span className="ml-2">(Total: {pagination.total})</span>
//                   )}
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     disabled={pagination.page === 1 || loading}
//                     onClick={() => handlePageChange(pagination.page - 1)}
//                     className="px-4"
//                   >
//                     Previous
//                   </Button>
//                   <div className="flex items-center space-x-1">
//                     {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
//                       let pageNum;
//                       if (pagination.pages <= 5) {
//                         pageNum = i + 1;
//                       } else if (pagination.page <= 3) {
//                         pageNum = i + 1;
//                       } else if (pagination.page >= pagination.pages - 2) {
//                         pageNum = pagination.pages - 4 + i;
//                       } else {
//                         pageNum = pagination.page - 2 + i;
//                       }
                      
//                       return (
//                         <Button
//                           key={pageNum}
//                           variant={pagination.page === pageNum ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => handlePageChange(pageNum)}
//                           disabled={loading}
//                           className="w-10 h-10"
//                         >
//                           {pageNum}
//                         </Button>
//                       );
//                     })}
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     disabled={pagination.page === pagination.pages || loading}
//                     onClick={() => handlePageChange(pagination.page + 1)}
//                     className="px-4"
//                   >
//                     Next
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// }




























"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Plus, 
  RefreshCw, 
  X,
  Save,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { CategoryOption, FakeNewsReport, FakeNewsFormData } from "@/lib/mock-data/fake-type";
import { toast } from "sonner";
import FakeNewsForm from "./fake-news-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FakeNewsTableProps {
  categories: CategoryOption[];
  categoriesLoading: boolean;
  onCreateNew: () => void;
}

const severityOptions = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
];

const statusOptions = [
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
  { value: "published", label: "Published", color: "bg-blue-100 text-blue-800" },
  { value: "archived", label: "Archived", color: "bg-purple-100 text-purple-800" },
];

export default function FakeNewsTable({
  categories,
  categoriesLoading,
  onCreateNew,
}: FakeNewsTableProps) {
  const router = useRouter();
  const [reports, setReports] = useState<FakeNewsReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<FakeNewsReport | null>(null);
  const [formData, setFormData] = useState<FakeNewsFormData | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Helper to convert FakeNewsReport to FakeNewsFormData
  const convertToFormData = (report: FakeNewsReport): FakeNewsFormData => {
    return {
      title: report.title || "",
      titleHi: report.titleHi || "",
      fakeClaim: report.fakeClaim || "",
      fakeClaimHi: report.fakeClaimHi || "",
      factCheck: report.factCheck || "",
      factCheckHi: report.factCheckHi || "",
      explanation: report.explanation || "",
      explanationHi: report.explanationHi || "",
      detailedAnalysis: report.detailedAnalysis || "",
      detailedAnalysisHi: report.detailedAnalysisHi || "",
      evidence: report.evidence?.map(e => ({
        type: e.type || "image",
        url: e.url || "",
        title: e.title || "",
        description: e.description || "",
        timestamp: e.timestamp || "",
      })) || [],
      category: report.category || "political",
      severity: report.severity || "medium",
      origin: report.origin || "",
      spreadPlatforms: report.spreadPlatforms || [],
      debunkedBy: report.debunkedBy?.map(d => ({
        name: d.name || "",
        logo: d.logo || "",
        expertise: d.expertise || "",
        verificationDate: d.verificationDate || "",
      })) || [],
      debunkedAt: report.debunkedAt ? new Date(report.debunkedAt).toISOString().split('T')[0] : "",
      verifiedSources: report.verifiedSources?.map(s => ({
        name: s.name || "",
        url: s.url || "",
        type: s.type || "government",
        credibilityScore: s.credibilityScore || 100,
      })) || [],
      tags: report.tags || [],
      timeline: report.timeline?.map(t => ({
        date: t.date || "",
        event: t.event || "",
        description: t.description || "",
      })) || [],
      visualComparison: report.visualComparison ? {
        original: report.visualComparison.original || "",
        manipulated: report.visualComparison.manipulated || "",
        analysis: report.visualComparison.analysis || "",
      } : {
        original: "",
        manipulated: "",
        analysis: "",
      },
      impact: report.impact ? {
        reach: report.impact.reach || 0,
        countries: report.impact.countries || [],
        platforms: report.impact.platforms || [],
        duration: report.impact.duration || "",
      } : {
        reach: 0,
        countries: [],
        platforms: [],
        duration: "",
      },
      preventionTips: report.preventionTips || [],
      factChecker: report.factChecker ? {
        name: report.factChecker.name || "",
        avatar: report.factChecker.avatar || "",
        expertise: report.factChecker.expertise || [],
        experience: report.factChecker.experience || "",
        verifiedChecks: report.factChecker.verifiedChecks || 0,
      } : {
        name: "",
        avatar: "",
        expertise: [],
        experience: "",
        verifiedChecks: 0,
      },
      status: report.status || "draft",
    };
  };

  // Fetch reports from API
  const fetchReports = async (page = 1, limit = 10, search = "", category = "", status = "") => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add optional filters
      if (search && search.trim() !== "") {
        params.append("search", search.trim());
      }
      if (category && category !== "all") {
        params.append("category", category);
      }
      if (status && status !== "all") {
        params.append("status", status);
      }

      const url = `/api/admin/fake-news?${params.toString()}`;
      
      const response = await fetch(url, {
        method: "GET"
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Authentication failed. Please check your credentials.");
        } else if (response.status === 403) {
          toast.error("You don't have permission to access this resource.");
        } else {
          toast.error(`Failed to load reports: ${response.statusText}`);
        }
        return;
      }

      const data = await response.json();
      
      if (data.success === false) {
        toast.error(data.message || "Failed to load reports");
        return;
      }
      
      setReports(data.reports || []);
      setPagination(data.pagination || {
        total: 0,
        page: page,
        limit: limit,
        pages: 0,
      });
      
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports. Please check your network connection.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchReports();
  }, []);

  // Handle search change with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports(
        1, 
        pagination.limit, 
        searchQuery, 
        selectedCategory !== "all" ? selectedCategory : "", 
        selectedStatus !== "all" ? selectedStatus : ""
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle category/status change
  useEffect(() => {
    if (selectedCategory !== "all" || selectedStatus !== "all") {
      fetchReports(
        1, 
        pagination.limit, 
        searchQuery, 
        selectedCategory !== "all" ? selectedCategory : "", 
        selectedStatus !== "all" ? selectedStatus : ""
      );
    }
  }, [selectedCategory, selectedStatus]);

  // Handle edit report - opens modal
  const handleEdit = (report: FakeNewsReport) => {
    setEditingReport(report);
    const formData = convertToFormData(report);
    setFormData(formData);
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Handle form data change
  const handleFormChange = (data: FakeNewsFormData) => {
    setFormData(data);
    // Clear errors when user makes changes
    setFormErrors({});
  };

  // Validate form
  const validateForm = (data: FakeNewsFormData): boolean => {
    const errors: Record<string, string> = {};

    if (!data.title?.trim()) errors.title = "Title (English) is required";
    if (!data.titleHi?.trim()) errors.titleHi = "Title (Hindi) is required";
    if (!data.fakeClaim?.trim()) errors.fakeClaim = "Fake Claim (English) is required";
    if (!data.fakeClaimHi?.trim()) errors.fakeClaimHi = "Fake Claim (Hindi) is required";
    if (!data.factCheck?.trim()) errors.factCheck = "Fact Check (English) is required";
    if (!data.factCheckHi?.trim()) errors.factCheckHi = "Fact Check (Hindi) is required";
    if (!data.explanation?.trim()) errors.explanation = "Explanation (English) is required";
    if (!data.explanationHi?.trim()) errors.explanationHi = "Explanation (Hindi) is required";
    if (!data.category) errors.category = "Category is required";
    if (!data.severity) errors.severity = "Severity is required";
    if (!data.origin?.trim()) errors.origin = "Origin is required";
    if (!data.debunkedAt) errors.debunkedAt = "Debunked Date is required";

    // Validate evidence
    data.evidence.forEach((evidence, index) => {
      if (!evidence.url?.trim()) errors[`evidence_${index}_url`] = `Evidence ${index + 1} URL is required`;
      if (!evidence.title?.trim()) errors[`evidence_${index}_title`] = `Evidence ${index + 1} Title is required`;
      if (!evidence.description?.trim()) errors[`evidence_${index}_description`] = `Evidence ${index + 1} Description is required`;
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle save/edit
  const handleSave = async () => {
    if (!formData || !editingReport) return;

    // Validate form
    if (!validateForm(formData)) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      setIsSaving(true);
      
      // Call PATCH API
      const response = await fetch(`/api/admin/fake-news/${editingReport._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success === false) {
        throw new Error(data.message || "Failed to update report");
      }

      toast.success("Report updated successfully");
      
      // Update local state
      setReports(prevReports =>
        prevReports.map(report =>
          report._id === editingReport._id ? data.data || report : report
        )
      );

      // Close modal
      setIsEditModalOpen(false);
      setEditingReport(null);
      setFormData(null);
      setFormErrors({});

    } catch (error) {
      console.error("Error updating report:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update report");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete with confirmation
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`/api/admin/fake-news/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success === false) {
        throw new Error(data.message || "Failed to delete report");
      }

      toast.success("Report deleted successfully");
      
      // Remove the deleted report from local state immediately
      setReports(prevReports => prevReports.filter(report => report._id !== id));
      
      // Also update pagination total
      setPagination(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1)
      }));

    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete report");
    } finally {
      setLoading(false);
    }
  };

  // Handle quick status update
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/fake-news/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update status: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success === false) {
        throw new Error(data.message || "Failed to update status");
      }

      // Update local state
      setReports(prevReports =>
        prevReports.map(report =>
          report._id === id ? { ...report, status: newStatus } : report
        )
      );

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchReports(
      page, 
      pagination.limit, 
      searchQuery, 
      selectedCategory !== "all" ? selectedCategory : "", 
      selectedStatus !== "all" ? selectedStatus : ""
    );
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchReports(
      pagination.page, 
      pagination.limit, 
      searchQuery, 
      selectedCategory !== "all" ? selectedCategory : "", 
      selectedStatus !== "all" ? selectedStatus : ""
    );
  };

  // Handle search change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle status change
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  // Filter reports locally (for immediate UI updates while API loads)
  const filteredReports = reports.filter((report) => {
    // Category filter
    if (selectedCategory !== "all" && report.category !== selectedCategory)
      return false;
    
    // Status filter
    if (selectedStatus !== "all" && report.status !== selectedStatus)
      return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (report.title?.toLowerCase() || "").includes(query) ||
        (report.fakeClaim?.toLowerCase() || "").includes(query) ||
        (report.tags?.some((tag) => tag.toLowerCase().includes(query)) || false) ||
        (report.titleHi?.toLowerCase() || "").includes(query) ||
        (report.fakeClaimHi?.toLowerCase() || "").includes(query)
      );
    }
    
    return true;
  });

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-2xl">All Fake News Reports</CardTitle>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={onCreateNew} size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Report
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports by title, claim, or tags..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 w-full"
                disabled={loading}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
              disabled={categoriesLoading || loading}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
                {categoriesLoading && (
                  <span className="absolute right-8">...</span>
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={selectedStatus} 
              onValueChange={handleStatusChange}
              disabled={loading}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading && reports.length === 0 ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <span className="text-gray-600">Loading reports...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold">Title</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Severity</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Views</TableHead>
                      <TableHead className="font-semibold">Created</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <TableRow key={report._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium py-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold text-gray-900 line-clamp-1">
                                  {report.title || "Untitled Report"}
                                </div>
                                <div className="text-sm text-gray-600 line-clamp-2 mt-1 table-cell-truncate">
                                  {report.fakeClaim || "No claim provided"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge variant="outline" className="font-medium">
                              {categories.find(cat => cat.value === report.category)?.label || 
                               report.category?.charAt(0).toUpperCase() + report.category?.slice(1) || "Uncategorized"}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              className={
                                severityOptions.find(
                                  (s) => s.value === report.severity
                                )?.color + " font-medium" || "bg-gray-100 text-gray-800 font-medium"
                              }
                            >
                              {severityOptions.find(
                                (s) => s.value === report.severity
                              )?.label || report.severity?.charAt(0).toUpperCase() + report.severity?.slice(1) || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={
                                  statusOptions.find((s) => s.value === report.status)
                                    ?.color + " font-medium" || "bg-gray-100 text-gray-800 font-medium"
                                }
                              >
                                {statusOptions.find((s) => s.value === report.status)
                                  ?.label || report.status?.charAt(0).toUpperCase() + report.status?.slice(1) || "Unknown"}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                  {statusOptions.map((status) => (
                                    report.status !== status.value && (
                                      <DropdownMenuItem
                                        key={status.value}
                                        onClick={() => handleStatusUpdate(report._id, status.value)}
                                      >
                                        {status.label}
                                      </DropdownMenuItem>
                                    )
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{report.views?.toLocaleString() || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-gray-700">
                              {report.createdAt ? format(new Date(report.createdAt), "MMM d, yyyy") : "N/A"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => router.push(`/admin/fake-news/${report._id}`)}
                                  className="cursor-pointer"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>View Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleEdit(report)}
                                  className="cursor-pointer"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <div className="px-2 py-1.5">
                                  <p className="text-xs font-medium text-gray-500">Quick Status</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {statusOptions.map((status) => (
                                      report.status !== status.value && (
                                        <Button
                                          key={status.value}
                                          size="sm"
                                          variant="ghost"
                                          className="h-6 text-xs px-2"
                                          onClick={() => handleStatusUpdate(report._id, status.value)}
                                        >
                                          {status.label}
                                        </Button>
                                      )
                                    ))}
                                  </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                                  onClick={() => handleDelete(report._id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center justify-center">
                            <AlertTriangle className="h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                              No reports found
                            </h3>
                            <p className="text-gray-500 mb-6 max-w-md">
                              {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
                                ? "No reports match your search criteria. Try adjusting your filters."
                                : "There are no fake news reports yet. Create your first report to get started."}
                            </p>
                            {!searchQuery && selectedCategory === "all" && selectedStatus === "all" && (
                              <Button onClick={onCreateNew} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Create First Report
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredReports.length > 0 && pagination.pages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-6 border-t">
                  <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                    <span className="font-medium">Showing {filteredReports.length} of {reports.length} reports</span>
                    {pagination.total > 0 && (
                      <span className="ml-2">(Total: {pagination.total})</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1 || loading}
                      onClick={() => handlePageChange(pagination.page - 1)}
                      className="px-4"
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={pagination.page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            disabled={loading}
                            className="w-10 h-10"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === pagination.pages || loading}
                      onClick={() => handlePageChange(pagination.page + 1)}
                      className="px-4"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Edit Fake News Report</DialogTitle>
                <DialogDescription>
                  Update the details of the fake news report
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          {formData && (
            <div className="py-4">
              <FakeNewsForm
                formData={formData}
                categories={categories}
                errors={formErrors}
                onChange={handleFormChange}
              />
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}