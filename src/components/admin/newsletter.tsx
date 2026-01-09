"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Mail,
  Users,
  Send,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Download,
  Upload,
  Calendar,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Subscriber {
  _id: string;
  email: string;
  name: string;
  language: string;
  isActive: boolean;
  subscribedAt: string;
  isVerified: boolean;
  source?: string;
}

interface Campaign {
  _id: string;
  subject: string;
  content: string;
  htmlContent: string;
  language: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  scheduledAt?: string;
  recipients: number;
  opens: number;
  clicks: number;
  createdBy: string;
  createdAt: string;
  sentAt?: string;
}

interface NewsletterStats {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface CampaignsResponse {
  campaigns: Campaign[];
  pagination: Pagination;
}

interface SubscribersResponse {
  subscribers: Subscriber[];
  pagination: Pagination;
}

interface EmailForm {
  subject: string;
  content: string;
  htmlContent: string;
  template: string;
  language: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  scheduledAt: string;
  recipients: number;
  opens: number;
  clicks: number;
}

interface SubscriberForm {
  email: string;
  name: string;
  language: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  subject: string;
  content: string;
  htmlContent: string;
}

export default function NewsletterPage() {
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [isSubscriberDialogOpen, setIsSubscriberDialogOpen] = useState(false);
  const [isTemplatePreviewOpen, setIsTemplatePreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [selectedTab, setSelectedTab] = useState("overview");
  const [emailForm, setEmailForm] = useState<EmailForm>({
    subject: "",
    content: "",
    htmlContent: "",
    template: "default",
    language: "en",
    status: "draft",
    scheduledAt: "",
    recipients: 0,
    opens: 0,
    clicks: 0,
  });
  const [subscriberForm, setSubscriberForm] = useState<SubscriberForm>({
    email: "",
    name: "",
    language: "en",
  });
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [subscriberPagination, setSubscriberPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });
  const [campaignPagination, setCampaignPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [subscriberLoading, setSubscriberLoading] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const API_BASE_URL = "http://localhost:3000/api/admin/newsletter";
  const AUTH_TOKEN = `${localStorage.getItem("admin-token")}`;

  // Fetch campaigns from API
  const fetchCampaigns = useCallback(
    async (page: number = 1, limit: number = 10) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/campaigns?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CampaignsResponse = await response.json();
        setCampaigns(data.campaigns);
        setCampaignPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    },
    [AUTH_TOKEN]
  );

  // Fetch subscribers from API
  const fetchSubscribers = useCallback(
    async (page: number = 1, limit: number = 10) => {
      setSubscriberLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/subscribers?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: SubscribersResponse = await response.json();
        setSubscribers(data.subscribers);
        setSubscriberPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
        toast.error("Failed to load subscribers");
      } finally {
        setSubscriberLoading(false);
      }
    },
    [AUTH_TOKEN]
  );

  // Create a new campaign
  const createCampaign = async (campaignData: Partial<Campaign>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newCampaign = await response.json();
      setCampaigns([newCampaign, ...campaigns]);
      setCampaignPagination({
        ...campaignPagination,
        total: campaignPagination.total + 1,
      });
      toast.success("Campaign created successfully");
      return newCampaign;
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
      throw error;
    }
  };

  // Update an existing campaign
  const updateCampaign = async (
    id: string,
    campaignData: Partial<Campaign>
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedCampaign = await response.json();
      setCampaigns(
        campaigns.map((campaign) =>
          campaign._id === id ? updatedCampaign : campaign
        )
      );
      toast.success("Campaign updated successfully");
      return updatedCampaign;
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("Failed to update campaign");
      throw error;
    }
  };

  // Delete a campaign
  const deleteCampaign = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setCampaigns(campaigns.filter((campaign) => campaign._id !== id));
      setCampaignPagination({
        ...campaignPagination,
        total: campaignPagination.total - 1,
      });
      toast.success("Campaign deleted successfully");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete campaign");
      throw error;
    }
  };

  // Send a campaign
  const sendCampaign = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Update the campaign status in the local state
      setCampaigns(
        campaigns.map((campaign) =>
          campaign._id === id
            ? { ...campaign, status: "sent", sentAt: new Date().toISOString() }
            : campaign
        )
      );

      toast.success(result.message || "Campaign sent successfully");
      return result;
    } catch (error) {
      console.error("Error sending campaign:", error);
      toast.error("Failed to send campaign");
      throw error;
    }
  };

  // Add a new subscriber
  const addSubscriber = async (subscriberData: SubscriberForm) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(subscriberData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newSubscriber = await response.json();
      setSubscribers([newSubscriber, ...subscribers]);
      setSubscriberPagination({
        ...subscriberPagination,
        total: subscriberPagination.total + 1,
      });
      toast.success("Subscriber added successfully");
      return newSubscriber;
    } catch (error) {
      console.error("Error adding subscriber:", error);
      toast.error("Failed to add subscriber");
      throw error;
    }
  };

  // Update subscriber status
  const updateSubscriberStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscribers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedSubscriber = await response.json();
      setSubscribers(
        subscribers.map((subscriber) =>
          subscriber._id === id ? updatedSubscriber : subscriber
        )
      );
      toast.success(
        `Subscriber ${isActive ? "activated" : "deactivated"} successfully`
      );
      return updatedSubscriber;
    } catch (error) {
      console.error("Error updating subscriber:", error);
      toast.error("Failed to update subscriber");
      throw error;
    }
  };

  // Delete a subscriber
  const deleteSubscriber = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscribers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSubscribers(subscribers.filter((subscriber) => subscriber._id !== id));
      setSubscriberPagination({
        ...subscriberPagination,
        total: subscriberPagination.total - 1,
      });
      toast.success("Subscriber deleted successfully");
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast.error("Failed to delete subscriber");
      throw error;
    }
  };

  const templates: Template[] = [
    {
      id: "default",
      name: "Default Newsletter",
      description: "Standard newsletter template",
      preview: "/placeholder.svg",
      subject: "Weekly News Update",
      content: `Dear Subscriber,

Welcome to our weekly newsletter! Here are the top stories from this week:

## Breaking News
- Major political developments in the region
- Economic policy updates affecting markets
- Technology breakthrough announcements

## Sports Highlights
- Championship finals results
- Player transfers and team updates
- Upcoming match schedules

## Opinion & Analysis
- Expert commentary on current events
- Market analysis and predictions
- Editorial perspectives

Thank you for staying informed with us!

Best regards,
The News Team`,
      htmlContent: `<p>Dear Subscriber,</p>
<p>Welcome to our weekly newsletter! Here are the top stories from this week:</p>
<h2>Breaking News</h2>
<ul>
<li>Major political developments in the region</li>
<li>Economic policy updates affecting markets</li>
<li>Technology breakthrough announcements</li>
</ul>
<h2>Sports Highlights</h2>
<ul>
<li>Championship finals results</li>
<li>Player transfers and team updates</li>
<li>Upcoming match schedules</li>
</ul>
<h2>Opinion & Analysis</h2>
<ul>
<li>Expert commentary on current events</li>
<li>Market analysis and predictions</li>
<li>Editorial perspectives</li>
</ul>
<p>Thank you for staying informed with us!</p>
<p>Best regards,<br>The News Team</p>`,
    },
    {
      id: "breaking",
      name: "Breaking News",
      description: "Urgent news alerts",
      preview: "/placeholder.svg",
      subject: "🚨 BREAKING: Important News Alert",
      content: `URGENT UPDATE

This is a breaking news alert regarding recent developments.

## What Happened
[Brief description of the breaking news]

## Key Details
- Timeline of events
- People involved
- Impact and implications

## What's Next
We will continue to monitor this developing story and provide updates as they become available.

Stay tuned for more information.

The News Team`,
      htmlContent: `<p>URGENT UPDATE</p>
<p>This is a breaking news alert regarding recent developments.</p>
<h2>What Happened</h2>
<p>[Brief description of the breaking news]</p>
<h2>Key Details</h2>
<ul>
<li>Timeline of events</li>
<li>People involved</li>
<li>Impact and implications</li>
</ul>
<h2>What's Next</h2>
<p>We will continue to monitor this developing story and provide updates as they become available.</p>
<p>Stay tuned for more information.</p>
<p>The News Team</p>`,
    },
    {
      id: "weekly",
      name: "Weekly Digest",
      description: "Weekly summary format",
      preview: "/placeholder.svg",
      subject: "Your Weekly News Digest",
      content: `Weekly News Digest - [Date]

## This Week's Top Stories

### Politics & Government
- Policy changes and announcements
- Legislative updates
- International relations

### Business & Economy
- Market performance
- Corporate news
- Economic indicators

### Technology & Innovation
- Latest tech developments
- Product launches
- Industry trends

### Sports & Entertainment
- Game results and highlights
- Celebrity news
- Upcoming events

Thank you for reading!`,
      htmlContent: `<p>Weekly News Digest - [Date]</p>
<h2>This Week's Top Stories</h2>
<h3>Politics & Government</h3>
<ul>
<li>Policy changes and announcements</li>
<li>Legislative updates</li>
<li>International relations</li>
</ul>
<h3>Business & Economy</h3>
<ul>
<li>Market performance</li>
<li>Corporate news</li>
<li>Economic indicators</li>
</ul>
<h3>Technology & Innovation</h3>
<ul>
<li>Latest tech developments</li>
<li>Product launches</li>
<li>Industry trends</li>
</ul>
<h3>Sports & Entertainment</h3>
<ul>
<li>Game results and highlights</li>
<li>Celebrity news</li>
<li>Upcoming events</li>
</ul>
<p>Thank you for reading!</p>`,
    },
    {
      id: "special",
      name: "Special Edition",
      description: "Special event template",
      preview: "/placeholder.svg",
      subject: "Special Edition: [Event Name]",
      content: `Special Edition Newsletter

## [Event/Topic Name]

This special edition focuses on [specific event or topic].

### Background
[Context and background information]

### Key Highlights
- Important point 1
- Important point 2
- Important point 3

### Analysis & Impact
[Detailed analysis of the event/topic]

### Looking Forward
[Future implications and what to expect]

We hope you found this special edition informative.

Best regards,
The Editorial Team`,
      htmlContent: `<p>Special Edition Newsletter</p>
<h2>[Event/Topic Name]</h2>
<p>This special edition focuses on [specific event or topic].</p>
<h3>Background</h3>
<p>[Context and background information]</p>
<h3>Key Highlights</h3>
<ul>
<li>Important point 1</li>
<li>Important point 2</li>
<li>Important point 3</li>
</ul>
<h3>Analysis & Impact</h3>
<p>[Detailed analysis of the event/topic]</p>
<h3>Looking Forward</h3>
<p>[Future implications and what to expect]</p>
<p>We hope you found this special edition informative.</p>
<p>Best regards,<br>The Editorial Team</p>`,
    },
  ];

  useEffect(() => {
    fetchCampaigns();
    fetchSubscribers();
  }, [fetchCampaigns, fetchSubscribers]);

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsTemplatePreviewOpen(true);
  };

  const handleUseTemplate = (template: Template) => {
    setEmailForm({
      subject: template.subject,
      content: template.content,
      htmlContent: template.htmlContent,
      template: template.id,
      language: "en",
      status: "draft",
      scheduledAt: "",
      recipients: 0,
      opens: 0,
      clicks: 0,
    });
    setIsComposeDialogOpen(true);
    setIsTemplatePreviewOpen(false);
    setEditingCampaign(null);
  };

  const handleSendNewsletter = async () => {
    try {
      const campaignData = {
        subject: emailForm.subject,
        content: emailForm.content,
        htmlContent: emailForm.htmlContent,
        language: emailForm.language,
        status: emailForm.status,
        scheduledAt:
          emailForm.status === "scheduled" && emailForm.scheduledAt
            ? emailForm.scheduledAt
            : undefined,
        recipients: 0,
        opens: 0,
        clicks: 0,
      };

      if (editingCampaign) {
        await updateCampaign(editingCampaign._id, campaignData);
      } else {
        await createCampaign(campaignData);
      }

      setIsComposeDialogOpen(false);
      setEmailForm({
        subject: "",
        content: "",
        htmlContent: "",
        template: "default",
        language: "en",
        status: "draft",
        scheduledAt: "",
        recipients: 0,
        opens: 0,
        clicks: 0,
      });
      setEditingCampaign(null);
    } catch (error) {
      console.error("Error saving campaign:", error);
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setEmailForm({
      subject: campaign.subject,
      content: campaign.content,
      htmlContent: campaign.htmlContent,
      template: "default",
      language: campaign.language,
      status: campaign.status,
      scheduledAt: campaign.scheduledAt || "",
      recipients: campaign.recipients || 0,
      opens: campaign.opens || 0,
      clicks: campaign.clicks || 0,
    });
    setIsComposeDialogOpen(true);
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      try {
        await deleteCampaign(campaignId);
      } catch (error) {
        console.error("Error deleting campaign:", error);
      }
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    try {
      await sendCampaign(campaignId);
    } catch (error) {
      console.error("Error sending campaign:", error);
    }
  };

  const handleAddSubscriber = async () => {
    try {
      await addSubscriber(subscriberForm);
      setIsSubscriberDialogOpen(false);
      setSubscriberForm({ email: "", name: "", language: "en" });
    } catch (error) {
      console.error("Error adding subscriber:", error);
    }
  };

  const handleToggleSubscriberStatus = async (
    subscriberId: string,
    currentStatus: boolean
  ) => {
    try {
      await updateSubscriberStatus(subscriberId, !currentStatus);
    } catch (error) {
      console.error("Error toggling subscriber status:", error);
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (confirm("Are you sure you want to delete this subscriber?")) {
      try {
        await deleteSubscriber(subscriberId);
      } catch (error) {
        console.error("Error deleting subscriber:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "sent":
        return "default";
      case "scheduled":
        return "secondary";
      case "draft":
        return "outline";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Calculate newsletter stats from real data
  const newsletterStats: NewsletterStats[] = [
    {
      title: "Total Subscribers",
      value: subscribers.filter((s) => s.isActive).length.toString(),
      change: "+0",
      trend: "neutral",
      icon: Users,
    },
    {
      title: "Active Campaigns",
      value: campaigns
        .filter((c) => c.status === "sent" || c.status === "scheduled")
        .length.toString(),
      change: "+0",
      trend: "neutral",
      icon: Mail,
    },
    {
      title: "Open Rate",
      value:
        campaigns.length > 0
          ? `${(
              (campaigns.reduce((sum, c) => sum + (c.opens || 0), 0) /
                campaigns.reduce((sum, c) => sum + (c.recipients || 0), 1)) *
              100
            ).toFixed(1)}%`
          : "0%",
      change: "+0%",
      trend: "neutral",
      icon: Eye,
    },
    {
      title: "Click Rate",
      value:
        campaigns.length > 0
          ? `${(
              (campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0) /
                campaigns.reduce((sum, c) => sum + (c.recipients || 0), 1)) *
              100
            ).toFixed(1)}%`
          : "0%",
      change: "+0%",
      trend: "neutral",
      icon: TrendingUp,
    },
  ];

  // Format datetime-local input value
  const formatDateTimeForInput = (dateString: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "yyyy-MM-dd'T'HH:mm");
    } catch (error) {
      return "";
    }
  };

  if (loading && campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Management</h1>
          <p className="text-muted-foreground">
            Manage subscribers and send newsletters to your audience
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog
            open={isComposeDialogOpen}
            onOpenChange={(open) => {
              setIsComposeDialogOpen(open);
              if (!open) {
                setEditingCampaign(null);
                setEmailForm({
                  subject: "",
                  content: "",
                  htmlContent: "",
                  template: "default",
                  language: "en",
                  status: "draft",
                  scheduledAt: "",
                  recipients: 0,
                  opens: 0,
                  clicks: 0,
                });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Compose Newsletter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCampaign ? "Edit Campaign" : "Compose Newsletter"}
                </DialogTitle>
                <DialogDescription>
                  {editingCampaign
                    ? "Edit your campaign details."
                    : "Create and send a newsletter to your subscribers."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 scroll-auto overflow-y-auto max-h-[60vh] pr-2">
                <div>
                  <Label htmlFor="template">Email Template</Label>
                  <Select
                    value={emailForm.template}
                    onValueChange={(value) => {
                      const template = templates.find((t) => t.id === value);
                      if (template) {
                        setEmailForm({
                          ...emailForm,
                          template: value,
                          subject: template.subject,
                          content: template.content,
                          htmlContent: template.htmlContent,
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={emailForm.subject}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, subject: e.target.value })
                    }
                    placeholder="Enter email subject"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Email Content</Label>
                  <Textarea
                    id="content"
                    value={emailForm.content}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, content: e.target.value })
                    }
                    placeholder="Write your newsletter content..."
                    rows={8}
                  />
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={emailForm.language}
                    onValueChange={(value) =>
                      setEmailForm({ ...emailForm, language: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={emailForm.status}
                    onValueChange={(value) =>
                      setEmailForm({
                        ...emailForm,
                        status: value as
                          | "draft"
                          | "scheduled"
                          | "sent"
                          | "failed",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {emailForm.status === "scheduled" && (
                  <div>
                    <Label htmlFor="scheduledAt">Scheduled Date & Time</Label>
                    <Input
                      id="scheduledAt"
                      type="datetime-local"
                      value={formatDateTimeForInput(emailForm.scheduledAt)}
                      onChange={(e) =>
                        setEmailForm({
                          ...emailForm,
                          scheduledAt: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : "",
                        })
                      }
                    />
                  </div>
                )}
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    This will be sent to{" "}
                    {subscribers.filter((s) => s.isActive).length} active
                    subscribers
                  </span>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsComposeDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSendNewsletter}>
                  {editingCampaign ? "Update Campaign" : "Create Campaign"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {newsletterStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">{stat.change}</span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaigns.slice(0, 3).map((campaign) => (
                  <div
                    key={campaign._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-sm">
                        {campaign.subject}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Badge variant={getStatusBadgeVariant(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        {campaign.sentAt && (
                          <span>{formatDate(campaign.sentAt)}</span>
                        )}
                        {campaign.scheduledAt &&
                          campaign.status === "scheduled" && (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {format(
                                  new Date(campaign.scheduledAt),
                                  "MMM d, h:mm a"
                                )}
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                    {campaign.status === "sent" && (
                      <div className="text-right text-xs">
                        <div>
                          {(campaign.recipients || 0) > 0
                            ? `${(
                                ((campaign.opens || 0) /
                                  (campaign.recipients || 1)) *
                                100
                              ).toFixed(1)}% open`
                            : "0% open"}
                        </div>
                        <div>
                          {(campaign.recipients || 0) > 0
                            ? `${(
                                ((campaign.clicks || 0) /
                                  (campaign.recipients || 1)) *
                                100
                              ).toFixed(1)}% click`
                            : "0% click"}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Subscriber Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Subscriber Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>English Subscribers</span>
                    <span className="font-medium">
                      {subscribers.filter((s) => s.language === "en").length} (
                      {subscribers.length > 0
                        ? Math.round(
                            (subscribers.filter((s) => s.language === "en")
                              .length /
                              subscribers.length) *
                              100
                          )
                        : 0}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${
                          subscribers.length > 0
                            ? (subscribers.filter((s) => s.language === "en")
                                .length /
                                subscribers.length) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Hindi Subscribers</span>
                    <span className="font-medium">
                      {subscribers.filter((s) => s.language === "hi").length} (
                      {subscribers.length > 0
                        ? Math.round(
                            (subscribers.filter((s) => s.language === "hi")
                              .length /
                              subscribers.length) *
                              100
                          )
                        : 0}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${
                          subscribers.length > 0
                            ? (subscribers.filter((s) => s.language === "hi")
                                .length /
                                subscribers.length) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Subscribers</span>
                    <span className="font-medium">
                      {subscribers.filter((s) => s.isActive).length} (
                      {subscribers.length > 0
                        ? Math.round(
                            (subscribers.filter((s) => s.isActive).length /
                              subscribers.length) *
                              100
                          )
                        : 0}
                      %)
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Verified Subscribers</span>
                    <span className="font-medium">
                      {subscribers.filter((s) => s.isVerified).length} (
                      {subscribers.length > 0
                        ? Math.round(
                            (subscribers.filter((s) => s.isVerified).length /
                              subscribers.length) *
                              100
                          )
                        : 0}
                      %)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Input placeholder="Search subscribers..." className="w-64" />
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Dialog
                open={isSubscriberDialogOpen}
                onOpenChange={setIsSubscriberDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Subscriber
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Subscriber</DialogTitle>
                    <DialogDescription>
                      Manually add a new subscriber to your newsletter.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={subscriberForm.email}
                        onChange={(e) =>
                          setSubscriberForm({
                            ...subscriberForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="subscriber@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={subscriberForm.name}
                        onChange={(e) =>
                          setSubscriberForm({
                            ...subscriberForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="language">Preferred Language</Label>
                      <Select
                        value={subscriberForm.language}
                        onValueChange={(value) =>
                          setSubscriberForm({
                            ...subscriberForm,
                            language: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubscriberDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddSubscriber}>
                      Add Subscriber
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {subscriberLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subscriber</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Subscribed</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.map((subscriber) => (
                        <TableRow key={subscriber._id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {subscriber.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {subscriber.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                subscriber.isActive ? "default" : "secondary"
                              }
                            >
                              {subscriber.isActive ? "active" : "inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {subscriber.language === "en"
                                ? "English"
                                : "Hindi"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                subscriber.isVerified ? "default" : "secondary"
                              }
                            >
                              {subscriber.isVerified ? "verified" : "pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(subscriber.subscribedAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleToggleSubscriberStatus(
                                      subscriber._id,
                                      subscriber.isActive
                                    )
                                  }
                                >
                                  {subscriber.isActive
                                    ? "Unsubscribe"
                                    : "Resubscribe"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() =>
                                    handleDeleteSubscriber(subscriber._id)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-between p-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {subscribers.length} of{" "}
                      {subscriberPagination.total} subscribers
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        disabled={subscriberPagination.page === 1}
                        onClick={() =>
                          fetchSubscribers(
                            subscriberPagination.page - 1,
                            subscriberPagination.limit
                          )
                        }
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        disabled={
                          subscriberPagination.page ===
                          subscriberPagination.pages
                        }
                        onClick={() =>
                          fetchSubscribers(
                            subscriberPagination.page + 1,
                            subscriberPagination.limit
                          )
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Campaigns</CardTitle>
              <div className="flex space-x-2">
                <Select
                  value={campaignPagination.limit.toString()}
                  onValueChange={(value) => fetchCampaigns(1, parseInt(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Open Rate</TableHead>
                        <TableHead>Click Rate</TableHead>
                        <TableHead>Sent Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.map((campaign) => (
                        <TableRow key={campaign._id}>
                          <TableCell className="font-medium">
                            {campaign.subject}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(campaign.status)}
                            >
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {(campaign.recipients || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {(campaign.recipients || 0) > 0
                              ? `${(
                                  ((campaign.opens || 0) /
                                    campaign.recipients) *
                                  100
                                ).toFixed(1)}%`
                              : "0%"}
                          </TableCell>
                          <TableCell>
                            {(campaign.recipients || 0) > 0
                              ? `${(
                                  ((campaign.clicks || 0) /
                                    campaign.recipients) *
                                  100
                                ).toFixed(1)}%`
                              : "0%"}
                          </TableCell>
                          <TableCell>
                            {campaign.sentAt
                              ? formatDate(campaign.sentAt)
                              : "Not sent"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => handleEditCampaign(campaign)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {campaign.status === "draft" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleSendCampaign(campaign._id)
                                    }
                                  >
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Now
                                  </DropdownMenuItem>
                                )}
                                {campaign.status === "scheduled" && (
                                  <DropdownMenuItem>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Reschedule
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() =>
                                    handleDeleteCampaign(campaign._id)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {campaigns.length} of {campaignPagination.total}{" "}
                      campaigns
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        disabled={campaignPagination.page === 1}
                        onClick={() =>
                          fetchCampaigns(
                            campaignPagination.page - 1,
                            campaignPagination.limit
                          )
                        }
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        disabled={
                          campaignPagination.page === campaignPagination.pages
                        }
                        onClick={() =>
                          fetchCampaigns(
                            campaignPagination.page + 1,
                            campaignPagination.limit
                          )
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardHeader className="p-0">
                  <div className="h-32 bg-muted rounded-t-lg flex items-center justify-center">
                    <Mail className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.description}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handlePreviewTemplate(template)}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleUseTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Preview Dialog */}
      <Dialog
        open={isTemplatePreviewOpen}
        onOpenChange={setIsTemplatePreviewOpen}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              Template Preview: {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Subject Line:
                </div>
                <div className="font-medium">{selectedTemplate.subject}</div>
              </div>
              <div className="border rounded-lg p-4 bg-background">
                <div className="text-sm font-medium text-muted-foreground mb-3">
                  Email Content:
                </div>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed overflow-x-auto">
                    {selectedTemplate.content}
                  </pre>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-shrink-0 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsTemplatePreviewOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedTemplate) {
                  handleUseTemplate(selectedTemplate);
                }
              }}
            >
              Use This Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
