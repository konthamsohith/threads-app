import { ArrowRight } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const handleLogin = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/threads`);
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Failed to start login:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                    @
                </div>
                <h1 className="text-3xl font-bold mb-2">Threads Poster</h1>
                <p className="text-gray-500 mb-8">Connect your account to verify and start posting directly to Threads.</p>

                <button
                    onClick={handleLogin}
                    className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <span>Connect with Threads</span>
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default Login;
