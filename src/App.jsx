import React, { useState, useEffect, useRef } from 'react';
import MobileLayout from './components/MobileLayout';
import { motion, AnimatePresence } from 'framer-motion';
// ★ [중요] 아이콘 리스트 100% 유지
import { 
  Sparkles, Briefcase, Video, ChevronRight, 
  BarChart3, Zap, Database, Search, Bell, Menu, 
  Loader2, MapPin, Hash, Target, Camera, Image as ImageIcon,
  X, Copy, Share2, FileText, Instagram, CheckCircle2, ArrowRight,
  Heart, MessageCircle, Send, MoreHorizontal, Bookmark,
  Siren, TrendingUp, AlertTriangle, RefreshCcw, User,
  Film, Type, PlayCircle, Clock, Youtube,
  LogOut, CreditCard, HelpCircle, ShieldAlert, Store, TrendingDown,
  Lock, Check, Crown, Link, Info, ExternalLink, Activity,
  GraduationCap, Eye, Brain, Palette, Mail, ChevronDown,
  MousePointerClick, Layers, FileWarning, Bot
} from 'lucide-react';

// =================================================================================
// [1] 육각형 차트 컴포넌트
// =================================================================================
const HexagonRadar = ({ data, isManager }) => {
  const size = 180;
  const center = size / 2;
  const radius = 70;
  const angles = [-90, -30, 30, 90, 150, 210].map(a => a * (Math.PI / 180));
  
  const safeData = (data && data.length === 6) ? data : [0.5, 0.5, 0.5, 0.5, 0.5, 0.5];

  const dataPoints = angles.map((a, i) => {
    const r = radius * safeData[i];
    return `${center + r * Math.cos(a)},${center + r * Math.sin(a)}`;
  }).join(' ');

  const labels = isManager 
    ? ["노출", "소통", "콘텐츠", "가격", "호감", "트렌드"]
    : ["소통력", "후킹력", "알고리즘", "시의성", "전문성", "바이럴"];

  return (
    <div className="relative flex justify-center py-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {[0.3, 0.6, 1].map((scale, i) => (
          <polygon key={i} points={angles.map(a => `${center + radius * scale * Math.cos(a)},${center + radius * scale * Math.sin(a)}`).join(' ')} 
            fill="none" stroke="#E5E7EB" strokeWidth="1" />
        ))}
        {angles.map((a, i) => (
          <line key={i} x1={center} y1={center} x2={center + radius * Math.cos(a)} y2={center + radius * Math.sin(a)} stroke="#E5E7EB" strokeWidth="1" />
        ))}
        <polygon points={dataPoints} fill={isManager ? "rgba(79, 70, 229, 0.2)" : "rgba(236, 72, 153, 0.2)"} stroke={isManager ? "#4F46E5" : "#EC4899"} strokeWidth="2" />
        {angles.map((a, i) => {
          const r = radius * safeData[i];
          return <circle key={i} cx={center + r * Math.cos(a)} cy={center + r * Math.sin(a)} r="3" fill={isManager ? "#4F46E5" : "#EC4899"} />
        })}
      </svg>
      {labels.map((label, i) => (
         <div key={i} className="absolute text-[10px] font-bold text-gray-500" style={{
            top: `${50 + 50 * Math.sin(angles[i])}%`,
            left: `${50 + 50 * Math.cos(angles[i])}%`,
            transform: 'translate(-50%, -50%)'
         }}>{label}</div>
      ))}
    </div>
  );
};

// =================================================================================
// [2] Footer 컴포넌트 (토스 심사 필수, 좌측 정렬)
// =================================================================================
const Footer = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';
  return (
    <div className={`py-8 px-6 text-[10px] leading-relaxed border-t text-left ${isDark ? 'bg-gray-900 text-gray-500 border-gray-800' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
      <div className="font-bold mb-2 text-xs">나무컴퍼니 | 대표: 최하나</div>
      <div className="space-y-1">
        <p>사업자등록번호: 476-24-00343 | 통신판매업: 2016-인천서구-0890</p>
        <p>주소: 경기도 김포시 양촌읍 누산봉성로53번길 74</p>
        <p>고객센터: 02-1234-5678 | cs@kim-manager.com</p>
      </div>
      <div className="mt-4 flex gap-3 font-bold opacity-80 cursor-pointer">
        <span>이용약관</span>
        <span>개인정보처리방침</span>
        <span>환불규정</span>
      </div>
      <p className="mt-4 opacity-50">Copyright © 2024 NAMU COMPANY All rights reserved.</p>
    </div>
  );
};

// =================================================================================
// [3] 메인 앱 컴포넌트 (App)
// =================================================================================
function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [userType, setUserType] = useState('manager'); 
  const [isPro, setIsPro] = useState(false);

  // [데이터 상태]
  const [dataCount, setDataCount] = useState(1240);
  const [savedPosts, setSavedPosts] = useState([]);

  const [formData, setFormData] = useState({
    industry: '', location: '', feature: '', 
    topic: '', platform: '', target: '', nickname: '',
    rivalChannel: '', keywords: '', targetAudience: '',
    naverLink: '', instaId: '', channelLink: ''
  });
  
  const [chatMessages, setChatMessages] = useState([]);
  const [chatStep, setChatStep] = useState(0); 
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [snsInput, setSnsInput] = useState({ naver: '', insta: '', channel: '' }); 
  const [showLinkGuide, setShowLinkGuide] = useState(false);

  // Upload UI 상태
  const [contentTopic, setContentTopic] = useState('');
  const [refLink, setRefLink] = useState(''); 
  const [selectedMood, setSelectedMood] = useState('자극적인'); 
  
  // Modals & Tabs
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [resultTab, setResultTab] = useState('first'); 
  const [isApplied, setIsApplied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uploadContext, setUploadContext] = useState(null);

  // 고객센터 상태
  const [inquiryType, setInquiryType] = useState('기타');
  const [inquiryText, setInquiryText] = useState('');
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);

  const isManager = userType === 'manager';
  const themeColor = isManager ? 'text-indigo-600' : 'text-pink-600';
  const bgTheme = isManager ? 'bg-indigo-600' : 'bg-pink-600';
  const borderTheme = isManager ? 'focus:border-indigo-500' : 'focus:border-pink-500';
  const partnerName = isManager ? '김과장' : '박PD';
  const PartnerIcon = isManager ? Briefcase : Video;
  const userName = formData.nickname 
    ? `${formData.nickname} ${isManager ? '사장님' : '님'}`
    : (isManager ? '김사장님' : '박PD님');

  const tabs = isManager 
    ? [ { id: 'blog', label: '블로그', icon: FileText }, { id: 'insta', label: '인스타', icon: Instagram } ]
    : [ { id: 'conti', label: '숏폼 콘티', icon: Film }, { id: 'title', label: '썸네일·제목', icon: Type } ];

  // --- Handlers ---
  const handleApplyAdvice = () => {
    if (isPro) setIsApplied(true);
    else setShowPaywallModal(true);
  };

  const handleSubscribe = () => {
    setIsPro(true);
    alert("🎉 Pro 멤버십에 가입되었습니다! 이제 모든 기능을 제한 없이 이용하세요.");
    setCurrentScreen('result');
  };

  const handleCounterAttack = (targetName, reason) => {
    setUploadContext({
      mode: 'counter',
      msg: `${targetName}의 ${reason} 이슈를 공략하는 전략 포스팅 모드 가동 중`
    });
    setCurrentScreen('upload');
  };

  const handleNormalUpload = () => {
    setUploadContext(null);
    setCurrentScreen('upload');
  };

  // [저장 로직]
  const handleSaveResult = () => {
    setDataCount(prev => prev + 1);
    const newPost = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      title: contentTopic || (isManager ? '맛집 추천 포스팅' : '숏폼 기획안'),
      type: isManager ? '블로그' : '유튜브'
    };
    setSavedPosts(prev => [newPost, ...prev]);
    alert("저장 완료! 💾\n김과장이 이 데이터를 학습하였습니다.\n(브랜드 DNA에 반영되었습니다.)");
  };

  // 문의 전송 로직
  const handleSendInquiry = () => {
    if (!inquiryText.trim()) return;
    setIsSendingInquiry(true);
    setTimeout(() => {
      setIsSendingInquiry(false);
      setInquiryText(''); 
      alert("✅ 접수가 완료되었습니다!\n담당자가 확인 후 빠르게 답변드리겠습니다.");
    }, 1500);
  };

  const handleSelectPartner = (type) => {
    setUserType(type);
    setTimeout(() => setCurrentScreen('input'), 300);
  };

  const handleResetChat = () => {
    setChatMessages([]);
    setChatStep(0);
    setFormData({ industry: '', location: '', feature: '', topic: '', platform: '', target: '', nickname: '', naverLink: '', instaId: '', rivalChannel: '', keywords: '', targetAudience: '', channelLink: '' });
    addSystemMessage(0);
  };

  // --- Effects ---
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => setCurrentScreen('onboarding'), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  useEffect(() => {
    if (currentScreen === 'input' && chatMessages.length === 0) {
      addSystemMessage(0);
    }
  }, [currentScreen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping, showLinkGuide]);

  useEffect(() => {
    if (currentScreen === 'analyzing') {
      const timer = setTimeout(() => setCurrentScreen('home'), 3000);
      return () => clearTimeout(timer);
    }
    if (currentScreen === 'generating') {
      setIsApplied(false); 
      setResultTab(isManager ? 'blog' : 'conti');
      const timer = setTimeout(() => setCurrentScreen('result'), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  useEffect(() => {
    if (currentScreen === 'upload') setShowGuideModal(true);
  }, [currentScreen]);

  // --- Chat Logic (인터뷰 로직 복구) ---
  const addSystemMessage = (step, immediateValue = null) => {
    setIsTyping(true);
    const val = immediateValue; 
    let messagesToAdd = [];
    let delay = 1000;

    if (isManager) {
      if (step === 0) messagesToAdd = [{ type: 'text', text: "안녕하세요 사장님! 👋\n어떤 사업을 하시나요?\n(예: 고깃집, 꽃집, 헬스장)" }];
      else if (step === 1) messagesToAdd = [{ type: 'text', text: `아, ${val || formData.industry}이군요! 🌸\n매장 위치는 어디인가요?\n(예: 서울 강남구 테헤란로)` }];
      else if (step === 2) {
        setIsTyping(false); 
        setChatMessages(prev => [...prev, { id: Date.now(), text: "🔍 데이터를 분석하고 있습니다...", isUser: false, type: 'loading' }]);
        setTimeout(() => {
          setChatMessages(prev => prev.filter(msg => msg.type !== 'loading'));
          const analysisMsg = { type: 'analysis', data: { title: `${val} 상권 분석`, count: '12,500', level: 'High' } };
          const nextQuestion = { type: 'text', text: "경쟁이 치열하네요! 🔥\n전략을 잘 짜야겠습니다.\n\n우리 가게만의 특별한\n자랑거리가 있나요?\n(예: 24시 무인운영)" };
          setChatMessages(prev => [...prev, { id: Date.now(), ...analysisMsg, isUser: false }, { id: Date.now() + 1, ...nextQuestion, isUser: false }]);
        }, 1500); return; 
      } else if (step === 3) messagesToAdd = [{ type: 'text', text: "접수했습니다! 📝\n\n운영 중인 채널 주소를 알려주세요.\n분석에 큰 도움이 됩니다.\n(없으면 건너뛰기 가능)" }];
      else if (step === 4) messagesToAdd = [{ type: 'text', text: "좋아요! 이제 거의 다 왔습니다. 😎\n\n마지막으로 앱에서 사용하실\n멋진 닉네임을 정해주세요!" }];
      else if (step === 5) messagesToAdd = [{ type: 'text', text: `반갑습니다, ${val} 사장님! 🎉\n[${formData.location}]에 위치한\n[${formData.feature} ${formData.industry}]\n(으)로 세팅할까요?` }];
    } else {
      if (step === 0) messagesToAdd = [{ type: 'text', text: "반갑습니다 PD님! 🎬\n롤모델이나 라이벌 채널의 이름(또는 링크)을 알려주세요! 그들의 성공 공식을 분석해 드릴게요." }];
      else if (step === 1) messagesToAdd = [{ type: 'text', text: "분석 완료! 😎\n내 채널을 설명하는 핵심 키워드 3가지는 무엇인가요? (예: 가성비, 병맛, 정보전달)" }];
      else if (step === 2) {
        setIsTyping(false); 
        setChatMessages(prev => [...prev, { id: Date.now(), text: "📡 라이벌 채널 알고리즘 분석 중...", isUser: false, type: 'loading' }]);
        setTimeout(() => {
          setChatMessages(prev => prev.filter(msg => msg.type !== 'loading'));
          const analysisMsg = { type: 'analysis', data: { title: "떡상 키워드 조합 중...", count: '890,200', level: 'Viral' } };
          const nextQuestion = { type: 'text', text: "성공 공식이 보입니다! 🚀\n내 영상을 주로 누가 봤으면 하나요? (예: 20대 취준생, 재테크족)" };
          setChatMessages(prev => [...prev, { id: Date.now(), ...analysisMsg, isUser: false }, { id: Date.now() + 1, ...nextQuestion, isUser: false }]);
        }, 1500); return; 
      } else if (step === 3) messagesToAdd = [{ type: 'text', text: "접수했습니다! 📝\n\n운영 중인 채널이 있다면 링크를 알려주세요.\n분석에 큰 도움이 됩니다." }];
      else if (step === 4) messagesToAdd = [{ type: 'text', text: "확실한 타겟이네요! 😎\n\n마지막으로 앱에서 사용하실\n활동명을 알려주세요!" }];
      else if (step === 5) messagesToAdd = [{ type: 'text', text: `반갑습니다, ${val}님! 🎉\n[${formData.targetAudience} 타겟 ${formData.keywords}]\n채널로 세팅할까요?` }];
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, ...messagesToAdd.map((m, i) => ({ id: Date.now() + i, isUser: false, ...m }))]);
      setIsTyping(false);
    }, delay);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    processInput(inputText);
  };

  const handleSnsSubmit = () => {
    const userMsg = { id: Date.now(), text: "채널 정보 입력 완료 👌", isUser: true, type: 'text' };
    setChatMessages(prev => [...prev, userMsg]);
    if (isManager) setFormData(prev => ({ ...prev, naverLink: snsInput.naver, instaId: snsInput.insta }));
    else setFormData(prev => ({ ...prev, channelLink: snsInput.channel, instaId: snsInput.insta }));
    const nextStep = 4;
    setChatStep(nextStep);
    addSystemMessage(nextStep);
  };

  const processInput = (value) => {
    const userMsg = { id: Date.now(), text: value, isUser: true, type: 'text' };
    setChatMessages(prev => [...prev, userMsg]);
    setInputText(''); 
    
    const nextStep = chatStep + 1;
    setChatStep(nextStep); 

    if (isManager) {
      if (chatStep === 0) setFormData(prev => ({ ...prev, industry: value }));
      else if (chatStep === 1) setFormData(prev => ({ ...prev, location: value }));
      else if (chatStep === 2) setFormData(prev => ({ ...prev, feature: value }));
      else if (chatStep === 4) setFormData(prev => ({ ...prev, nickname: value })); 
    } else {
      if (chatStep === 0) setFormData(prev => ({ ...prev, rivalChannel: value }));
      else if (chatStep === 1) setFormData(prev => ({ ...prev, keywords: value }));
      else if (chatStep === 2) setFormData(prev => ({ ...prev, targetAudience: value }));
      else if (chatStep === 4) setFormData(prev => ({ ...prev, nickname: value }));
    }
    
    if (nextStep <= 5) addSystemMessage(nextStep, value);
  };

  return (
    <MobileLayout>
      <AnimatePresence>
        {showPaywallModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 px-8">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-sm overflow-hidden rounded-[24px] bg-white text-center shadow-2xl">
              <div className="flex h-32 w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700"><Lock className="h-10 w-10 text-white mb-2" /><h3 className="text-lg font-bold text-white">Pro 멤버십 전용 기능</h3></div>
              <div className="p-6"><p className="mb-2 text-gray-800 font-bold">"상위 1% 마케팅 비법을<br/>적용하시겠습니까?"</p><p className="mb-6 text-xs text-gray-500">지금 구독하고 {partnerName}의<br/>모든 노하우를 제한 없이 이용하세요.</p><div className="flex gap-2"><button onClick={() => setShowPaywallModal(false)} className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-600">닫기</button><button onClick={() => { setShowPaywallModal(false); setCurrentScreen('subscription'); }} className={`flex-1 rounded-xl py-3 text-sm font-bold text-white ${bgTheme}`}>구독하러 가기</button></div></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isSidebarOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm" />
          <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute left-0 top-0 bottom-0 z-50 w-[80%] bg-white shadow-2xl">
            <div className={`flex h-36 flex-col justify-end p-6 ${bgTheme}`}>
              <div className="flex items-center gap-3 mb-2"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl">{isManager ? '👨‍💼' : '🎬'}</div><div className="text-white"><h3 className="text-lg font-bold">{userName}</h3><span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium">{isPro ? <Crown size={10} className="text-yellow-300 fill-yellow-300"/> : null} {isPro ? 'Pro 멤버십' : '무료 체험 중'}</span></div></div>
            </div>
            <div className="p-4 space-y-1">
              <button onClick={() => { setIsSidebarOpen(false); setCurrentScreen('myAccount'); }} className="flex w-full items-center gap-3 rounded-xl p-3 text-gray-700 hover:bg-gray-50"><User size={20} className="text-gray-400" /> <span className="font-medium">내 계정 정보</span></button>
              <button onClick={() => { setIsSidebarOpen(false); setCurrentScreen('subscription'); }} className="flex w-full items-center gap-3 rounded-xl p-3 text-gray-700 hover:bg-gray-50"><CreditCard size={20} className="text-gray-400" /> <div className="flex flex-1 justify-between"><span className="font-medium">결제 관리</span><span className={`text-xs font-bold ${isPro ? themeColor : 'text-gray-400'}`}>{isPro ? 'Pro 이용중' : '업그레이드'}</span></div></button>
              <button onClick={() => { setIsSidebarOpen(false); setCurrentScreen('customerCenter'); }} className="flex w-full items-center gap-3 rounded-xl p-3 text-gray-700 hover:bg-gray-50"><HelpCircle size={20} className="text-gray-400" /> <span className="font-medium">고객센터</span></button>
              <div className="my-2 h-px bg-gray-100" />
              <button onClick={() => { setIsSidebarOpen(false); setCurrentScreen('splash'); }} className="flex w-full items-center gap-3 rounded-xl p-3 text-red-500 hover:bg-red-50"><LogOut size={20} /> <span className="font-medium">로그아웃</span></button>
              <div className="mt-8 border-t border-dashed border-gray-200 pt-4"><p className="px-3 text-[10px] font-bold text-gray-400 mb-2">DEVELOPER OPTIONS</p><button onClick={() => setIsPro(!isPro)} className="flex w-full items-center justify-between gap-3 rounded-xl bg-gray-50 p-3 text-gray-600 hover:bg-gray-100"><span className="text-xs font-bold">[Dev] Pro 모드</span><div className={`relative h-5 w-9 rounded-full transition-colors ${isPro ? 'bg-green-500' : 'bg-gray-300'}`}><div className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${isPro ? 'translate-x-4' : ''}`} /></div></button></div>
            </div>
          </motion.div>
        </>
      )}

      <AnimatePresence mode="wait">
        
        {/* Screen 1: Splash */}
        {currentScreen === 'splash' && (
          <motion.div key="splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full w-full flex-col items-center justify-center bg-gray-900 px-6 text-center">
            <motion.div initial={{ scale: 0.8, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.8, type: "spring" }} className="mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] bg-indigo-500 shadow-2xl shadow-indigo-500/30"><Sparkles className="h-12 w-12 text-white" /></motion.div>
            <h1 className="mb-3 text-2xl font-bold text-white">마케터 김과장</h1>
            <p className="text-gray-400 font-medium">사장님의 퇴근을<br />앞당겨드립니다</p>
          </motion.div>
        )}

        {/* Screen 2: Onboarding (푸터 삭제) */}
        {currentScreen === 'onboarding' && (
          <motion.div key="onboarding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="flex h-full w-full flex-col px-6 pt-12 pb-8">
            <div className="mb-8"><span className="mb-3 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-600">AI 파트너 매칭</span><h2 className="text-2xl font-bold text-gray-900 leading-snug">어떤 파트너가<br />필요하신가요?</h2></div>
            <div className="flex flex-1 flex-col gap-4">
              <button onClick={() => handleSelectPartner('manager')} className="group relative flex w-full items-start gap-5 rounded-[24px] bg-white p-6 text-left shadow-xl shadow-gray-100 border-2 border-transparent hover:border-indigo-500 hover:shadow-indigo-100 active:scale-95 transition-all"><div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Briefcase size={26} strokeWidth={2} /></div><div><h3 className="text-lg font-bold text-gray-900">김과장 <span className="text-sm font-normal text-gray-500 ml-1">매장 사장님</span></h3><p className="text-xs text-gray-400 mt-1.5 leading-relaxed">플레이스 · 블로그 · SEO 전문<br/>"매출이 오르는 글을 씁니다"</p></div></button>
              <button onClick={() => handleSelectPartner('creator')} className="group relative flex w-full items-start gap-5 rounded-[24px] bg-white p-6 text-left shadow-xl shadow-gray-100 border-2 border-transparent hover:border-pink-500 hover:shadow-pink-100 active:scale-95 transition-all"><div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors"><Video size={26} strokeWidth={2} /></div><div><h3 className="text-lg font-bold text-gray-900">박PD <span className="text-sm font-normal text-gray-500 ml-1">크리에이터</span></h3><p className="text-xs text-gray-400 mt-1.5 leading-relaxed">유튜브 · 숏폼 · 알고리즘 전문<br/>"떡상하는 대본을 씁니다"</p></div></button>
            </div>
          </motion.div>
        )}

        {/* Screen 2.5: Input */}
        {currentScreen === 'input' && (
          <motion.div key="input" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex h-full w-full flex-col bg-gray-50">
            <div className="flex items-center gap-3 bg-white px-6 pt-8 pb-4 border-b border-gray-100 sticky top-0 z-10"><button onClick={() => setCurrentScreen('onboarding')} className="text-gray-400 hover:text-gray-600"><X size={24} /></button><div className="flex flex-col"><span className="text-sm font-bold text-gray-900">{partnerName}</span><span className="text-xs text-green-500 font-medium">● 온라인</span></div></div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
               {chatMessages.map((msg) => (
                 <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex w-full ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                   {!msg.isUser && <div className={`mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${isManager ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600'}`}><PartnerIcon size={16}/></div>}
                   {msg.type === 'analysis' ? (
                     <div className="w-[75%] rounded-[20px] bg-white border border-gray-100 p-4 shadow-md rounded-tl-none"><div className="text-xs font-bold text-gray-500 mb-2">📊 {isManager ? '실시간 상권 분석' : '알고리즘 패턴 분석'}</div><div className="mb-3"><h4 className="text-sm font-bold text-gray-900">{msg.data.title}</h4><div className="flex items-end gap-1 mt-1"><span className="text-2xl font-bold text-indigo-600">{msg.data.count}</span><span className="text-xs text-gray-400 mb-1">건 조회</span></div></div><div className="flex items-center gap-2 rounded-lg bg-red-50 p-2"><div className="rounded bg-red-100 p-1 text-red-500"><Siren size={14}/></div><div className="text-xs font-bold text-red-600">{msg.data.level === 'High' ? '경쟁 강도: 매우 높음 🔥' : '바이럴 잠재력: 최상 🚀'}</div></div></div>
                   ) : msg.type === 'loading' ? (
                     <div className="rounded-[20px] rounded-tl-none bg-white px-4 py-3 border border-gray-100 shadow-sm text-sm text-gray-500 flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> {msg.text}</div>
                   ) : (
                     <div className={`max-w-[75%] whitespace-pre-line rounded-[20px] px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.isUser ? `${bgTheme} text-white rounded-tr-none` : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>{msg.text}</div>
                   )}
                 </motion.div>
               ))}
               {isTyping && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start"><div className={`mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${isManager ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600'}`}><PartnerIcon size={16}/></div><div className="flex items-center gap-1 rounded-[20px] rounded-tl-none bg-white px-4 py-4 border border-gray-100"><motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="h-1.5 w-1.5 rounded-full bg-gray-400" /><motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-gray-400" /><motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-gray-400" /></div></motion.div>)}
               <div ref={messagesEndRef} />
            </div>
            
            <div className="bg-white px-4 pb-6 pt-2 border-t border-gray-100">
               {chatStep === 3 ? (
                 <div className="space-y-3">
                   <div className="flex gap-2">
                     {isManager ? (
                       <div className="relative flex-1"><div className="absolute left-3 top-3 text-green-500 font-bold text-xs">N</div><input value={snsInput.naver} onChange={(e)=>setSnsInput({...snsInput, naver:e.target.value})} placeholder="네이버 플레이스 링크" className="w-full rounded-xl bg-gray-50 py-3 pl-8 pr-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-green-100 transition-all"/></div>
                     ) : (
                       // 1. 크리에이터 인터뷰 수정: 활동중인 채널 링크
                       <div className="relative flex-1"><div className="absolute left-3 top-3 text-pink-500 font-bold text-xs">CH</div><input value={snsInput.channel} onChange={(e)=>setSnsInput({...snsInput, channel:e.target.value})} placeholder="활동중인 채널 링크" className="w-full rounded-xl bg-gray-50 py-3 pl-8 pr-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all"/></div>
                     )}
                     <div className="relative flex-1"><div className="absolute left-3 top-3 text-pink-500 font-bold text-xs">IG</div><input value={snsInput.insta} onChange={(e)=>setSnsInput({...snsInput, insta:e.target.value})} placeholder="인스타 아이디" className="w-full rounded-xl bg-gray-50 py-3 pl-8 pr-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all"/></div>
                   </div>
                   <div className="flex justify-between items-center"><button onClick={() => setShowLinkGuide(!showLinkGuide)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"><HelpCircle size={12}/> 주소 복사하는 법</button><button onClick={handleSnsSubmit} className={`rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md active:scale-95 transition-transform ${bgTheme}`}>입력 완료</button></div>
                   <AnimatePresence>{showLinkGuide && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-20 left-4 right-4 rounded-xl bg-gray-900 p-4 text-white shadow-xl z-20"><div className="flex justify-between mb-2"><span className="text-xs font-bold text-yellow-400">💡 김과장의 꿀팁</span><X size={14} className="cursor-pointer" onClick={() => setShowLinkGuide(false)}/></div><p className="text-xs leading-relaxed opacity-90">앱을 끄지 않고 홈으로 나가셔도 됩니다!<br/>1. 채널/가게 검색 &gt; 공유 &gt; 복사<br/>2. 인스타그램: 프로필 &gt; 프로필 공유 &gt; 링크 복사</p></motion.div>)}</AnimatePresence>
                 </div>
               ) : chatStep < 5 ? (
                 <div className="relative flex items-center">
                   <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="메시지를 입력하세요..." disabled={isTyping} className={`w-full rounded-full bg-gray-50 py-3.5 pl-5 pr-12 text-sm text-gray-900 outline-none transition-all ${borderTheme} border border-transparent focus:bg-white focus:shadow-md`}/>
                   <button onClick={handleSendMessage} disabled={!inputText.trim() || isTyping} className={`absolute right-1.5 rounded-full p-2 transition-colors ${inputText.trim() ? `${themeColor} hover:bg-gray-100` : 'text-gray-300'}`}><Send size={20} /></button>
                 </div>
               ) : (
                 <div className="flex gap-3">
                   <button onClick={handleResetChat} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-100 py-3.5 text-sm font-bold text-gray-600 active:scale-95 transition-transform"><RefreshCcw size={18} /> 수정할래요</button>
                   <button onClick={() => setCurrentScreen('analyzing')} className={`flex flex-[2] items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-lg active:scale-95 transition-transform ${bgTheme}`}>네, 좋아요! <CheckCircle2 size={18} /></button>
                 </div>
               )}
            </div>
          </motion.div>
        )}

        {/* Analyzing */}
        {currentScreen === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full w-full flex-col items-center justify-center bg-white px-6 text-center">
            <div className={`relative mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50`}>
               <Loader2 className={`h-10 w-10 animate-spin ${themeColor}`} />
               <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className={`absolute inset-0 rounded-full ${bgTheme} opacity-10`}/>
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">{isManager ? `${formData.location || '지역'} 상권 분석 중...` : `${formData.platform || '플랫폼'} 트렌드 분석 중...`}</h2>
            <p className="text-sm text-gray-500">데이터를 수집하고 있어요.</p>
          </motion.div>
        )}

        {/* Subscription Screen (Updated: Scrollable with Footer & Back Button) */}
        {currentScreen === 'subscription' && (
          <motion.div key="subscription" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="flex h-full w-full flex-col bg-gray-900 overflow-y-auto relative">
            <div className="absolute top-0 left-0 w-full p-6 z-50 pointer-events-none">
                <button onClick={() => setCurrentScreen('home')} className="pointer-events-auto rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><X size={20}/></button>
            </div>
            
            <div className="flex flex-col items-center pt-20 px-6 text-center min-h-full">
              <div className="mb-6 rounded-full bg-indigo-500/20 p-4 border border-indigo-500/30"><Crown size={48} className="text-indigo-400" fill="currentColor" fillOpacity={0.3} /></div>
              <h2 className="text-3xl font-black text-white leading-tight mb-2">PRO MEMBERSHIP</h2>
              <p className="text-gray-400 text-sm mb-10">마케팅 전문가 김과장을 채용하세요</p>

              <div className="w-full space-y-4 text-left mb-10">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-indigo-400"><Bot size={20}/></div><div><p className="font-bold text-white text-sm">Seo/Geo 완벽 대응 알고리즘</p><p className="text-xs text-gray-500">GPT-4o 기반 지능형 엔진 탑재</p></div></div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-indigo-400"><Database size={20}/></div><div><p className="font-bold text-white text-sm">Fine-tuning 지능형 데이터</p><p className="text-xs text-gray-500">데이터가 축적될수록 똑똑해지는 맞춤형 모델</p></div></div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-indigo-400"><Zap size={20}/></div><div><p className="font-bold text-white text-sm">RAG 실시간 트렌드 반영</p><p className="text-xs text-gray-500">경쟁사 변동 및 이슈 즉시 적용</p></div></div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-indigo-400"><TrendingUp size={20}/></div><div><p className="font-bold text-white text-sm">C-Rank & DIA 로직 최적화</p><p className="text-xs text-gray-500">체류시간 증대를 위한 훅(Hook) 설계</p></div></div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-indigo-400"><MapPin size={20}/></div><div><p className="font-bold text-white text-sm">Local SEO & CTA 전략</p><p className="text-xs text-gray-500">플레이스 리뷰 유도 및 행동 지침 설계</p></div></div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-indigo-400"><MousePointerClick size={20}/></div><div><p className="font-bold text-white text-sm">CVR(전환율) 최적화</p><p className="text-xs text-gray-500">희소성/긴박감(FOMO) 조성 멘트 자동 생성</p></div></div>
              </div>

              <div className="w-full bg-white rounded-t-[32px] p-8 pb-10">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-sm line-through">정가 120,000원</span>
                    <div className="flex items-end gap-1.5"><span className="text-3xl font-black text-gray-900">50,000원</span><span className="text-sm font-bold text-gray-500 mb-1.5">/월</span></div>
                  </div>
                  <div className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-600">58% OFF</div>
                </div>
                <button onClick={handleSubscribe} className={`w-full rounded-2xl py-4 text-lg font-bold text-white shadow-xl active:scale-95 transition-transform bg-gradient-to-r from-indigo-600 to-purple-600`}>지금 바로 시작하기</button>
              </div>
              
              {/* [Footer] 다크 테마 */}
              <div className="w-full">
                <Footer theme="dark" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Customer Center (Updated: Restored Lists & Added Footer) */}
        {currentScreen === 'customerCenter' && (
          <motion.div key="customerCenter" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="flex h-full w-full flex-col bg-white">
            <div className="flex items-center gap-3 px-6 pt-8 pb-4 sticky top-0 z-10 bg-white border-b border-gray-100"><button onClick={() => setCurrentScreen('home')} className="rounded-full bg-gray-50 p-2 hover:bg-gray-100"><ArrowRight className="rotate-180" size={20} /></button><h2 className="text-lg font-bold text-gray-900">고객센터</h2></div>
            <div className="flex-1 p-6 overflow-y-auto">
              {/* 문의 작성 폼 */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-3">1:1 문의 작성</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {['결제', '오류', '제안', '기타'].map(type => (
                      <button key={type} onClick={() => setInquiryType(type)} className={`flex-1 rounded-xl py-2 text-xs font-bold transition-colors ${inquiryType === type ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>{type}</button>
                    ))}
                  </div>
                  <textarea value={inquiryText} onChange={(e) => setInquiryText(e.target.value)} placeholder="무엇을 도와드릴까요? 내용을 입력해주세요." className="w-full h-32 rounded-xl bg-gray-50 p-4 text-sm resize-none outline-none focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400" />
                  <button onClick={handleSendInquiry} disabled={isSendingInquiry || !inquiryText} className={`w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${isSendingInquiry ? 'bg-gray-400' : 'bg-gray-900'}`}>{isSendingInquiry ? <><Loader2 size={16} className="animate-spin"/> 전송 중...</> : <><Send size={16}/> 문의 접수하기</>}</button>
                </div>
              </div>
              
              <div className="h-px bg-gray-100 my-6" />

              {/* [복구] 문의 내역 */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-bold text-gray-900">최근 문의 내역</h3><span className="text-xs text-gray-400">전체보기</span></div>
                <div className="space-y-2">
                  <div className="rounded-xl border border-gray-100 p-4"><div className="flex items-center justify-between mb-1"><span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">결제</span><span className="text-[10px] text-gray-400">24.05.20</span></div><p className="text-xs font-bold text-gray-800 mb-2">결제 영수증은 어디서 보나요?</p><div className="flex items-center gap-1 text-[10px] font-bold text-blue-600"><CheckCircle2 size={12}/> 처리완료</div></div>
                  <div className="rounded-xl border border-gray-100 p-4"><div className="flex items-center justify-between mb-1"><span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">오류</span><span className="text-[10px] text-gray-400">오늘</span></div><p className="text-xs font-bold text-gray-800 mb-2">인스타 연동이 잘 안돼요 ㅠ</p><div className="flex items-center gap-1 text-[10px] font-bold text-gray-500"><Loader2 size={12} className="animate-spin"/> 접수 확인 중</div></div>
                </div>
              </div>

              {/* [복구] FAQ */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">자주 묻는 질문</h3>
                <div className="space-y-3">
                  <div className="rounded-xl border border-gray-100 p-4"><div className="flex items-center justify-between mb-2"><span className="text-sm font-bold text-gray-800">AI가 쓴 글, 저품질 안 걸리나요?</span><ChevronDown size={16} className="text-gray-400"/></div><p className="text-xs text-gray-500 leading-relaxed">네이버 품질지수는 폐지되었습니다. 김과장은 최신 로직에 맞춰 '체류시간'을 늘리는 고품질 글만 작성합니다.</p></div>
                  <div className="rounded-xl border border-gray-100 p-4"><div className="flex items-center justify-between mb-2"><span className="text-sm font-bold text-gray-800">AI가 만든 콘티, 중복영상 아닌가요?</span><ChevronDown size={16} className="text-gray-400"/></div><p className="text-xs text-gray-500 leading-relaxed">마케터김과장 이용자의 정보와 현재 트렌드, 최신 로직에 맞춰 실시간으로 생성되므로 80% 이상 중복되지 않습니다.</p></div>
                  <div className="rounded-xl border border-gray-100 p-4"><div className="flex items-center justify-between mb-2"><span className="text-sm font-bold text-gray-800">경쟁사 데이터는 정확한가요?</span><ChevronDown size={16} className="text-gray-400"/></div><p className="text-xs text-gray-500 leading-relaxed">네이버/인스타그램 공개 데이터를 1시간 단위로 트래킹하여 99.8%의 정확도를 자랑합니다.</p></div>
                  <div className="rounded-xl border border-gray-100 p-4"><div className="flex items-center justify-between mb-2"><span className="text-sm font-bold text-gray-800">크레딧 충전은 어떻게 하나요?</span><ChevronDown size={16} className="text-gray-400"/></div><p className="text-xs text-gray-500 leading-relaxed">매월 1일 60회가 자동 충전되며, 추가 충전은 마이페이지에서 가능합니다.</p></div>
                </div>
              </div>
            </div>
            {/* [추가] 고객센터 하단 푸터 */}
            <Footer theme="light" />
          </motion.div>
        )}

        {/* Brand DNA Screen (Updated Warning + Restored Competitor Spy List) */}
        {currentScreen === 'brandDNA' && (
          <motion.div key="brandDNA" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="flex h-full w-full flex-col bg-white">
            <div className="flex items-center gap-3 px-6 pt-8 pb-4 sticky top-0 z-10 bg-white border-b border-gray-100"><button onClick={() => setCurrentScreen('home')} className="rounded-full bg-white p-2 hover:bg-gray-100 shadow-sm"><ArrowRight className="rotate-180" size={20} /></button><h2 className="text-lg font-bold text-gray-900">브랜드 DNA 관리</h2></div>
            
            {/* 안내 배너 */}
            <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex items-start gap-3">
              <div className="mt-0.5"><Database size={16} className="text-blue-600"/></div>
              <p className="text-xs text-blue-700 leading-relaxed"><strong>💡 생성된 콘텐츠를 [저장]해야<br/>우리 가게의 DNA 데이터로 분석됩니다.</strong></p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* 1. Radar Chart Section */}
              <div className="mb-6 rounded-[32px] bg-white p-6 shadow-xl shadow-gray-100 border border-gray-100">
                <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><div className={`rounded-full p-1.5 ${isManager ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600'}`}><BarChart3 size={16} /></div><span className="text-sm font-bold text-gray-600">마케팅 건강검진</span></div><span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-600">78점 (양호)</span></div>
                <HexagonRadar data={[0.9, 0.4, 0.8, 0.7, 0.85, 0.6]} isManager={isManager} />
                <div className="mt-4 rounded-xl bg-gray-50 p-4 text-center">
                  <p className="text-sm font-bold text-gray-800 mb-1">{isManager ? '"소통력이 부족해요 😭"' : '"후킹력이 부족해요 😭"'}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{isManager ? "하지만 걱정 마세요! 김과장이 다 해결해 드릴게요. 😎" : "3초 안에 시청자들이 다 도망갑니다. 김과장이 짜주는 3초 후킹 대사를 사용해 보세요!"}</p>
                  <button onClick={() => setCurrentScreen('subscription')} className={`w-full rounded-lg py-3 text-sm font-bold text-white ${bgTheme}`}>🚀 꽉 찬 육각형 만들기 (Pro)</button>
                </div>
              </div>

              {/* 2. [복구] 감시 중인 경쟁사 (버튼 포함) */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Target size={20} className={themeColor}/> 감시 중인 경쟁사</h3>
                <div className="space-y-3">
                  {['옆집 돈까스', '청담 김밥', '메가 커피', '빽다방', '공차'].map((name, i) => (<div key={i} className="flex items-center justify-between rounded-xl bg-gray-50 p-4"><div className="flex items-center gap-3"><Store size={18} className="text-gray-400"/><span className="font-bold text-gray-700">{name}</span></div><span className="rounded-md bg-green-100 px-2 py-1 text-[10px] font-bold text-green-600">감시 중</span></div>))}
                  {/* [복구] 경쟁사 추가 버튼 */}
                  <button onClick={() => setCurrentScreen('subscription')} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-4 text-sm font-bold text-gray-400 hover:border-gray-400 hover:text-gray-600">+ 경쟁사 추가하기</button>
                </div>
              </div>

              {/* 3. 나의 키워드 영토 */}
              <div className="mb-8"><h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><MapPin size={20} className={themeColor}/> 나의 키워드 영토</h3><div className="flex flex-wrap gap-2">{['#부평맛집', '#데이트', '#가성비', '#존맛탱', '#분위기좋은'].map((tag, i) => (<span key={i} className={`rounded-full px-3 py-1.5 text-xs font-bold ${i < 2 ? `${bgTheme} text-white` : 'bg-gray-100 text-gray-600'}`}>{tag}</span>))}</div></div>
              
              {/* 4. NEW: Data Asset Value Report (White Style) */}
              <div className="mb-8 rounded-[32px] bg-white p-8 shadow-xl shadow-blue-50 border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5"><Database size={120} className="text-blue-600"/></div>
                <div className="relative z-10 mb-8">
                  <h3 className="text-xs font-bold text-blue-500 mb-2 uppercase tracking-wider">Data Asset Value</h3>
                  <p className="text-xl font-bold text-gray-900 leading-snug mb-4">
                    <span className="text-blue-600">{userName.split(' ')[0] || '회원'}</span> {isManager ? '사장님' : 'PD님'}의<br/>
                    마케팅 데이터 자산
                  </p>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-4xl font-black text-gray-900">{dataCount.toLocaleString()}</span>
                    <span className="text-sm font-bold text-gray-400 mb-2">건 확보</span>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
                    <span className="text-xs font-bold text-blue-600">환산 가치: ₩ {(dataCount * 500).toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gray-50 text-gray-500"><Search size={16}/></div>
                    <div><p className="text-xs text-gray-400 font-bold">상권/키워드 분석</p><p className="text-sm font-bold text-gray-800">우리 동네 유입 키워드 120개 확보</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gray-50 text-gray-500"><Target size={16}/></div>
                    <div><p className="text-xs text-gray-400 font-bold">경쟁사 염탐 기록</p><p className="text-sm font-bold text-gray-800">변동 데이터 450건 축적</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gray-50 text-gray-500"><FileText size={16}/></div>
                    <div><p className="text-xs text-gray-400 font-bold">생성된 포스팅</p><p className="text-sm font-bold text-gray-800">최적화 원고 60건 보관 중</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gray-50 text-gray-500"><BarChart3 size={16}/></div>
                    <div><p className="text-xs text-gray-400 font-bold">성과 분석</p><p className="text-sm font-bold text-gray-800">노출/유입 증가율 <span className="text-purple-600">매일 갱신 중</span></p></div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    ※ 서비스 해지 시, 확보된 맞춤형 전략 데이터가 <span className="text-red-400 font-bold underline">즉시 소멸</span>됩니다. (복구 불가)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* My Account (With Footer) */}
        {currentScreen === 'myAccount' && (
          <motion.div key="myAccount" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="flex h-full w-full flex-col bg-white">
            <div className="flex items-center gap-3 px-6 pt-8 pb-4 sticky top-0 z-10 bg-white border-b border-gray-100"><button onClick={() => setCurrentScreen('home')} className="rounded-full bg-gray-50 p-2 hover:bg-gray-100"><ArrowRight className="rotate-180" size={20} /></button><h2 className="text-lg font-bold text-gray-900">내 계정 정보</h2></div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex flex-col items-center mb-8">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-4xl mb-4">{isManager ? '👨‍💼' : '🎬'}</div>
                <h3 className="text-xl font-bold text-gray-900">{userName}</h3>
                <span className="text-sm text-gray-500">test@example.com</span>
                <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${isPro ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>{isPro ? <Crown size={12}/> : null} {isPro ? 'Pro 멤버십 사용 중' : '무료 체험 중'}</span>
              </div>
              <div className="mb-6 p-5 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="flex justify-between mb-2"><span className="text-sm font-bold text-gray-600">남은 크레딧</span><span className="text-sm font-bold text-indigo-600">57 / 60</span></div>
                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '95%' }} /></div>
                <p className="mt-2 text-[10px] text-gray-400 text-right">매월 1일 초기화됩니다.</p>
              </div>
              
              {/* 내 계정에 저장된 콘텐츠 리스트 추가 */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-1">📂 나의 저장 콘텐츠</h3>
                <p className="text-xs text-gray-400 mb-4">데이터가 쌓일수록 김과장이 더 똑똑해집니다.</p>
                {savedPosts.length === 0 ? (
                  <div className="py-8 text-center bg-gray-50 rounded-xl"><p className="text-xs text-gray-400">아직 저장된 콘텐츠가 없어요 😢<br/>콘텐츠를 생성하고 [저장]을 눌러보세요!</p></div>
                ) : (
                  <div className="space-y-3">
                    {savedPosts.map((post) => (
                      <div key={post.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex justify-between items-center">
                        <div>
                           <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold mb-1 ${post.type === '블로그' ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600'}`}>{post.type}</span>
                           <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{post.title}</h4>
                           <p className="text-[10px] text-gray-400 mt-1">{post.date}</p>
                        </div>
                        <button className="text-gray-300 hover:text-gray-500"><ChevronRight size={16}/></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* [Footer] 내 정보 하단 (라이트 테마) */}
            <Footer theme="light" />
          </motion.div>
        )}

        {/* Home Screen */}
        {currentScreen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full flex-col bg-gray-50">
            {/* 상단 돋보기 삭제됨 */}
            <div className="flex items-center justify-between px-6 pt-8 pb-4 bg-white sticky top-0 z-10 shadow-sm shadow-gray-100/50"><div className={`font-bold text-lg ${themeColor}`}>Marketer Kim</div><div className="flex gap-4 text-gray-400"><Bell size={22} className="cursor-pointer hover:text-gray-600" onClick={() => setCurrentScreen('notification')} /><Menu size={22} className="cursor-pointer hover:text-gray-600" onClick={() => setIsSidebarOpen(true)} /></div></div>
            <div className="flex-1 overflow-y-auto px-6 pb-24">
              <div className="mt-6 mb-8"><h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{isManager ? <>사장님, 우리 가게 앞에도<br/>줄을 세워볼까요? 🏃‍♂️🏃‍♀️</> : <>PD님, 알고리즘의<br/>간택을 받으러 가시죠! 🎬✨</>}</h2><button onClick={handleNormalUpload} className={`group relative flex h-32 w-full flex-col justify-between overflow-hidden rounded-[32px] p-7 text-white shadow-xl transition-transform active:scale-95 ${isManager ? 'bg-gradient-to-br from-indigo-600 to-blue-500 shadow-indigo-200' : 'bg-gradient-to-br from-pink-500 to-rose-400 shadow-pink-200'}`}><div className="relative z-10"><span className="block text-sm font-medium opacity-80 mb-1">AI 자동 생성</span><span className="text-2xl font-bold">콘텐츠 만들기 <ArrowRight className="inline ml-1" size={20}/></span></div><div className="absolute right-0 bottom-0 opacity-20"><Sparkles size={120} /></div></button></div>
              <button onClick={() => setCurrentScreen('brandDNA')} className="mb-8 flex h-20 w-full items-center justify-between rounded-[24px] bg-white px-6 shadow-lg shadow-gray-100 border border-gray-100 active:scale-95 transition-transform"><div className="flex items-center gap-4"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isManager ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600'}`}><Activity size={24} /></div><div className="text-left"><span className="block text-sm font-bold text-gray-400">내 가게 분석</span><span className="text-lg font-bold text-gray-900">브랜드 DNA 관리</span></div></div><ChevronRight size={24} className="text-gray-300" /></button>
              <div>
                <div className="mb-4 flex items-center gap-2"><div className="rounded-full bg-red-100 p-1.5 text-red-600"><Siren size={18} className="animate-pulse" /></div><span className="text-base font-bold text-gray-900">실시간 경쟁사 포착</span><span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">LIVE</span></div>
                <div className="space-y-3">
                  <div onClick={() => handleCounterAttack('옆집 A가게', '가격 인상')} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-red-50 active:scale-95 transition-transform cursor-pointer hover:bg-red-50/50">
                     <div className="flex gap-3 items-center"><div className="flex-shrink-0 text-red-500"><TrendingUp size={20}/></div><div className="text-sm font-bold text-gray-800">{isManager ? '옆집 A가게 가격 인상 감지' : '라이벌 채널 급상승 포착'}</div></div>
                     <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded">반격하기</span>
                  </div>
                  <div onClick={() => handleCounterAttack('B가게', '부정 리뷰')} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer hover:bg-red-50/50">
                     <div className="flex gap-3 items-center"><div className="flex-shrink-0 text-gray-400"><AlertTriangle size={20}/></div><div className="text-sm font-bold text-gray-800">B가게 '불친절' 리뷰 등록됨</div></div>
                     <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">확인</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Upload Screen */}
        {currentScreen === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex h-full flex-col bg-white">
            <div className="flex items-center gap-3 px-6 pt-8 pb-4"><button onClick={() => setCurrentScreen('home')} className="rounded-full bg-gray-100 p-2 text-gray-600"><X size={20} /></button><h2 className="text-lg font-bold text-gray-900">새 콘텐츠 만들기</h2></div>
            {uploadContext?.mode === 'counter' && (
              <div className="mx-6 mb-2 flex items-center gap-3 rounded-xl bg-red-50 p-4 border border-red-100">
                <div className="flex-shrink-0 rounded-full bg-red-100 p-2 text-red-600"><Target size={20}/></div>
                <div><h3 className="text-sm font-bold text-red-600">⚔️ 전략 모드 가동 중</h3><p className="text-xs text-red-500">{uploadContext.msg}</p></div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-6 pt-2 pb-8">
              {isManager ? (
                <div className="mb-8"><label className="mb-3 block text-sm font-bold text-gray-700">사진을 올려주세요 (선택)</label><div className="grid grid-cols-2 gap-3"><button className="flex aspect-square w-full flex-col items-center justify-center rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors"><Camera size={28} className="mb-2" /><span className="text-xs font-medium">촬영하기</span></button><button className="flex aspect-square w-full flex-col items-center justify-center rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors"><ImageIcon size={28} className="mb-2" /><span className="text-xs font-medium">앨범 선택</span></button></div></div>
              ) : (
                <div className="space-y-6 mb-8">
                  <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100 shadow-sm">
                    <h4 className="text-xs font-bold text-pink-600 mb-2 flex items-center gap-1"><Activity size={14}/> 🔥 지금 유튜브 급상승 키워드</h4>
                    <div className="flex flex-wrap gap-2">{['#아이폰16', '#탕후루챌린지', '#슬릭백', '#브이로그', '#내돈내산'].map(k => <span key={k} className="px-2 py-1 bg-white rounded-lg text-[10px] font-bold text-gray-600 border border-pink-100">{k}</span>)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-bold block mb-2">참고하고 싶은 영상 링크</label>
                    <div className="relative"><Link className="absolute left-4 top-4 text-pink-400" size={18}/><input type="text" value={refLink} onChange={e => setRefLink(e.target.value)} placeholder="유튜브/틱톡 링크를 넣어주세요" className="w-full rounded-2xl bg-gray-50 p-4 pl-12 outline-none border border-transparent transition-all focus:border-pink-500 focus:bg-white text-sm"/></div>
                  </div>
                  <div>
                    <label className="text-sm font-bold block mb-2">도파민 설정 (무드)</label>
                    <div className="grid grid-cols-2 gap-2">{['자극적인', '감동적인', '정보전달', '병맛'].map(m => <button key={m} onClick={() => setSelectedMood(m)} className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${selectedMood === m ? 'bg-pink-600 text-white border-pink-600 shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}>{m}</button>)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-bold block mb-2">제목 리스트 미리보기</label>
                    <div className="bg-white border-2 border-gray-100 rounded-3xl p-4 flex gap-3 items-center shadow-sm">
                       <div className="w-24 aspect-video bg-gray-200 rounded-xl flex items-center justify-center text-gray-400"><Youtube size={20} /></div>
                       <div className="flex-1 space-y-2"><div className={`h-4 w-full rounded-md ${contentTopic ? 'bg-pink-50' : 'bg-gray-100'} flex items-center px-2`}><span className="text-[9px] font-bold text-pink-600 truncate">{contentTopic || '제목이 표시됩니다'}</span></div><div className="h-3 w-2/3 bg-gray-100 rounded-md"></div></div>
                    </div>
                  </div>
                </div>
              )}
              <div className="mb-8"><label className="mb-3 block text-sm font-bold text-gray-700">어떤 주제로 쓸까요?</label><input type="text" placeholder={uploadContext ? "전략에 맞는 문구를 자동 생성합니다..." : "예: 비오는 날 감성, 신메뉴 출시"} value={contentTopic} onChange={(e) => setContentTopic(e.target.value)} className={`w-full rounded-2xl bg-gray-50 p-4 text-gray-900 outline-none border border-transparent transition-all ${borderTheme} focus:bg-white focus:shadow-lg`}/></div><button onClick={() => setCurrentScreen('generating')} disabled={!contentTopic} className={`w-full rounded-[20px] py-4 text-lg font-bold text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${uploadContext ? 'bg-red-500 shadow-red-200' : `${bgTheme} shadow-${isManager ? 'indigo' : 'pink'}-200`}`}>{uploadContext ? '반격 콘텐츠 생성하기' : '콘텐츠 생성하기'}</button></div><AnimatePresence>{showGuideModal && isManager && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 px-8"><motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-sm overflow-hidden rounded-[24px] bg-white text-center shadow-2xl"><div className={`flex h-32 w-full flex-col items-center justify-center ${bgTheme}`}><Camera className="h-10 w-10 text-white mb-2" /><h3 className="text-xl font-bold text-white">촬영 꿀팁 📸</h3></div><div className="p-6"><p className="mb-6 text-gray-600 leading-relaxed">"사진은 <strong>1:1 비율</strong>이 좋아요!<br/>음식은 <strong>45도 각도</strong>에서,<br/>제품은 <strong>자연광</strong>에서 찍어주세요."</p><button onClick={() => setShowGuideModal(false)} className={`w-full rounded-xl py-3 font-bold text-white ${bgTheme}`}>네, 알겠어요!</button></div></motion.div></motion.div>)}</AnimatePresence>
          </motion.div>
        )}

        {currentScreen === 'generating' && (<motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full w-full flex-col items-center justify-center bg-white px-6 text-center"><div className={`relative mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50`}><Sparkles className={`h-10 w-10 animate-pulse ${themeColor}`} /><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className={`absolute inset-0 rounded-full border-t-2 ${isManager ? 'border-indigo-500' : 'border-pink-500'}`}/></div><h2 className="mb-2 text-xl font-bold text-gray-900">AI가 글을 쓰고 있어요</h2><p className="text-sm text-gray-500">"{contentTopic}" 주제로<br/>가장 반응이 좋은 톤앤매너를 찾는 중...</p></motion.div>)}
        {currentScreen === 'result' && (<motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full flex-col bg-gray-50"><div className="flex items-center justify-between px-6 pt-8 pb-4 bg-white sticky top-0 z-10"><button onClick={() => setCurrentScreen('home')} className="rounded-full bg-gray-50 p-2 hover:bg-gray-100"><X size={20} className="text-gray-600" /></button><div className="font-bold text-lg text-gray-900">생성 결과</div><button onClick={handleSaveResult} className={`font-bold ${themeColor}`}>저장</button></div><div className="flex-1 overflow-y-auto px-6 pb-24"><motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className={`mt-4 mb-6 rounded-2xl p-5 border shadow-sm transition-all ${isApplied ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-100'}`}>{!isApplied ? (<div className="flex gap-3"><div className="flex-shrink-0 rounded-full bg-blue-100 p-2 text-blue-600 h-fit"><Sparkles size={18} /></div><div className="flex-1"><h4 className="font-bold text-blue-800 text-sm mb-1">{partnerName}의 Tip</h4><p className="text-xs text-blue-600 leading-relaxed mb-3">{isManager ? <>사장님! <strong>'{contentTopic}'</strong> 대신 <strong>'{contentTopic} 추천'</strong>으로 새로 쓰면 클릭률이 15% 더 <strong>올라갈 수 있어요!</strong></> : <>PD님! 도입부 3초에 <strong>'이거 모르면 손해'</strong>를 새로 쓰면 시청 지속 시간이 2배 <strong>늘어날 수 있어요!</strong></>}</p><button onClick={handleApplyAdvice} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-200 active:scale-95 transition-transform">{isPro ? '네, 수정해주세요' : '네, 수정해주세요 (Pro)'} <ArrowRight size={12} /></button></div></div>) : (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between"><div className="flex items-center gap-2.5"><div className="rounded-full bg-green-100 p-1.5 text-green-600"><CheckCircle2 size={16} /></div><span className="text-sm font-bold text-green-700">성공적으로 반영했어요!</span></div><button onClick={() => setIsApplied(false)} className="text-xs text-gray-400 underline">되돌리기</button></motion.div>)}</motion.div><div className="mb-6 flex rounded-xl bg-gray-200 p-1">{tabs.map((tab) => (<button key={tab.id} onClick={() => setResultTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${resultTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><tab.icon size={16}/> {tab.label}</button>))}</div><div className="relative rounded-[24px] bg-white p-6 shadow-xl shadow-gray-100 overflow-hidden">{isApplied && <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0 bg-green-400 mix-blend-overlay pointer-events-none z-10"/>}{isManager ? (<>{resultTab === 'blog' && (<div className="space-y-4"><div className="border-b border-gray-100 pb-3"><span className="text-xs font-bold text-green-500 mb-1 block">NAVER BLOG</span><h3 className="text-lg font-bold text-gray-900 leading-snug">{isApplied ? `🚨 ${formData.location} ${contentTopic} 종결자! 사장님이 미쳤어요 😲` : `${formData.location} ${contentTopic} 솔직 후기! (feat. 사장님 추천)`}</h3></div><div className="space-y-3 text-sm text-gray-600 leading-relaxed">{isApplied ? <><p><strong>"아직도 여기 안 가보셨어요?"</strong></p><p>솔직히 말씀드릴게요. {formData.location}에서...</p></> : <><p>안녕하세요! 여러분 😊</p><p>오늘은 비도 오고 해서...</p></>}</div></div>)}{resultTab === 'insta' && (<div className="space-y-4"><div className="flex items-center justify-between border-b border-gray-100 pb-3"><div className="flex items-center gap-2"><div className="h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]"><div className="h-full w-full rounded-full bg-white p-[2px]"><div className="h-full w-full rounded-full bg-gray-200" /></div></div><span className="font-bold text-sm text-gray-900">{formData.nickname || 'manager'}</span></div><MoreHorizontal size={20} className="text-gray-400" /></div><div className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl transition-all duration-500 ${isApplied ? 'bg-gradient-to-br from-purple-600 to-pink-500' : 'bg-gray-100'}`}>{!isApplied && <ImageIcon size={48} className="text-gray-300" />}<div className="absolute inset-0 flex items-center justify-center p-6 text-center"><h3 className={`text-2xl font-black drop-shadow-lg leading-tight break-keep ${isApplied ? 'text-white' : 'text-gray-800'}`}>{isApplied ? <>🚨 사장님이 미쳤어요!<br/><span className="text-yellow-300">{contentTopic}</span> 반값 할인</> : <>{formData.location}<br/>{contentTopic} 맛집 추천</>}</h3></div></div><div className="flex justify-between text-gray-800"><div className="flex gap-4"><Heart /><MessageCircle /><Send /></div><Bookmark /></div><div className="text-sm text-gray-800 leading-relaxed"><p className="mb-1"><span className="font-bold mr-2">{formData.nickname || 'manager'}</span>{isApplied ? "이거 모르면 진짜 손해...😱" : "비 오는 날엔 역시 이거지! ☔️✨"}</p></div><div className="text-blue-600 text-sm">#{formData.location} #{contentTopic} {isApplied && "#사장님이미쳤어요 #이벤트"}</div></div>)}</>) : (<>{resultTab === 'conti' && (<div className="space-y-6"><div className="border-l-4 border-pink-500 pl-4"><span className="text-xs font-bold text-pink-500 block mb-1">Scene 1: 3초 후킹</span><p className="text-sm font-bold text-gray-900">{isApplied ? "\"이거 모르면 100만원 손해봅니다!\"" : "\"오늘 대박 소식 알려드립니다!\""}</p><p className="text-xs text-gray-400 mt-1">🎬 화면: 클로즈업 + 자막 크게</p></div><div className="border-l-4 border-gray-200 pl-4"><span className="text-xs font-bold text-gray-400 block mb-1">Scene 2: 문제 제기</span><p className="text-sm font-bold text-gray-900">{contentTopic}의 충격적인 진실 공개</p></div><div className="border-l-4 border-gray-200 pl-4"><span className="text-xs font-bold text-gray-400 block mb-1">Scene 3: 해결책</span><p className="text-sm font-bold text-gray-900">댓글 링크에서 확인하세요!</p></div></div>)}{resultTab === 'title' && (<div className="space-y-4"><div className="space-y-2"><label className="text-xs font-bold text-gray-400">추천 제목 3종</label>{[1,2,3].map(i => <div key={i} className="bg-gray-50 p-3 rounded-xl text-sm font-bold text-gray-800 border border-gray-100 flex justify-between"><span>{i}. {isApplied ? `클릭하면 무조건 이득! ${contentTopic}` : `${contentTopic} 솔직 리뷰`}</span><Copy size={14} className="text-gray-300"/></div>)}</div></div>)}</>)}</div><div className="mt-6 flex gap-3"><button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gray-100 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-200"><Copy size={18} /> 복사하기</button><button className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white ${bgTheme}`}><Share2 size={18} /> 공유하기</button></div><p className="mt-4 text-center text-xs text-gray-400">💡 저장을 누르셔야 AI가 사장님 스타일을 학습해<br/>다음번에 더 완벽한 글을 씁니다!</p></div></motion.div>)}
        {currentScreen === 'notification' && (<motion.div key="notification" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="flex h-full w-full flex-col bg-gray-50"><div className="flex items-center gap-3 bg-white px-6 pt-8 pb-4 sticky top-0 z-10 border-b border-gray-100"><button onClick={() => setCurrentScreen('home')} className="rounded-full bg-gray-50 p-2 hover:bg-gray-100"><ArrowRight className="rotate-180" size={20} /></button><h2 className="text-lg font-bold text-gray-900">알림 센터</h2></div><div className="flex-1 overflow-y-auto px-6 py-6 space-y-4"><div className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm border border-red-50"><div className="flex-shrink-0 mt-1 text-red-500"><AlertTriangle size={20} /></div><div><h4 className="font-bold text-gray-900 text-sm mb-1">부정 리뷰 감지 🚨</h4><p className="text-xs text-gray-600 leading-relaxed">{isManager ? "옆집 A가게에 '불친절' 키워드가 포함된 리뷰가 등록되었습니다." : "경쟁 채널 B에 '광고 너무 많음' 댓글이 급증하고 있습니다."}</p><span className="text-[10px] text-gray-400 mt-2 block">1시간 전</span></div></div><div className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm border border-blue-50"><div className="flex-shrink-0 mt-1 text-blue-500"><TrendingDown size={20} /></div><div><h4 className="font-bold text-gray-900 text-sm mb-1">가격/트렌드 변동 📉</h4><p className="text-xs text-gray-600 leading-relaxed">{isManager ? "B가게가 김치찌개 가격을 1,000원 인하했습니다." : "먹방 카테고리 시청 지속 시간이 소폭 하락했습니다."}</p><span className="text-[10px] text-gray-400 mt-2 block">3시간 전</span></div></div><div className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm border border-purple-50"><div className="flex-shrink-0 mt-1 text-purple-500"><Zap size={20} /></div><div><h4 className="font-bold text-gray-900 text-sm mb-1">실시간 트렌드 🔥</h4><p className="text-xs text-gray-600 leading-relaxed">지금 유튜브에서 '탕후루' 챌린지가 다시 뜨고 있습니다! 탑승하시겠습니까?</p><span className="text-[10px] text-gray-400 mt-2 block">5시간 전</span></div></div></div></motion.div>)}
      </AnimatePresence>
    </MobileLayout>
  );
}

export default App;