"use client"

import { useState, useRef, useEffect } from "react"
import {
  LayoutDashboard,
  FolderOpen,
  Star,
  ScanLine,
  Plane,
  ClipboardList,
  Users,
  Store,
  ArrowLeftRight,
  Heart,
  Crown,
  Lock,
  Upload,
  Check,
  X,
  ChevronRight,
  Search,
  Grid3X3,
  List,
  RotateCcw,
} from "lucide-react"

// ============ DATA ============
const USER = {
  name: "Jamie",
  airport: "EGLL",
  level: 14,
  xp: 2847,
  xpToNext: 3500,
  cards: 147,
  spots: 38,
  setsComplete: 4,
  rank: 312,
  avatar: "J",
}

type Rarity = "common" | "uncommon" | "rare" | "ultra-rare" | "limited"

interface Card {
  id: string
  name: string
  type: string
  manufacturer: string
  airline?: string
  era: string
  rarity: Rarity
  owned: boolean
  set: string
  image?: string
  specs?: {
    engines: string
    range: string
    cruisingAltitude: string
    cruisingSpeed: string
    firstFlight: string
  }
}

const CARDS: Card[] = [
  { id: "1", name: "Boeing 787-9 Dreamliner", type: "Wide-body", manufacturer: "Boeing", airline: "British Airways", era: "Modern", rarity: "limited", owned: true, set: "Modern Marvels", specs: { engines: "GEnx-1B / Trent 1000", range: "7,530 nm", cruisingAltitude: "43,000 ft", cruisingSpeed: "Mach 0.85", firstFlight: "December 15, 2009" } },
  { id: "2", name: "Airbus A380-800", type: "Super Jumbo", manufacturer: "Airbus", airline: "Emirates", era: "Modern", rarity: "ultra-rare", owned: true, set: "Giants of the Sky" },
  { id: "3", name: "Concorde", type: "Supersonic", manufacturer: "Aerospatiale/BAC", airline: "British Airways", era: "Classic", rarity: "ultra-rare", owned: true, set: "Legends" },
  { id: "4", name: "Boeing 747-400", type: "Wide-body", manufacturer: "Boeing", airline: "Lufthansa", era: "Classic", rarity: "rare", owned: true, set: "Giants of the Sky" },
  { id: "5", name: "Airbus A350-900", type: "Wide-body", manufacturer: "Airbus", airline: "Qatar Airways", era: "Modern", rarity: "rare", owned: true, set: "Modern Marvels" },
  { id: "6", name: "Boeing 777-300ER", type: "Wide-body", manufacturer: "Boeing", airline: "Singapore Airlines", era: "Modern", rarity: "rare", owned: true, set: "Long-Haul Kings" },
  { id: "7", name: "Airbus A320neo", type: "Narrow-body", manufacturer: "Airbus", airline: "easyJet", era: "Modern", rarity: "common", owned: true, set: "Workhorses" },
  { id: "8", name: "Boeing 737-800", type: "Narrow-body", manufacturer: "Boeing", airline: "Ryanair", era: "Modern", rarity: "common", owned: true, set: "Workhorses" },
  { id: "9", name: "Airbus A321neo", type: "Narrow-body", manufacturer: "Airbus", airline: "JetBlue", era: "Modern", rarity: "uncommon", owned: true, set: "Workhorses" },
  { id: "10", name: "Boeing 787-10", type: "Wide-body", manufacturer: "Boeing", airline: "United", era: "Modern", rarity: "rare", owned: false, set: "Modern Marvels" },
  { id: "11", name: "Airbus A330-300", type: "Wide-body", manufacturer: "Airbus", airline: "Virgin Atlantic", era: "Modern", rarity: "uncommon", owned: true, set: "Long-Haul Kings" },
  { id: "12", name: "Douglas DC-10", type: "Wide-body", manufacturer: "Douglas", airline: "American Airlines", era: "Classic", rarity: "rare", owned: false, set: "Legends" },
  { id: "13", name: "Boeing 707", type: "Narrow-body", manufacturer: "Boeing", airline: "Pan Am", era: "Classic", rarity: "ultra-rare", owned: false, set: "Legends" },
  { id: "14", name: "Lockheed L-1011 TriStar", type: "Wide-body", manufacturer: "Lockheed", airline: "Eastern", era: "Classic", rarity: "rare", owned: false, set: "Legends" },
  { id: "15", name: "Vickers VC10", type: "Narrow-body", manufacturer: "Vickers", airline: "BOAC", era: "Classic", rarity: "ultra-rare", owned: false, set: "Legends" },
  { id: "16", name: "Airbus A220-300", type: "Narrow-body", manufacturer: "Airbus", airline: "Delta", era: "Modern", rarity: "uncommon", owned: true, set: "Workhorses" },
  { id: "17", name: "Embraer E195-E2", type: "Regional", manufacturer: "Embraer", airline: "KLM", era: "Modern", rarity: "common", owned: true, set: "Regional Jets" },
  { id: "18", name: "Boeing 757-200", type: "Narrow-body", manufacturer: "Boeing", airline: "Icelandair", era: "Classic", rarity: "uncommon", owned: false, set: "Workhorses" },
  { id: "19", name: "Airbus A340-600", type: "Wide-body", manufacturer: "Airbus", airline: "Iberia", era: "Classic", rarity: "rare", owned: false, set: "Long-Haul Kings" },
  { id: "20", name: "Boeing 767-300ER", type: "Wide-body", manufacturer: "Boeing", airline: "Delta", era: "Classic", rarity: "uncommon", owned: true, set: "Long-Haul Kings" },
]

const SETS = [
  { name: "Modern Marvels", owned: 3, total: 8, color: "#38bdf8" },
  { name: "Giants of the Sky", owned: 2, total: 5, color: "#a78bfa" },
  { name: "Legends", owned: 2, total: 6, color: "#f59e0b" },
  { name: "Workhorses", owned: 5, total: 8, color: "#4ade80" },
]

const RECENT_ACTIVITY = [
  { type: "spot", text: "Spotted BA189 at EGLL", time: "2h ago" },
  { type: "unlock", text: "Unlocked 787-9 Limited Edition", time: "2h ago" },
  { type: "badge", text: "Earned \"Early Bird\" badge", time: "1d ago" },
  { type: "trade", text: "Trade offer from @AviationMax", time: "2d ago" },
]

const LEADERBOARD = [
  { rank: 1, name: "SkyWatcher99", spots: 892 },
  { rank: 2, name: "PlaneHunter", spots: 756 },
  { rank: 3, name: "AeroNerd", spots: 612 },
  { rank: 4, name: "Jamie", spots: 38, isUser: true },
  { rank: 5, name: "LHRSpotter", spots: 34 },
]

const MARKETPLACE_LISTINGS = [
  { id: "1", card: CARDS[1], seller: "AviationMax", condition: "Mint", price: "£12.50" },
  { id: "2", card: CARDS[3], seller: "PlaneHunter", condition: "Near Mint", price: "850 coins" },
  { id: "3", card: CARDS[4], seller: "SkyWatcher99", condition: "Mint", price: "£8.00" },
  { id: "4", card: CARDS[5], seller: "AeroNerd", condition: "Excellent", price: "620 coins" },
  { id: "5", card: CARDS[10], seller: "LHRSpotter", condition: "Mint", price: "£15.00" },
  { id: "6", card: CARDS[11], seller: "CloudChaser", condition: "Near Mint", price: "400 coins" },
  { id: "7", card: CARDS[6], seller: "JetSetter42", condition: "Good", price: "200 coins" },
  { id: "8", card: CARDS[7], seller: "RunwayRick", condition: "Mint", price: "£3.50" },
  { id: "9", card: CARDS[8], seller: "TurboProp", condition: "Excellent", price: "350 coins" },
  { id: "10", card: CARDS[16], seller: "WingTip", condition: "Mint", price: "£5.00" },
  { id: "11", card: CARDS[17], seller: "FlightPath", condition: "Near Mint", price: "180 coins" },
  { id: "12", card: CARDS[19], seller: "AltitudeAce", condition: "Mint", price: "£7.50" },
]

const TRADE_OFFERS = [
  { id: "1", from: "AviationMax", offering: CARDS[12], wanting: CARDS[3] },
  { id: "2", from: "PlaneHunter", offering: CARDS[14], wanting: CARDS[0] },
]

const COMMUNITY_POSTS = [
  { id: "1", user: "SkyWatcher99", avatar: "S", action: "spotted", target: "Boeing 747-8F at KJFK", time: "15m ago", card: CARDS[3] },
  { id: "2", user: "AeroNerd", avatar: "A", action: "unlocked", target: "Concorde Limited Edition", time: "1h ago", card: CARDS[2] },
  { id: "3", user: "PlaneHunter", avatar: "P", action: "completed set", target: "Legends Collection", time: "3h ago" },
  { id: "4", user: "CloudChaser", avatar: "C", action: "earned badge", target: "Century Spotter (100 spots)", time: "5h ago" },
  { id: "5", user: "JetSetter42", avatar: "J", action: "spotted", target: "Airbus A380 at EGLL", time: "8h ago", card: CARDS[1] },
]

const GROUPS = [
  { id: "1", name: "LHR Spotters", code: "EGLL", members: 1247, isMember: true },
  { id: "2", name: "Manchester Spotters", code: "MAN", members: 456, isMember: false },
  { id: "3", name: "Edinburgh Spotters", code: "EDI", members: 234, isMember: false },
  { id: "4", name: "Birmingham Spotters", code: "BHX", members: 189, isMember: false },
  { id: "5", name: "Glasgow Spotters", code: "GLA", members: 167, isMember: false },
]

const GLOBAL_LEADERBOARD = [
  { rank: 1, name: "SkyWatcher99", spots: 2847, cards: 423, sets: 12 },
  { rank: 2, name: "PlaneHunter", spots: 2654, cards: 398, sets: 11 },
  { rank: 3, name: "AeroNerd", spots: 2412, cards: 367, sets: 10 },
  { rank: 4, name: "CloudChaser", spots: 2198, cards: 345, sets: 9 },
  { rank: 5, name: "JetSetter42", spots: 2056, cards: 312, sets: 9 },
  { rank: 6, name: "RunwayRick", spots: 1923, cards: 289, sets: 8 },
  { rank: 7, name: "TurboProp", spots: 1845, cards: 276, sets: 8 },
  { rank: 8, name: "WingTip", spots: 1756, cards: 254, sets: 7 },
  { rank: 9, name: "FlightPath", spots: 1687, cards: 243, sets: 7 },
  { rank: 10, name: "AltitudeAce", spots: 1598, cards: 231, sets: 6 },
]

// ============ COMPONENTS ============

function RarityBadge({ rarity }: { rarity: Rarity }) {
  const colors: Record<Rarity, string> = {
    common: "bg-zinc-600 text-zinc-200",
    uncommon: "bg-zinc-500 text-zinc-100",
    rare: "bg-av-accent/20 text-av-accent border border-av-accent/50",
    "ultra-rare": "bg-av-purple/20 text-av-purple border border-av-purple/50",
    limited: "bg-av-green/20 text-av-green border border-av-green/50",
  }
  const labels: Record<Rarity, string> = {
    common: "Common",
    uncommon: "Uncommon",
    rare: "Rare",
    "ultra-rare": "Ultra Rare",
    limited: "Limited",
  }
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${colors[rarity]}`}>
      {labels[rarity]}
    </span>
  )
}

function TradingCard({
  card,
  size = "normal",
  onClick,
  showTilt = true,
}: {
  card: Card
  size?: "normal" | "large"
  onClick?: () => void
  showTilt?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState("")

  const dimensions = size === "large" ? "w-[200px] h-[290px]" : "w-[130px] h-[190px]"

  const bgGradients: Record<Rarity, string> = {
    common: "from-zinc-800 to-zinc-900",
    uncommon: "from-zinc-700 to-zinc-800",
    rare: "from-blue-900/80 to-zinc-900",
    "ultra-rare": "from-purple-900/80 via-blue-900/60 to-zinc-900",
    limited: "from-green-900/80 to-zinc-900",
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!showTilt || !cardRef.current || card.rarity === "common" || card.rarity === "uncommon") return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
  }

  const handleMouseLeave = () => {
    setTransform("")
  }

  const shimmerClass = card.rarity === "rare" 
    ? "card-shimmer-rare" 
    : card.rarity === "ultra-rare" 
    ? "card-shimmer-ultra" 
    : card.rarity === "limited" 
    ? "card-shimmer-limited" 
    : ""

  return (
    <div
      ref={cardRef}
      className={`${dimensions} rounded-lg overflow-hidden relative cursor-pointer transition-transform duration-200 flex-shrink-0 ${!card.owned ? "grayscale opacity-40" : ""}`}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgGradients[card.rarity]}`} />
      
      {/* Shimmer overlay for rare+ */}
      {card.owned && (card.rarity === "rare" || card.rarity === "ultra-rare" || card.rarity === "limited") && (
        <div className={`absolute inset-0 ${shimmerClass} pointer-events-none`} />
      )}

      {/* Card content */}
      <div className="relative h-full flex flex-col p-3">
        {/* Rarity badge */}
        <div className="absolute top-2 right-2 z-10">
          <RarityBadge rarity={card.rarity} />
        </div>

        {/* Limited edition crown */}
        {card.rarity === "limited" && (
          <div className="absolute top-2 left-2 z-10">
            <Crown className="w-4 h-4 text-av-green" />
          </div>
        )}

        {/* Aircraft illustration placeholder */}
        <div className="flex-1 flex items-center justify-center">
          <Plane className={`${size === "large" ? "w-20 h-20" : "w-12 h-12"} text-av-text/30`} />
        </div>

        {/* Bottom info */}
        <div className="bg-gradient-to-t from-black/80 to-transparent -mx-3 -mb-3 px-3 pb-3 pt-6">
          <p className="font-mono text-xs text-av-muted uppercase">{card.type}</p>
          <p className={`font-bold text-av-text ${size === "large" ? "text-base" : "text-sm"} leading-tight`}>{card.name}</p>
        </div>
      </div>

      {/* Lock overlay for unowned */}
      {!card.owned && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/60 rounded-full p-3">
            <Lock className="w-6 h-6 text-av-muted" />
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: React.ElementType }) {
  return (
    <div className="bg-av-bg-card rounded-lg p-4 border border-av-border">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-av-accent/10 rounded-lg">
          <Icon className="w-5 h-5 text-av-accent" />
        </div>
        <div>
          <p className="font-mono text-2xl font-bold text-av-text">{value}</p>
          <p className="text-sm text-av-muted">{label}</p>
        </div>
      </div>
    </div>
  )
}

function Radar() {
  return (
    <div className="relative w-full aspect-square max-w-[200px] mx-auto">
      {/* Radar circles */}
      <div className="absolute inset-0 rounded-full border border-av-accent/20" />
      <div className="absolute inset-[25%] rounded-full border border-av-accent/20" />
      <div className="absolute inset-[50%] rounded-full border border-av-accent/20" />
      
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-av-accent rounded-full" />
      
      {/* Sweep line */}
      <div className="absolute inset-0 radar-sweep origin-center">
        <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-av-accent to-transparent origin-left" />
      </div>
      
      {/* Blips */}
      <div className="absolute top-[30%] left-[60%] w-2 h-2 bg-av-green rounded-full radar-blip" />
      <div className="absolute top-[45%] left-[25%] w-2 h-2 bg-av-green rounded-full radar-blip" style={{ animationDelay: "0.5s" }} />
      <div className="absolute top-[70%] left-[55%] w-2 h-2 bg-av-green rounded-full radar-blip" style={{ animationDelay: "1s" }} />
    </div>
  )
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-4 right-4 bg-av-green text-av-bg px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 toast-enter z-50">
      <Check className="w-5 h-5" />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// ============ PAGES ============

function Dashboard({ onCardClick, showToast }: { onCardClick: (card: Card) => void; showToast: (msg: string) => void }) {
  const recentCards = CARDS.filter(c => c.owned).slice(0, 5)

  return (
    <div className="page-enter">
      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Cards Owned" value={USER.cards} icon={FolderOpen} />
            <StatCard label="Planes Spotted" value={USER.spots} icon={Plane} />
            <StatCard label="Sets Complete" value={USER.setsComplete} icon={Star} />
            <StatCard label="Global Rank" value={`#${USER.rank}`} icon={Crown} />
          </div>

          {/* Recent cards */}
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Cards</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {recentCards.map(card => (
                <TradingCard key={card.id} card={card} onClick={() => onCardClick(card)} />
              ))}
            </div>
          </div>

          {/* Set progress */}
          <div>
            <h2 className="text-xl font-bold mb-4">Set Progress</h2>
            <div className="grid grid-cols-2 gap-4">
              {SETS.map(set => (
                <div key={set.name} className="bg-av-bg-card rounded-lg p-4 border border-av-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{set.name}</span>
                    <span className="font-mono text-sm text-av-muted">{set.owned}/{set.total}</span>
                  </div>
                  <div className="h-2 bg-av-bg rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(set.owned / set.total) * 100}%`, backgroundColor: set.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-80 space-y-6">
          {/* Spot widget */}
          <div className="bg-av-bg-card rounded-lg p-4 border border-av-border">
            <h3 className="font-bold mb-3">Spot a Plane</h3>
            <div className="border-2 border-dashed border-av-border rounded-lg p-6 text-center hover:border-av-accent transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-av-muted" />
              <p className="text-sm text-av-muted">Upload photo or enter reg</p>
            </div>
          </div>

          {/* Radar */}
          <div className="bg-av-bg-card rounded-lg p-4 border border-av-border">
            <h3 className="font-bold mb-3">Nearby Traffic at {USER.airport}</h3>
            <Radar />
          </div>

          {/* Leaderboard */}
          <div className="bg-av-bg-card rounded-lg p-4 border border-av-border">
            <h3 className="font-bold mb-3">LHR Spotters</h3>
            <div className="space-y-2">
              {LEADERBOARD.map(entry => (
                <div 
                  key={entry.rank} 
                  className={`flex items-center gap-3 p-2 rounded ${entry.isUser ? "bg-av-accent/10 border border-av-accent/30" : ""}`}
                >
                  <span className="font-mono text-sm w-6 text-av-muted">#{entry.rank}</span>
                  <span className={`flex-1 ${entry.isUser ? "text-av-accent font-medium" : ""}`}>{entry.name}</span>
                  <span className="font-mono text-sm text-av-muted">{entry.spots}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-av-bg-card rounded-lg p-4 border border-av-border">
            <h3 className="font-bold mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {RECENT_ACTIVITY.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-av-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{item.text}</p>
                    <p className="text-xs text-av-muted">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Binder({ onCardClick }: { onCardClick: (card: Card) => void }) {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({ type: "", manufacturer: "", rarity: "" })

  const filteredCards = CARDS.filter(card => {
    if (search && !card.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filters.type && card.type !== filters.type) return false
    if (filters.manufacturer && card.manufacturer !== filters.manufacturer) return false
    if (filters.rarity && card.rarity !== filters.rarity) return false
    return true
  })

  const ownedCount = CARDS.filter(c => c.owned).length

  return (
    <div className="page-enter">
      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-av-muted" />
              <input
                type="text"
                placeholder="Search cards..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-av-bg-card border border-av-border rounded-lg text-av-text placeholder:text-av-muted focus:outline-none focus:border-av-accent"
              />
            </div>
            <select
              value={filters.type}
              onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
              className="px-4 py-2 bg-av-bg-card border border-av-border rounded-lg text-av-text focus:outline-none focus:border-av-accent"
            >
              <option value="">All Types</option>
              <option value="Wide-body">Wide-body</option>
              <option value="Narrow-body">Narrow-body</option>
              <option value="Regional">Regional</option>
              <option value="Supersonic">Supersonic</option>
              <option value="Super Jumbo">Super Jumbo</option>
            </select>
            <select
              value={filters.manufacturer}
              onChange={e => setFilters(f => ({ ...f, manufacturer: e.target.value }))}
              className="px-4 py-2 bg-av-bg-card border border-av-border rounded-lg text-av-text focus:outline-none focus:border-av-accent"
            >
              <option value="">All Manufacturers</option>
              <option value="Boeing">Boeing</option>
              <option value="Airbus">Airbus</option>
              <option value="Lockheed">Lockheed</option>
              <option value="Douglas">Douglas</option>
              <option value="Embraer">Embraer</option>
            </select>
            <select
              value={filters.rarity}
              onChange={e => setFilters(f => ({ ...f, rarity: e.target.value }))}
              className="px-4 py-2 bg-av-bg-card border border-av-border rounded-lg text-av-text focus:outline-none focus:border-av-accent"
            >
              <option value="">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="ultra-rare">Ultra Rare</option>
              <option value="limited">Limited</option>
            </select>
            <div className="flex bg-av-bg-card border border-av-border rounded-lg overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={`p-2 ${view === "grid" ? "bg-av-accent text-av-bg" : "text-av-muted hover:text-av-text"}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 ${view === "list" ? "bg-av-accent text-av-bg" : "text-av-muted hover:text-av-text"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cards */}
          {view === "grid" ? (
            <div className="grid grid-cols-5 gap-4">
              {filteredCards.map(card => (
                <TradingCard key={card.id} card={card} onClick={() => onCardClick(card)} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCards.map(card => (
                <div
                  key={card.id}
                  onClick={() => onCardClick(card)}
                  className={`flex items-center gap-4 p-3 bg-av-bg-card border border-av-border rounded-lg cursor-pointer hover:border-av-accent transition-colors ${!card.owned ? "opacity-40" : ""}`}
                >
                  <Plane className="w-8 h-8 text-av-muted" />
                  <div className="flex-1">
                    <p className="font-medium">{card.name}</p>
                    <p className="text-sm text-av-muted">{card.manufacturer} - {card.type}</p>
                  </div>
                  <RarityBadge rarity={card.rarity} />
                  {!card.owned && <Lock className="w-5 h-5 text-av-muted" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="w-72 space-y-4">
          <div className="bg-av-bg-card rounded-lg p-4 border border-av-border">
            <h3 className="font-bold mb-3">Collection Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-av-muted">Total Cards</span>
                <span className="font-mono">{ownedCount}/{CARDS.length}</span>
              </div>
              <div className="h-2 bg-av-bg rounded-full overflow-hidden">
                <div className="h-full bg-av-accent rounded-full" style={{ width: `${(ownedCount / CARDS.length) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-av-bg-card rounded-lg p-4 border border-av-border">
            <h3 className="font-bold mb-3">Recently Viewed</h3>
            <div className="space-y-2">
              {CARDS.slice(0, 3).map(card => (
                <div key={card.id} className="flex items-center gap-3 text-sm">
                  <Plane className="w-4 h-4 text-av-muted" />
                  <span className="truncate">{card.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-av-bg-card rounded-lg p-4 border border-av-border">
            <h3 className="font-bold mb-3">Active Sets</h3>
            <div className="space-y-3">
              {SETS.slice(0, 2).map(set => (
                <div key={set.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{set.name}</span>
                    <span className="font-mono text-av-muted">{set.owned}/{set.total}</span>
                  </div>
                  <div className="h-1.5 bg-av-bg rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(set.owned / set.total) * 100}%`, backgroundColor: set.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SpotPlane({ showToast }: { showToast: (msg: string) => void }) {
  const [reg, setReg] = useState("")
  const [verified, setVerified] = useState(false)

  const handleVerify = () => {
    setVerified(true)
    showToast("Limited Edition Unlocked!")
  }

  const handleAddToBinder = () => {
    showToast("Card Added to Binder")
  }

  return (
    <div className="page-enter">
      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Step 1 */}
            <div className="bg-av-bg-card rounded-lg p-6 border border-av-border">
              <h2 className="text-xl font-bold mb-4">Step 1: Upload or Enter Registration</h2>
              
              <div className="border-2 border-dashed border-av-border rounded-lg p-8 text-center hover:border-av-accent transition-colors cursor-pointer mb-4">
                <Upload className="w-12 h-12 mx-auto mb-3 text-av-muted" />
                <p className="text-av-muted mb-1">Drag and drop your photo here</p>
                <p className="text-sm text-av-muted">or click to browse</p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm text-av-muted">Or enter registration manually</label>
                <input
                  type="text"
                  placeholder="e.g. G-BOAC"
                  value={reg}
                  onChange={e => setReg(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-av-bg border border-av-border rounded-lg text-av-text font-mono placeholder:text-av-muted focus:outline-none focus:border-av-accent"
                />
                <button
                  onClick={handleVerify}
                  className="w-full py-3 bg-av-accent text-av-bg font-bold rounded-lg hover:bg-av-accent/90 transition-colors"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`bg-av-bg-card rounded-lg p-6 border border-av-border ${!verified ? "opacity-50" : ""}`}>
              <h2 className="text-xl font-bold mb-4">Step 2: Verification Result</h2>
              
              {verified ? (
                <div className="space-y-4">
                  {/* Success banner */}
                  <div className="bg-av-green/20 border border-av-green/50 rounded-lg p-4 flex items-center gap-3">
                    <Crown className="w-6 h-6 text-av-green" />
                    <span className="font-bold text-av-green">Limited Edition Unlocked!</span>
                  </div>

                  {/* Aircraft info */}
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-av-border">
                      <span className="text-av-muted">Aircraft Type</span>
                      <span className="font-medium">Boeing 787-9 Dreamliner</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-av-border">
                      <span className="text-av-muted">Flight Number</span>
                      <span className="font-mono">BA189</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-av-border">
                      <span className="text-av-muted">Route</span>
                      <span>LHR → SIN</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-av-border">
                      <span className="text-av-muted">Airline</span>
                      <span>British Airways</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-av-border">
                      <span className="text-av-muted">Aircraft Age</span>
                      <span className="font-mono">4.2 years</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToBinder}
                      className="flex-1 py-3 bg-av-accent text-av-bg font-bold rounded-lg hover:bg-av-accent/90 transition-colors"
                    >
                      Add to Digital Binder
                    </button>
                    <button className="flex-1 py-3 bg-av-bg-secondary border border-av-border font-bold rounded-lg hover:border-av-accent transition-colors">
                      Order Physical Card
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-av-muted">
                  <p>Complete Step 1 to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-80 space-y-4">
          <div className="bg-av-bg-card rounded-lg p-4 border border-av-border">
            <h3 className="font-bold mb-3">Recent Spots</h3>
            <div className="space-y-3">
              {[
                { date: "14 May", aircraft: "787-9", reg: "G-ZBKM", unlock: true },
                { date: "12 May", aircraft: "A380", reg: "G-XLED", unlock: false },
                { date: "10 May", aircraft: "777-300ER", reg: "G-STBK", unlock: false },
                { date: "8 May", aircraft: "A350-900", reg: "G-VLUX", unlock: true },
              ].map((spot, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="text-av-muted font-mono w-14">{spot.date}</span>
                  <span className="flex-1">{spot.aircraft}</span>
                  <span className="font-mono text-av-muted">{spot.reg}</span>
                  {spot.unlock && <Star className="w-4 h-4 text-av-green" />}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-av-bg-card rounded-lg p-4 border border-av-border">
            <h3 className="font-bold mb-3">Spot Locations</h3>
            <div className="aspect-video bg-av-bg rounded-lg flex items-center justify-center text-av-muted">
              <p className="text-sm">Map placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CardDetail({ card, onBack }: { card: Card; onBack: () => void }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="page-enter">
      <button onClick={onBack} className="flex items-center gap-2 text-av-muted hover:text-av-text mb-6">
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to Binder
      </button>

      <div className="flex gap-8">
        {/* Card display */}
        <div className="space-y-4">
          <div className="relative" style={{ perspective: "1000px" }}>
            <div
              className="transition-transform duration-500"
              style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "" }}
            >
              {/* Front */}
              <div style={{ backfaceVisibility: "hidden" }}>
                <TradingCard card={card} size="large" showTilt={false} />
              </div>
            </div>
          </div>
          <button
            onClick={() => setFlipped(!flipped)}
            className="w-full flex items-center justify-center gap-2 py-2 bg-av-bg-card border border-av-border rounded-lg hover:border-av-accent transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Flip Card
          </button>
        </div>

        {/* Card info */}
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{card.name}</h1>
              <RarityBadge rarity={card.rarity} />
            </div>
            <p className="text-av-muted">{card.set} Collection</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-av-bg-card rounded-lg p-3 border border-av-border">
              <p className="text-xs text-av-muted mb-1">Condition</p>
              <p className="font-medium">Mint</p>
            </div>
            <div className="bg-av-bg-card rounded-lg p-3 border border-av-border">
              <p className="text-xs text-av-muted mb-1">Scan Date</p>
              <p className="font-mono text-sm">14 May 2025</p>
            </div>
            <div className="bg-av-bg-card rounded-lg p-3 border border-av-border">
              <p className="text-xs text-av-muted mb-1">Status</p>
              <p className={card.owned ? "text-av-green" : "text-av-muted"}>
                {card.owned ? "Owned" : "Locked"}
              </p>
            </div>
          </div>

          {/* Specs */}
          <div className="bg-av-bg-card rounded-lg p-4 border border-av-border">
            <h3 className="font-bold mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-av-muted">Manufacturer</p>
                <p className="font-medium">{card.manufacturer}</p>
              </div>
              <div>
                <p className="text-av-muted">Type</p>
                <p className="font-medium">{card.type}</p>
              </div>
              {card.specs && (
                <>
                  <div>
                    <p className="text-av-muted">Engines</p>
                    <p className="font-medium">{card.specs.engines}</p>
                  </div>
                  <div>
                    <p className="text-av-muted">Range</p>
                    <p className="font-mono">{card.specs.range}</p>
                  </div>
                  <div>
                    <p className="text-av-muted">Cruising Altitude</p>
                    <p className="font-mono">{card.specs.cruisingAltitude}</p>
                  </div>
                  <div>
                    <p className="text-av-muted">Cruising Speed</p>
                    <p className="font-mono">{card.specs.cruisingSpeed}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-av-muted">First Flight</p>
                    <p className="font-medium">{card.specs.firstFlight}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Spot metadata for limited edition */}
          {card.rarity === "limited" && (
            <div className="bg-av-green/10 border border-av-green/30 rounded-lg p-4">
              <h3 className="font-bold mb-3 text-av-green">Spot Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-av-muted">Location</p>
                  <p>EGLL (London Heathrow)</p>
                </div>
                <div>
                  <p className="text-av-muted">Date & Time</p>
                  <p className="font-mono">14 May 2025, 09:34</p>
                </div>
                <div>
                  <p className="text-av-muted">Flight</p>
                  <p className="font-mono">BA189 LHR→SIN</p>
                </div>
                <div>
                  <p className="text-av-muted">Aircraft Age</p>
                  <p className="font-mono">4.2 years</p>
                </div>
              </div>
            </div>
          )}

          {/* Community spots */}
          <div className="bg-av-bg-card rounded-lg p-4 border border-av-border">
            <h3 className="font-bold mb-3">Community Spots</h3>
            <div className="space-y-3">
              {[
                { user: "SkyWatcher99", location: "KJFK", date: "12 May" },
                { user: "AeroNerd", location: "KLAX", date: "10 May" },
                { user: "PlaneHunter", location: "EDDF", date: "8 May" },
              ].map((spot, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-av-bg-secondary flex items-center justify-center text-xs font-bold">
                    {spot.user[0]}
                  </div>
                  <span className="flex-1">{spot.user}</span>
                  <span className="text-av-muted">{spot.location}</span>
                  <span className="font-mono text-av-muted">{spot.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Marketplace({ onCardClick }: { onCardClick: (card: Card) => void }) {
  return (
    <div className="page-enter">
      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <select className="px-4 py-2 bg-av-bg-card border border-av-border rounded-lg text-av-text focus:outline-none focus:border-av-accent">
              <option>All Rarities</option>
              <option>Common</option>
              <option>Uncommon</option>
              <option>Rare</option>
              <option>Ultra Rare</option>
              <option>Limited</option>
            </select>
            <select className="px-4 py-2 bg-av-bg-card border border-av-border rounded-lg text-av-text focus:outline-none focus:border-av-accent">
              <option>All Types</option>
              <option>Wide-body</option>
              <option>Narrow-body</option>
              <option>Regional</option>
            </select>
            <select className="px-4 py-2 bg-av-bg-card border border-av-border rounded-lg text-av-text focus:outline-none focus:border-av-accent">
              <option>Any Price</option>
              <option>Under 500 coins</option>
              <option>500-1000 coins</option>
              <option>Over 1000 coins</option>
            </select>
            <select className="px-4 py-2 bg-av-bg-card border border-av-border rounded-lg text-av-text focus:outline-none focus:border-av-accent">
              <option>Any Condition</option>
              <option>Mint</option>
              <option>Near Mint</option>
              <option>Excellent</option>
              <option>Good</option>
            </select>
          </div>

          {/* Listings grid */}
          <div className="grid grid-cols-4 gap-4">
            {MARKETPLACE_LISTINGS.map(listing => (
              <div key={listing.id} className="bg-av-bg-card rounded-lg p-3 border border-av-border hover:border-av-accent transition-colors">
                <div className="mb-3" onClick={() => onCardClick(listing.card)}>
                  <TradingCard card={{ ...listing.card, owned: true }} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-av-muted">@{listing.seller}</span>
                    <span className="text-xs text-av-muted">{listing.condition}</span>
                  </div>
                  <p className="font-mono font-bold text-av-accent">{listing.price}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 bg-av-accent text-av-bg text-sm font-bold rounded hover:bg-av-accent/90 transition-colors">
                      Buy
                    </button>
                    <button className="flex-1 py-1.5 bg-av-bg-secondary border border-av-border text-sm font-medium rounded hover:border-av-accent transition-colors">
                      Offer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-72 space-y-4">
          <div className="bg-av-bg-card rounded-lg p-4 border border-av-border">
            <h3 className="font-bold mb-3">Your Listings</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Plane className="w-8 h-8 text-av-muted" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">A320neo</p>
                  <p className="text-xs text-av-muted">350 coins</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Plane className="w-8 h-8 text-av-muted" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">737-800</p>
                  <p className="text-xs text-av-muted">£4.50</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-av-bg-card rounded-lg p-4 border border-av-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Trade Offers</h3>
              <span className="px-2 py-0.5 bg-av-accent text-av-bg text-xs font-bold rounded">2</span>
            </div>
            <div className="space-y-4">
              {TRADE_OFFERS.map(offer => (
                <div key={offer.id} className="p-3 bg-av-bg rounded-lg border border-av-border">
                  <p className="text-sm text-av-muted mb-2">From @{offer.from}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 text-center">
                      <p className="text-xs text-av-muted mb-1">Offering</p>
                      <p className="text-sm font-medium truncate">{offer.offering.name}</p>
                    </div>
                    <ArrowLeftRight className="w-4 h-4 text-av-muted flex-shrink-0" />
                    <div className="flex-1 text-center">
                      <p className="text-xs text-av-muted mb-1">Wants</p>
                      <p className="text-sm font-medium truncate">{offer.wanting.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 bg-av-green text-av-bg text-sm font-bold rounded hover:bg-av-green/90 transition-colors">
                      Accept
                    </button>
                    <button className="flex-1 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-medium rounded hover:bg-red-500/30 transition-colors">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-av-bg-card rounded-lg p-4 border border-av-border">
            <h3 className="font-bold mb-3">Recent Sales</h3>
            <div className="space-y-2 text-sm">
              {[
                { card: "A380-800", price: "£18.00" },
                { card: "747-400", price: "920 coins" },
                { card: "Concorde", price: "£45.00" },
              ].map((sale, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-av-muted">{sale.card}</span>
                  <span className="font-mono text-av-green">{sale.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Community() {
  const [tab, setTab] = useState<"feed" | "groups" | "leaderboard">("feed")

  return (
    <div className="page-enter">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-av-bg-card rounded-lg p-1 w-fit">
        {(["feed", "groups", "leaderboard"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md font-medium capitalize transition-colors ${tab === t ? "bg-av-accent text-av-bg" : "text-av-muted hover:text-av-text"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "feed" && (
        <div className="max-w-2xl space-y-4">
          {COMMUNITY_POSTS.map(post => (
            <div key={post.id} className="bg-av-bg-card rounded-lg p-4 border border-av-border">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-av-bg-secondary flex items-center justify-center font-bold">
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <p>
                    <span className="font-medium">{post.user}</span>
                    <span className="text-av-muted"> {post.action} </span>
                    <span className="font-medium">{post.target}</span>
                  </p>
                  <p className="text-sm text-av-muted mt-1">{post.time}</p>
                </div>
                {post.card && (
                  <div className="w-16">
                    <TradingCard card={post.card} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "groups" && (
        <div className="grid grid-cols-3 gap-4 max-w-4xl">
          {GROUPS.map(group => (
            <div key={group.id} className={`bg-av-bg-card rounded-lg p-4 border ${group.isMember ? "border-av-accent" : "border-av-border"}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-av-bg-secondary flex items-center justify-center font-mono font-bold text-av-accent">
                  {group.code}
                </div>
                <div>
                  <p className="font-bold">{group.name}</p>
                  <p className="text-sm text-av-muted">{group.members.toLocaleString()} members</p>
                </div>
              </div>
              {group.isMember ? (
                <div className="flex items-center gap-2 text-sm text-av-green">
                  <Check className="w-4 h-4" />
                  <span>Member</span>
                </div>
              ) : (
                <button className="w-full py-2 bg-av-accent text-av-bg font-bold rounded-lg hover:bg-av-accent/90 transition-colors">
                  Join Group
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "leaderboard" && (
        <div className="max-w-2xl">
          <div className="bg-av-bg-card rounded-lg border border-av-border overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-3 bg-av-bg-secondary text-sm font-medium text-av-muted border-b border-av-border">
              <span>Rank</span>
              <span>User</span>
              <span className="text-right">Spots</span>
              <span className="text-right">Cards</span>
              <span className="text-right">Sets</span>
            </div>
            {GLOBAL_LEADERBOARD.map(entry => (
              <div key={entry.rank} className="grid grid-cols-5 gap-4 p-3 border-b border-av-border last:border-0">
                <span className="font-mono font-bold text-av-accent">#{entry.rank}</span>
                <span className="font-medium">{entry.name}</span>
                <span className="font-mono text-right">{entry.spots}</span>
                <span className="font-mono text-right">{entry.cards}</span>
                <span className="font-mono text-right">{entry.sets}</span>
              </div>
            ))}
            {/* Gap indicator */}
            <div className="p-3 text-center text-av-muted border-b border-av-border">
              ...
            </div>
            {/* User's rank */}
            <div className="grid grid-cols-5 gap-4 p-3 bg-av-accent/10 border border-av-accent/30">
              <span className="font-mono font-bold text-av-accent">#{USER.rank}</span>
              <span className="font-medium text-av-accent">{USER.name} (You)</span>
              <span className="font-mono text-right">{USER.spots}</span>
              <span className="font-mono text-right">{USER.cards}</span>
              <span className="font-mono text-right">{USER.setsComplete}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============ MAIN APP ============

type Page = "dashboard" | "binder" | "limited" | "scan" | "spot" | "log" | "group" | "marketplace" | "trades" | "wanted" | "community"

export default function AVCollect() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard")
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => setToast(msg)

  const handleCardClick = (card: Card) => {
    setSelectedCard(card)
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "binder", label: "Binder" },
    { id: "spot", label: "Spot" },
    { id: "marketplace", label: "Marketplace" },
    { id: "community", label: "Community" },
  ] as const

  const sidebarSections = [
    {
      title: "Collection",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "binder", label: "My Binder", icon: FolderOpen },
        { id: "limited", label: "Limited Editions", icon: Star },
        { id: "scan", label: "Scan a Card", icon: ScanLine },
      ],
    },
    {
      title: "Spotting",
      items: [
        { id: "spot", label: "Spot a Plane", icon: Plane },
        { id: "log", label: "Spotting Log", icon: ClipboardList },
        { id: "group", label: "LHR Spotters Group", icon: Users },
      ],
    },
    {
      title: "Trade",
      items: [
        { id: "marketplace", label: "Marketplace", icon: Store },
        { id: "trades", label: "Trade Offers", icon: ArrowLeftRight, badge: 2 },
        { id: "wanted", label: "Wanted List", icon: Heart },
      ],
    },
  ] as const

  const renderPage = () => {
    if (selectedCard) {
      return <CardDetail card={selectedCard} onBack={() => setSelectedCard(null)} />
    }

    switch (currentPage) {
      case "dashboard":
        return <Dashboard onCardClick={handleCardClick} showToast={showToast} />
      case "binder":
      case "limited":
        return <Binder onCardClick={handleCardClick} />
      case "spot":
      case "log":
        return <SpotPlane showToast={showToast} />
      case "marketplace":
      case "trades":
        return <Marketplace onCardClick={handleCardClick} />
      case "community":
      case "group":
        return <Community />
      default:
        return <Dashboard onCardClick={handleCardClick} showToast={showToast} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navbar */}
      <nav className="h-14 bg-av-bg-secondary border-b border-av-border flex items-center px-4 fixed top-0 left-0 right-0 z-40">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-8">
          <Plane className="w-6 h-6 text-av-accent" />
          <span className="text-xl font-bold">AV Collect</span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id); setSelectedCard(null); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === item.id ? "text-av-accent bg-av-accent/10" : "text-av-muted hover:text-av-text"}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side - XP bar and avatar */}
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-32">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-av-muted">Level {USER.level}</span>
                <span className="font-mono text-av-muted">{USER.xp}/{USER.xpToNext}</span>
              </div>
              <div className="h-2 bg-av-bg rounded-full overflow-hidden">
                <div className="h-full bg-av-accent rounded-full" style={{ width: `${(USER.xp / USER.xpToNext) * 100}%` }} />
              </div>
            </div>
            <div className="px-2 py-1 bg-av-accent/20 text-av-accent text-sm font-bold rounded">
              Lv.{USER.level}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-av-accent flex items-center justify-center font-bold text-av-bg">
            {USER.avatar}
          </div>
        </div>
      </nav>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className="w-56 bg-av-bg-secondary border-r border-av-border fixed left-0 top-14 bottom-0 overflow-y-auto">
          <div className="p-4 space-y-6">
            {sidebarSections.map(section => (
              <div key={section.title}>
                <h3 className="text-xs font-bold text-av-muted uppercase tracking-wider mb-2">{section.title}</h3>
                <div className="space-y-1">
                  {section.items.map(item => {
                    const Icon = item.icon
                    const isActive = currentPage === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setCurrentPage(item.id as Page); setSelectedCard(null); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? "bg-av-accent/10 text-av-accent" : "text-av-muted hover:text-av-text hover:bg-av-bg"}`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="flex-1 text-left text-sm">{item.label}</span>
                        {"badge" in item && item.badge && (
                          <span className="px-2 py-0.5 bg-av-accent text-av-bg text-xs font-bold rounded">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-56 p-6">
          {renderPage()}
        </main>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
