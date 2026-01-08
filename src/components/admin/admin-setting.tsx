"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Globe,
  Mail,
  Shield,
  Database,
  Palette,
  Search,
  DollarSign,
  Save,
  Upload,
  Download,
} from "lucide-react";

export default function SettingsPage() {
  // Remove this duplicate useState, keep only the typed one below

  interface GeneralSettings {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    timezone: string;
    language: string;
  }

  interface SEOSettings {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  }

  interface SocialSettings {
    facebookUrl: string;
    twitterUrl: string;
    instagramUrl: string;
    linkedinUrl: string;
  }

  interface EmailSettings {
    smtpHost: string;
    smtpPort: string;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  }

  interface AdsenseSettings {
    adsenseEnabled: boolean;
    adsenseClientId: string;
    headerAdCode: string;
    sidebarAdCode: string;
    articleAdCode: string;
  }

  interface SecuritySettings {
    twoFactorEnabled: boolean;
    passwordMinLength: number;
    sessionTimeout: number;
  }

  interface BackupSettings {
    autoBackup: boolean;
    backupFrequency: string;
    backupRetention: number;
  }

  type Settings = GeneralSettings &
    SEOSettings &
    SocialSettings &
    EmailSettings &
    AdsenseSettings &
    SecuritySettings &
    BackupSettings;

  const [settings, setSettings] = useState<Settings>({
    // General Settings
    siteName: "News Website",
    siteDescription: "Your trusted source for news and information",
    siteUrl: "https://newswebsite.com",
    timezone: "Asia/Kolkata",
    language: "en",

    // SEO Settings
    metaTitle: "News Website - Latest News & Updates",
    metaDescription:
      "Stay updated with the latest news, breaking stories, and in-depth analysis from around the world.",
    metaKeywords: "news, breaking news, politics, sports, technology, business",

    // Social Media
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    linkedinUrl: "",

    // Email Settings
    smtpHost: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    fromEmail: "noreply@newswebsite.com",
    fromName: "News Website",

    // AdSense Settings
    adsenseEnabled: false,
    adsenseClientId: "",
    headerAdCode: "",
    sidebarAdCode: "",
    articleAdCode: "",

    // Security Settings
    twoFactorEnabled: false,
    passwordMinLength: 8,
    sessionTimeout: 30,

    // Backup Settings
    autoBackup: true,
    backupFrequency: "daily",
    backupRetention: 30,
  });

  const handleSettingChange = (
    key: keyof Settings,
    value: Settings[keyof Settings]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    console.log("Saving settings:", settings);
    // Here you would typically save to your backend
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Website Settings</h1>
          <p className="text-muted-foreground">
            Configure your news website settings and preferences
          </p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="adsense">AdSense</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Site Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) =>
                      handleSettingChange("siteName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) =>
                      handleSettingChange("siteDescription", e.target.value)
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) =>
                      handleSettingChange("siteUrl", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Regional Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) =>
                      handleSettingChange("timezone", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">
                        Asia/Kolkata (IST)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        America/New_York (EST)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        Europe/London (GMT)
                      </SelectItem>
                      <SelectItem value="Asia/Tokyo">
                        Asia/Tokyo (JST)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Default Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) =>
                      handleSettingChange("language", value)
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>SEO Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={settings.metaTitle}
                  onChange={(e) =>
                    handleSettingChange("metaTitle", e.target.value)
                  }
                  placeholder="Your site's meta title"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 50-60 characters
                </p>
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.metaDescription}
                  onChange={(e) =>
                    handleSettingChange("metaDescription", e.target.value)
                  }
                  placeholder="Your site's meta description"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 150-160 characters
                </p>
              </div>
              <div>
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={settings.metaKeywords}
                  onChange={(e) =>
                    handleSettingChange("metaKeywords", e.target.value)
                  }
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate keywords with commas
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Social Media Links</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  value={settings.facebookUrl}
                  onChange={(e) =>
                    handleSettingChange("facebookUrl", e.target.value)
                  }
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input
                  id="twitterUrl"
                  value={settings.twitterUrl}
                  onChange={(e) =>
                    handleSettingChange("twitterUrl", e.target.value)
                  }
                  placeholder="https://twitter.com/youraccount"
                />
              </div>
              <div>
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  value={settings.instagramUrl}
                  onChange={(e) =>
                    handleSettingChange("instagramUrl", e.target.value)
                  }
                  placeholder="https://instagram.com/youraccount"
                />
              </div>
              <div>
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  value={settings.linkedinUrl}
                  onChange={(e) =>
                    handleSettingChange("linkedinUrl", e.target.value)
                  }
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Email Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) =>
                      handleSettingChange("smtpHost", e.target.value)
                    }
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={settings.smtpPort}
                    onChange={(e) =>
                      handleSettingChange("smtpPort", e.target.value)
                    }
                    placeholder="587"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="smtpUsername">SMTP Username</Label>
                <Input
                  id="smtpUsername"
                  value={settings.smtpUsername}
                  onChange={(e) =>
                    handleSettingChange("smtpUsername", e.target.value)
                  }
                  placeholder="your-email@gmail.com"
                />
              </div>
              <div>
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) =>
                    handleSettingChange("smtpPassword", e.target.value)
                  }
                  placeholder="Your SMTP password"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    value={settings.fromEmail}
                    onChange={(e) =>
                      handleSettingChange("fromEmail", e.target.value)
                    }
                    placeholder="noreply@yoursite.com"
                  />
                </div>
                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.fromName}
                    onChange={(e) =>
                      handleSettingChange("fromName", e.target.value)
                    }
                    placeholder="Your Site Name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adsense" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Google AdSense Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="adsenseEnabled"
                  checked={settings.adsenseEnabled}
                  onCheckedChange={(checked) =>
                    handleSettingChange("adsenseEnabled", checked)
                  }
                />
                <Label htmlFor="adsenseEnabled">Enable Google AdSense</Label>
              </div>

              {settings.adsenseEnabled && (
                <>
                  <div>
                    <Label htmlFor="adsenseClientId">AdSense Client ID</Label>
                    <Input
                      id="adsenseClientId"
                      value={settings.adsenseClientId}
                      onChange={(e) =>
                        handleSettingChange("adsenseClientId", e.target.value)
                      }
                      placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                    />
                  </div>
                  <div>
                    <Label htmlFor="headerAdCode">Header Ad Code</Label>
                    <Textarea
                      id="headerAdCode"
                      value={settings.headerAdCode}
                      onChange={(e) =>
                        handleSettingChange("headerAdCode", e.target.value)
                      }
                      placeholder="Paste your header ad code here"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sidebarAdCode">Sidebar Ad Code</Label>
                    <Textarea
                      id="sidebarAdCode"
                      value={settings.sidebarAdCode}
                      onChange={(e) =>
                        handleSettingChange("sidebarAdCode", e.target.value)
                      }
                      placeholder="Paste your sidebar ad code here"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="articleAdCode">In-Article Ad Code</Label>
                    <Textarea
                      id="articleAdCode"
                      value={settings.articleAdCode}
                      onChange={(e) =>
                        handleSettingChange("articleAdCode", e.target.value)
                      }
                      placeholder="Paste your in-article ad code here"
                      rows={4}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="twoFactorEnabled"
                    checked={settings.twoFactorEnabled}
                    onCheckedChange={(checked) =>
                      handleSettingChange("twoFactorEnabled", checked)
                    }
                  />
                  <Label htmlFor="twoFactorEnabled">
                    Enable Two-Factor Authentication
                  </Label>
                </div>
                <div>
                  <Label htmlFor="passwordMinLength">
                    Minimum Password Length
                  </Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) =>
                      handleSettingChange(
                        "passwordMinLength",
                        Number.parseInt(e.target.value)
                      )
                    }
                    min="6"
                    max="20"
                  />
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      handleSettingChange(
                        "sessionTimeout",
                        Number.parseInt(e.target.value)
                      )
                    }
                    min="5"
                    max="120"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Backup Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoBackup"
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) =>
                      handleSettingChange("autoBackup", checked)
                    }
                  />
                  <Label htmlFor="autoBackup">Enable Automatic Backups</Label>
                </div>
                <div>
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) =>
                      handleSettingChange("backupFrequency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="backupRetention">
                    Backup Retention (days)
                  </Label>
                  <Input
                    id="backupRetention"
                    type="number"
                    value={settings.backupRetention}
                    onChange={(e) =>
                      handleSettingChange(
                        "backupRetention",
                        Number.parseInt(e.target.value)
                      )
                    }
                    min="7"
                    max="365"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Download Backup
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Upload className="mr-2 h-4 w-4" />
                    Restore Backup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
