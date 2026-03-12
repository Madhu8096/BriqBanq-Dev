import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    User, Mail, Phone, Building2, Briefcase, MapPin,
    ChevronRight, Home, Upload, Trash2, ShieldCheck,
    Save, X
} from 'lucide-react'

export default function ProfileSettings() {
    const navigate = useNavigate()
    const [isSaving, setIsSaving] = useState(false)
    const [profileData, setProfileData] = useState({
        firstName: 'David',
        lastName: 'Williams',
        email: 'david.williams@example.com',
        phone: '+61 412 345 678',
        company: 'Platinum Capital Partners',
        jobTitle: 'Investment Manager',
        bio: 'Experienced investment professional specializing in distressed asset management and mortgage investment opportunities.',
        address: '123 Collins Street',
        city: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
        country: 'Australia'
    })

    const handleSave = () => {
        setIsSaving(true)
        // Simulate save
        setTimeout(() => {
            setIsSaving(false)
            alert('Profile settings saved successfully!')
        }, 800)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setProfileData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="space-y-8 max-w-7xl pb-20">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profile Settings</h1>
                <p className="text-sm text-gray-500 mt-2 font-medium tracking-wide">Platform administration and compliance management</p>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                <Home className="w-3.5 h-3.5" />
                <ChevronRight className="w-3 h-3" />
                <button onClick={() => navigate('/admin/dashboard')} className="hover:text-gray-900 transition-colors">Dashboard</button>
                <ChevronRight className="w-3 h-3" />
                <button onClick={() => navigate('/admin/settings')} className="hover:text-gray-900 transition-colors">Settings</button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-indigo-600">Profile</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                {/* Left Column */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Profile Photo Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Profile Photo</h3>
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-black mb-8 shadow-xl shadow-indigo-100 ring-4 ring-indigo-50">
                                DW
                            </div>
                            <div className="w-full space-y-3">
                                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-900 hover:bg-gray-50 transition-all shadow-sm">
                                    <Upload className="w-3.5 h-3.5" />
                                    Upload Photo
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-all">
                                    <X className="w-3.5 h-3.5" />
                                    Remove Photo
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium text-center mt-8 leading-relaxed">
                                Recommended: Square image, at least 400x400px<br />
                                JPG, PNG or GIF. Max 5MB.
                            </p>
                        </div>
                    </div>

                    {/* Account Info Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Account Info</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Member Since:</span>
                                <span className="text-sm font-black text-gray-900">Jan 2024</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Account Type:</span>
                                <span className="text-sm font-black text-gray-900">Premium Investor</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Verification:</span>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-emerald-100">Verified</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Personal Information */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name *</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={profileData.firstName}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name *</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={profileData.lastName}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address *</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-4 invisible" />
                                    <input
                                        type="text"
                                        name="company"
                                        value={profileData.company}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-4 invisible" />
                                    <input
                                        type="text"
                                        name="jobTitle"
                                        value={profileData.jobTitle}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bio</label>
                                <textarea
                                    name="bio"
                                    value={profileData.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all resize-none"
                                />
                                <div className="flex justify-between mt-1">
                                    <p className="text-[10px] text-gray-400 font-medium">{profileData.bio.length} / 500 characters</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-12 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Street Address</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="text"
                                        name="address"
                                        value={profileData.address}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-5 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={profileData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                                />
                            </div>
                            <div className="md:col-span-4 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                                <select
                                    name="state"
                                    value={profileData.state}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                                >
                                    <option value="VIC">VIC</option>
                                    <option value="NSW">NSW</option>
                                    <option value="QLD">QLD</option>
                                    <option value="WA">WA</option>
                                    <option value="SA">SA</option>
                                    <option value="TAS">TAS</option>
                                </select>
                            </div>
                            <div className="md:col-span-3 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Postcode</label>
                                <input
                                    type="text"
                                    name="postcode"
                                    value={profileData.postcode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                                />
                            </div>
                            <div className="md:col-span-12 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={profileData.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button
                            onClick={() => navigate('/admin/settings')}
                            className="px-8 py-3 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-3 px-10 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-3.5 h-3.5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
