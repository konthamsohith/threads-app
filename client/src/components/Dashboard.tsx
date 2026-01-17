import { useState } from 'react';
import axios from 'axios';
import { Image, Video, Type, Send, LogOut, Loader2 } from 'lucide-react';

interface DashboardProps {
    token: string;
    userId: string;
    onLogout: () => void;
}

const Dashboard = ({ token, userId, onLogout }: DashboardProps) => {
    const [text, setText] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [mediaType, setMediaType] = useState<'TEXT' | 'IMAGE' | 'VIDEO'>('TEXT');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handlePost = async () => {
        if (!text && !mediaUrl) return;

        setLoading(true);
        setStatus(null);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/post`, {
                token,
                userId,
                text,
                mediaType,
                mediaUrl
            });

            setStatus({ type: 'success', message: 'Posted successfully!' });
            setText('');
            setMediaUrl('');
            setMediaType('TEXT');
        } catch (error: any) {
            setStatus({ type: 'error', message: error.response?.data?.error || 'Failed to post' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 pt-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">New Thread</h1>
                <button onClick={onLogout} className="text-sm text-gray-500 hover:text-black flex items-center gap-1">
                    <LogOut size={16} /> Logout
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                {/* Type Selector */}
                <div className="flex gap-2 mb-6 bg-gray-50 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setMediaType('TEXT')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mediaType === 'TEXT' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                    >
                        <div className="flex items-center gap-2"><Type size={16} /> Text</div>
                    </button>
                    <button
                        onClick={() => setMediaType('IMAGE')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mediaType === 'IMAGE' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                    >
                        <div className="flex items-center gap-2"><Image size={16} /> Image</div>
                    </button>
                    <button
                        onClick={() => setMediaType('VIDEO')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mediaType === 'VIDEO' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                    >
                        <div className="flex items-center gap-2"><Video size={16} /> Video</div>
                    </button>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Start a thread..."
                        className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black/5 min-h-[120px] resize-none text-lg outline-none"
                    />

                    {mediaType !== 'TEXT' && (
                        <input
                            type="text"
                            value={mediaUrl}
                            onChange={(e) => setMediaUrl(e.target.value)}
                            placeholder={`Enter ${mediaType.toLowerCase()} URL...`}
                            className="w-full p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black/5 outline-none"
                        />
                    )}
                </div>

                {/* Status Message */}
                {status && (
                    <div className={`mt-4 p-3 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {status.message}
                    </div>
                )}

                {/* Action Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handlePost}
                        disabled={loading || (!text && !mediaUrl)}
                        className="bg-black text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
