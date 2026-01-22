import React from 'react';
import { ArrowRight, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const RefundPolicy = ({ onBack }) => {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex items-center gap-3 px-6 pt-8 pb-4 sticky top-0 z-10 bg-white border-b border-gray-100">
        <button onClick={onBack} className="rounded-full bg-gray-50 p-2 hover:bg-gray-100 transition-colors">
          <ArrowRight className="rotate-180 text-gray-600" size={20} />
        </button>
        <h2 className="text-lg font-bold text-gray-900">환불 규정</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 text-sm text-gray-700 leading-relaxed space-y-8 scrollbar-hide">
        
        {/* 핵심 강조 박스: 가장 위에 배치 */}
        <div className="rounded-2xl bg-red-50 p-5 border border-red-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-red-600 font-bold">
            <AlertTriangle size={20} />
            <h3 className="text-base">환불 제한 안내 (필독)</h3>
          </div>
          <p className="text-red-700 font-bold text-sm leading-6 break-keep">
            본 서비스는 디지털 콘텐츠(AI 생성물)의 특성상, <span className="bg-red-200 px-1 rounded text-red-800">1회라도 서비스 이용(콘텐츠 생성) 이력이 있는 경우</span> 원칙적으로 환불이 불가능합니다.
          </p>
          <p className="mt-3 text-[11px] text-red-500 leading-tight">
            * 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 2항에 의거, 디지털 콘텐츠의 제공이 개시된 경우 청약철회가 제한됩니다.
          </p>
        </div>

        <section>
          <h3 className="font-bold text-gray-900 mb-3 text-base flex items-center gap-2">
            <CheckCircle2 size={18} className="text-blue-500"/> 100% 환불이 가능한 경우
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600">
            <li>포인트 구매 이후 환불은 결제가 되었던 수단으로 진행됩니다.</li>
            <li>구매한 포인트는 회원간 양도가 불가합니다.</li>
            <li>구매한 포인트를 사용 및 취소/환불할 수 있는 기한은 <strong>1년</strong>입니다.</li>
            <li>결제 후 <strong>7일 이내</strong>이며, 콘텐츠 생성 이력이 <strong>0건</strong>인 경우</li>
            <li>회사의 귀책사유(시스템 치명적 오류, 24시간 이상 서버 다운 등)로 인해 정상적인 서비스 이용이 불가능했던 경우</li>
            <li>중복 결제가 발생한 경우 (증빙 자료 제출 시)</li>
            <li>마케터김과장의 환불 정책은 서비스이용약관에 따라 결제 후 <strong>7일</strong> 이내 사용 이력이 없을 시에만 가능합니다.</li>
            <li>환불 문의는 마이페이지 → 결제 정보 → 결제 내역의 우측 <strong>환불 문의</strong>를 통해 접수할 수 있습니다. 접수된 문의에 대한 답변은 MY문의에서 확인하실 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-3 text-base flex items-center gap-2">
            <XCircle size={18} className="text-red-500"/> 환불이 불가능한 경우
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600">
            <li>단 1회라도 AI 기능을 사용하여 결과물(글, 이미지, 기획안)을 생성한 경우</li>
            <li>단순 변심으로 인한 환불 요청 (생성 이력이 있는 경우)</li>
            <li>AI가 생성한 결과물의 내용이 주관적인 마음에 들지 않는다는 사유</li>
            <li>서비스 업데이트로 인한 기능 변경에 대한 불만</li>
            <li>회원의 부주의로 계정이 정지되거나 해지된 경우</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">제 3 조 (중도 해지 및 정기 결제 취소)</h3>
          <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-600 space-y-2">
            <p>1. 월간/연간 구독 이용 중 중도 해지(구독 취소)를 신청하실 수 있습니다.</p>
            <p>2. 중도 해지 시, <strong>다음 결제일부터 자동 결제가 중단</strong>되며, 남은 기간 동안은 PRO 기능을 계속 이용하실 수 있습니다.</p>
            <p>3. 이미 결제된 기간에 대한 일할 계산 환불은 지원하지 않습니다.</p>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">제 4 조 (환불 신청 방법)</h3>
          <p className="text-xs text-gray-600">
            마이페이지 &gt; 고객센터 &gt; [1:1 문의]를 통해 환불 사유와 함께 접수해 주시면, 담당자가 이용 기록을 확인 후 3영업일 이내에 처리해 드립니다.
          </p>
        </section>

      </div>
    </div>
  );
};

export default RefundPolicy;