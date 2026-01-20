import React from 'react';
import { ArrowRight, FileText } from 'lucide-react';

const TermsOfUse = ({ onBack }) => {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-6 pt-8 pb-4 sticky top-0 z-10 bg-white border-b border-gray-100">
        <button onClick={onBack} className="rounded-full bg-gray-50 p-2 hover:bg-gray-100 transition-colors">
          <ArrowRight className="rotate-180 text-gray-600" size={20} />
        </button>
        <h2 className="text-lg font-bold text-gray-900">이용약관</h2>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto px-6 py-6 text-xs text-gray-600 leading-relaxed space-y-6 scrollbar-hide">
        <div className="bg-gray-50 p-4 rounded-xl mb-4">
          <p className="font-bold text-gray-800 mb-1">제 1 조 (목적)</p>
          <p>이 약관은 나무컴퍼니(이하 "회사")가 제공하는 AI 마케팅 자동화 서비스 '마케터 김과장' 및 관련 제반 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
        </div>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">제 2 조 (용어의 정의)</h3>
          <ol className="list-decimal pl-4 space-y-1">
            <li>"서비스"란 단말기(PC, 모바일 등)에 상관없이 회원이 이용할 수 있는 '마케터 김과장' 서비스를 의미합니다.</li>
            <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
            <li>"구독"이란 회원이 서비스를 이용하기 위해 일정 금액을 지불하고, 정해진 기간 동안 유료 기능을 사용하는 것을 의미합니다.</li>
            <li>"AI 결과물"이란 회원이 서비스를 통해 생성한 텍스트, 이미지, 영상 기획안 등의 모든 디지털 콘텐츠를 의미합니다.</li>
          </ol>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">제 3 조 (서비스의 내용 및 변경)</h3>
          <p className="mb-2">회사는 다음과 같은 서비스를 제공합니다.</p>
          <ul className="list-disc pl-4 space-y-1 mb-2">
            <li>AI 기반 마케팅 원고(블로그, 인스타그램 등) 생성</li>
            <li>유튜브/숏폼 영상 기획안 및 스크립트 생성</li>
            <li>경쟁사 분석 및 키워드 데이터 제공</li>
          </ul>
          <p>회사는 기술적 사양의 변경이나 서비스 개선을 위해 서비스 내용을 변경할 수 있으며, 이 경우 변경 내용을 회원에게 공지합니다.</p>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">제 4 조 (저작권 및 데이터 활용)</h3>
          <ol className="list-decimal pl-4 space-y-1">
            <li>회원이 서비스를 통해 생성한 "AI 결과물"의 저작권은 <strong>회원에게 귀속</strong>됩니다. 회원은 이를 상업적으로 자유롭게 이용할 수 있습니다.</li>
            <li>단, "AI 결과물"은 회사의 AI 모델 성능 향상 및 기계학습을 위해 익명화된 형태로 활용될 수 있습니다.</li>
            <li>회원은 타인의 저작권이나 초상권을 침해하는 데이터를 입력해서는 안 되며, 이에 대한 법적 책임은 회원 본인에게 있습니다.</li>
          </ol>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">제 5 조 (유료 서비스 및 결제)</h3>
          <p>서비스의 이용 요금 및 결제 방식은 회사가 별도로 고지하는 바에 따릅니다. 결제는 PG사(토스페이먼츠 등)를 통해 이루어지며, 정기 결제 해지는 다음 결제일 전까지 언제든지 가능합니다.</p>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">제 6 조 (책임의 한계)</h3>
          <p>회사는 AI가 생성한 정보의 정확성, 신뢰성, 적법성에 대해 보증하지 않습니다. "AI 결과물"을 활용하여 발생한 마케팅 성과나 법적 분쟁에 대해 회사는 책임을 지지 않습니다.</p>
        </section>

        <p className="text-[10px] text-gray-400 pt-4 border-t border-gray-100">
          공고일자: 2024년 5월 20일<br/>
          시행일자: 2024년 5월 20일
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;