"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Award,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Shield,
  TrendingUp,
  MessageSquare,
  FileText,
  Camera,
  Code,
  Search,
  BarChart,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  UserPlus,
  Briefcase,
  Calendar,
  MapPin,
  GraduationCap,
  Star,
  Target,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { GoogleAdSense } from "./google-adsense";

const TeamPage = () => {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const departments = [
    { id: "all", label: "All Departments", count: 47 },
    { id: "editorial", label: "Editorial", count: 14 },
    { id: "factcheck", label: "Fact-Check", count: 8 },
    { id: "technology", label: "Technology", count: 10 },
    { id: "research", label: "Research", count: 6 },
    { id: "multimedia", label: "Multimedia", count: 7 },
    { id: "operations", label: "Operations", count: 2 },
  ];

  const teamMembers = [
    // Leadership Team
    {
      id: 2,
      name: "Priya Sharma",
      nameHi: "प्रिया शर्मा",
      role: "Fact-Check Director",
      roleHi: "तथ्य-जाँच निदेशक",
      department: "factcheck",
      experience: "12+ years",
      education: "PhD in Media Studies, JNU",
      expertise: [
        "Digital Forensics",
        "Misinformation Research",
        "Data Verification",
      ],
      bio: "Leading expert in digital forensics and misinformation detection. Founded our fact-checking unit.",
      bioHi:
        "डिजिटल फोरेंसिक्स और गलत सूचना पहचान में अग्रणी विशेषज्ञ। हमारी तथ्य-जाँच इकाई की संस्थापक।",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      email: "priya@republicmirror.com",
      phone: "+91 98765 43211",
      social: {
        twitter: "@priyafactcheck",
        linkedin: "priyasharma",
        instagram: "priya_sharma",
      },
      achievements: [
        "Google News Initiative Fellow",
        "UNESCO Award",
        "Fact-Check Pioneer",
      ],
      isLeadership: true,
      joinDate: "2021-03-10",
    },
    {
      id: 3,
      name: "Arjun Singh",
      nameHi: "अर्जुन सिंह",
      role: "CTO & Head of Technology",
      roleHi: "सीटीओ और तकनीकी प्रमुख",
      department: "technology",
      experience: "10+ years",
      education: "MTech Computer Science, IIT Delhi",
      expertise: ["AI/ML", "Big Data", "Cybersecurity", "Cloud Infrastructure"],
      bio: "Builds the technology that powers our fact-checking tools and digital platforms.",
      bioHi:
        "हमारे तथ्य-जाँच टूल्स और डिजिटल प्लेटफॉर्म को शक्ति प्रदान करने वाली तकनीक का निर्माण करते हैं।",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
      email: "arjun@republicmirror.com",
      phone: "+91 98765 43212",
      social: {
        twitter: "@arjun_tech",
        linkedin: "arjunsingh",
        instagram: "arjun_singh",
      },
      achievements: [
        "Forbes 30 Under 30",
        "Tech Innovation Award",
        "Patent Holder",
      ],
      isLeadership: true,
      joinDate: "2021-02-20",
    },
    {
      id: 9,
      name: "Mohammad Uwais Siddiqui",
      nameHi: "मुहम्मद उवैस सिद्दीक़ी",
      role: "Chief Editor",
      roleHi: "मुख्य संपादक",
      department: "editorial",
      experience: "8+ years",
      education: "Journalism, Jamia Millia Islamia, Delhi",
      expertise: [
        "Multimedia Journalism",
        "Political Reporting",
        "Social Issues",
        "Ground Reporting",
      ],
      bio: "A multimedia journalist specializing in connecting stories from the ground. Graduate in Political Science from Mumbai University, followed by journalism from Jamia Millia Islamia. Passionate about social and political journalism.",
      bioHi:
        "एक मल्टीमीडिया पत्रकार हैं, जो कहानियों को ज़मीन से जोड़कर पेश करने में माहिर हैं. मुंबई विश्वविद्यालय से राजनीति विज्ञान में स्नातक करने के बाद जामिया मिलिया इस्लामिया विश्वविद्यालय, दिल्ली से पत्रकारिता की पढ़ाई की. सामाजिक और राजनीतिक मुद्दों पर पत्रकारिता करना, ग्राउंड रिपोर्टिंग में विशेष रुचि रखते हैं।",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Uwais",
      email: "uwais@republicmirror.com",
      phone: "+91 98765 43218",
      social: {
        twitter: "@uwaisjournalist",
        linkedin: "uwais-siddiqui",
        instagram: "uwais_siddiqui",
      },
      achievements: [
        "Best Multimedia Storytelling",
        "Ground Reporting Excellence",
        "Social Impact Award",
      ],
      isLeadership: true,
      joinDate: "2021-06-15",
    },
    {
      id: 10,
      name: "Waseem Ahmed",
      nameHi: "वसीम अहमद",
      role: "Consulting Editor",
      roleHi: "परामर्श संपादक",
      department: "editorial",
      experience: "10+ years",
      education: "Journalism, Jamia Millia Islamia, Delhi",
      expertise: [
        "Political Analysis",
        "Social Issues",
        "Opinion Writing",
        "Research",
      ],
      bio: "Graduated in Political Science from Delhi University, followed by journalism from Jamia Millia Islamia. Experienced in ground reporting. Avid reader and writer with deep interest in social and political issues.",
      bioHi:
        "दिल्ली विश्वविद्यालय से पॉलिटिकल साइंस में ग्रेजुएशन के बाद जामिया मिलिया इस्लामिया से पत्रकारिता की पढ़ाई। ज़मीन पर रिपोर्टिंग का अनुभव। पढ़ने-लिखने का शौक, सामाजिक और राजनीति मुद्दों में गहरी रुचि।",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Waseem",
      email: "waseem@republicmirror.com",
      phone: "+91 98765 43219",
      social: {
        twitter: "@waseemeditor",
        linkedin: "waseem-ahmed",
        instagram: "waseem_ahmed",
      },
      achievements: [
        "Political Commentary Award",
        "Social Issues Reporting",
        "Editorial Excellence",
      ],
      isLeadership: true,
      joinDate: "2021-04-20",
    },
    // Fact-Check Team
    {
      id: 4,
      name: "Meera Patel",
      nameHi: "मीरा पटेल",
      role: "Senior Fact-Checker",
      roleHi: "वरिष्ठ तथ्य-जाँचकर्ता",
      department: "factcheck",
      experience: "8+ years",
      education: "MA Mass Communication, Jamia",
      expertise: [
        "Political Fact-Checking",
        "Source Verification",
        "Deepfake Detection",
      ],
      bio: "Specializes in political misinformation and deepfake detection. Verified 5000+ claims.",
      bioHi:
        "राजनीतिक गलत सूचना और डीपफेक पहचान में विशेषज्ञ। 5000+ दावों का सत्यापन किया है।",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
      email: "meera@republicmirror.com",
      phone: "+91 98765 43213",
      social: {
        twitter: "@meerapatel",
        linkedin: "meerapatel",
        instagram: "meera_patel",
      },
      achievements: [
        "Verified 5000+ claims",
        "Accuracy Rate: 99.2%",
        "Rapid Response Award",
      ],
      isLeadership: false,
      joinDate: "2022-05-15",
    },
    {
      id: 5,
      name: "Vikram Joshi",
      nameHi: "विक्रम जोशी",
      role: "Data Analyst",
      roleHi: "डेटा विश्लेषक",
      department: "research",
      experience: "6+ years",
      education: "MS Statistics, ISI Kolkata",
      expertise: ["Data Mining", "Statistical Analysis", "Trend Prediction"],
      bio: "Analyzes viral trends and misinformation patterns using advanced statistical models.",
      bioHi:
        "उन्नत सांख्यिकीय मॉडल का उपयोग करके वायरल ट्रेंड्स और गलत सूचना पैटर्न का विश्लेषण करते हैं।",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
      email: "vikram@republicmirror.com",
      phone: "+91 98765 43214",
      social: {
        twitter: "@vikramdata",
        linkedin: "vikramjoshi",
        instagram: "vikram_joshi",
      },
      achievements: [
        "Best Research Paper",
        "Data Science Excellence",
        "Innovation Award",
      ],
      isLeadership: false,
      joinDate: "2022-08-22",
    },
    {
      id: 6,
      name: "Ananya Reddy",
      nameHi: "आन्या रेड्डी",
      role: "Multimedia Journalist",
      roleHi: "मल्टीमीडिया पत्रकार",
      department: "multimedia",
      experience: "5+ years",
      education: "BJMC, Christ University",
      expertise: ["Video Journalism", "Social Media", "Visual Storytelling"],
      bio: "Creates engaging visual content and documentaries that explain complex issues simply.",
      bioHi:
        "आकर्षक दृश्य सामग्री और वृत्तचित्र बनाती हैं जो जटिल मुद्दों को सरलता से समझाते हैं।",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
      email: "ananya@republicmirror.com",
      phone: "+91 98765 43215",
      social: {
        twitter: "@ananyavision",
        linkedin: "ananyareddy",
        instagram: "ananya_reddy",
      },
      achievements: [
        "Best Documentary",
        "Visual Storytelling Award",
        "Social Media Impact",
      ],
      isLeadership: false,
      joinDate: "2023-01-10",
    },
    {
      id: 7,
      name: "Rohit Verma",
      nameHi: "रोहित वर्मा",
      role: "AI Engineer",
      roleHi: "एआई इंजीनियर",
      department: "technology",
      experience: "4+ years",
      education: "BTech AI, IIIT Hyderabad",
      expertise: [
        "Machine Learning",
        "Computer Vision",
        "Natural Language Processing",
      ],
      bio: "Develops AI models for detecting deepfakes and analyzing misinformation patterns.",
      bioHi:
        "डीपफेक्स का पता लगाने और गलत सूचना पैटर्न का विश्लेषण करने के लिए एआई मॉडल विकसित करते हैं।",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit",
      email: "rohit@republicmirror.com",
      phone: "+91 98765 43216",
      social: {
        twitter: "@rohit_ai",
        linkedin: "rohitverma",
        instagram: "rohit_verma",
      },
      achievements: [
        "AI Innovation Award",
        "Open Source Contributor",
        "Tech Star",
      ],
      isLeadership: false,
      joinDate: "2023-03-25",
    },
    {
      id: 8,
      name: "Sneha Kapoor",
      nameHi: "स्नेहा कपूर",
      role: "Health Fact-Checker",
      roleHi: "स्वास्थ्य तथ्य-जाँचकर्ता",
      department: "factcheck",
      experience: "7+ years",
      education: "MBBS, AIIMS Delhi",
      expertise: [
        "Medical Misinformation",
        "Health Journalism",
        "Science Communication",
      ],
      bio: "Medical doctor turned fact-checker, specializes in debunking health-related misinformation.",
      bioHi:
        "चिकित्सक से तथ्य-जाँचकर्ता बनीं, स्वास्थ्य संबंधी गलत सूचना को खारिज करने में विशेषज्ञ।",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
      email: "sneha@republicmirror.com",
      phone: "+91 98765 43217",
      social: {
        twitter: "@snehahealth",
        linkedin: "snehakapoor",
        instagram: "sneha_kapoor",
      },
      achievements: [
        "Health Journalism Award",
        "WHO Recognition",
        "Science Communicator",
      ],
      isLeadership: false,
      joinDate: "2022-11-30",
    },
  ];

  // Filter team members
  const filteredMembers = teamMembers.filter((member) => {
    if (activeDepartment !== "all" && member.department !== activeDepartment)
      return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        member.name.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.expertise.some((exp) => exp.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Pagination
  const membersPerPage = 6;
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const startIndex = (currentPage - 1) * membersPerPage;
  const currentMembers = filteredMembers.slice(
    startIndex,
    startIndex + membersPerPage
  );

  const departmentStats = {
    editorial: 14,
    factcheck: 8,
    technology: 10,
    research: 6,
    multimedia: 7,
    operations: 2,
  };

  const teamStats = [
    {
      label: language === "hi" ? "कुल टीम सदस्य" : "Total Team Members",
      value: "47+",
      icon: Users,
    },
    {
      label: language === "hi" ? "वर्षों का अनुभव" : "Years of Experience",
      value: "200+",
      icon: Calendar,
    },
    {
      label: language === "hi" ? "तथ्य-जाँचे गए" : "Claims Verified",
      value: "5000+",
      icon: CheckCircle,
    },
    {
      label: language === "hi" ? "देशों में उपस्थिति" : "Countries Covered",
      value: "25+",
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <PublicHeader /> */}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {language === "hi" ? "हमारी टीम" : "Our Team"}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
              {language === "hi"
                ? "अनुभवी पत्रकारों, तकनीकी विशेषज्ञों और तथ्य-जाँचकर्ताओं की विविध टीम"
                : "A diverse team of experienced journalists, technical experts, and fact-checkers"}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2">
                <Target className="h-5 w-5" />
                {language === "hi" ? "हमारा मिशन" : "Our Mission"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white bg-red-600 gap-2"
              >
                <UserPlus className="h-5 w-5" />
                {language === "hi" ? "हमसे जुड़ें" : "Join Our Team"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Team Stats */}
        <section className="mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {teamStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border-0 shadow-sm bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Department Distribution */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {language === "hi" ? "विभाग वितरण" : "Department Distribution"}
              </CardTitle>
              <CardDescription>
                {language === "hi"
                  ? "हमारी टीम विभिन्न विशेषज्ञता वाले विभागों में काम करती है"
                  : "Our team works across departments with different specializations"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(departmentStats).map(([dept, count]) => (
                  <div
                    key={dept}
                    className="text-center p-4 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {count}
                    </div>
                    <div className="text-sm font-medium capitalize">
                      {dept === "factcheck"
                        ? "Fact-Check"
                        : dept === "editorial"
                        ? "Editorial"
                        : dept}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Search and Filter */}
        <section className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={
                      language === "hi"
                        ? "टीम सदस्य खोजें..."
                        : "Search team members..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={activeDepartment}
                  onValueChange={setActiveDepartment}
                >
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue
                        placeholder={
                          language === "hi"
                            ? "विभाग चुनें"
                            : "Select Department"
                        }
                      />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{dept.label}</span>
                          <Badge variant="secondary">{dept.count}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Leadership Team */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {language === "hi" ? "नेतृत्व टीम" : "Leadership Team"}
              </h2>
              <p className="text-gray-600">
                {language === "hi"
                  ? "हमारी दिशा निर्धारित करने वाले अनुभवी नेता"
                  : "Experienced leaders who set our direction"}
              </p>
            </div>
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
              {language === "hi" ? "नेतृत्व" : "Leadership"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {teamMembers
              .filter((member) => member.isLeadership)
              .map((member) => (
                <Card
                  key={member.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow border-red-200"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-28 w-28 mb-4 border-4 border-red-100">
                        <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-700 text-white text-xl">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="mb-4">
                        <h3 className="font-bold text-lg mb-1 truncate w-full">
                          {language === "hi" ? member.nameHi : member.name}
                        </h3>
                        <Badge className="bg-red-100 text-red-700 border-red-200 mb-2 text-xs">
                          {language === "hi" ? member.roleHi : member.role}
                        </Badge>
                        <p className="text-xs text-gray-600">
                          {member.experience}
                        </p>
                      </div>

                      <div className="w-full space-y-2 mb-3">
                        <div className="flex items-center justify-center gap-1">
                          <Briefcase className="h-3 w-3 text-gray-400" />
                          <span className="text-xs">
                            {language === "hi" ? "विभाग:" : "Department:"}{" "}
                            {member.department}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3 justify-center">
                        {member.expertise.slice(0, 2).map((exp, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs px-1"
                          >
                            {exp.split(" ")[0]}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="gap-1 text-xs">
                          <Mail className="h-3 w-3" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1 text-xs">
                          <MessageSquare className="h-3 w-3" />
                          {language === "hi" ? "प्रोफाइल" : "Profile"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>

        {/* Ad - Middle */}
        <div className="my-8">
          <GoogleAdSense
            adSlot="728x90_team_middle"
            adFormat="horizontal"
            fullWidthResponsive={true}
            className="w-full"
          />
        </div>

        {/* All Team Members */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {language === "hi" ? "हमारी पूरी टीम" : "Our Complete Team"}
              </h2>
              <p className="text-gray-600">
                {language === "hi"
                  ? `${filteredMembers.length} टीम सदस्य मिले`
                  : `${filteredMembers.length} team members found`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {language === "hi" ? "पेज" : "Page"} {currentPage}{" "}
                {language === "hi" ? "का" : "of"} {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {currentMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMembers.map((member) => (
                <Card
                  key={member.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar className="h-20 w-20 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-700 text-white">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg mb-1">
                              {language === "hi" ? member.nameHi : member.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {member.department}
                            </Badge>
                          </div>
                          {member.isLeadership && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>

                        <p className="text-sm font-medium text-red-600 mb-2">
                          {language === "hi" ? member.roleHi : member.role}
                        </p>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {language === "hi" ? member.bioHi : member.bio}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {member.expertise.slice(0, 2).map((exp, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {exp}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                            >
                              <Linkedin className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/team/${member.id}`}>
                              {language === "hi" ? "विवरण" : "Details"}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {language === "hi"
                    ? "कोई टीम सदस्य नहीं मिला"
                    : "No Team Members Found"}
                </h3>
                <p className="text-gray-600">
                  {language === "hi"
                    ? "खोजे गए शब्दों से मेल खाने वाला कोई टीम सदस्य नहीं मिला"
                    : "No team members found matching your search"}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  {language === "hi" ? "पहला" : "First"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-10 h-10 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  {language === "hi" ? "अंतिम" : "Last"}
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Our Values */}
        <section className="mb-12">
          <Card className="border-red-200 bg-gradient-to-r from-red-50 to-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {language === "hi"
                  ? "हम क्या प्रदान करते हैं"
                  : "What We Offer"}
              </CardTitle>
              <CardDescription>
                {language === "hi"
                  ? "हमारी टीम के सदस्यों के लिए अवसर और लाभ"
                  : "Opportunities and benefits for our team members"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                    <Award className="h-6 w-6 text-red-600" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">
                    {language === "hi" ? "पेशेवर विकास" : "Professional Growth"}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === "hi"
                      ? "नियमित प्रशिक्षण, कार्यशालाएं और करियर उन्नति के अवसर"
                      : "Regular training, workshops, and career advancement opportunities"}
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">
                    {language === "hi" ? "स्वास्थ्य लाभ" : "Health Benefits"}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === "hi"
                      ? "स्वास्थ्य बीमा, मानसिक स्वास्थ्य सहायता और कल्याण कार्यक्रम"
                      : "Health insurance, mental health support, and wellness programs"}
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">
                    {language === "hi"
                      ? "शोध के अवसर"
                      : "Research Opportunities"}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === "hi"
                      ? "अकादमिक संस्थानों के साथ शोध परियोजनाएं और सहयोग"
                      : "Research projects and collaborations with academic institutions"}
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">
                    {language === "hi" ? "कार्य संतुलन" : "Work-Life Balance"}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === "hi"
                      ? "लचीले कार्य घंटे, दूरस्थ कार्य विकल्प और उदार अवकाश नीति"
                      : "Flexible hours, remote work options, and generous leave policy"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Join Our Team */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">
                  {language === "hi"
                    ? "हमारी टीम का हिस्सा बनें"
                    : "Join Our Team"}
                </h2>
                <p className="text-gray-700 mb-8">
                  {language === "hi"
                    ? "क्या आप सत्य और पारदर्शिता के लिए प्रतिबद्ध हैं? हम हमेशा प्रतिभाशाली पत्रकारों, शोधकर्ताओं और तकनीकी विशेषज्ञों की तलाश में रहते हैं।"
                    : "Are you committed to truth and transparency? We're always looking for talented journalists, researchers, and technical experts."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="gap-2">
                    <UserPlus className="h-5 w-5" />
                    {language === "hi"
                      ? "खुली पदों पर जाएं"
                      : "View Open Positions"}
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Mail className="h-5 w-5" />
                    {language === "hi"
                      ? "स्वतः आवेदन भेजें"
                      : "Send Spontaneous Application"}
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-6">
                  {language === "hi"
                    ? "वर्तमान में 5+ पदों पर भर्ती चल रही है"
                    : "Currently hiring for 5+ positions"}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* <PublicFooter /> */}
    </div>
  );
};

export default TeamPage;