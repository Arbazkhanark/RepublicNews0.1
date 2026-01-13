"use client";

import { useState } from "react";
import Link from "next/link";
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
  Zap,
  Brain,
  Camera,
  FileText,
  Search as SearchIcon,
  Filter,
  Award as AwardIcon,
  GraduationCap,
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

const AboutUsPage = () => {
  const [language, setLanguage] = useState<"en" | "hi">("en");

  const teamMembers = [
    {
      id: 1,
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
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Owais",
      email: "owais@republicmirror.com",
      phone: "+91 98765 43218",
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
      id: 2,
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
  ];

  const values = [
    {
      icon: Shield,
      title: "Integrity",
      titleHi: "ईमानदारी",
      description: "We never compromise on truth, no matter the pressure",
      descriptionHi: "हम किसी भी दबाव में सच से समझौता नहीं करते",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Eye,
      title: "Transparency",
      titleHi: "पारदर्शिता",
      description: "We show our sources and explain our fact-checking process",
      descriptionHi:
        "हम अपने स्रोत दिखाते हैं और तथ्य-जाँच प्रक्रिया समझाते हैं",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Target,
      title: "Accuracy",
      titleHi: "सटीकता",
      description: "Every claim is verified with multiple reliable sources",
      descriptionHi: "हर दावे को कई विश्वसनीय स्रोतों से सत्यापित किया जाता है",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Heart,
      title: "Public Service",
      titleHi: "जनसेवा",
      description:
        "Our mission is to serve the people with reliable information",
      descriptionHi: "हमारा मिशन लोगों को विश्वसनीय जानकारी प्रदान करना है",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Globe,
      title: "Impartiality",
      titleHi: "निष्पक्षता",
      description: "We report facts without political or ideological bias",
      descriptionHi:
        "हम बिना किसी राजनीतिक या वैचारिक पूर्वाग्रह के तथ्य रिपोर्ट करते हैं",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Clock,
      title: "Timeliness",
      titleHi: "समयबद्धता",
      description: "We verify information as quickly as accuracy allows",
      descriptionHi:
        "हम जितनी जल्दी हो सके उतनी जल्दी जानकारी सत्यापित करते हैं",
      color: "bg-red-100 text-red-600",
    },
  ];

  const milestones = [
    {
      year: "2021",
      event: "Republic Mirror Founded",
      eventHi: "रिपब्लिक मिरर की स्थापना",
      description: "Started with small team of 5 journalists",
      descriptionHi: "5 पत्रकारों की छोटी टीम के साथ शुरुआत",
    },
    {
      year: "2022",
      event: "Fact-Check Unit Launched",
      eventHi: "तथ्य-जाँच यूनिट लॉन्च",
      description: "Dedicated team for debunking fake news",
      descriptionHi: "फेक न्यूज को खारिज करने के लिए समर्पित टीम",
    },
    {
      year: "2023",
      event: "AI Detection Tools",
      eventHi: "एआई डिटेक्शन टूल्स",
      description: "Developed proprietary tools for deepfake detection",
      descriptionHi: "डीपफेक डिटेक्शन के लिए स्वामित्व टूल्स विकसित किए",
    },
    {
      year: "2024",
      event: "10 Million Readers",
      eventHi: "1 करोड़ पाठक",
      description: "Reached milestone of 10 million monthly readers",
      descriptionHi: "1 करोड़ मासिक पाठकों के मील के पत्थर तक पहुँचे",
    },
    {
      year: "2024",
      event: "International Recognition",
      eventHi: "अंतर्राष्ट्रीय मान्यता",
      description: "Awarded for excellence in journalism",
      descriptionHi: "पत्रकारिता में उत्कृष्टता के लिए पुरस्कृत",
    },
  ];

  const factCheckStats = [
    {
      label: language === "hi" ? "दावे सत्यापित" : "Claims Verified",
      value: "5000+",
      icon: CheckCircle,
      description:
        language === "hi" ? "तथ्य-जाँचे गए दावे" : "Claims fact-checked",
    },
    {
      label: language === "hi" ? "सटीकता दर" : "Accuracy Rate",
      value: "98.7%",
      icon: Target,
      description:
        language === "hi" ? "सत्यापन सटीकता" : "Verification accuracy",
    },
    {
      label: language === "hi" ? "टीम सदस्य" : "Team Members",
      value: "2",
      icon: Users,
      description:
        language === "hi" ? "विशेषज्ञ पत्रकार" : "Expert journalists",
    },
    {
      label: language === "hi" ? "देश कवर किए" : "Countries Covered",
      value: "25+",
      icon: Globe,
      description: language === "hi" ? "वैश्विक कवरेज" : "Global coverage",
    },
  ];

  const contactInfo = {
    email: "contact@republicmirror.com",
    phone: "+91 98765 43210",
    address: "Press House, Connaught Place, New Delhi - 110001",
    addressHi: "प्रेस हाउस, कनॉट प्लेस, नई दिल्ली - 110001",
    workingHours: "Mon-Sat: 9:00 AM - 7:00 PM",
    workingHoursHi: "सोम-शनि: सुबह 9:00 - शाम 7:00",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <PublicHeader />

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white py-24 overflow-hidden">
        {/* News-themed background */}
        <div className="absolute inset-0 bg-black/50 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50"></div>
        </div>

        {/* Animated news ticker */}
        <div className="absolute top-6 left-0 right-0 overflow-hidden opacity-20">
          <div className="flex animate-marquee whitespace-nowrap">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="mx-8 text-lg font-semibold">
                • TRUTH • TRANSPARENCY • INTEGRITY • JOURNALISM • FACTS •
                REPORTING •
              </span>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-6 bg-red-600/30 backdrop-blur-sm px-8 py-3 rounded-full border border-red-500/40">
              <Newspaper className="h-6 w-6" />
              <span className="text-lg font-semibold tracking-wider">
                {language === "hi"
                  ? "प्रतिष्ठित पत्रकारिता"
                  : "Prestigious Journalism"}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              {language === "hi" ? "रिपब्लिक मिरर" : "Republic Mirror"}
            </h1>
            <p className="text-2xl md:text-3xl opacity-90 mb-10 max-w-3xl mx-auto font-light">
              {language === "hi"
                ? "सत्य का प्रतिबिंब - जहाँ तथ्य मायने रखते हैं"
                : "Reflection of Truth - Where Facts Matter"}
            </p>

            <div className="flex flex-wrap gap-6 justify-center mt-12">
              <Button
                size="lg"
                variant="secondary"
                className="gap-3 px-10 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all bg-white text-red-700 hover:bg-red-50 border-red-200"
              >
                <Users className="h-6 w-6" />
                {language === "hi" ? "हमारी टीम" : "Our Team"}
              </Button>
              <Button
                size="lg"
                variant="default"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 gap-3 px-10 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all"
              >
                <MessageSquare className="h-6 w-6" />
                {language === "hi" ? "संपर्क करें" : "Contact Us"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        {/* Mission & Vision - Enhanced */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-6 py-2 text-lg">
              {language === "hi" ? "हमारा मिशन" : "Our Mission"}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-900 to-red-700 bg-clip-text text-transparent">
              {language === "hi"
                ? "सत्य को सत्ता से ऊपर रखना"
                : "Putting Truth Above Power"}
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {language === "hi"
                ? "हम एक ऐसा मीडिया प्लेटफॉर्म बनाना चाहते हैं जहाँ हर नागरिक को सटीक, सत्यापित और निष्पक्ष जानकारी मिल सके।"
                : "We aim to build a media platform where every citizen can access accurate, verified, and impartial information."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-red-50">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-t-xl"></div>
              <CardHeader>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl">
                      {language === "hi" ? "हमारा विजन" : "Our Vision"}
                    </CardTitle>
                    <CardDescription className="text-lg text-red-600">
                      {language === "hi"
                        ? "भविष्य की दिशा"
                        : "Future Direction"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-xl leading-relaxed">
                  {language === "hi"
                    ? "एक ऐसे भारत का निर्माण करना जहाँ हर नागरिक सूचित निर्णय ले सके, जहाँ तथ्यों की सत्ता हो और भ्रामक सूचनाओं का कोई स्थान न हो।"
                    : "To build an India where every citizen can make informed decisions, where facts reign supreme, and misinformation finds no place."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-red-50">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-t-xl"></div>
              <CardHeader>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg">
                    <Newspaper className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl">
                      {language === "hi" ? "हमारा दृष्टिकोण" : "Our Approach"}
                    </CardTitle>
                    <CardDescription className="text-lg text-red-600">
                      {language === "hi" ? "कार्यप्रणाली" : "Methodology"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-xl leading-relaxed">
                  {language === "hi"
                    ? "हम स्रोत सत्यापन, डिजिटल फोरेंसिक्स और बहु-स्तरीय तथ्य-जाँच के माध्यम से हर कहानी की पुष्टि करते हैं।"
                    : "We verify every story through source verification, digital forensics, and multi-layered fact-checking."}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Values - Enhanced */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-900 to-red-700 bg-clip-text text-transparent">
              {language === "hi" ? "हमारे मूल्य" : "Our Values"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "hi"
                ? "ये मूल्य हमारे काम की नींव हैं और हर कहानी में प्रतिबिंबित होते हैं"
                : "These values form the foundation of our work and are reflected in every story we publish"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-red-50"
                >
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`p-5 rounded-2xl mb-6 ${value.color} bg-opacity-20`}
                      >
                        <Icon className="h-10 w-10" />
                      </div>
                      <h3 className="font-bold text-2xl mb-4">
                        {language === "hi" ? value.titleHi : value.title}
                      </h3>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {language === "hi"
                          ? value.descriptionHi
                          : value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Fact Check Stats - Enhanced */}
        <section className="mb-20 bg-gradient-to-br from-red-800 via-red-700 to-red-800 rounded-3xl p-10 shadow-2xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-red-400 to-red-500 text-white border-0 px-6 py-2 text-lg">
              {language === "hi" ? "तथ्य-जाँच का प्रभाव" : "Fact-Check Impact"}
            </Badge>
            <h2 className="text-4xl font-bold mb-6 text-white">
              {language === "hi"
                ? "हमारी संख्या बोलती हैं"
                : "Our Numbers Speak for Themselves"}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {factCheckStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-6 shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-white mb-3">
                    {stat.value}
                  </div>
                  <div className="text-xl font-semibold text-white mb-2">
                    {stat.label}
                  </div>
                  <div className="text-gray-300">{stat.description}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Our Team - Only 2 Members */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-6 py-2 text-lg">
              {language === "hi" ? "हमारी टीम" : "Our Team"}
            </Badge>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-900 to-red-700 bg-clip-text text-transparent">
              {language === "hi" ? "हमारे विशेषज्ञ" : "Our Experts"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === "hi"
                ? "अनुभवी पत्रकारों की टीम जो सत्य और पारदर्शिता के लिए प्रतिबद्ध है"
                : "A team of experienced journalists committed to truth and transparency"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden bg-gradient-to-br from-white to-red-50"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-red-600"></div>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center md:items-start">
                      <div className="relative">
                        <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                          <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-700 text-white text-4xl">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white p-3 rounded-full shadow-lg">
                          <Star className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="mt-8 flex gap-3">
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full border-red-200 hover:bg-red-50"
                        >
                          <Linkedin className="h-4 w-4 text-red-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full border-red-200 hover:bg-red-50"
                        >
                          <Twitter className="h-4 w-4 text-red-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full border-red-200 hover:bg-red-50"
                        >
                          <Mail className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">
                            {language === "hi" ? member.nameHi : member.name}
                          </h3>
                          <Badge className="bg-red-100 text-red-700 border-red-200 text-base px-4 py-1">
                            {language === "hi" ? member.roleHi : member.role}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="text-base border-red-200">
                          {member.experience}
                        </Badge>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <GraduationCap className="h-5 w-5 text-red-600" />
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
                          <Zap className="h-5 w-5 text-red-600" />
                          {language === "hi" ? "विशेषज्ञता" : "Expertise"}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {member.expertise.map((exp, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="bg-red-50 text-red-700 hover:bg-red-100 text-sm border-red-200"
                            >
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                        <MessageSquare className="h-5 w-5" />
                        {language === "hi"
                          ? "पूरा प्रोफाइल देखें"
                          : "View Full Profile"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/our-team">
              <Button
                size="lg"
                className="gap-3 px-10 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                <Users className="h-6 w-6" />
                {language === "hi" ? "टीम पेज पर जाएं" : "Visit Team Page"}
              </Button>
            </Link>
          </div>
        </section>

        {/* How We Work - Enhanced */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-6 py-2 text-lg">
              {language === "hi" ? "कार्य प्रक्रिया" : "Work Process"}
            </Badge>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-900 to-red-700 bg-clip-text text-transparent">
              {language === "hi" ? "हम कैसे काम करते हैं" : "How We Work"}
            </h2>
          </div>

          <Tabs defaultValue="process" className="w-full">
            <TabsList className="inline-flex mx-auto mb-12 bg-gradient-to-r from-red-100 to-red-50 p-2 rounded-2xl">
              <TabsTrigger
                value="process"
                className="rounded-xl px-8 py-3 text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white"
              >
                {language === "hi" ? "प्रक्रिया" : "Process"}
              </TabsTrigger>
              <TabsTrigger
                value="verification"
                className="rounded-xl px-8 py-3 text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white"
              >
                {language === "hi" ? "सत्यापन" : "Verification"}
              </TabsTrigger>
              <TabsTrigger
                value="ethics"
                className="rounded-xl px-8 py-3 text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white"
              >
                {language === "hi" ? "नीतियाँ" : "Ethics"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="process" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: SearchIcon,
                    title:
                      language === "hi"
                        ? "खोज और पहचान"
                        : "Research & Identification",
                    color: "from-red-500 to-red-600",
                    items: [
                      language === "hi"
                        ? "ट्रेंडिंग कंटेंट की निगरानी"
                        : "Monitoring trending content",
                      language === "hi"
                        ? "यूजर रिपोर्ट्स का विश्लेषण"
                        : "Analyzing user reports",
                      language === "hi"
                        ? "वायरल पैटर्न की पहचान"
                        : "Identifying viral patterns",
                    ],
                  },
                  {
                    icon: BarChart,
                    title:
                      language === "hi"
                        ? "विश्लेषण और सत्यापन"
                        : "Analysis & Verification",
                    color: "from-red-500 to-red-600",
                    items: [
                      language === "hi"
                        ? "स्रोत सत्यापन"
                        : "Source verification",
                      language === "hi"
                        ? "तकनीकी विश्लेषण"
                        : "Technical analysis",
                      language === "hi"
                        ? "विशेषज्ञ परामर्श"
                        : "Expert consultation",
                    ],
                  },
                  {
                    icon: Lightbulb,
                    title:
                      language === "hi"
                        ? "रिपोर्टिंग और अनुवर्ती"
                        : "Reporting & Follow-up",
                    color: "from-red-500 to-red-600",
                    items: [
                      language === "hi"
                        ? "विस्तृत रिपोर्ट तैयार करना"
                        : "Creating detailed reports",
                      language === "hi"
                        ? "सबूतों का प्रकाशन"
                        : "Publishing evidence",
                      language === "hi"
                        ? "निगरानी और अपडेट"
                        : "Monitoring and updates",
                    ],
                  },
                ].map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <Card
                      key={index}
                      className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-red-50"
                    >
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-6">
                          <div
                            className={`p-4 bg-gradient-to-br ${step.color} rounded-2xl shadow-lg`}
                          >
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <CardTitle className="text-xl">
                            {step.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {step.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="verification">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-red-50">
                <CardContent className="p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                      <h3 className="font-bold text-2xl mb-8">
                        {language === "hi"
                          ? "हमारा सत्यापन मानदंड"
                          : "Our Verification Standards"}
                      </h3>
                      <ul className="space-y-6">
                        {[
                          language === "hi"
                            ? "कम से कम दो स्वतंत्र स्रोतों से सत्यापन"
                            : "Verification from at least two independent sources",
                          language === "hi"
                            ? "प्राथमिक स्रोतों को प्राथमिकता"
                            : "Priority to primary sources",
                          language === "hi"
                            ? "तकनीकी विश्लेषण टूल्स का उपयोग"
                            : "Use of technical analysis tools",
                          language === "hi"
                            ? "विशेषज्ञ समीक्षा"
                            : "Expert review",
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-4">
                            <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                              <UserCheck className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-lg text-gray-700 pt-1">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-8">
                        {language === "hi"
                          ? "तथ्य-जाँच रेटिंग"
                          : "Fact-Check Ratings"}
                      </h3>
                      <div className="space-y-8">
                        {[
                          {
                            label: "❌ False",
                            percent: 25,
                            color: "from-red-500 to-red-600",
                          },
                          {
                            label: "⚠️ Misleading",
                            percent: 40,
                            color: "from-red-400 to-red-500",
                          },
                          {
                            label: "✅ True",
                            percent: 35,
                            color: "from-red-500 to-red-700",
                          },
                        ].map((rating, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between mb-3">
                              <span className="font-semibold text-lg">
                                {rating.label}
                              </span>
                              <span className="text-lg font-bold text-gray-700">
                                {rating.percent}%
                              </span>
                            </div>
                            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${rating.color} rounded-full`}
                                style={{ width: `${rating.percent}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ethics">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-red-50">
                <CardContent className="p-12">
                  <div className="space-y-12">
                    {[
                      {
                        title:
                          language === "hi"
                            ? "संपादकीय नीति"
                            : "Editorial Policy",
                        description:
                          language === "hi"
                            ? "हम तथ्यों पर आधारित पत्रकारिता में विश्वास करते हैं। हमारी सभी रिपोर्ट्स स्रोत सत्यापन, डेटा विश्लेषण और विशेषज्ञ परामर्श पर आधारित होती हैं।"
                            : "We believe in fact-based journalism. All our reports are based on source verification, data analysis, and expert consultation.",
                      },
                      {
                        title:
                          language === "hi"
                            ? "संघर्ष नीति"
                            : "Conflict of Interest Policy",
                        description:
                          language === "hi"
                            ? "हमारे कर्मचारी और योगदानकर्ता किसी राजनीतिक दल, व्यावसायिक हित या वैचारिक समूह से वित्तीय संबंध नहीं रखते हैं।"
                            : "Our staff and contributors have no financial relationships with political parties, business interests, or ideological groups.",
                      },
                      {
                        title:
                          language === "hi"
                            ? "सुधार नीति"
                            : "Correction Policy",
                        description:
                          language === "hi"
                            ? "अगर हमसे कोई त्रुटि हो जाती है, तो हम तुरंत सुधार करते हैं और पारदर्शिता के साथ त्रुटि की सूचना देते हैं।"
                            : "If we make an error, we correct it immediately and transparently notify about the error.",
                      },
                    ].map((policy, idx) => (
                      <div key={idx} className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                            <Shield className="h-7 w-7 text-white" />
                          </div>
                          <h3 className="font-bold text-2xl">{policy.title}</h3>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed pl-16">
                          {policy.description}
                        </p>
                        {idx < 2 && <Separator className="my-8" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <PublicFooter />

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
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutUsPage;