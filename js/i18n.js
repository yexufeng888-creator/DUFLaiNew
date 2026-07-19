/* ============================================================
   DUFL — i18n Module v2
   Full translations: zh/tw/en/ja/ko for ALL pages
   Security-hardened: XSS-safe textContent/innerHTML
   ============================================================ */
const I18N = (function(){
  'use strict';

  /* ---- Complete Translation Dictionary ---- */
  const DICT = {
    /* Nav & Brand */
    'nav.brand':    { zh:'越是地方的，越是世界的', tw:'越是地方的，越是世界的', en:'The More Local, The More Global', ja:'ローカルであるほど、グローバルである', ko:'지역적일수록, 세계적이다' },
    'nav.home':     { zh:'首页', tw:'首頁', en:'Home', ja:'ホーム', ko:'홈' },
    'nav.data':     { zh:'数据', tw:'數據', en:'Data', ja:'データ', ko:'데이터' },
    'nav.global':   { zh:'国际', tw:'國際', en:'Global', ja:'国際', ko:'글로벌' },
    'nav.compare':  { zh:'对比', tw:'對比', en:'Compare', ja:'比較', ko:'비교' },
    'nav.decode':   { zh:'解码', tw:'解碼', en:'Decode', ja:'解説', ko:'디코드' },
    'nav.films':    { zh:'资料库', tw:'資料庫', en:'Films', ja:'作品集', ko:'작품집' },
    'nav.insights': { zh:'洞察', tw:'洞察', en:'Insights', ja:'洞察', ko:'인사이트' },
    'nav.deepdive': { zh:'深度分析', tw:'深度分析', en:'Deep Dive', ja:'深掘り分析', ko:'심층 분석' },
    'nav.cases':    { zh:'案例', tw:'案例', en:'Case Studies', ja:'事例研究', ko:'사례 연구' },
    'nav.timeline': { zh:'脉络', tw:'脈絡', en:'Timeline', ja:'歴史', ko:'연대기' },
    'nav.method':   { zh:'方法', tw:'方法', en:'Methodology', ja:'方法論', ko:'방법론' },
    'nav.about':    { zh:'关于', tw:'關於', en:'About', ja:'概要', ko:'소개' },
    'nav.contact':  { zh:'联系', tw:'聯繫', en:'Contact', ja:'連絡先', ko:'연락처' },
    'nav.ai':       { zh:'AI 问答', tw:'AI 問答', en:'AI Query', ja:'AI Q&A', ko:'AI 문의' },
    'nav.login':    { zh:'登录', tw:'登入', en:'Login', ja:'ログイン', ko:'로그인' },

    /* Hero (index) */
    'hero.eyebrow': { zh:'数据新闻大赛', tw:'數據新聞大賽', en:'Data Journalism Competition', ja:'データジャーナリズムコンペティション', ko:'데이터 저널리즘 공모전' },
    'hero.title1':  { zh:'被世界听懂的', tw:'被世界聽懂的', en:'When the World Hears', ja:'世界に届く', ko:'세상이 알아듣는' },
    'hero.title2':  { zh:'"土味"乡音', tw:'"土味"鄉音', en:'"Rustic" Dialects', ja:'「土の味」の方言', ko:'「토속적인」방언' },
    'hero.sub':     { zh:'中国方言叙事的破圈传播与国际表达<br>以《给阿嬷的情书》为核心样本', tw:'中國方言敘事的破圈傳播與國際表達<br>以《給阿嬤的情書》為核心樣本', en:'The Breakthrough & Global Expression of Chinese Dialect Narratives<br>Featuring "A Love Letter to Grandma"', ja:'中国方言映画の国際的展開<br>「おばあちゃんへのラブレター」を中心に', ko:'중국 방언 서사의 글로벌 확산<br>《할머니께 보내는 연서》를 중심으로' },
    'hero.scroll':  { zh:'↓ 向下探索', tw:'↓ 向下探索', en:'↓ Scroll to explore', ja:'↓ スクロールして探索', ko:'↓ 스크롤하여 탐색' },
    'hero.stat1':   { zh:'累计票房', tw:'累計票房', en:'Box Office', ja:'累計興行収入', ko:'누적 박스오피스' },
    'hero.stat2':   { zh:'豆瓣评分', tw:'豆瓣評分', en:'Douban Rating', ja:'豆瓣評価', ko:'더우반 평점' },
    'hero.stat3':   { zh:'全球上映', tw:'全球上映', en:'Global Release', ja:'世界公開', ko:'글로벌 개봉' },

    /* Sections (index) */
    'sec.foreword':  { zh:'卷首语', tw:'卷首語', en:'Foreword', ja:'序文', ko:'서문' },
    'sec.timeline':  { zh:'票房轨迹', tw:'票房軌跡', en:'Box Office Timeline', ja:'興行収入の軌跡', ko:'흥행 궤적' },
    'sec.data':      { zh:'数据图景', tw:'數據圖景', en:'Data Landscape', ja:'データ概観', ko:'데이터 전경' },
    'sec.global':    { zh:'全球版图', tw:'全球版圖', en:'Global Release Map', ja:'世界公開地図', ko:'글로벌 개봉 지도' },
    'sec.compare':   { zh:'创作路径对比', tw:'創作路徑對比', en:'Creative Approach', ja:'制作手法の比較', ko:'창작 경로 비교' },
    'sec.decode':    { zh:'土味解码', tw:'土味解碼', en:'Dialect Decode', ja:'方言解説', ko:'방언 해독' },
    'sec.films':     { zh:'电影资料库', tw:'電影資料庫', en:'Film Database', ja:'作品データベース', ko:'영화 데이터베이스' },
    'sec.insights':  { zh:'核心观点', tw:'核心觀點', en:'Core Insights', ja:'核心的洞察', ko:'핵심 통찰' },

    /* Footer */
    'footer.explore':   { zh:'探索更多', tw:'探索更多', en:'Explore', ja:'もっと見る', ko:'더 보기' },
    'footer.data':      { zh:'数据来源', tw:'數據來源', en:'Data Sources', ja:'データソース', ko:'데이터 출처' },
    'footer.quote':     { zh:'"真正的本土性不需要翻译，它本身就是世界性的。"', tw:'"真正的本土性不需要翻譯，它本身就是世界性的。"', en:'"True locality needs no translation — it is already universal."', ja:'「真のローカリティに翻訳は不要——それ自体がユニバーサルである」', ko:'"진정한 지역성은 번역이 필요 없다 — 그 자체로 세계적이다"' },
    'footer.copyright': { zh:'© 2026 方言电影传播研究 · 大连外国语大学', tw:'© 2026 方言電影傳播研究 · 大連外國語大學', en:'© 2026 Dialect Film Research · DUFL', ja:'© 2026 方言映画研究 · 大連外国語大学', ko:'© 2026 방언영화연구 · 대련외국어대학' },

    /* Region selector */
    'region.title':     { zh:'选择地区', tw:'選擇地區', en:'Select Region', ja:'地域を選択', ko:'지역 선택' },
    'region.desc':      { zh:'Select your region', tw:'Select your region', en:'Select your region', ja:'地域をお選びください', ko:'지역을 선택하세요' },
    'region.cancel':    { zh:'取消', tw:'取消', en:'Cancel', ja:'キャンセル', ko:'취소' },

    /* Theme */
    'theme.toggle': { zh:'切换主题', tw:'切換主題', en:'Toggle theme', ja:'テーマ切替', ko:'테마 전환' },

    /* Login page */
    'login.title':       { zh:'登录', tw:'登入', en:'Sign In', ja:'ログイン', ko:'로그인' },
    'login.register':    { zh:'注册', tw:'註冊', en:'Sign Up', ja:'登録', ko:'회원가입' },
    'login.apple':       { zh:'使用 Apple 登录', tw:'使用 Apple 登入', en:'Sign in with Apple', ja:'Appleでログイン', ko:'Apple로 로그인' },
    'login.google':      { zh:'使用 Google 登录', tw:'使用 Google 登入', en:'Sign in with Google', ja:'Googleでログイン', ko:'Google로 로그인' },
    'login.github':      { zh:'使用 GitHub 登录', tw:'使用 GitHub 登入', en:'Sign in with GitHub', ja:'GitHubでログイン', ko:'GitHub로 로그인' },
    'login.wechat':      { zh:'使用微信登录', tw:'使用微信登入', en:'Sign in with WeChat', ja:'WeChatでログイン', ko:'WeChat으로 로그인' },
    'login.email_div':   { zh:'或使用邮箱', tw:'或使用郵箱', en:'or use email', ja:'またはメールで', ko:'또는 이메일 사용' },
    'login.email':       { zh:'邮箱', tw:'郵箱', en:'Email', ja:'メールアドレス', ko:'이메일' },
    'login.password':    { zh:'密码', tw:'密碼', en:'Password', ja:'パスワード', ko:'비밀번호' },
    'login.name':        { zh:'姓名', tw:'姓名', en:'Name', ja:'名前', ko:'이름' },
    'login.login_btn':   { zh:'登 录', tw:'登 入', en:'Sign In', ja:'ログイン', ko:'로그인' },
    'login.register_btn':{ zh:'注 册', tw:'註 冊', en:'Sign Up', ja:'登 録', ko:'회원가입' },
    'login.password_hint':{ zh:'使用 PBKDF2-SHA512 + 随机盐值加密存储', tw:'使用 PBKDF2-SHA512 + 隨機鹽值加密存儲', en:'Encrypted with PBKDF2-SHA512 + random salt', ja:'PBKDF2-SHA512 + ランダムソルトで暗号化', ko:'PBKDF2-SHA512 + 임의 솔트로 암호화' },
    'login.back':        { zh:'← 返回首页', tw:'← 返回首頁', en:'← Back to Home', ja:'← ホームに戻る', ko:'← 홈으로' },
    'login.security':    { zh:'🔒 数据加密存储在浏览器本地', tw:'🔒 數據加密存儲在瀏覽器本地', en:'🔒 Data encrypted in local storage', ja:'🔒 データはブラウザで暗号化', ko:'🔒 데이터는 브라우저에서 암호화' },

    /* AI Query page */
    'ai.title':         { zh:'AI 智能问答', tw:'AI 智能問答', en:'AI Intelligence Q&A', ja:'AI インテリジェント Q&A', ko:'AI 지능형 문의' },
    'ai.subtitle':      { zh:'方言电影传播研究', tw:'方言電影傳播研究', en:'Dialect Film Research', ja:'方言映画研究', ko:'방언 영화 연구' },
    'ai.welcome':       { zh:'方言电影研究助手', tw:'方言電影研究助手', en:'Dialect Film Research Assistant', ja:'方言映画研究アシスタント', ko:'방언 영화 연구 도우미' },
    'ai.welcome_desc':  { zh:'由最新 AI 模型驱动，深度解析方言电影的破圈传播、海外发行、文化影响与数据洞察', tw:'由最新 AI 模型驅動，深度解析方言電影的破圈傳播、海外發行、文化影響與數據洞察', en:'Powered by the latest AI models. Deep analysis of dialect film distribution, global release, cultural impact, and data insights.', ja:'最新AIモデルが方言映画の国際展開、文化的影響、データ分析を深掘りします', ko:'최신 AI 모델로 방언 영화의 글로벌 확산, 문화적 영향, 데이터 통찰을 분석합니다' },
    'ai.new_chat':      { zh:'＋ 新对话', tw:'＋ 新對話', en:'＋ New Chat', ja:'＋ 新規チャット', ko:'＋ 새 대화' },
    'ai.history':       { zh:'对话历史', tw:'對話歷史', en:'Chat History', ja:'チャット履歴', ko:'대화 기록' },
    'ai.clear_history': { zh:'🗑️ 清除历史', tw:'🗑️ 清除歷史', en:'🗑️ Clear History', ja:'🗑️ 履歴を消去', ko:'🗑️ 기록 삭제' },
    'ai.settings':      { zh:'⚙️ 模型设置', tw:'⚙️ 模型設定', en:'⚙️ Model Settings', ja:'⚙️ モデル設定', ko:'⚙️ 모델 설정' },
    'ai.guide':         { zh:'📖 使用指南', tw:'📖 使用指南', en:'📖 User Guide', ja:'📖 利用ガイド', ko:'📖 사용 가이드' },
    'ai.placeholder':   { zh:'向 AI 提问……', tw:'向 AI 提問……', en:'Ask AI...', ja:'AIに質問...', ko:'AI에게 질문...' },
    'ai.voice':         { zh:'语音输入', tw:'語音輸入', en:'Voice Input', ja:'音声入力', ko:'음성 입력' },
    'ai.hint':          { zh:'🔒 本地知识库 + AI API · 隐私政策', tw:'🔒 本地知識庫 + AI API · 隱私政策', en:'🔒 Local KB + AI API · Privacy', ja:'🔒 ローカル知識ベース + AI API', ko:'🔒 로컬 지식베이스 + AI API' },
    'ai.settings_title':{ zh:'⚙️ 模型设置', tw:'⚙️ 模型設定', en:'⚙️ Model Settings', ja:'⚙️ モデル設定', ko:'⚙️ 모델 설정' },
    'ai.settings_desc': { zh:'API Key 使用 AES-GCM 加密存储在浏览器本地', tw:'API Key 使用 AES-GCM 加密存儲在瀏覽器本地', en:'API Key encrypted with AES-GCM in browser storage', ja:'APIキーはAES-GCMで暗号化されブラウザに保存', ko:'API 키는 AES-GCM으로 암호화되어 브라우저에 저장' },
    'ai.provider':      { zh:'提供商', tw:'提供商', en:'Provider', ja:'プロバイダー', ko:'제공사' },
    'ai.model':         { zh:'模型', tw:'模型', en:'Model', ja:'モデル', ko:'모델' },
    'ai.api_key':       { zh:'API Key', tw:'API Key', en:'API Key', ja:'APIキー', ko:'API 키' },
    'ai.save':          { zh:'保存', tw:'保存', en:'Save', ja:'保存', ko:'저장' },
    'ai.cancel':        { zh:'取消', tw:'取消', en:'Cancel', ja:'キャンセル', ko:'취소' },
    'ai.clear_btn':     { zh:'清除', tw:'清除', en:'Clear', ja:'消去', ko:'삭제' },

    /* Contact page */
    'contact.title':    { zh:'联系我们', tw:'聯繫我們', en:'Contact Us', ja:'お問い合わせ', ko:'연락처' },
    'contact.desc':     { zh:'有任何问题或合作意向，请随时与我们取得联系', tw:'有任何問題或合作意向，請隨時與我們取得聯繫', en:'For any questions or collaboration inquiries, please contact us.', ja:'ご質問やご協力については、お気軽にお問い合わせください', ko:'문의사항이나 협업 제안이 있으시면 언제든 연락해 주세요' },
    'contact.email':    { zh:'学术交流邮箱', tw:'學術交流郵箱', en:'Academic Email', ja:'学術交流メール', ko:'학술 교류 이메일' },
    'contact.wechat':   { zh:'微信公众号', tw:'微信公眾號', en:'WeChat Official', ja:'WeChat公式', ko:'위챗 공식 계정' },
    'contact.chat':     { zh:'在线客服', tw:'在線客服', en:'Live Chat', ja:'オンラインサポート', ko:'실시간 상담' },
    'contact.response': { zh:'工作日 9:00-18:00 在线 · 邮件回复 < 24 小时', tw:'工作日 9:00-18:00 在線 · 郵件回覆 < 24 小時', en:'Online weekdays 9:00-18:00 · Email reply < 24h', ja:'平日9:00-18:00 · メール返信24時間以内', ko:'평일 9:00-18:00 · 이메일 답변 24시간 이내' },
    'contact.chat_welcome': { zh:'您好！👋 如需帮助请留言，我们将尽快回复。', tw:'您好！👋 如需幫助請留言，我們將盡快回覆。', en:'Hello! 👋 Leave a message and we\'ll respond shortly.', ja:'こんにちは！👋 ご用件をお書きください。', ko:'안녕하세요! 👋 메시지를 남겨주시면 확인 후 답변드립니다.' },

    /* About page */
    'about.title':      { zh:'关于研究', tw:'關於研究', en:'About the Research', ja:'研究について', ko:'연구 소개' },
    'about.desc':       { zh:'一项关于方言叙事如何跨越语言与地域实现全球传播的传播学研究', tw:'一項關於方言敘事如何跨越語言與地域實現全球傳播的傳播學研究', en:'A communication study on how dialect narratives achieve global distribution across language and geography', ja:'方言の物語が言語と地理を超えて世界に届く仕組みを探るコミュニケーション研究', ko:'방언 서사가 언어와 지역을 넘어 글로벌하게 전파되는 과정을 연구합니다' },
    'about.origin':     { zh:'研究缘起', tw:'研究緣起', en:'Research Origin', ja:'研究のきっかけ', ko:'연구 배경' },
    'about.team':       { zh:'研究团队', tw:'研究團隊', en:'Research Team', ja:'研究チーム', ko:'연구팀' },
    'about.contact':    { zh:'学术交流', tw:'學術交流', en:'Academic Exchange', ja:'学術交流', ko:'학술 교류' },

    /* Methodology */
    'method.title':     { zh:'研究方法', tw:'研究方法', en:'Methodology', ja:'研究方法', ko:'연구 방법' },
    'method.desc':      { zh:'如何系统性追踪一部方言电影从地方叙事到全球传播的完整路径？', tw:'如何系統性追蹤一部方言電影從地方敘事到全球傳播的完整路徑？', en:'How to systematically track the complete path of a dialect film from local narrative to global distribution?', ja:'方言映画がローカルな物語から世界中に届くまでの過程を体系的に追跡する方法', ko:'방언 영화가 지역 서사에서 글로벌 배급까지 이어지는 경로를 체계적으로 추적하는 방법' },
    'method.mixed':     { zh:'混合方法设计', tw:'混合方法設計', en:'Mixed Methods Design', ja:'混合手法設計', ko:'혼합 연구 방법' },
    'method.data':      { zh:'数据来源', tw:'數據來源', en:'Data Sources', ja:'データソース', ko:'데이터 출처' },
    'method.process':   { zh:'研究历程', tw:'研究歷程', en:'Research Process', ja:'研究過程', ko:'연구 과정' },

    /* Timeline */
    'timeline.title':   { zh:'历史脉络', tw:'歷史脈絡', en:'Historical Evolution', ja:'歴史的展開', ko:'역사적 전개' },
    'timeline.desc':    { zh:'中国方言电影从边缘到主流的百年演进 · 一段关于"声音"的文化变迁史', tw:'中國方言電影從邊緣到主流的百年演進 · 一段關於"聲音"的文化變遷史', en:'A century of Chinese dialect cinema from the margins to the mainstream · A cultural history of voices', ja:'中国方言映画の百年——周縁から主流へ · 「声」の文化変遷史', ko:'중국 방언 영화의 변방에서 주류로의 백년 여정 · 목소리의 문화 변천사' },

    /* Case Studies */
    'cases.title':      { zh:'案例研究', tw:'案例研究', en:'Case Studies', ja:'事例研究', ko:'사례 연구' },
    'cases.desc':       { zh:'选取六部具有代表性的方言电影，深度剖析各自的破圈路径与传播机制', tw:'選取六部具有代表性的方言電影，深度剖析各自的破圈路徑與傳播機制', en:'Six representative dialect films analyzed for their breakthrough paths and communication mechanisms', ja:'代表的な方言映画6作品のブレイクスルー経路と伝播メカニズムを分析', ko:'대표적인 방언 영화 6편의 성공 경로와 전파 메커니즘을 심층 분석' },

    /* Deep Dive */
    'deepdive.title':   { zh:'深度分析', tw:'深度分析', en:'Deep Dive', ja:'深掘り分析', ko:'심층 분석' },
    'deepdive.desc':    { zh:'以《给阿嬷的情书》为核心样本，拆解方言叙事破圈与出海的底层逻辑', tw:'以《給阿嬤的情書》為核心樣本，拆解方言敘事破圈與出海的底層邏輯', en:'Deconstructing the underlying logic of dialect narrative breakthrough and global distribution', ja:'「おばあちゃんへのラブレター」を中心に、方言の物語が世界に届くメカニズムを解体', ko:'《할머니께 보내는 연서》를 중심으로 방언 서사가 세계로 뻗어나가는 근본 논리를 분석' },

    /* Privacy */
    'privacy.title':    { zh:'隐私政策', tw:'隱私政策', en:'Privacy Policy', ja:'プライバシーポリシー', ko:'개인정보처리방침' },
    'privacy.desc':     { zh:'我们重视您的隐私。请了解我们如何收集、使用和保护您的信息。', tw:'我們重視您的隱私。請了解我們如何收集、使用和保護您的資訊。', en:'We value your privacy. Learn how we collect, use, and protect your information.', ja:'お客様のプライバシーを尊重します。情報の収集·利用·保護についてご確認ください', ko:'귀하의 개인정보를 소중히 여깁니다. 정보 수집, 사용, 보호 방법을 확인하세요.' },

    /* Film Database */
    'film.all':         { zh:'全部', tw:'全部', en:'All', ja:'すべて', ko:'전체' },
    'film.minnan':      { zh:'闽南语', tw:'閩南語', en:'Minnan', ja:'閩南語', ko:'민난어' },
    'film.yue':         { zh:'粤语', tw:'粵語', en:'Cantonese', ja:'広東語', ko:'광둥어' },
    'film.wu':          { zh:'吴语', tw:'吳語', en:'Wu', ja:'呉語', ko:'우어' },
    'film.guanhua':     { zh:'官话', tw:'官話', en:'Mandarin Dialects', ja:'官話方言', ko:'관화 방언' },
    'film.hakka':       { zh:'客家话', tw:'客家話', en:'Hakka', ja:'客家語', ko:'하카어' },
    'film.xiang':       { zh:'湘语', tw:'湘語', en:'Xiang', ja:'湘語', ko:'샹어' },

    /* Back to top */
    'back.top': { zh:'↑', tw:'↑', en:'↑', ja:'↑', ko:'↑' },

    /* Compare */
    'compare.table.film':    { zh:'影片', tw:'影片', en:'Film', ja:'作品', ko:'영화' },
    'compare.table.dialect': { zh:'方言', tw:'方言', en:'Dialect', ja:'方言', ko:'방언' },
    'compare.table.path':    { zh:'传播路径', tw:'傳播路徑', en:'Path', ja:'経路', ko:'경로' },
    'compare.table.mech':    { zh:'破圈机制', tw:'破圈機制', en:'Mechanism', ja:'メカニズム', ko:'메커니즘' },
    'compare.table.intl':    { zh:'海外路径', tw:'海外路徑', en:'Intl Path', ja:'国際経路', ko:'해외 경로' },
  };

  /* Region config */
  const REGIONS = [
    { code:'zh-CN', name:'中国大陆', flag:'🇨🇳', lang:'zh' },
    { code:'zh-HK', name:'中国香港', flag:'🇭🇰', lang:'tw' },
    { code:'zh-TW', name:'中国台湾', flag:'🇹🇼', lang:'tw' },
    { code:'ja',    name:'日本',     flag:'🇯🇵', lang:'ja' },
    { code:'ko',    name:'韩国',     flag:'🇰🇷', lang:'ko' },
    { code:'ms',    name:'马来西亚', flag:'🇲🇾', lang:'zh' },
    { code:'en-US', name:'United States', flag:'🇺🇸', lang:'en' },
    { code:'en-CA', name:'Canada',  flag:'🇨🇦', lang:'en' },
  ];

  let currentRegion = localStorage.getItem('region_v2') || 'zh-CN';
  let currentLang = 'zh';

  function getLangForRegion(region){
    const r = REGIONS.find(r => r.code === region);
    return r ? r.lang : 'zh';
  }

  function t(key){
    const entry = DICT[key];
    if (!entry) {
      // Fallback: try without nav. prefix for nav links
      const fallback = DICT['nav.' + key] || DICT['sec.' + key] || DICT['footer.' + key];
      if (fallback) return fallback[currentLang] || fallback['zh'] || key;
      return key;
    }
    return entry[currentLang] || entry['zh'] || key;
  }

  function setRegion(code){
    currentRegion = code;
    currentLang = getLangForRegion(code);
    localStorage.setItem('region_v2', code);
    const r = REGIONS.find(r => r.code === code);
    document.documentElement.lang = code;
    apply();
    window.dispatchEvent(new CustomEvent('regionChange', {
      detail: { region: code, lang: currentLang, name: r ? r.name : code }
    }));
  }

  function getRegion(){ return currentRegion; }
  function getLang(){ return currentLang; }

  function apply(){
    // DOM-based translation: find all [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const text = t(key);
      // If text contains <br>, set innerHTML; otherwise textContent for security
      if (text && text.includes('<br>')){
        el.innerHTML = text;
      } else if (text){
        el.textContent = text;
      }
    });

    // Translate nav links by their text content
    document.querySelectorAll('#nav .nav-links a').forEach(a => {
      const text = a.textContent.trim();
      // Map Chinese text to i18n key
      const linkMap = {
        '首页': 'nav.home', '首頁': 'nav.home',
        '深度分析': 'nav.deepdive',
        '案例': 'nav.cases',
        '脉络': 'nav.timeline',
        '方法': 'nav.method',
        '关于': 'nav.about',
        '联系': 'nav.contact',
        'AI 问答': 'nav.ai', 'AI 問答': 'nav.ai',
        '资料库': 'nav.films', '資料庫': 'nav.films',
        '洞察': 'nav.insights',
        '对比': 'nav.compare', '對比': 'nav.compare',
        '国际': 'nav.global', '國際': 'nav.global',
        '数据': 'nav.data', '數據': 'nav.data',
        '登录': 'nav.login', '登入': 'nav.login',
      };
      // Check each mapping
      for (const [cn, key] of Object.entries(linkMap)){
        if (text === cn){
          a.textContent = t(key);
          break;
        }
      }
    });

    // Update region selector UI
    updateRegionUI();
  }

  function updateRegionUI(){
    document.querySelectorAll('.region-option').forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-region') === currentRegion);
    });
    // Update current region label
    const label = document.getElementById('currentRegionLabel');
    if (label){
      const r = REGIONS.find(r => r.code === currentRegion);
      if (r) label.textContent = r.flag + ' ' + r.name;
    }
  }

  function getRegions(){ return REGIONS; }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    currentLang = getLangForRegion(currentRegion);
    apply();
  });

  return { t, setRegion, getRegion, getLang, apply, getRegions, dict: DICT, REGIONS };
})();
