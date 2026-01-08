"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, Plus, TrendingUp, TrendingDown } from "lucide-react";

interface StockData {
  ticker: string;
  name: string;
  price: number;
  day_change: number;
  previous_close_price: number;
  currency: string;
}

interface StockManagerProps {
  onStocksUpdate: (stocks: string[]) => void;
}

export function StockManager({ onStocksUpdate }: StockManagerProps) {
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [stockInput, setStockInput] = useState("");
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load stocks from localStorage on component mount
    const savedStocks = localStorage.getItem("userStocks");
    if (savedStocks) {
      const stocks = JSON.parse(savedStocks);
      setSelectedStocks(stocks);
      onStocksUpdate(stocks);
      if (stocks.length > 0) {
        fetchStockData(stocks);
      }
    }
  }, []);

  const fetchStockData = async (symbols: string[]) => {
    if (symbols.length === 0) return;

    setIsLoading(true);
    try {
      const symbolsString = symbols.join("%2C");
      const response = await fetch(
        `https://api.stockdata.org/v1/data/quote?symbols=${symbolsString}&api_token=t6wEVlNwzsrUrXklMr9Fdhms57nnPQfnPwlrxBOM`
      );

      if (response.ok) {
        const data = await response.json();
        setStockData(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch stock data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addStock = () => {
    const stockSymbol = stockInput.toUpperCase().trim();
    if (
      stockSymbol &&
      !selectedStocks.includes(stockSymbol) &&
      selectedStocks.length < 3
    ) {
      const newStocks = [...selectedStocks, stockSymbol];
      setSelectedStocks(newStocks);
      setStockInput("");
      localStorage.setItem("userStocks", JSON.stringify(newStocks));
      onStocksUpdate(newStocks);
      fetchStockData(newStocks);
    }
  };

  const removeStock = (stockSymbol: string) => {
    const newStocks = selectedStocks.filter((s) => s !== stockSymbol);
    setSelectedStocks(newStocks);
    setStockData((prev) =>
      prev.filter((stock) => stock.ticker !== stockSymbol)
    );
    localStorage.setItem("userStocks", JSON.stringify(newStocks));
    onStocksUpdate(newStocks);
  };

  const getStockChangePercent = (stock: StockData) => {
    return ((stock.day_change / stock.previous_close_price) * 100).toFixed(2);
  };

  const isPositiveChange = (stock: StockData) => stock.day_change > 0;

  return (
    <div className="flex items-center gap-4">
      {/* Stock Display */}
      <div className="flex items-center gap-3">
        {stockData.map((stock) => (
          <Badge
            key={stock.ticker}
            variant="outline"
            className={`flex items-center gap-1 px-2 py-1 text-xs ${
              isPositiveChange(stock)
                ? "text-green-600 border-green-200 bg-green-50"
                : "text-red-600 border-red-200 bg-red-50"
            }`}
          >
            {stock.ticker}
            <span className="font-medium">${stock.price.toFixed(2)}</span>
            {isPositiveChange(stock) ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>({getStockChangePercent(stock)}%)</span>
          </Badge>
        ))}
      </div>

      {/* Stock Manager Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs">
            <TrendingUp className="w-4 h-4 mr-1" />
            Stocks
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Your Stocks</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current Stocks */}
            <div>
              <h4 className="text-sm font-medium mb-2">
                Your Stocks ({selectedStocks.length}/3)
              </h4>
              <div className="space-y-2">
                {selectedStocks.map((stock) => (
                  <div
                    key={stock}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <span className="font-medium">{stock}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStock(stock)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {selectedStocks.length === 0 && (
                  <p className="text-sm text-gray-500">No stocks selected</p>
                )}
              </div>
            </div>

            {/* Add Stock */}
            <div>
              <h4 className="text-sm font-medium mb-2">Add Stock</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter stock symbol (e.g., AAPL)"
                  value={stockInput}
                  onChange={(e) => setStockInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addStock()}
                  disabled={selectedStocks.length >= 3}
                />
                <Button
                  onClick={addStock}
                  disabled={!stockInput || selectedStocks.length >= 3}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Maximum 3 stocks allowed. Use symbols like AAPL, TSLA, MSFT
              </p>
            </div>

            {/* Popular Stocks Suggestion */}
            <div>
              <h4 className="text-sm font-medium mb-2">Popular Stocks</h4>
              <div className="flex flex-wrap gap-2">
                {["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "META"].map(
                  (symbol) => (
                    <Badge
                      key={symbol}
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        if (
                          !selectedStocks.includes(symbol) &&
                          selectedStocks.length < 3
                        ) {
                          setStockInput(symbol);
                          addStock();
                        }
                      }}
                    >
                      {symbol}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
