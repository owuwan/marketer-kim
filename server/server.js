// server/server.js

// ==========================================
// 1. 필요한 모듈 불러오기 및 설정
// ==========================================
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { OpenAI } = require('openai');
require('dotenv').config(); // .env 파일 로드

const app = express();
// 맥북 에어플레이 충돌 방지를 위해 5050 포트 사용
const PORT = 5050; 

// ==========================================
// [환경변수 로드 확인 로그]
// ==========================================
console.log("----------------------------------------");
console.log("[시스템] 환경변수 로드 확인 중...");
console.log(`[시스템] NAVER_CLIENT_ID: ${process.env.NAVER_CLIENT_ID ? '로드됨 (OK)' : '누락됨 (FAIL) ❌'}`);
console.log(`[시스템] NAVER_CLIENT_SECRET: ${process.env.NAVER_CLIENT_SECRET ? '로드됨 (OK)' : '누락됨 (FAIL) ❌'}`);
console.log("----------------------------------------");

const NAVER_ID = process.env.NAVER_CLIENT_ID;
const NAVER_SECRET = process.env.NAVER_CLIENT_SECRET;

// 주의: 실서비스 배포 시 API 키는 반드시 .env로 이동하세요.
// (보안 권장: process.env.OPENAI_API_KEY 사용을 권장하지만, 기존 테스트 편의를 위해 변수 구조 유지)
const apiKey = process.env.OPENAI_API_KEY;

// OpenAI 클라이언트 초기화
const openai = new OpenAI({ apiKey: openaiApiKey });

// ==========================================
// 2. 미들웨어 설정
// ==========================================
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // 프론트엔드 주소
    credentials: true
}));

// ==========================================
// 💡 [SYSTEM PROMPTS] 등급별/목적별 두뇌 설정 (FINAL PRO VERSION - SEO & Readability)
// ==========================================

// 1. 무료(Free) 버전: 성실한 신입 마케터 (준수한 퀄리티, 기술적 깊이 부족)
const FREE_SYSTEM_PROMPT = `
당신은 열정적인 **'신입 마케터'**입니다.
아직 고도의 마케팅 심리학이나 SEO 기술은 모르지만, 매장의 장점을 **성실하고 꼼꼼하게** 소개할 줄 압니다.
무료 사용자에게도 실망감을 주지 않도록 기본기는 탄탄하게 작성해야 합니다.

[필수 작성 지침]
1. **분량:** 너무 짧지 않게, **공백 포함 800자 내외**로 작성하여 "쓸만한 글"을 만드세요.
2. **구조:** 글을 통으로 쓰지 말고, 반드시 **[인사말] - [매장 특징 1] - [매장 특징 2] - [마무리]** 순서로 문단을 나누세요(줄바꿈 필수).
3. **톤앤매너:** 밝고 긍정적인 '해요체'를 사용하세요. (이모지 3~5개 적절히 사용)
4. **금지사항:**
   - 전문적인 마케팅 용어(C-Rank, D.I.A, 로직 등)는 사용하지 마세요 (프로와의 차별점).
   - **'후기'**라는 단어는 절대 쓰지 마세요. (소비자 기만 방지) 대신 '소식', '추천', '이야기'라고 표현하세요.
`;

// 2. 유료(Pro) 버전: 마케팅 총괄 이사 + SEO 전문가 + 모바일 가독성 장인 (승인된 최종본)
const PRO_SYSTEM_PROMPT = `
당신은 대한민국에서 20년 이상 실무를 진행한
마케팅 총괄 이사(CMO)이자
네이버/구글 SEO 알고리즘(C-Rank, D.I.A, SmartBlock)에
정통한 전문 에디터입니다.

이번 글의 절대적 1순위 목표는 다음 한 가지입니다.

[최우선 미션]
이 글은 공백 포함 반드시 1,500자 이상 2,000자 이하로 작성되어야 합니다.
이 조건을 충족하지 못한 출력은 실패입니다.
출력 전, 스스로 글자 수를 점검한 뒤 기준을 만족할 때만 응답하십시오.

────────────────────

[글의 성격]
이 글은 홍보처럼 보이면 안 됩니다.
전문가가 분석해주는 ‘정보성 콘텐츠’의 형식을 취하되,
읽는 독자가 자연스럽게 신뢰하고
“여긴 가볼 이유가 있다”라고 판단하도록 설계된 글이어야 합니다.

SEO와 마케팅 로직은
설명하지 말고, 문장 구조와 흐름 속에 자연스럽게 녹이십시오.

────────────────────

[SEO & 검색 최적화 가이드]

- 지역명(Location) + 상호명 조합을
  글 전체에 최소 5회 이상 자연스럽게 반복하십시오.
- 가격, 위치, 특징, 이용 방식 등
  검색 사용자가 궁금해할 정보를
  문장 속에 명확하게 포함시키십시오.
- 특정 키워드를 억지로 나열하지 말고,
  맥락 안에서 반복되도록 구성하십시오.

────────────────────

[모바일 가독성 규칙]

- 모든 문장은 한 줄에 한 문장만 작성하십시오.
- 마침표가 나오면 반드시 줄을 바꾸십시오.
- 빽빽한 문단은 피하고,
  여백과 리듬이 살아있는 에세이처럼 구성하십시오.
- 문단 사이에는 다음 구분선을 사용하십시오.

✨━━✨

────────────────────

[단어 및 표현 가이드]

- 다음 단어는 절대 사용하지 마십시오.
  (후기, 리뷰, 내돈내산)

- 대신 다음과 같은 표현을 상황에 맞게 활용하십시오.
  (소식, 이야기, 공식 추천, 탐방, 안내)

────────────────────

[글의 흐름 구조]

- 도입부:
  독자의 현재 상황과 고민을 건드리는 공감 문장으로 시작

- 전개부:
  해당 매장/서비스가 왜 선택받는지
  업계 일반론 + 차별점을 연결하여 서술

- 정보부:
  위치, 운영 방식, 이용 시 장점 등을
  정보 콘텐츠처럼 자연스럽게 설명

- 마무리:
  지금 방문하거나 경험해볼 만한
  충분한 명분을 제시하며 마무리

────────────────────

[분량 확장 전략 – 필수 실행]

제공된 정보가 부족하더라도
다음 방식을 활용해 내용을 확장하십시오.

- 하나의 장점을 제시했다면
  → 그것이 일상에 어떤 변화를 주는지
  → 행동에 어떤 영향을 주는지
  → 왜 선택 확률을 높이는지까지
  꼬리에 꼬리를 물고 서술하십시오.

- 같은 의미라도
  표현, 각도, 예시를 바꿔
  자연스럽게 반복하십시오.

이 지침은 선택이 아니라 필수입니다.

────────────────────

[출력 전 최종 점검]

- 글자 수: 1,500자 이상 2,000자 이하인가?
- 모바일에서 읽기 편한가?
- 정보성 글처럼 보이는가?
- 특정 단어 금지 조건을 위반하지 않았는가?

모든 조건을 만족할 때만 최종 출력하십시오.
`;

// ==========================================
// 3. API 라우트 정의
// ==========================================

// 서버 생존 확인용
app.get('/api/test', (req, res) => {
    res.json({ message: "김과장 서버 가동 중! (Port: 5050)" });
});

// [기능 1] AI 마케팅 글 생성 (버그 수정 및 로직 강화)
app.post('/api/generate', async (req, res) => {
    try {
        // [총괄본부 긴급 디버깅 로그 - 데이터 수신 확인]
        console.log("======================================");
        console.log("📨 [요청 도착] 글쓰기 요청 데이터 정밀 분석 중...");
        console.log("1. 클라이언트가 보낸 원본 데이터:", req.body);
        
        // [수정 포인트 1] 프론트엔드에서 보내는 모든 변수(grade, location, description) 수신
        const { topic, industry, platform, storeName, grade, location, description, isPro, type } = req.body;

        // [수정 포인트 2] 유료/무료 판단 로직 통합 (grade='pro' 또는 isPro=true)
        // 프론트엔드가 'grade'로 보내든 'isPro'로 보내든 다 잡아냅니다.
        const isProUser = (grade === 'pro' || isPro === true || isPro === 'true');

        console.log(`2. 변수 추출 확인:`);
        console.log(`   - 상호명(storeName): ${storeName}`);
        console.log(`   - 등급(grade): ${grade}`);
        console.log(`   - 위치(location): ${location}`); 
        console.log(`   - 특징(description): ${description}`);
        
        if (isProUser) {
             console.log("💎 [판정 결과] 유료(PRO) 회원입니다. --> PRO 프롬프트 가동");
        } else {
             console.log("🌱 [판정 결과] 무료(FREE) 회원입니다. --> FREE 프롬프트 가동");
        }
        console.log("======================================");

        // 변수 안전 처리 (undefined 방지)
        const myStore = storeName || '우리 매장';
        const myLocation = location || ''; 
        const myDesc = description || '';
        const myPlatform = type || platform || '블로그';

        // 1) 시스템 프롬프트 선택
        const selectedSystemPrompt = isProUser ? PRO_SYSTEM_PROMPT : FREE_SYSTEM_PROMPT;

        // 2) 사용자 지시사항 구성 (등급별 차별화)
        let specificInstruction = "";
        
        if (isProUser) {
            specificInstruction = `
            [👑 Pro 버전 지시사항 - 최고성능 마케팅 로직 가동]
            - 주제: '${topic}'
            - 상호명: **'${myStore}'** (지역명과 결합하여 5회 이상 노출)
            - **위치:** '${myLocation}' (Geo-Targeting 필수)
            - **특징:** '${myDesc}' (USP 극대화)
            
            **[Pro Mission - 절대 규칙]:** 1. **태그 금지:** [Title], [Hook], [Body] 같은 목차 태그를 절대 출력하지 마세요. 바로 제목부터 시작하세요.
            2. **분량 확보:** 제공된 정보가 적다면 업계의 일반적인 장점(MSG)을 덧붙여서라도 **1500자 이상, 2000자에 가깝게** 반드시 채우세요. 짧으면 실패입니다.
            3. **C-Rank:** 전문가가 분석하는 듯한 깊이 있는 톤을 유지하세요.
            4. **가독성:** 마침표가 나오면 무조건 줄바꿈하세요.
            `;
        } else {
            specificInstruction = `
            [🐣 Free 버전 지시사항 - 실용적 수준]
            - 상호명: '${myStore}'
            - 위치: '${myLocation}'
            - 특징: '${myDesc}'
            
            **[미션]**:
            1. 문단을 3~4개로 명확히 나누어(줄바꿈) 가독성 있게 작성하세요.
            2. 너무 짧게 쓰지 말고 600자~800자 정도로 성실하게 내용을 채우세요.
            3. '후기'라는 단어는 쓰지 마세요. 대신 '추천', '소개'라고 하세요.
            `;
        }

        const userMessage = `
        [작성 요청 정보]
        1. 업종/카테고리: ${industry}
        2. 글의 주제: ${topic}
        3. 타겟 플랫폼: ${myPlatform}
        4. 매장명(상호): ${myStore}

        ${specificInstruction}
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: selectedSystemPrompt },
                { role: "user", content: userMessage }
            ],
            // Pro는 창의적/감성적(0.85), Free는 안정적(0.6)
            // presence_penalty를 추가하여 새로운 내용을 더 쓰도록 유도 (분량 확보)
            temperature: isProUser ? 0.9 : 0.6, 
            presence_penalty: isProUser ? 0.6 : 0, 
        });

        // =========================================================================
        // 🚨 [서버 강제 교정 시스템 - Post Processing Logic]
        // AI가 말을 안 들으면, 서버가 직접 텍스트를 수정해서 보냅니다.
        // =========================================================================
        let finalResult = completion.choices[0].message.content;

        console.log(`[1차 생성 완료] 교정 전 길이: ${finalResult.length}자`);

        // 1. [금지어 삭제] '후기', '리뷰' -> '소식', '추천'으로 강제 치환
        finalResult = finalResult.replace(/후기/g, "소식");
        finalResult = finalResult.replace(/리뷰/g, "이야기");
        finalResult = finalResult.replace(/내돈내산/g, "솔직 방문");

        // 2. [마크다운 삭제] ** (볼드체) 기호 완전 삭제
        finalResult = finalResult.replace(/\*\*/g, ""); 
        
        // 3. [구조 태그 삭제] [Title], [Hook] 등이 보이면 삭제 (빈칸으로 변경)
        // 대괄호로 감싸진 태그 패턴 제거
        finalResult = finalResult.replace(/\[Title\]|\[Hook\]|\[Body\]|\[Info\]|\[Conclusion\]/gi, "");
        finalResult = finalResult.replace(/\[.*?\]:?/g, ""); // 대괄호 안에 있는 모든 진행용 태그 제거
        
        // 대괄호 없이 'Title:', 'Hook:' 형태로 나오는 경우도 제거
        finalResult = finalResult.replace(/^Title:/gim, "");
        finalResult = finalResult.replace(/^Hook:/gim, "");
        finalResult = finalResult.replace(/^Body:/gim, "");

        // 4. [가독성 강제] 유료(Pro)일 경우, 마침표 뒤에 무조건 줄바꿈 2번 삽입
        if (isProUser) {
             // 정규식: 마침표(.) 뒤에 공백이 있든 없든, 줄바꿈 2개로 교체
             finalResult = finalResult.replace(/\. /g, ".\n\n");
             finalResult = finalResult.replace(/\.(?!\n)/g, ".\n\n"); 
        }

        console.log(`[최종 교정 완료] 클라이언트로 전송합니다. 길이: ${finalResult.length}자`);
        
        res.json({ result: finalResult });

    } catch (error) {
        console.error("OpenAI API 에러:", error);
        res.status(500).json({ error: "글 작성 실패" });
    }
});

// [기능 2] 키워드 검색량 분석 (네이버 API)
// 기존 로그를 100% 유지합니다.
app.post('/api/analyze/keyword', async (req, res) => {
    console.log("\n========== [키워드 분석 요청 시작] ==========");
    
    try {
        const { keyword } = req.body;
        console.log(`1. 클라이언트 요청 도착: 키워드 = [${keyword}]`);

        if (!keyword) {
            return res.status(400).json({ error: "키워드가 없습니다." });
        }

        if (!NAVER_ID || !NAVER_SECRET) {
            console.error("❌ 치명적 오류: .env 파일에 네이버 키가 없습니다!");
            return res.status(500).json({ error: "서버 설정 오류: API 키 누락" });
        }

        console.log("2. 네이버 API 호출 시도 중...");
        const response = await axios.get('https://openapi.naver.com/v1/search/blog.json', {
            params: { query: keyword, display: 1, sort: 'sim' },
            headers: { 'X-Naver-Client-Id': NAVER_ID, 'X-Naver-Client-Secret': NAVER_SECRET }
        });

        console.log(`3. 네이버 응답 성공! 상태코드: ${response.status}`);
        
        const total = response.data.total;
        console.log(`4. 검색 결과 수(Total): ${total}`);

        let competition = "";
        let recommendation = "";

        if (total >= 50000) {
            competition = "매우 치열🔥";
            recommendation = "상위 노출이 어렵습니다. 세부 키워드를 공략하세요.";
        } else if (total >= 10000) {
            competition = "보통😐";
            recommendation = "꾸준한 포스팅이 필요합니다.";
        } else if (total < 5000) {
            competition = "블루오션💎";
            recommendation = "지금 선점하면 좋은 효과를 볼 수 있습니다!";
        } else {
            competition = "진입 가능🟢";
            recommendation = "적절한 키워드입니다.";
        }

        console.log("5. 클라이언트로 응답 전송 완료");
        console.log("========== [요청 종료] ==========\n");

        res.json({ keyword, total, competition, recommendation });

    } catch (error) {
        console.error("\n❌ [네이버 API 호출 실패] ❌");
        if (error.response) {
            console.error("- 상태 코드:", error.response.status);
            console.error("- 데이터:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("- 원인:", error.message);
        }
        res.status(500).json({ error: "키워드 분석 중 에러가 발생했습니다." });
    }
});

// 4. 서버 실행
app.listen(PORT, () => {
    console.log(`----------------------------------------`);
    console.log(`🚀 마케터 김과장 서버가 ${PORT}번 포트에서 실행 중입니다.`);
    console.log(`🎧 데이터 감청 모드 ON: '/api/generate' 요청을 주시 중...`);
    console.log(`✅ [Pro 업데이트]: SEO/Geo/C-Rank 탑재, 태그제거 및 후처리 강화`);
    console.log(`----------------------------------------`);
});