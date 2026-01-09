"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Plus } from "lucide-react";
import { toast } from "sonner";
import { CategoryOption, FakeNewsReport } from "@/lib/mock-data/fake-type";
import StatsCards from "./fake-stats-card";
import FakeNewsTable from "./fake-news-table";
import FakeNewsDialog from "./fake-news-dialog";

// Define API response type
interface ApiResponse {
  reports: FakeNewsReport[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  error?: string;
  message?: string;
}

export default function AdminFakeNewsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<FakeNewsReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<FakeNewsReport | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  const [categories, setCategories] = useState<CategoryOption[]>([
    { value: "political", label: "Political" },
    { value: "health", label: "Health" },
    { value: "technology", label: "Technology" },
    { value: "entertainment", label: "Entertainment" },
    { value: "social", label: "Social" },
    { value: "other", label: "Other" },
  ]);

  const API_BASE_URL = "/api/admin/fake-news";

  // Get auth token from localStorage
  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin-token") || null;
    }
    return null;
  }, []);

  // Get auth headers
  const getAuthHeaders = useCallback(() => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }, [getAuthToken]);

  // Check authentication and redirect if not logged in
  const checkAuth = useCallback(() => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please login to access this page");
      router.push("/admin/login");
      return false;
    }
    return true;
  }, [getAuthToken, router]);

  // Simple fetch helper with proper error handling
  const fetchReports = useCallback(async () => {
    // Check authentication first
    if (!checkAuth()) return;

    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      // Get auth headers
      const headers = getAuthHeaders();

      // Use GET request with Authorization header
      const url = `${API_BASE_URL}?${params}`;
      const response = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("admin-token");
        router.push("/admin/login");
        return;
      }

      // Handle other errors
      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              errorData.error ||
              `HTTP error! status: ${response.status}`
          );
        } catch {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = (await response.json()) as ApiResponse;

      // Handle successful response
      setReports(data.reports || []);
      setPagination(
        data.pagination || {
          total: data.reports?.length || 0,
          page: pagination.page,
          limit: pagination.limit,
          pages: Math.ceil((data.reports?.length || 0) / pagination.limit),
        }
      );
    } catch (error) {
      console.error("Error fetching reports:", error);

      // Show user-friendly error message
      if (error instanceof Error) {
        if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        ) {
          toast.error("Network error. Please check your connection.");
        } else if (error.message.includes("500")) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to load fake news reports");
      }

      // Set empty state to prevent UI from breaking
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    selectedCategory,
    selectedStatus,
    searchQuery,
    getAuthHeaders,
    checkAuth,
    router,
  ]);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const headers = getAuthHeaders();
      const response = await fetch("/api/categories", {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        // Silently fail for categories - we have defaults
        console.log("Failed to fetch categories, using defaults");
        return;
      }

      const data = await response.json();

      if (data.categories && Array.isArray(data.categories)) {
        const formattedCategories = data.categories
          .filter((cat: { isActive: boolean }) => cat.isActive)
          .map((cat: { slug: string; name: string }) => ({
            value: cat.slug,
            label: cat.name,
          }));

        // Merge with defaults
        const defaultCategories = [
          { value: "political", label: "Political" },
          { value: "health", label: "Health" },
          { value: "technology", label: "Technology" },
          { value: "entertainment", label: "Entertainment" },
          { value: "social", label: "Social" },
          { value: "other", label: "Other" },
        ];

        // Create a map to avoid duplicates
        const categoryMap = new Map();
        [...defaultCategories, ...formattedCategories].forEach((cat) => {
          categoryMap.set(cat.value, cat);
        });

        setCategories(Array.from(categoryMap.values()));
      }
    } catch (error) {
      // Silently handle category fetch errors
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  }, [getAuthHeaders]);

  // Initial data fetch
  useEffect(() => {
    if (checkAuth()) {
      fetchCategories();
      fetchReports();
    }
  }, [checkAuth, fetchCategories, fetchReports]);

  // Delete report
  const deleteReport = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this report? This action cannot be undone."
      )
    )
      return;

    // Check authentication
    if (!checkAuth()) return;

    try {
      const headers = getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers,
      });

      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("admin-token");
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            errorData.error ||
            `Delete failed: ${response.status}`
        );
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      // Update local state
      setReports((prev) => prev.filter((report) => report._id !== id));
      toast.success("Report deleted successfully");

      // Refresh pagination stats
      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete report"
      );
    }
  };

  // Handle edit
  const handleEdit = (report: FakeNewsReport) => {
    setEditingReport(report);
    setIsDialogOpen(true);
  };

  // Handle form submission
  const handleFormSubmit = (report: FakeNewsReport, isNew: boolean) => {
    if (isNew) {
      setReports([report, ...reports]);
    } else {
      setReports(reports.map((r) => (r._id === report._id ? report : r)));
    }
  };

  // Stats calculation
  const stats = {
    total: reports.length,
    published: reports.filter((r) => r.status === "published").length,
    draft: reports.filter((r) => r.status === "draft").length,
    highSeverity: reports.filter((r) => r.severity === "high").length,
    criticalSeverity: reports.filter((r) => r.severity === "critical").length,
    totalViews: reports.reduce((sum, r) => sum + (r.views || 0), 0),
    totalShares: reports.reduce((sum, r) => sum + (r.shares || 0), 0),
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Fake News Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and publish fake news debunking reports
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={fetchReports}
            disabled={loading}
            size="sm"
            className="flex items-center"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => setIsDialogOpen(true)}
            size="sm"
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Reports Table */}
      <Card className="overflow-hidden">
        <FakeNewsTable
          reports={reports}
          loading={loading}
          categories={categories}
          categoriesLoading={categoriesLoading}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          pagination={pagination}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onStatusChange={setSelectedStatus}
          onPageChange={(page: number) => {
            setPagination({ ...pagination, page });
            // Fetch new page data
            const fetchPage = async () => {
              await fetchReports();
            };
            fetchPage();
          }}
          onEdit={handleEdit}
          onDelete={deleteReport}
          onRefresh={fetchReports}
        />
      </Card>

      {/* Create/Edit Dialog */}
      <FakeNewsDialog
        open={isDialogOpen}
        editingReport={editingReport}
        categories={categories}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingReport(null);
          }
        }}
        onSubmitSuccess={(report, isNew) => {
          handleFormSubmit(report, isNew);
          setIsDialogOpen(false);
          setEditingReport(null);
          fetchReports(); // Refresh the list
        }}
      />
    </div>
  );
}
