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
  Newspaper,
  Eye,
  Zap,
  Clock,
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

const TeamPage = () => {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const departments = [
    { id: "all", label: "All Departments", count: 2 },
    { id: "editorial", label: "Editorial", count: 2 },
  ];

  const teamMembers = [
    // Leadership Team
    {
      id: 9,
      name: "Owais Siddiqui",
      nameHi: "ओवैस सिद्दीक़ी",
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
      avatar: "/owais.jpeg",
      email: "owais@republicmirror.com",
      // phone: "+91 98765 43218",
      social: {
        twitter: "@owaisjournalist",
        linkedin: "owais-siddiqui",
        instagram: "owais_siddiqui",
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
      avatar: "/waseem.jpeg",
      email: "wasimahmed.com@gmail.com",
      // phone: "+91 98765 43219",
      social: {
        twitter: "https://x.com/Wasim_Words",
        linkedin: "https://www.linkedin.com/in/mohd-waseem-21a359241?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
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
    editorial: 2,
  };

  const teamStats = [
    {
      label: language === "hi" ? "कुल टीम सदस्य" : "Total Team Members",
      value: "2",
      icon: Users,
      description:
        language === "hi" ? "विशेषज्ञ पत्रकार" : "Expert Journalists",
    },
    {
      label: language === "hi" ? "वर्षों का अनुभव" : "Years of Experience",
      value: "18+",
      icon: Calendar,
      description: language === "hi" ? "संयुक्त अनुभव" : "Combined Experience",
    },
    {
      label: language === "hi" ? "कहानियाँ कवर कीं" : "Stories Covered",
      value: "1000+",
      icon: Newspaper,
      description:
        language === "hi" ? "ग्राउंड रिपोर्टिंग" : "Ground Reporting",
    },
    {
      label: language === "hi" ? "तथ्य-जाँच दर" : "Fact-Check Accuracy",
      value: "99.8%",
      icon: CheckCircle,
      description: language === "hi" ? "सटीकता दर" : "Accuracy Rate",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Hero Section with News Background */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20 overflow-hidden">
        {/* News-themed background elements */}
        <div className="absolute inset-0 bg-black/50 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
        </div>

        {/* Animated news headlines */}
        <div className="absolute top-4 left-0 right-0 overflow-hidden opacity-10">
          <div className="flex animate-marquee whitespace-nowrap">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="mx-8 text-lg font-semibold">
                • BREAKING NEWS • FACT CHECK • EXCLUSIVE REPORT • GROUND REALITY
                •
              </span>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-6 bg-red-600/20 backdrop-blur-sm px-6 py-3 rounded-full border border-red-500/30">
              <Newspaper className="h-6 w-6" />
              <span className="text-lg font-semibold">
                {language === "hi"
                  ? "प्रतिष्ठित पत्रकारिता टीम"
                  : "Prestigious Journalism Team"}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {language === "hi" ? "हमारी टीम" : "Our Team"}
            </h1>
            <p className="text-2xl md:text-3xl opacity-90 mb-8 max-w-3xl mx-auto font-light">
              {language === "hi"
                ? "अनुभवी पत्रकारों की टीम जो सत्य और पारदर्शिता के लिए प्रतिबद्ध है"
                : "A team of experienced journalists committed to truth and transparency"}
            </p>

            <div className="flex flex-wrap gap-4 justify-center mt-10">
              <Button
                size="lg"
                variant="secondary"
                className="gap-3 px-8 py-6 text-lg rounded-full shadow-lg"
              >
                <Target className="h-6 w-6" />
                {language === "hi" ? "हमारा मिशन" : "Our Mission"}
              </Button>
              <Button
                size="lg"
                variant="default"
                className="bg-red-600 hover:bg-red-700 gap-3 px-8 py-6 text-lg rounded-full shadow-lg"
              >
                <UserPlus className="h-6 w-6" />
                {language === "hi" ? "हमसे जुड़ें" : "Join Our Team"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Team Stats with enhanced design */}
        <section className="mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {teamStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-6 shadow-lg">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mb-2">
                      {stat.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.description}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Department Distribution */}
        <section className="mb-16">
          <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-r from-white to-gray-50">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-3xl font-bold">
                {language === "hi" ? "विभाग वितरण" : "Department Distribution"}
              </CardTitle>
              <CardDescription className="text-lg">
                {language === "hi"
                  ? "हमारी टीम विभिन्न विशेषज्ञता वाले विभागों में काम करती है"
                  : "Our team works across departments with different specializations"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <div className="flex justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-red-600">2</div>
                      <div className="text-gray-600 font-medium">
                        Team Members
                      </div>
                    </div>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center mt-8">
                <Badge className="bg-red-100 text-red-800 text-lg px-6 py-2">
                  Editorial Department
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Search and Filter */}
        <section className="mb-12">
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    placeholder={
                      language === "hi"
                        ? "टीम सदस्य खोजें..."
                        : "Search team members..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-6 text-lg border-2 rounded-xl"
                  />
                </div>
                <Select
                  value={activeDepartment}
                  onValueChange={setActiveDepartment}
                >
                  <SelectTrigger className="py-6 text-lg border-2 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Filter className="h-5 w-5" />
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

        {/* Leadership Team - Fixed Image Display */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-1 bg-red-600"></div>
              <span className="text-red-600 font-semibold uppercase tracking-wider">
                {language === "hi" ? "नेतृत्व" : "Leadership"}
              </span>
              <div className="w-12 h-1 bg-red-600"></div>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              {language === "hi" ? "हमारे नेतृत्वकर्ता" : "Our Leadership"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === "hi"
                ? "अनुभवी पत्रकार जो हमारी दिशा निर्धारित करते हैं"
                : "Experienced journalists who set our editorial direction"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex flex-col items-center lg:items-start">
                      <div className="relative">
                        {/* Fixed Circle Image with proper cover */}
                        <div className="h-32 w-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 relative">
                          <Image
                            src={member.avatar}
                            alt={member.name}
                            fill
                            sizes="128px"
                            style={{
                              objectFit: "cover",
                              objectPosition: "center center"
                            }}
                            className="rounded-full"
                            priority
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-red-600 text-white p-2 rounded-full">
                          <Star className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        {member.social.linkedin && (
                          <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full"
                            asChild
                          >
                            <Link
                              href={
                                member.social.linkedin.startsWith("http")
                                  ? member.social.linkedin
                                  : `https://linkedin.com/in/${member.social.linkedin}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Linkedin className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        {member.social.twitter && (
                          <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full"
                            asChild
                          >
                            <Link
                              href={
                                member.social.twitter.startsWith("http")
                                  ? member.social.twitter
                                  : `https://twitter.com/${member.social.twitter.replace("@", "")}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Twitter className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full"
                          asChild
                        >
                          <Link href={`mailto:${member.email}`}>
                            <Mail className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-1">
                            {language === "hi" ? member.nameHi : member.name}
                          </h3>
                          <Badge className="bg-red-100 text-red-700 border-red-200 text-sm px-3 py-1">
                            {language === "hi" ? member.roleHi : member.role}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="text-sm">
                          {member.experience}
                        </Badge>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <GraduationCap className="h-4 w-4" />
                          <span className="font-medium">
                            {member.education}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {language === "hi" ? member.bioHi : member.bio}
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-red-600" />
                          {language === "hi" ? "विशेषज्ञता" : "Expertise"}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {member.expertise.map((exp, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Award className="h-4 w-4 text-yellow-600" />
                          {language === "hi" ? "उपलब्धियाँ" : "Achievements"}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {member.achievements.map((ach, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-sm"
                            >
                              {ach}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full gap-2" asChild>
                        <Link href={`/team/${member.id}`}>
                          <MessageSquare className="h-4 w-4" />
                          {language === "hi"
                            ? "पूरा प्रोफाइल देखें"
                            : "View Full Profile"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Photo Gallery - Fixed Rectangle Images */}
        <section className="mb-16">
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">
                {language === "hi" ? "टीम गैलरी" : "Team Gallery"}
              </CardTitle>
              <CardDescription className="text-lg">
                {language === "hi"
                  ? "हमारे पत्रकार कार्य में"
                  : "Our journalists at work"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg group">
                  <div className="relative w-full h-full">
                    <Image
                      src="/owais.jpeg"
                      alt="Owais Siddiqui at work"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{
                        objectFit: "cover",
                        objectPosition: "center center"
                      }}
                      className="group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-2xl font-bold">Owais Siddiqui</h3>
                      <p className="text-white/90 text-lg">Chief Editor</p>
                    </div>
                  </div>
                </div>
                <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg group">
                  <div className="relative w-full h-full">
                    <Image
                      src="/waseem.jpeg"
                      alt="Waseem Ahmed at work"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{
                        objectFit: "cover",
                        objectPosition: "center center"
                      }}
                      className="group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-2xl font-bold">Waseem Ahmed</h3>
                      <p className="text-white/90 text-lg">Consulting Editor</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer Contact Images - Fixed */}
        <section className="mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">
                  {language === "hi" ? "हमसे संपर्क करें" : "Get In Touch"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === "hi"
                    ? "अगर आपके पास कोई कहानी या सुझाव है, तो हमसे संपर्क करें"
                    : "If you have a story or suggestion, get in touch with our team"}
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                      <Image
                        src="/owais.jpeg"
                        alt="Owais Siddiqui"
                        fill
                        sizes="64px"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center center"
                        }}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">Owais Siddiqui</p>
                      <p className="text-sm text-gray-600">Chief Editor</p>
                      <Link
                        href="mailto:editor@republicmirror.com"
                        className="text-sm text-red-600 hover:underline"
                      >
                        editor@republicmirror.com
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                      <Image
                        src="/waseem.jpeg"
                        alt="Waseem Ahmed"
                        fill
                        sizes="64px"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center center"
                        }}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">Waseem Ahmed</p>
                      <p className="text-sm text-gray-600">Consulting Editor</p>
                      <Link
                        href="mailto:wasimahmed.com@gmail.com"
                        className="text-sm text-red-600 hover:underline"
                      >
                        wasimahmed.com@gmail.com
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Custom CSS for better image handling */}
        <style jsx global>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-marquee {
            animation: marquee 30s linear infinite;
          }

          /* Ensure images are properly displayed */
          img {
            max-width: 100%;
            height: auto;
          }

          /* Fix for image object-fit in Next.js Image component */
          .image-cover {
            object-fit: cover !important;
          }
        `}</style>
      </main>
    </div>
  );
};

export default TeamPage;