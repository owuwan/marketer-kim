import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

const PrivacyPolicy = ({ onBack }) => {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex items-center gap-3 px-6 pt-8 pb-4 sticky top-0 z-10 bg-white border-b border-gray-100">
        <button onClick={onBack} className="rounded-full bg-gray-50 p-2 hover:bg-gray-100 transition-colors">
          <ArrowRight className="rotate-180 text-gray-600" size={20} />
        </button>
        <h2 className="text-lg font-bold text-gray-900">개인정보처리방침</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 text-xs text-gray-600 leading-relaxed space-y-6 scrollbar-hide">
        <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
          <ShieldCheck className="text-blue-600 flex-shrink-0" size={20} />
          <p className="text-blue-700 font-medium">
            나무컴퍼니는 이용자의 개인정보를 소중히 다루며, "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수합니다.
          </p>
        </div>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">1. 수집하는 개인정보 항목</h3>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>필수항목:</strong> 이메일 주소, 비밀번호, 닉네임, 휴대전화 번호</li>
            <li><strong>선택항목:</strong> 운영중인 SNS 채널 URL(네이버 플레이스, 인스타그램 등), 업종, 지역 정보</li>
            <li><strong>결제기록:</strong> 카드사명, 승인번호 (결제 대행사를 통해 관리되며 회사는 카드번호 전체를 저장하지 않습니다)</li>
            <li><strong>자동수집:</strong> 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 불량 이용 기록</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">2. 개인정보의 수집 및 이용목적</h3>
          <p className="mb-1">회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>서비스 제공:</strong> AI 콘텐츠 생성, 맞춤형 키워드 분석, 경쟁사 데이터 트래킹</li>
            <li><strong>회원 관리:</strong> 본인확인, 개인식별, 부정 이용 방지, 민원 처리, 고지사항 전달</li>
            <li><strong>AI 모델 학습:</strong> 서비스 품질 향상을 위한 익명화된 데이터 분석 및 머신러닝 학습</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">3. 개인정보의 보유 및 이용기간</h3>
          <p className="mb-2">원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 일정 기간 보관합니다.</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
            <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
            <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">4. 개인정보의 제3자 제공</h3>
          <p>회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 결제 처리를 위해 아래와 같이 제공합니다.</p>
          <div className="mt-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p><strong>제공받는 자:</strong> (주)토스페이먼츠</p>
            <p><strong>제공 목적:</strong> 유료 서비스 결제 및 정산</p>
            <p><strong>제공 항목:</strong> 결제 정보(카드사, 금액 등)</p>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">5. 개인정보 보호책임자</h3>
          <p>이름: 최홍철</p>
          <p>직위: CISO (정보보호최고책임자)</p>
          <p>이메일: Chol5622729@naver.com</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;