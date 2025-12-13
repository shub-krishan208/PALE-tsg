import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, Monitor, BookOpen, Wifi, WifiOff, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy user data
const dummyUser = {
  name: "Aditya Sharma",
  roll: "20CH300XX",
  institution: "ApnaInsti",
  avatar:
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya&backgroundColor=b6e3f4",
};

// QR Code refresh interval in seconds
const QR_REFRESH_INTERVAL = 30;

function Checkin() {
  const navigate = useNavigate();

  // State for interactive components
  const [hasLaptop, setHasLaptop] = useState(true);
  const [books, setBooks] = useState([]);
  const [bookInput, setBookInput] = useState("");
  const [refreshCountdown, setRefreshCountdown] = useState(QR_REFRESH_INTERVAL);
  const [qrTimestamp, setQrTimestamp] = useState(Date.now());

  // Generate QR data based on current state
  const qrData = useMemo(() => {
    return JSON.stringify({
      user: dummyUser.roll,
      hasLaptop,
      books,
      timestamp: qrTimestamp,
      validUntil: qrTimestamp + QR_REFRESH_INTERVAL * 1000,
    });
  }, [hasLaptop, books, qrTimestamp]);

  // Auto-refresh countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          // Refresh QR code
          setQrTimestamp(Date.now());
          return QR_REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle adding a book
  const handleAddBook = (e) => {
    if (e.key === "Enter" && bookInput.trim()) {
      setBooks((prev) => [...prev, bookInput.trim()]);
      setBookInput("");
    }
  };

  // Handle removing a book
  const removeBook = (index) => {
    setBooks((prev) => prev.filter((_, i) => i !== index));
  };

  // Check if any assets are declared
  const hasAssets = hasLaptop || books.length > 0;

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Centered container with max-width for desktop */}
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="flex items-center gap-4 p-4 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Library Entry Pass</h1>
        </header>

        {/* User Profile Section */}
        <section className="flex items-center gap-4 px-6 py-4">
          <img
            src={dummyUser.avatar}
            alt={dummyUser.name}
            className="w-14 h-14 rounded-full bg-gray-300 object-cover"
          />
          <div>
            <h2 className="text-xl font-bold">{dummyUser.name}</h2>
            <p className="text-gray-400 text-sm">{dummyUser.roll}</p>
            <p className="text-gray-400 text-sm">{dummyUser.institution}</p>
          </div>
        </section>

        {/* Carrying Laptop/Device Toggle */}
        <section className="mx-4 mt-4 p-4 bg-[#1a2d4d] rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0a1628] rounded-lg">
                <Monitor className="w-5 h-5 text-gray-300" />
              </div>
              <span className="text-base">Carrying Laptop/Device?</span>
            </div>
            <button
              onClick={() => setHasLaptop(!hasLaptop)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                hasLaptop ? "bg-amber-400" : "bg-gray-600"
              }`}
              aria-label={
                hasLaptop ? "Turn off laptop toggle" : "Turn on laptop toggle"
              }
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                  hasLaptop ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </section>

        {/* Personal Books Section */}
        <section className="mx-4 mt-4 p-4 bg-[#1a2d4d] rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#0a1628] rounded-lg">
              <BookOpen className="w-5 h-5 text-gray-300" />
            </div>
            <span className="text-base">Personal Books</span>
          </div>

          {/* Book Tags */}
          {books.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {books.map((book, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#0a1628] rounded-full text-sm"
                >
                  {book}
                  <button
                    onClick={() => removeBook(index)}
                    className="ml-1 hover:text-red-400 transition-colors"
                    aria-label={`Remove ${book}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Book Input */}
          <input
            type="text"
            value={bookInput}
            onChange={(e) => setBookInput(e.target.value)}
            onKeyDown={handleAddBook}
            placeholder="Add book titles or serial numbers..."
            className="w-full px-4 py-3 bg-[#0a1628] rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-amber-400/50 transition-all"
          />
        </section>

        {/* QR Code Section */}
        <section className="flex flex-col items-center mt-8 px-4">
          {/* Asset Declared Badge */}
          <div
            className={`px-4 py-1.5 rounded-full text-sm font-medium mb-[-12px] z-10 ${
              hasAssets ? "bg-teal-500 text-white" : "bg-gray-600 text-gray-300"
            }`}
          >
            {hasAssets ? "Asset Declared" : "No Assets Declared"}
          </div>

          {/* QR Code Card */}
          <div className="bg-[#d4c9a8] rounded-2xl p-6 pt-8 shadow-lg">
            {/* SVG QR Code placeholder - generates a deterministic pattern based on data */}
            <QRCodeSVG data={qrData} size={180} />

            {/* QR Info */}
            <p className="text-center text-[#0a1628] text-xs mt-3 font-medium">
              Pass valid for {dummyUser.roll}
            </p>
          </div>

          {/* Auto-refresh countdown */}
          <p className="text-gray-400 text-sm mt-4">
            Auto-refreshing in {refreshCountdown}s
          </p>

          {/* Valid Offline Badge */}
          <div className="flex items-center gap-2 mt-3 px-4 py-2 bg-[#1a2d4d] rounded-full">
            <Wifi className="w-4 h-4 text-teal-400" />
            <span className="text-sm text-teal-400 font-medium">
              Valid Offline
            </span>
          </div>
        </section>

        {/* Bottom Padding */}
        <div className="h-8" />
      </div>
    </div>
  );
}

// Simple QR Code SVG component (generates a visual pattern)
function QRCodeSVG({ data, size = 180 }) {
  // Generate a deterministic grid pattern based on the data hash
  const gridSize = 21;
  const cellSize = size / gridSize;

  // Simple hash function to generate pattern
  const hash = (str) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return h;
  };

  const dataHash = hash(data);

  // Generate cells
  const cells = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Position patterns (finder patterns in corners)
      const isFinderPattern =
        (row < 7 && col < 7) ||
        (row < 7 && col >= gridSize - 7) ||
        (row >= gridSize - 7 && col < 7);

      // Timing patterns
      const isTimingPattern = (row === 6 || col === 6) && !isFinderPattern;

      // Data area - use hash to determine fill
      const seed = dataHash + row * gridSize + col;
      const isFilled = isFinderPattern
        ? isFinderCell(row, col, gridSize)
        : isTimingPattern
        ? (row + col) % 2 === 0
        : Math.abs(seed % 3) < 2;

      if (isFilled) {
        cells.push(
          <rect
            key={`${row}-${col}`}
            x={col * cellSize}
            y={row * cellSize}
            width={cellSize}
            height={cellSize}
            fill="#0a1628"
          />
        );
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {cells}
    </svg>
  );
}

// Helper to determine if a cell in finder pattern should be filled
function isFinderCell(row, col, gridSize) {
  const positions = [
    { startRow: 0, startCol: 0 },
    { startRow: 0, startCol: gridSize - 7 },
    { startRow: gridSize - 7, startCol: 0 },
  ];

  for (const { startRow, startCol } of positions) {
    const r = row - startRow;
    const c = col - startCol;

    if (r >= 0 && r < 7 && c >= 0 && c < 7) {
      // Outer border
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      // Inner square
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      // White ring
      return false;
    }
  }
  return false;
}

export default Checkin;
