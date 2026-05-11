'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, User, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

const inputCls = "w-full border-b bg-transparent py-3 pr-8 text-sm placeholder-gray-400 focus:outline-none transition-colors border-gray-300 dark:border-gray-700 focus:border-blue-500 text-gray-900 dark:text-white dark:placeholder-gray-600";
const btnCls   = "w-full rounded-full py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center";
const btnStyle = { background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', boxShadow: '0 4px 20px rgba(59,130,246,0.5)' };

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, googleLogin, updateUser } = useAuth();

  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState(initialMode);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm,   setRegForm]   = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [gLoading,  setGLoading]  = useState(false);

  const [otp,       setOtp]       = useState(['','','','','','']);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const switchMode = (to) => { if (mode !== to) setMode(to); };

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const user = await login(loginForm.email, loginForm.password);
      if (user.role === 'admin') { router.push('/admin-login'); return; }
      toast.success(`Welcome back, ${user.name}!`);
      router.push('/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid credentials'); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regForm.password !== regForm.confirm) return toast.error('Passwords do not match');
    if (regForm.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { name: regForm.name, email: regForm.email, password: regForm.password });
      toast.success('OTP sent!');
      setMode('otp'); setCountdown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send OTP'); }
    finally { setLoading(false); }
  };

  const handleOtpChange = (i, v) => {
    if (!/^\d*$/.test(v)) return;
    const n = [...otp]; n[i] = v.slice(-1); setOtp(n);
    if (v && i < 5) inputRefs.current[i+1]?.focus();
  };
  const handleOtpKey   = (i, e) => { if (e.key==='Backspace' && !otp[i] && i>0) inputRefs.current[i-1]?.focus(); };
  const handleOtpPaste = (e) => {
    const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);
    if (p.length===6) { setOtp(p.split('')); inputRefs.current[5]?.focus(); }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) return toast.error('Enter the 6-digit code');
    setVerifying(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email: regForm.email, otp: code });
      sessionStorage.setItem('user_token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      updateUser(data.user);
      toast.success(`Welcome, ${data.user.name}!`);
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
      setOtp(['','','','','','']); inputRefs.current[0]?.focus();
    } finally { setVerifying(false); }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/send-otp', { name: regForm.name, email: regForm.email, password: regForm.password });
      toast.success('New OTP sent!'); setCountdown(60);
      setOtp(['','','','','','']); inputRefs.current[0]?.focus();
    } catch { toast.error('Failed to resend'); }
    finally { setResending(false); }
  };

  const handleGoogle = async (credentialResponse) => {
    setGLoading(true);
    try {
      const user = await googleLogin(credentialResponse.credential);
      if (user.role === 'admin') { router.push('/admin-login'); return; }
      toast.success(`Welcome, ${user.name}!`); router.push('/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Google sign-in failed'); }
    finally { setGLoading(false); }
  };

  const handleGoogleError = () => {
    toast.error('Google sign-in failed. Please try again.');
    setGLoading(false);
  };

  const isLogin = mode === 'login';
  const isOtp   = mode === 'otp';

  // ── Google button (using @react-oauth/google GoogleLogin component) ────────
  const GoogleLink = (
    <div className="flex justify-center">
      {gLoading ? (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="h-3 w-3 animate-spin" /> Connecting…
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogle}
          onError={handleGoogleError}
          useOneTap={false}
          theme="outline"
          size="medium"
          text="continue_with"
          shape="pill"
        />
      )}
    </div>
  );

  // ── Forms ─────────────────────────────────────────────────────────────────
  const LoginForm = (
    <>
      <h1 className="mb-1 text-5xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>Login</h1>
      <p className="mb-10 text-sm text-gray-500 dark:text-gray-500">Sign in to your account to continue</p>
      <form onSubmit={handleLogin} className="space-y-8">
        <div className="relative">
          <input type="email" required value={loginForm.email} onChange={e=>setLoginForm({...loginForm,email:e.target.value})} placeholder="Email" className={inputCls}/>
          <Mail className="absolute right-0 top-3 h-4 w-4 text-gray-400"/>
        </div>
        <div className="relative">
          <input type={showPw?'text':'password'} required value={loginForm.password} onChange={e=>setLoginForm({...loginForm,password:e.target.value})} placeholder="Password" className={inputCls}/>
          <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-0 top-3">
            {showPw ? <EyeOff className="h-4 w-4 text-gray-400"/> : <Lock className="h-4 w-4 text-gray-400"/>}
          </button>
        </div>
        <div className="space-y-4">
          <button type="submit" disabled={loading} className={btnCls} style={btnStyle}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin"/> : 'Login'}
          </button>
          <div className="flex items-center gap-3"><div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"/><span className="text-xs text-gray-400">or</span><div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"/></div>
          {GoogleLink}
        </div>
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <button type="button" onClick={()=>switchMode('register')} className="font-semibold text-blue-500 hover:text-blue-400 transition-colors">Sign Up</button>
        </p>
      </form>
    </>
  );

  const RegisterForm = (
    <>
      <h1 className="mb-1 text-5xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>Sign Up</h1>
      <p className="mb-10 text-sm text-gray-500">Create your account to get started</p>
      <form onSubmit={handleRegister} className="space-y-7">
        <div className="relative">
          <input type="text" required value={regForm.name} onChange={e=>setRegForm({...regForm,name:e.target.value})} placeholder="Full Name" className={inputCls}/>
          <User className="absolute right-0 top-3 h-4 w-4 text-gray-400"/>
        </div>
        <div className="relative">
          <input type="email" required value={regForm.email} onChange={e=>setRegForm({...regForm,email:e.target.value})} placeholder="Email" className={inputCls}/>
          <Mail className="absolute right-0 top-3 h-4 w-4 text-gray-400"/>
        </div>
        <div className="relative">
          <input type={showPw?'text':'password'} required value={regForm.password} onChange={e=>setRegForm({...regForm,password:e.target.value})} placeholder="Password" className={inputCls}/>
          <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-0 top-3">
            {showPw ? <EyeOff className="h-4 w-4 text-gray-400"/> : <Lock className="h-4 w-4 text-gray-400"/>}
          </button>
        </div>
        <div className="relative">
          <input type="password" required value={regForm.confirm} onChange={e=>setRegForm({...regForm,confirm:e.target.value})} placeholder="Confirm Password" className={inputCls}/>
          <Lock className="absolute right-0 top-3 h-4 w-4 text-gray-400"/>
        </div>
        <div className="space-y-4">
          <button type="submit" disabled={loading} className={btnCls} style={btnStyle}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin"/> : 'Sign Up'}
          </button>
          <div className="flex items-center gap-3"><div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"/><span className="text-xs text-gray-400">or</span><div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"/></div>
          {GoogleLink}
        </div>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button type="button" onClick={()=>switchMode('login')} className="font-semibold text-blue-500 hover:text-blue-400 transition-colors">Login</button>
        </p>
      </form>
    </>
  );

  const OtpForm = (
    <>
      <button onClick={()=>setMode('register')} className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4"/> Back
      </button>
      <h1 className="mb-1 text-5xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>Verify email</h1>
      <p className="mb-2 text-sm text-gray-500">We sent a 6-digit code to</p>
      <p className="mb-10 text-sm font-semibold text-gray-900 dark:text-white">{regForm.email}</p>
      <div className="flex justify-center gap-3 mb-8" onPaste={handleOtpPaste}>
        {otp.map((digit,i) => (
          <input key={i} ref={el=>inputRefs.current[i]=el} type="text" inputMode="numeric" maxLength={1} value={digit}
            onChange={e=>handleOtpChange(i,e.target.value)} onKeyDown={e=>handleOtpKey(i,e)}
            className={`w-10 h-12 text-center text-xl font-bold bg-transparent border-b-2 text-gray-900 dark:text-white focus:outline-none transition-colors ${digit?'border-blue-500':'border-gray-300 dark:border-gray-700 focus:border-blue-500'}`}/>
        ))}
      </div>
      <button onClick={handleVerify} disabled={verifying||otp.join('').length<6} className={`${btnCls} mb-6`} style={btnStyle}>
        {verifying ? <Loader2 className="h-5 w-5 animate-spin"/> : 'Verify & Create Account'}
      </button>
      <p className="text-center text-sm text-gray-500">
        Didn&apos;t receive it?{' '}
        {countdown>0
          ? <span className="text-gray-400">Resend in {countdown}s</span>
          : <button onClick={handleResend} disabled={resending} className="font-semibold text-blue-500 hover:text-blue-400 disabled:opacity-50">{resending?'Sending…':'Resend code'}</button>
        }
      </p>
      <p className="text-center text-xs text-gray-400 mt-2">Code expires in 10 minutes</p>
    </>
  );

  const activeForm = isLogin ? LoginForm : isOtp ? OtpForm : RegisterForm;

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0f]">

      {/* ── DESKTOP ── */}
      <div className="hidden md:block w-full min-h-screen">

        {/* Sliding blue panel */}
        <div className="absolute top-0 bottom-0 z-20"
          style={{
            width: 'calc(45% + 2px)',
            left: isLogin ? '55%' : '-2px',
            transition: 'left 800ms cubic-bezier(0.86,0,0.07,1)',
          }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,#1e3a8a 0%,#1d4ed8 45%,#3b82f6 100%)' }}/>
          {/* Diagonal mask */}
          <div className="absolute z-10 bg-white dark:bg-[#0a0a0f]"
            style={{
              top: 0, bottom: 0,
              left: isLogin ? 0 : 'auto',
              right: isLogin ? 'auto' : '-2px',
              width: 'calc(16% + 2px)',
              clipPath: isLogin ? 'polygon(0 0,100% 0,0 100%)' : 'polygon(0 0,100% 0,100% 100%)',
              transition: 'clip-path 800ms cubic-bezier(0.86,0,0.07,1)',
            }}/>
          <div className="relative z-20 flex h-full flex-col items-center justify-center px-12 text-center">
            <h2 className="text-5xl font-extrabold uppercase leading-tight tracking-wide text-white mb-4 whitespace-pre-line">
              {isOtp ? 'ALMOST\nTHERE!' : isLogin ? 'WELCOME\nBACK!' : 'JOIN\nUS!'}
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
              {isOtp ? 'Enter the code we sent to your email to activate your account.'
                : isLogin ? 'Sign in to explore, write, and share your stories with the world.'
                : 'Join BlogHub and start sharing your stories with the world.'}
            </p>
          </div>
        </div>

        {/* Left slot — login */}
        <div className="absolute inset-y-0 left-0 flex items-center justify-center w-[55%]"
          style={{
            opacity: isLogin ? 1 : 0,
            pointerEvents: isLogin ? 'auto' : 'none',
            transition: isLogin ? 'opacity 350ms ease 450ms' : 'opacity 200ms ease 0ms',
          }}>
          <div className="w-full max-w-md px-10">{LoginForm}</div>
        </div>

        {/* Right slot — register / otp */}
        <div className="absolute inset-y-0 right-0 flex items-center justify-center w-[55%]"
          style={{
            opacity: !isLogin ? 1 : 0,
            pointerEvents: !isLogin ? 'auto' : 'none',
            transition: !isLogin ? 'opacity 350ms ease 450ms' : 'opacity 200ms ease 0ms',
          }}>
          <div className="w-full max-w-md px-10">{isOtp ? OtpForm : RegisterForm}</div>
        </div>

      </div>

      {/* ── MOBILE ── */}
      <div className="md:hidden flex flex-col items-center justify-center min-h-screen w-full px-8 py-16 bg-white dark:bg-[#0a0a0f]">
        <div className="w-full max-w-sm">{activeForm}</div>
      </div>

    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]"><Loader2 className="h-8 w-8 animate-spin text-blue-500"/></div>}>
      <AuthContent/>
    </Suspense>
  );
}
