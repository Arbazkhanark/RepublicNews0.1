"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Search,
  X,
  Globe,
  ChevronDown,
  CloudSun,
  Wind,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { mockData } from "@/lib/mock-data";
import { StockManager } from "./stock-market";

interface StockData {
  ticker: string;
  name: string;
  price: number;
  day_change: number;
  previous_close_price: number;
  currency: string;
}

export function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const [userStocks, setUserStocks] = useState<string[]>([]);
  const [stockData, setStockData] = useState<StockData[]>([]);

  const [weather, setWeather] = useState<null | {
    temperature: number;
    windspeed: number;
    weathercode: number;
  }>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.23&current_weather=true"
        );
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      }
    };

    fetchWeather();
  }, []);

  // Fetch stock data when user stocks change
  useEffect(() => {
    const fetchStockData = async () => {
      if (userStocks.length === 0) return;

      try {
        const symbolsString = userStocks.join("%2C");
        const response = await fetch(
          `https://api.stockdata.org/v1/data/quote?symbols=${symbolsString}&api_token=t6wEVlNwzsrUrXklMr9Fdhms57nnPQfnPwlrxBOM`
        );

        if (response.ok) {
          const data = await response.json();
          setStockData(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      }
    };

    fetchStockData();

    // Refresh stock data every 30 seconds
    const interval = setInterval(fetchStockData, 30000);
    return () => clearInterval(interval);
  }, [userStocks]);

  const handleStocksUpdate = (stocks: string[]) => {
    setUserStocks(stocks);
  };

  const navigationItems = [
    { href: "/", label: t("home") },
    {
      href: "/category/national",
      label: t("national"),
      hasDropdown: true,
      subcategories: [
        { href: "/category/politics", label: t("politics") },
        { href: "/category/economy", label: t("economy") },
        { href: "/trending", label: "Trending" },
      ],
    },
    {
      href: "/category/international",
      label: t("international"),
      hasDropdown: true,
      subcategories: [
        { href: "/category/technology", label: "Technology" },
        { href: "/category/business", label: "Business" },
        { href: "/live-updates", label: "Live Updates" },
      ],
    },
    {
      href: "/fake-news",
      label: language === "hi" ? "जाली खबरें" : "FAKE NEWS",
    },
    {
      href: "https://www.youtube.com/@thehashtagnews",
      label: language === "hi" ? "वीडियो" : "VIDEOS",
      isExternal: true,
    },
    { href: "/contact", label: t("contact") },
  ];

  const getCategoryCount = (categorySlug: string) => {
    if (!mockData.news || !Array.isArray(mockData.news)) {
      return 0;
    }

    return mockData.news.filter(
      (article) =>
        article.category?.slug === categorySlug &&
        article.status === "published"
    ).length;
  };

  const getStockChangePercent = (stock: StockData) => {
    return ((stock.day_change / stock.previous_close_price) * 100).toFixed(2);
  };

  const isPositiveChange = (stock: StockData) => stock.day_change > 0;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="bg-red-600 text-white h-8 flex items-center overflow-hidden">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between text-xs">
            {/* Left: Breaking News */}
            <div className="flex items-center gap-3 min-w-0 m-4">
              <span className="bg-white/20 px-2 py-0.5 rounded font-semibold tracking-wide">
                {language === "hi" ? "ब्रेकिंग" : "BREAKING"}
              </span>

              <div className="overflow-hidden whitespace-nowrap">
                <div className="animate-marquee flex gap-6">
                  <span>
                    {language === "hi"
                      ? "बजट चर्चा के लिए संसद सत्र का विस्तार"
                      : "Parliament Session Extended for Budget Discussion"}
                  </span>
                  <span>
                    {language === "hi"
                      ? "सेंसेक्स 75,000 के पार"
                      : "Sensex crosses 75,000 mark"}
                  </span>
                  <span>
                    {language === "hi"
                      ? "उत्तर भारत के लिए भारी बारिश का अलर्ट"
                      : "Heavy Rainfall Alert for North India"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Weather + Date (Desktop only) */}
            <div className="hidden md:flex items-center gap-4 text-[11px] opacity-90">
              {weather && (
                <div className="flex items-center gap-1">
                  <CloudSun className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{weather.temperature}°C</span>
                </div>
              )}

              <span>
                {new Date().toLocaleDateString(
                  language === "hi" ? "hi-IN" : "en-IN",
                  { day: "numeric", month: "short", year: "numeric" }
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="text-center transition-transform duration-300 group-hover:scale-105">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                REPUBLIC MIRROR
              </h1>
              <p className="text-sm text-red-600 font-medium">
                {language === "hi"
                  ? "सत्य का प्रतिबिंब"
                  : "Reflection of Truth"}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div
                key={item.href}
                className="relative group"
                onMouseEnter={() =>
                  item.hasDropdown && setHoveredCategory(item.href)
                }
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {item.isExternal ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-300 py-2 px-1 relative group"
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-300 py-2 px-1 relative group"
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}

                {item.hasDropdown && hoveredCategory === item.href && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-fadeInDown">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {item.label}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {getCategoryCount(item.href.split("/").pop() || "")}{" "}
                        articles
                      </p>
                    </div>
                    {item.subcategories?.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      >
                        <span>{subItem.label}</span>
                        <span className="text-xs text-gray-400">
                          {getCategoryCount(
                            subItem.href.split("/").pop() || ""
                          )}
                        </span>
                      </Link>
                    ))}
                    <div className="px-4 py-2 border-t border-gray-100">
                      <Link
                        href={item.href}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        {language === "hi"
                          ? `सभी ${item.label} देखें →`
                          : `View All ${item.label} →`}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search, Language, Stocks and Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Stock Manager */}
            <div className="hidden md:block">
              <StockManager onStocksUpdate={handleStocksUpdate} />
            </div>

            {/* Language Switcher Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-red-600 transition-all duration-300 hover:scale-105"
                >
                  <Globe className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline">
                    {language === "en" ? "EN" : "हि"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-fadeInDown">
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={`transition-colors duration-200 ${
                    language === "en" ? "bg-red-50" : ""
                  }`}
                >
                  {t("english")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("hi")}
                  className={`transition-colors duration-200 ${
                    language === "hi" ? "bg-red-50" : ""
                  }`}
                >
                  {t("hindi")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-600 hover:text-red-600 transition-all duration-300 hover:scale-105"
            >
              <Search className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-600 hover:text-red-600 transition-all duration-300 hover:scale-105"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Stock Manager */}
        <div className="md:hidden mt-2">
          <StockManager onStocksUpdate={handleStocksUpdate} />
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 relative animate-slideDown">
            <Input
              placeholder={t("searchPlaceholder")}
              className="w-full pr-10 focus:ring-2 focus:ring-red-500 transition-all duration-300"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 animate-slideDown">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item, index) =>
                item.isExternal ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-300 py-2 hover:pl-2"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.hasDropdown && (
                        <span className="text-xs text-gray-400">
                          {getCategoryCount(item.href.split("/").pop() || "")}{" "}
                          articles
                        </span>
                      )}
                    </div>
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-300 py-2 hover:pl-2"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.hasDropdown && (
                        <span className="text-xs text-gray-400">
                          {getCategoryCount(item.href.split("/").pop() || "")}{" "}
                          articles
                        </span>
                      )}
                    </div>
                  </Link>
                )
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}
