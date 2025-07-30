import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, getIdTokenResult, getIdToken } from 'firebase/auth';

// =================================================================
// KONFIGURASI FIREBASE (WAJIB DIISI)
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBw0ji-FOZWMSOFbEZ_UY1Z9qR6cDPeN5c",
  authDomain: "aksaraai-4041b.firebaseapp.com",
  projectId: "aksaraai-4041b",
  storageBucket: "aksaraai-4041b.appspot.com",
  messagingSenderId: "207939858994",
  appId: "1:207939858994:web:2089a3d0ad6e4fd200022b",
  measurementId: "G-8HT1PRZ4GZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// =================================================================
// PENGATURAN API BACKEND
// =================================================================
const API_BASE_URL = 'http://localhost:5000/api';

// =================================================================
// Ikon SVG
// =================================================================
const LogoIcon = () => <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 10 L90 90 L75 90 L50 40 L25 90 L10 90 Z" fill="#3B82F6"/></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const ClientsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const MonitorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2z" /></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>;


// =================================================================
// API Service (Simulasi)
// =================================================================
const apiService = {
    getAdminDashboard: async (token) => ({ totalClients: 17, activeClients: 15, newThisMonth: 4 }),
    getClientDashboard: async (token) => ({ chatsHandled: 1523, formsSubmitted: 42, topQuestion: 'Lokasi di mana?' }),
    getClients: async (token) => [{ id: 'client1', businessName: 'Kopi Kenangan Manis', email: 'sarah@kopi.com', status: 'Aktif' }],
    getClientUsage: async (token) => ({
        interactions: { used: 1523, limit: 2000, name: 'Interaksi Chatbot' },
        forms: { used: 1, limit: 2, name: 'Formulir Pintar' }
    }),
    getClientSettings: async (token) => ({ isChatbotActive: true, welcomeMessage: 'Halo, selamat datang!' }),
    updateClientSettings: async (token, settings) => { console.log("Updating settings:", settings); return { success: true }; }
};

// =================================================================
// KOMPONEN UTAMA APLIKASI (APP)
// =================================================================
const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState('dashboard');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const tokenResult = await getIdTokenResult(currentUser);
                const role = tokenResult.claims.role || 'client';
                // PERBAIKAN: Jangan membuat objek baru dengan spread operator.
                // Ini akan menghancurkan prototype object User dari Firebase.
                // Sebaliknya, kita tambahkan 'role' ke object yang ada.
                const userWithRole = currentUser;
                userWithRole.role = role;
                setUser(userWithRole);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            alert("Login Gagal: " + error.message);
            throw error;
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
    };
    
    if (loading) return <div className="flex items-center justify-center h-screen bg-gray-100">Memuat Aplikasi...</div>;
    if (!user) return <LoginPage onLogin={handleLogin} />;

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar user={user} currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />
            <main className="flex-1 lg:ml-64 p-6 sm:p-10">
                {currentPage === 'dashboard' && <DashboardPage user={user} />}
                {user.role === 'admin' && currentPage === 'clients' && <ClientsListPage user={user} />}
                {user.role === 'client' && currentPage === 'monitoring' && <MonitoringPage user={user} />}
                {user.role === 'client' && currentPage === 'settings' && <SettingsPage user={user} />}
            </main>
        </div>
    );
};

// =================================================================
// KOMPONEN-KOMPONEN HALAMAN
// =================================================================

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        try {
            await onLogin(email, password);
        } catch (error) {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
                <div className="text-center"><div className="flex justify-center items-center gap-3"><LogoIcon /><span className="text-2xl font-bold text-gray-900">Aksara<span className="text-blue-600">AI</span></span></div><h2 className="mt-4 text-xl font-bold text-gray-700">Dashboard Login</h2></div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div><label className="text-sm font-bold text-gray-600 block">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mt-1 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
                    <div><label className="text-sm font-bold text-gray-600 block">Password</label><div className="relative"><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mt-1 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center">{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button></div></div>
                    <button type="submit" disabled={isLoggingIn} className="w-full py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">{isLoggingIn ? 'Logging in...' : 'Login'}</button>
                </form>
            </div>
        </div>
    );
};

const Sidebar = ({ user, currentPage, onNavigate, onLogout }) => {
    const adminNav = [{ name: 'Dashboard', icon: <DashboardIcon />, page: 'dashboard' }, { name: 'Manajemen Klien', icon: <ClientsIcon />, page: 'clients' }];
    const clientNav = [{ name: 'Dashboard', icon: <DashboardIcon />, page: 'dashboard' }, { name: 'Monitoring Paket', icon: <MonitorIcon />, page: 'monitoring' }, { name: 'Pengaturan', icon: <SettingsIcon />, page: 'settings' }];
    const navItems = user.role === 'admin' ? adminNav : clientNav;

    return (
        <aside className="w-64 bg-white h-screen fixed top-0 left-0 border-r border-gray-200 p-6 flex-col justify-between hidden lg:flex">
            <div>
                <div className="flex items-center gap-3 mb-10"><LogoIcon /><span className="text-xl font-bold text-gray-900">Aksara<span className="text-blue-600">AI</span></span></div>
                <nav className="flex flex-col space-y-2">
                    {navItems.map(item => (<button key={item.name} onClick={() => onNavigate(item.page)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors ${currentPage === item.page ? 'bg-blue-600 text-white' : ''}`}>{item.icon}<span>{item.name}</span></button>))}
                </nav>
            </div>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors"><LogoutIcon /><span>Logout</span></button>
        </aside>
    );
};

const DashboardPage = ({ user }) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const token = await getIdToken(user);
            const result = user.role === 'admin' ? await apiService.getAdminDashboard(token) : await apiService.getClientDashboard(token);
            setData(result);
        };
        fetchData();
    }, [user]);

    if (!data) return <div>Memuat dashboard...</div>;

    return user.role === 'admin' ? <AdminDashboard user={user} data={data} /> : <ClientDashboard user={user} data={data} />;
};

const AdminDashboard = ({ user, data }) => (
    <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Selamat datang, {user.email}!</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200"><p className="text-sm font-semibold text-blue-600">TOTAL KLIEN</p><h3 className="text-4xl font-bold text-gray-900 mt-2">{data.totalClients}</h3></div>
            <div className="bg-white p-6 rounded-xl border border-gray-200"><p className="text-sm font-semibold text-green-600">KLIEN AKTIF</p><h3 className="text-4xl font-bold text-gray-900 mt-2">{data.activeClients}</h3></div>
            <div className="bg-white p-6 rounded-xl border border-gray-200"><p className="text-sm font-semibold text-yellow-600">KLIEN BARU (BULAN INI)</p><h3 className="text-4xl font-bold text-gray-900 mt-2">{data.newThisMonth}</h3></div>
        </div>
    </div>
);

const ClientDashboard = ({ user, data }) => (
    <div>
        <h1 className="text-3xl font-bold text-gray-800">Client Dashboard</h1>
        <p className="text-gray-500 mt-1">Selamat datang, {user.email}!</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200"><p className="text-sm font-semibold text-blue-600">CHAT DITANGANI BOT (24 JAM)</p><h3 className="text-4xl font-bold text-gray-900 mt-2">{data.chatsHandled}</h3></div>
            <div className="bg-white p-6 rounded-xl border border-gray-200"><p className="text-sm font-semibold text-green-600">FORMULIR TERKIRIM (24 JAM)</p><h3 className="text-4xl font-bold text-gray-900 mt-2">{data.formsSubmitted}</h3></div>
            <div className="bg-white p-6 rounded-xl border border-gray-200"><p className="text-sm font-semibold text-yellow-600">PERTANYAAN TERATAS</p><h3 className="text-4xl font-bold text-gray-900 mt-2 truncate">{data.topQuestion}</h3></div>
        </div>
    </div>
);

const ClientsListPage = ({ user }) => {
    const [clients, setClients] = useState([]);
    useEffect(() => {
        const fetchClients = async () => {
            const token = await getIdToken(user);
            const data = await apiService.getClients(token);
            setClients(data);
        };
        fetchClients();
    }, [user]);
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manajemen Klien</h1>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50"><tr><th className="p-4 font-semibold text-sm text-gray-600">Nama Usaha</th><th className="p-4 font-semibold text-sm text-gray-600">Email</th><th className="p-4 font-semibold text-sm text-gray-600">Status</th></tr></thead>
                    <tbody>{clients.map(client => (<tr key={client.id} className="border-t border-gray-200"><td className="p-4 font-medium text-gray-800">{client.businessName}</td><td className="p-4 text-gray-600">{client.email}</td><td className="p-4"><span className={`px-3 py-1 text-xs font-semibold rounded-full ${client.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{client.status}</span></td></tr>))}</tbody>
                </table>
            </div>
        </div>
    );
};

const MonitoringPage = ({ user }) => {
    const [usage, setUsage] = useState(null);
    useEffect(() => {
        const fetchUsage = async () => {
            const token = await getIdToken(user);
            const data = await apiService.getClientUsage(token);
            setUsage(data);
        };
        fetchUsage();
    }, [user]);

    if (!usage) return <div>Memuat data pemakaian...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Monitoring Pemakaian Paket</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <UsageCard data={usage.interactions} color="blue" />
                <UsageCard data={usage.forms} color="green" />
            </div>
        </div>
    );
};

const UsageCard = ({ data, color }) => {
    const percentage = Math.round((data.used / data.limit) * 100);
    const bgColor = `bg-${color}-500`;
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">{data.name}</h2>
            <p className="text-3xl font-extrabold text-gray-900 my-2">{data.used} <span className="text-lg font-medium text-gray-500">/ {data.limit}</span></p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div className={`${bgColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-right">{percentage}% terpakai</p>
        </div>
    );
};

const SettingsPage = ({ user }) => {
    const [settings, setSettings] = useState(null);
    useEffect(() => {
        const fetchSettings = async () => {
            const token = await getIdToken(user);
            const data = await apiService.getClientSettings(token);
            setSettings(data);
        };
        fetchSettings();
    }, [user]);

    const handleToggle = async (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        const token = await getIdToken(user);
        await apiService.updateClientSettings(token, newSettings);
    };

    if (!settings) return <div>Memuat pengaturan...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Pengaturan</h1>
            <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Status AI Chatbot</h2>
                        <p className="text-sm text-gray-500">Aktifkan atau non-aktifkan balasan otomatis dari chatbot Anda.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.isChatbotActive} onChange={(e) => handleToggle('isChatbotActive', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default App;
