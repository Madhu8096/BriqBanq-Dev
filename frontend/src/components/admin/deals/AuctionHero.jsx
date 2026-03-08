import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, BedDouble, Bath, Car, Building2, MapPin } from 'lucide-react'

export default function AuctionHero({ deal }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [timeLeft, setTimeLeft] = useState({
        days: '00',
        hours: '02',
        minutes: '44',
        seconds: '44'
    })

    useEffect(() => {
        const timer = setInterval(() => {
            const secs = parseInt(timeLeft.seconds)
            if (secs > 0) {
                setTimeLeft(prev => ({ ...prev, seconds: String(secs - 1).padStart(2, '0') }))
            } else {
                const mins = parseInt(timeLeft.minutes)
                if (mins > 0) {
                    setTimeLeft(prev => ({ ...prev, minutes: String(mins - 1).padStart(2, '0'), seconds: '59' }))
                }
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [timeLeft])

    const nextImage = () => setCurrentImageIndex((currentImageIndex + 1) % deal.images.length)
    const prevImage = () => setCurrentImageIndex((currentImageIndex - 1 + deal.images.length) % deal.images.length)

    return (
        <div className="relative h-[600px] rounded-[3rem] overflow-hidden group shadow-2xl">
            {/* Background Image */}
            <img
                src={deal.images[currentImageIndex]}
                alt={deal.address}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Top Badge */}
            <div className="absolute top-8 left-8">
                <div className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
                    Live Auction
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Content Overlay */}
            <div className="absolute bottom-12 left-12 right-12 flex items-end justify-between">
                <div className="space-y-6">
                    {/* Thumbnails */}
                    <div className="flex gap-3">
                        {deal.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-white scale-110 shadow-xl' : 'border-white/20 opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <img src={img} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-5xl font-black text-white tracking-tight">{deal.address}</h2>
                            <div className="flex items-center gap-2 text-white/80">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm font-medium">{deal.suburb}, {deal.state} {deal.postcode}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs font-bold">
                                <BedDouble className="w-4 h-4" /> {deal.bedrooms} Bed
                            </div>
                            <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs font-bold">
                                <Bath className="w-4 h-4" /> {deal.bathrooms} Bath
                            </div>
                            <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs font-bold">
                                <Car className="w-4 h-4" /> {deal.parking} Car
                            </div>
                            <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs font-bold">
                                <Building2 className="w-4 h-4" /> {deal.propertyType}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Countdown Card */}
                <div className="bg-red-600 rounded-[2.5rem] p-8 text-white min-w-[320px] shadow-2xl border border-red-500/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Auction Ends In</p>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { label: 'Days', value: timeLeft.days },
                            { label: 'Hours', value: timeLeft.hours },
                            { label: 'Minutes', value: timeLeft.minutes },
                            { label: 'Seconds', value: timeLeft.seconds }
                        ].map((time, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black">
                                    {time.value}
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-60">{time.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
