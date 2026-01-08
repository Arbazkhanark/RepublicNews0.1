"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Target,
  Eye,
  Shield,
  Newspaper,
  Globe,
  Award,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  Clock,
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  ChevronRight,
  Star,
  BarChart,
  Lightbulb,
  Search,
  UserCheck,
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
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { GoogleAdSense } from "@/components/public/google-adsense";
// import { GoogleAdSense } from "@/components/google-adsense"

const AboutUsPage = () => {
  const [language, setLanguage] = useState<"en" | "hi">("en");

  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "Editor-in-Chief",
      experience: "15+ years",
      expertise: "Political Journalism",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
      bio: "Former editor at leading national daily, multiple award-winning journalist",
    },
    {
      name: "Priya Sharma",
      role: "Fact-Check Lead",
      experience: "12+ years",
      expertise: "Digital Forensics",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      bio: "Specialized in debunking misinformation, certified fact-checker",
    },
    {
      name: "Arjun Singh",
      role: "Technology Head",
      experience: "10+ years",
      expertise: "AI & Data Analytics",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
      bio: "Develops tools for detecting deepfakes and fake news",
    },
    {
      name: "Meera Patel",
      role: "Content Director",
      experience: "8+ years",
      expertise: "Multimedia Journalism",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
      bio: "Oversees content strategy and editorial standards",
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description: "We never compromise on truth, no matter the pressure",
      color: "text-red-600",
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "We show our sources and explain our fact-checking process",
      color: "text-blue-600",
    },
    {
      icon: Target,
      title: "Accuracy",
      description: "Every claim is verified with multiple reliable sources",
      color: "text-green-600",
    },
    {
      icon: Heart,
      title: "Public Service",
      description:
        "Our mission is to serve the people with reliable information",
      color: "text-purple-600",
    },
    {
      icon: Globe,
      title: "Impartiality",
      description: "We report facts without political or ideological bias",
      color: "text-orange-600",
    },
    {
      icon: Clock,
      title: "Timeliness",
      description: "We verify information as quickly as accuracy allows",
      color: "text-yellow-600",
    },
  ];

  const milestones = [
    {
      year: "2021",
      event: "Republic Mirror Founded",
      description: "Started with small team of 5 journalists",
    },
    {
      year: "2022",
      event: "Fact-Check Unit Launched",
      description: "Dedicated team for debunking fake news",
    },
    {
      year: "2023",
      event: "AI Detection Tools",
      description: "Developed proprietary tools for deepfake detection",
    },
    {
      year: "2024",
      event: "10 Million Readers",
      description: "Reached milestone of 10 million monthly readers",
    },
    {
      year: "2024",
      event: "International Recognition",
      description: "Awarded for excellence in journalism",
    },
  ];

  const factCheckStats = [
    { label: "Claims Verified", value: "5000+", icon: CheckCircle },
    { label: "Accuracy Rate", value: "98.7%", icon: Target },
    { label: "Team Members", value: "45+", icon: Users },
    { label: "Countries Covered", value: "25+", icon: Globe },
  ];

  const contactInfo = {
    email: "contact@republicmirror.com",
    phone: "+91 1800-XXX-XXX",
    address: "Press House, Connaught Place, New Delhi - 110001",
    workingHours: "Mon-Sat: 9:00 AM - 7:00 PM",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {language === "hi"
                ? "रिपब्लिक मिरर के बारे में"
                : "About Republic Mirror"}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
              {language === "hi"
                ? "सत्य का प्रतिबिंब - जहाँ तथ्य मायने रखते हैं"
                : "Reflection of Truth - Where Facts Matter"}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2">
                <Users className="h-5 w-5" />
                {language === "hi" ? "हमारी टीम" : "Our Team"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white bg-red-600 gap-2"
              >
                <MessageSquare className="h-5 w-5" />
                {language === "hi" ? "संपर्क करें" : "Contact Us"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-red-100 text-red-800 hover:bg-red-100">
              {language === "hi" ? "हमारा मिशन" : "Our Mission"}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "hi"
                ? "सत्य को सत्ता से ऊपर रखना"
                : "Putting Truth Above Power"}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              {language === "hi"
                ? "हम एक ऐसा मीडिया प्लेटफॉर्म बनाना चाहते हैं जहाँ हर नागरिक को सटीक, सत्यापित और निष्पक्ष जानकारी मिल सके।"
                : "We aim to build a media platform where every citizen can access accurate, verified, and impartial information."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="border-red-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <Target className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-2xl">
                    {language === "hi" ? "हमारा विजन" : "Our Vision"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">
                  {language === "hi"
                    ? "एक ऐसे भारत का निर्माण करना जहाँ हर नागरिक सूचित निर्णय ले सके, जहाँ तथ्यों की सत्ता हो और भ्रामक सूचनाओं का कोई स्थान न हो।"
                    : "To build an India where every citizen can make informed decisions, where facts reign supreme, and misinformation finds no place."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Newspaper className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">
                    {language === "hi" ? "हमारा दृष्टिकोण" : "Our Approach"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">
                  {language === "hi"
                    ? "हम स्रोत सत्यापन, डिजिटल फोरेंसिक्स और बहु-स्तरीय तथ्य-जाँच के माध्यम से हर कहानी की पुष्टि करते हैं।"
                    : "We verify every story through source verification, digital forensics, and multi-layered fact-checking."}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Ad */}
          <div className="my-8">
            <GoogleAdSense
              adSlot="728x90_about_top"
              adFormat="horizontal"
              fullWidthResponsive={true}
              className="w-full"
            />
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {language === "hi" ? "हमारे मूल्य" : "Our Values"}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === "hi"
                ? "ये मूल्य हमारे काम की नींव हैं और हर कहानी में प्रतिबिंबित होते हैं"
                : "These values form the foundation of our work and are reflected in every story we publish"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <Icon className={`h-6 w-6 ${value.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">
                          {value.title}
                        </h3>
                        <p className="text-gray-600">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Fact Check Stats */}
        <section className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              {language === "hi" ? "तथ्य-जाँच का प्रभाव" : "Fact-Check Impact"}
            </h2>
            <p className="text-gray-700">
              {language === "hi"
                ? "हमारी संख्या बोलती हैं"
                : "Our Numbers Speak for Themselves"}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {factCheckStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Our Team */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {language === "hi" ? "हमारी टीम" : "Meet Our Team"}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === "hi"
                ? "अनुभवी पत्रकारों, तकनीकी विशेषज्ञों और तथ्य-जाँचकर्ताओं की टीम"
                : "A team of experienced journalists, technical experts, and fact-checkers"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-700 text-white text-xl">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                  <Badge
                    variant="outline"
                    className="mb-2 bg-red-50 text-red-700 border-red-200"
                  >
                    {member.role}
                  </Badge>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Experience:</span>{" "}
                    {member.experience}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Expertise:</span>{" "}
                    {member.expertise}
                  </div>
                  <p className="text-sm text-gray-500">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/our-team">
              <Button size="lg" className="gap-2">
                <Users className="h-5 w-5" />
                {language === "hi" ? "पूरी टीम देखें" : "View Full Team"}
              </Button>
            </Link>
          </div>
        </section>

        {/* Milestones Timeline */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {language === "hi" ? "हमारी यात्रा" : "Our Journey"}
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 hidden md:block"></div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative ${
                    index % 2 === 0
                      ? "md:text-right md:pr-12"
                      : "md:text-left md:pl-12"
                  }`}
                >
                  <div className="md:w-1/2">
                    <Card className="relative hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`absolute ${
                              index % 2 === 0 ? "-right-6" : "-left-6"
                            } top-1/2 transform -translate-y-1/2 w-12 h-12 bg-red-600 rounded-full border-4 border-white flex items-center justify-center hidden md:flex`}
                          >
                            <Award className="h-6 w-6 text-white" />
                          </div>
                          <CardTitle className="text-xl">
                            {milestone.event}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-lg font-semibold text-red-600">
                          {milestone.year}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Work */}
        <section className="mb-16">
          <Tabs defaultValue="process" className="w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                {language === "hi" ? "हम कैसे काम करते हैं" : "How We Work"}
              </h2>
              <TabsList className="inline-flex">
                <TabsTrigger value="process">
                  {language === "hi" ? "प्रक्रिया" : "Process"}
                </TabsTrigger>
                <TabsTrigger value="verification">
                  {language === "hi" ? "सत्यापन" : "Verification"}
                </TabsTrigger>
                <TabsTrigger value="ethics">
                  {language === "hi" ? "नीतियाँ" : "Ethics"}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="process" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Search className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle>
                        {language === "hi"
                          ? "खोज और पहचान"
                          : "Research & Identification"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          {language === "hi"
                            ? "ट्रेंडिंग कंटेंट की निगरानी"
                            : "Monitoring trending content"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          {language === "hi"
                            ? "यूजर रिपोर्ट्स का विश्लेषण"
                            : "Analyzing user reports"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          {language === "hi"
                            ? "परिवर्तनशील पैटर्न की पहचान"
                            : "Identifying viral patterns"}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <BarChart className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle>
                        {language === "hi"
                          ? "विश्लेषण और सत्यापन"
                          : "Analysis & Verification"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          {language === "hi"
                            ? "स्रोत सत्यापन"
                            : "Source verification"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          {language === "hi"
                            ? "तकनीकी विश्लेषण"
                            : "Technical analysis"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          {language === "hi"
                            ? "विशेषज्ञ परामर्श"
                            : "Expert consultation"}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Lightbulb className="h-6 w-6 text-purple-600" />
                      </div>
                      <CardTitle>
                        {language === "hi"
                          ? "रिपोर्टिंग और अनुवर्ती"
                          : "Reporting & Follow-up"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          {language === "hi"
                            ? "विस्तृत रिपोर्ट तैयार करना"
                            : "Creating detailed reports"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          {language === "hi"
                            ? "सबूतों का प्रकाशन"
                            : "Publishing evidence"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          {language === "hi"
                            ? "निगरानी और अपडेट"
                            : "Monitoring and updates"}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="verification">
              <Card>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-xl mb-4">
                        {language === "hi"
                          ? "हमारा सत्यापन मानदंड"
                          : "Our Verification Standards"}
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <UserCheck className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>
                            {language === "hi"
                              ? "कम से कम दो स्वतंत्र स्रोतों से सत्यापन"
                              : "Verification from at least two independent sources"}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <UserCheck className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>
                            {language === "hi"
                              ? "प्राथमिक स्रोतों को प्राथमिकता"
                              : "Priority to primary sources"}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <UserCheck className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>
                            {language === "hi"
                              ? "तकनीकी विश्लेषण टूल्स का उपयोग"
                              : "Use of technical analysis tools"}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <UserCheck className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>
                            {language === "hi"
                              ? "विशेषज्ञ समीक्षा"
                              : "Expert review"}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-4">
                        {language === "hi"
                          ? "तथ्य-जाँच रेटिंग"
                          : "Fact-Check Ratings"}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-red-600">
                              ❌ False
                            </span>
                            <span className="text-sm text-gray-600">25%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-red-600 rounded-full w-1/4"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-yellow-600">
                              ⚠️ Misleading
                            </span>
                            <span className="text-sm text-gray-600">40%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-yellow-600 rounded-full w-2/5"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-green-600">
                              ✅ True
                            </span>
                            <span className="text-sm text-gray-600">35%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-green-600 rounded-full w-1/3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ethics">
              <Card>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-xl mb-3">
                        {language === "hi"
                          ? "संपादकीय नीति"
                          : "Editorial Policy"}
                      </h3>
                      <p className="text-gray-700">
                        {language === "hi"
                          ? "हम तथ्यों पर आधारित पत्रकारिता में विश्वास करते हैं। हमारी सभी रिपोर्ट्स स्रोत सत्यापन, डेटा विश्लेषण और विशेषज्ञ परामर्श पर आधारित होती हैं।"
                          : "We believe in fact-based journalism. All our reports are based on source verification, data analysis, and expert consultation."}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-bold text-xl mb-3">
                        {language === "hi"
                          ? "संघर्ष नीति"
                          : "Conflict of Interest Policy"}
                      </h3>
                      <p className="text-gray-700">
                        {language === "hi"
                          ? "हमारे कर्मचारी और योगदानकर्ता किसी राजनीतिक दल, व्यावसायिक हित या वैचारिक समूह से वित्तीय संबंध नहीं रखते हैं।"
                          : "Our staff and contributors have no financial relationships with political parties, business interests, or ideological groups."}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-bold text-xl mb-3">
                        {language === "hi" ? "सुधार नीति" : "Correction Policy"}
                      </h3>
                      <p className="text-gray-700">
                        {language === "hi"
                          ? "अगर हमसे कोई त्रुटि हो जाती है, तो हम तुरंत सुधार करते हैं और पारदर्शिता के साथ त्रुटि की सूचना देते हैं।"
                          : "If we make an error, we correct it immediately and transparently notify about the error."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Contact Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <h2 className="text-3xl font-bold mb-6">
                  {language === "hi" ? "हमसे जुड़ें" : "Get in Touch"}
                </h2>
                <p className="text-gray-300 mb-8">
                  {language === "hi"
                    ? "अगर आपके पास कोई सुझाव है, कोई समाचार टिप है, या आप हमारे साथ काम करना चाहते हैं, तो संपर्क करें"
                    : "If you have suggestions, news tips, or want to work with us, get in touch"}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-full">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">Email</div>
                      <div className="font-medium">{contactInfo.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-full">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">Phone</div>
                      <div className="font-medium">{contactInfo.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-full">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">Address</div>
                      <div className="font-medium">{contactInfo.address}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Youtube className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="bg-gray-800 p-8 lg:p-12">
                <h3 className="text-xl font-bold mb-6">
                  {language === "hi"
                    ? "फेक न्यूज रिपोर्ट करें"
                    : "Report Fake News"}
                </h3>
                <p className="text-gray-300 mb-6">
                  {language === "hi"
                    ? "अगर आपको कोई संदिग्ध सामग्री मिली है, तो हमारी तथ्य-जाँच टीम को रिपोर्ट करें"
                    : "If you find any suspicious content, report it to our fact-check team"}
                </p>
                <Button size="lg" className="w-full gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {language === "hi" ? "रिपोर्ट सबमिट करें" : "Submit Report"}
                </Button>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Clock className="h-4 w-4" />
                    {contactInfo.workingHours}
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {language === "hi"
                      ? "हम 24x7 तथ्य-जाँच हेल्पलाइन संचालित करते हैं"
                      : "We operate a 24x7 fact-check helpline"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default AboutUsPage;
