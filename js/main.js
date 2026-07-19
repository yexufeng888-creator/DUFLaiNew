/* ============================================================
   DUFL — Main Module v2
   Theme, Nav, Page Transitions, Reveal, Counters, Charts, Map, Films
   ============================================================ */
(function(){
  'use strict';

  /* ===== Theme ===== */
  function initTheme(){
    const html = document.documentElement;
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme:dark)').matches)){
      html.setAttribute('data-theme','dark');
    }
    const btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: next } }));
      if (typeof Chart !== 'undefined'){ Object.keys(Chart.instances || {}).forEach(id => Chart.instances[id]?.destroy()); initCharts(); }
    });
  }

  /* ===== Nav ===== */
  function initNav(){
    const nav = document.getElementById('nav');
    if (!nav) return;
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 50);
      // Highlight current section for anchor links
      if (y > lastScroll + 50 || y < lastScroll - 50){
        lastScroll = y;
        highlightNavSection();
      }
    }, { passive: true });

    // Mobile menu
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    if (menuBtn && navLinks){
      menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        menuBtn.classList.toggle('open'); // animate hamburger → X
      });
      navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.classList.remove('open');
      }));
    }

    // Active page marker
    markActivePage();
  }

  function highlightNavSection(){
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('#nav .nav-links a[href^="#"]');
    if (!sections.length || !links.length) return;
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  }

  function markActivePage(){
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#nav .nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html') || (path === '/' && href === 'index.html')){
        a.classList.add('active');
      }
    });
  }

  /* ===== Page Transitions ===== */
  function initPageTransitions(){
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:') ||
          href.startsWith('mailto:') || href.startsWith('tel:') ||
          href.startsWith('http://') || href.startsWith('https://')) return;
      if (!href.endsWith('.html')) return;

      link.addEventListener('click', function(e){
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        const overlay = document.createElement('div');
        overlay.className = 'page-transition';
        document.body.appendChild(overlay);
        void overlay.offsetWidth;
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 250);
      });
    });
  }

  /* ===== Scroll Reveal ===== */
  function initReveal(){
    // Immediately show all reveal elements that are in viewport
    const showAll = () => {
      document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) el.classList.add('visible');
      });
    };
    // Show visible ones immediately
    setTimeout(showAll, 150);
    // Then use IntersectionObserver for the rest
    if (!('IntersectionObserver' in window)) { showAll(); return; }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  /* ===== Counters ===== */
  function initCounters(){
    if (!('IntersectionObserver' in window)) return;
    document.querySelectorAll('.counter').forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals')) || 0;
      if (isNaN(target)) return;
      let done = false;
      new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting && !done){ done = true; obs.unobserve(el); animateCounter(el, target, suffix, decimals); }
        });
      }, { threshold: 0.4 }).observe(el);
    });
  }

  function animateCounter(el, target, suffix, decimals){
    const duration = 2200, start = performance.now();
    function frame(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      const val = target * eased;
      el.textContent = (decimals > 0 ? val.toFixed(decimals) : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
    }
    requestAnimationFrame(frame);
  }

  /* ===== Charts ===== */
  function initCharts(){
    if (typeof Chart === 'undefined') return;
    const style = getComputedStyle(document.documentElement);
    const accent = style.getPropertyValue('--accent').trim() || '#c44536';
    const gold = style.getPropertyValue('--gold').trim() || '#d4a853';
    const grey = style.getPropertyValue('--text-2').trim() || '#8a7b6b';
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const grid = isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)';

    const c1 = document.getElementById('chartBO');
    if (c1) new Chart(c1, { type:'line', data:{
      labels: ['4/27','5/9','5/16','5/24','5/31','6/19','6月'],
      datasets:[{ label:'累计(亿)', data:[0.1,1,4,10,14,18,19],
        borderColor:accent, backgroundColor:accent+'18', borderWidth:3, fill:true, tension:.35,
        pointRadius:5, pointBackgroundColor:accent, pointBorderColor:'#fff', pointBorderWidth:2, pointHoverRadius:8 }]
    }, options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{callbacks:{label:c=>c.raw+' 亿元'}} },
      scales:{ x:{ grid:{color:grid}, ticks:{color:grey,font:{size:10}} },
               y:{ grid:{color:grid}, ticks:{color:grey,callback:v=>v+'亿'}, beginAtZero:true } },
      interaction:{ intersect:false, mode:'index' }
    }});

    const c2 = document.getElementById('chartMetrics');
    if (c2) new Chart(c2, { type:'bar', data:{
      labels: ['豆瓣评分','上座率日冠','最高排片%','观影人次\n(千万)','传播\n(十亿)'],
      datasets:[{ data:[9.3,16,35.5,55.7,10],
        backgroundColor:[accent,gold,accent+'AA',gold+'99',accent+'77'], borderRadius:8, borderSkipped:false }]
    }, options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false} },
      scales:{ x:{ grid:{display:false}, ticks:{color:grey,font:{size:9}} },
               y:{ grid:{color:grid}, ticks:{color:grey}, beginAtZero:true, max:100 } }
    }});

    const c3 = document.getElementById('chartWaves');
    if (c3) new Chart(c3, { type:'bar', data:{
      labels: ['第一波 4/30','第二波 6/18','第三波 6/25','第四波 6/26','后续'],
      datasets:[{ data:[1,6,2,5,4], backgroundColor:[accent,gold,accent+'99',gold,accent+'66'], borderRadius:8, borderSkipped:false }]
    }, options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false} },
      scales:{ x:{ grid:{color:grid}, ticks:{color:grey,stepSize:2}, beginAtZero:true },
               y:{ grid:{display:false}, ticks:{color:grey,font:{size:10}} } }
    }});

    const c4 = document.getElementById('chartSentiment');
    if (c4) new Chart(c4, { type:'doughnut', data:{
      labels: ['文化认同','祖孙/乡愁','方言美感','女性互助','地域共情'],
      datasets:[{ data:[28,30,15,12,15], backgroundColor:[accent,gold,accent+'99',gold,accent+'66'],
        borderColor:isDark?'#1a1a1a':'#fff', borderWidth:2 }]
    }, options:{ responsive:true, maintainAspectRatio:false, cutout:'58%',
      plugins:{ legend:{ position:'bottom', labels:{ color:grey, font:{size:10}, padding:14, usePointStyle:true, pointStyleWidth:8 } } }
    }});
  }


  /* ===== Map (Apache ECharts · real world geometry · offline-capable) ===== */
  function initMap(){
    const el = document.getElementById('worldMap');
    if (!el) return;

    // Release data — real lat/lng, consumed directly by ECharts geo coord system
    const waveData = [
      { name:'北京', country:'中国内地', coord:[116.4,39.9], date:'4月30日', wave:1, bo:'累计19亿+', audiences:'5573万人次', note:'全球首映原点' },
      { name:'香港', country:'中国香港', coord:[114.2,22.3], date:'6月18日', wave:2, bo:'突破港币3000万', note:'潮语原声+粤语字幕' },
      { name:'澳门', country:'中国澳门', coord:[113.6,22.2], date:'6月18日', wave:2, note:'与香港同步上映' },
      { name:'新加坡', country:'新加坡', coord:[103.8,1.35], date:'6月18日', wave:2, bo:'4800张票1.5h售罄', audiences:'首周上座率93%' },
      { name:'吉隆坡', country:'马来西亚', coord:[101.7,3.14], date:'6月18日', wave:2, bo:'突破1500万林吉特' },
      { name:'悉尼', country:'澳大利亚', coord:[151.2,-33.9], date:'6月25日', wave:3, bo:'华语片年度最佳开画' },
      { name:'惠灵顿', country:'新西兰', coord:[174.8,-41.3], date:'6月25日', wave:3 },
      { name:'纽约', country:'美国', coord:[-74.0,40.7], date:'6月26日', wave:4, bo:'限定放映中' },
      { name:'多伦多', country:'加拿大', coord:[-79.4,43.7], date:'6月26日', wave:4 },
      { name:'伦敦', country:'英国', coord:[-0.13,51.5], date:'6月26日', wave:4 },
      { name:'都柏林', country:'爱尔兰', coord:[-6.26,53.4], date:'6月26日', wave:4 },
      { name:'东京', country:'日本', coord:[139.8,35.7], date:'6月26日', wave:4, note:'日文字幕版' },
      { name:'巴黎', country:'法国', coord:[2.35,48.9], date:'待定', wave:5, note:'洽谈中' },
      { name:'首尔', country:'韩国', coord:[127.0,37.6], date:'待定', wave:5, note:'洽谈中' },
      { name:'曼谷', country:'泰国', coord:[100.5,13.8], date:'待定', wave:5, note:'洽谈中' },
      { name:'河内', country:'越南', coord:[105.8,21.0], date:'待定', wave:5, note:'洽谈中' },
    ];

    const waveColor = {1:'#c44536',2:'#d4a853',3:'#e8a050',4:'#e8897a',5:'#8a8a8a'};
    const waveSize  = {1:20,2:15,3:14,4:13,5:11};
    const origin = [116.4,39.9];

    // Graceful degradation if ECharts / geo data unavailable (e.g. blocked local file)
    if (typeof echarts === 'undefined' || !window.__WORLD_GEO__){
      el.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;padding:40px;text-align:center;color:var(--text-3);font-size:13px;line-height:1.8">🌍 世界地图需要加载地图组件<br>请在联网环境或本地服务器中打开本页面查看完整互动地图</div>';
      return;
    }

    echarts.registerMap('world', window.__WORLD_GEO__);

    function themed(){ return document.documentElement.getAttribute('data-theme')==='dark'; }
    function palette(){
      return themed()
        ? { land:'#282c33', border:'rgba(255,255,255,.08)', emphasis:'#31363f', ocean:'transparent', label:'rgba(255,255,255,.15)' }
        : { land:'#e8ded2', border:'rgba(0,0,0,.06)', emphasis:'#ddd0c0', ocean:'transparent', label:'rgba(0,0,0,.22)' };
    }

    // Great-circle-ish arcs from origin to each released city
    const lines = waveData.filter(function(d){ return d.wave<5 && d.name!=='北京'; }).map(function(d){
      return { coords:[origin, d.coord], lineStyle:{ color:waveColor[d.wave] } };
    });

    const scatter = waveData.map(function(d){
      return {
        name:d.name, value:d.coord.concat([d.wave]),
        _meta:d,
        symbolSize: waveSize[d.wave],
        itemStyle:{ color:waveColor[d.wave], borderColor:'#fff', borderWidth:1.5,
          shadowColor:waveColor[d.wave], shadowBlur:10 }
      };
    });

    let chart = echarts.init(el, null, {renderer:'canvas'});

    function buildOption(){
      const p = palette();
      return {
        backgroundColor:'transparent',
        geo:{
          map:'world', roam:true, zoom:1.2, center:[60,25],
          scaleLimit:{min:1,max:8},
          itemStyle:{ areaColor:p.land, borderColor:p.border, borderWidth:0.6 },
          emphasis:{ itemStyle:{ areaColor:p.emphasis }, label:{show:false} },
          select:{ itemStyle:{ areaColor:p.emphasis }, label:{show:false} },
          silent:true
        },
        tooltip:{
          trigger:'item', backgroundColor:'rgba(20,20,20,.92)', borderWidth:0,
          padding:[10,14], textStyle:{color:'#fff',fontSize:12},
          formatter:function(pr){
            const d = pr.data && pr.data._meta; if(!d) return '';
            let h = '<div style="font:600 14px/1.4 serif;margin-bottom:4px">'+d.name
              + '<span style="font-size:11px;opacity:.7;margin-left:6px">'+d.country+'</span></div>';
            h += '<div style="font-size:11px;opacity:.85">📅 '+d.date+' · 第'+d.wave+'波</div>';
            if(d.bo) h += '<div style="font-size:11px;color:#e8a050;margin-top:3px">🎬 '+d.bo+'</div>';
            if(d.audiences) h += '<div style="font-size:11px;opacity:.8;margin-top:2px">👥 '+d.audiences+'</div>';
            if(d.note) h += '<div style="font-size:11px;opacity:.7;margin-top:2px;font-style:italic">'+d.note+'</div>';
            return h;
          }
        },
        series:[
          { type:'lines', coordinateSystem:'geo', geoIndex:0, zlevel:1,
            effect:{ show:true, period:5, trailLength:0.4, symbol:'arrow', symbolSize:5 },
            lineStyle:{ width:1, opacity:0.35, curveness:0.25 }, data:lines },
          { name:'上映城市', type:'effectScatter', coordinateSystem:'geo', geoIndex:0, zlevel:2,
            rippleEffect:{ brushType:'stroke', scale:3 },
            showEffectOn:'render',
            data: scatter.filter(function(s){return s.value[2]===1;}) },
          { name:'城市', type:'scatter', coordinateSystem:'geo', geoIndex:0, zlevel:2,
            data: scatter.filter(function(s){return s.value[2]!==1;}) }
        ]
      };
    }

    chart.setOption(buildOption());

    // Responsive + theme reactive
    const ro = new ResizeObserver(function(){ chart.resize(); });
    ro.observe(el);
    const mo = new MutationObserver(function(){ chart.setOption(buildOption()); });
    mo.observe(document.documentElement, {attributes:true, attributeFilter:['data-theme']});
  }

  /* ===== Film Database (enriched · all films with verified posters) ===== */
  const FILMS = [
    { title:'给阿嬷的情书', year:2026, dialect:'闽南语(潮汕)', bo:19, rating:9.3, tags:['侨批','祖孙情','素人','现象级'], img:'assets/images/posters/IMG_9318.jpg', desc:'以潮汕方言为主要对白，融合侨批记忆与南洋华人迁徙史，从区域点映逆袭至19亿票房的现象级方言电影。全素人出演、95%潮汕话对白，被人民日报称为"一封写给世界的情书"。', director:'蓝鸿春', runtime:'128分钟', awards:'2026五一档冠军 · 豆瓣年度最高分华语剧情片' },
    { title:'繁花', year:2024, dialect:'上海话', bo:0, rating:8.7, tags:['王家卫','沪语','年代剧'], img:'assets/images/posters/IMG_9269.jpg', desc:'王家卫首部电视剧，全程沪语对白，上海九十年代市井烟火。沪语的文化质感成为作品核心魅力，将方言从"沟通工具"升华为"审美对象"。', director:'王家卫', runtime:'30集', awards:'腾讯视频年度剧王 · 38国海外发行' },
    { title:'人生大事', year:2022, dialect:'武汉话', bo:17.1, rating:7.3, tags:['殡葬','市井','亲情','治愈'], img:'assets/images/posters/IMG_9268.jpg', desc:'以武汉方言讲述殡葬师与孤儿的故事，武汉话的直爽与幽默消解了题材的沉重感。商业类型片中方言运用的标杆之作。', director:'刘江江', runtime:'112分钟', awards:'2022暑期档冠军 · 金鸡奖最佳导演处女作' },
    { title:'隐入尘烟', year:2022, dialect:'西北方言(甘肃)', bo:1.1, rating:8.4, tags:['柏林','文艺片','农村','质朴'], img:'assets/images/posters/IMG_9273.jpg', desc:'以甘肃方言呈现西北农村最朴素的生命质感，入围柏林电影节主竞赛单元。"国际电影节→海外口碑→国内二次传播"的迂回路线成为文艺片出海样本。', director:'李睿珺', runtime:'133分钟', awards:'柏林电影节主竞赛 · 亚洲电影大奖最佳影片提名' },
    { title:'爱情神话', year:2021, dialect:'上海话', bo:2.6, rating:8.1, tags:['沪语','都市','轻喜剧'], img:'assets/images/posters/IMG_9274.jpg', desc:'全沪语对白的都市轻喜剧，打破方言叙事"乡土"刻板印象，让吴侬软语与摩登都市完美共生。', director:'邵艺辉', runtime:'120分钟', awards:'金鸡奖最佳编剧 · 华语年度十佳' },
    { title:'雄狮少年', year:2021, dialect:'粤语', bo:2.5, rating:8.3, tags:['动画','醒狮','岭南'], img:'assets/images/posters/雄狮少年1.jpg', desc:'醒狮鼓点撞着地道粤音，让岭南少年的热血与乡土底色愈发醇厚。国产动画方言叙事的里程碑。', director:'孙海鹏', runtime:'104分钟', awards:'金鸡奖最佳美术片 · 法国昂西动画节入围' },
    { title:'山海情', year:2021, dialect:'西北官话(固原)', bo:0, rating:9.3, tags:['扶贫','西海固','正午阳光'], img:'assets/images/posters/山海情.jpg', desc:'以地道固原话演绎扶贫史诗，全民级爆款剧集，译介至海外多国播出。证明方言正剧完全可以走向世界。', director:'孔笙 / 孙墨龙', runtime:'23集', awards:'白玉兰奖最佳电视剧 · 飞天奖优秀电视剧' },
    { title:'无名之辈', year:2018, dialect:'西南官话(贵州)', bo:7.9, rating:8.1, tags:['喜剧','犯罪','小人物'], img:'assets/images/posters/IMG_9281.jpg', desc:'以贵州方言呈现一群"无名之辈"的荒诞一天，证明方言在商业类型片中的巨大潜力。西南官话的喜剧基因与黑色犯罪类型天然耦合。', director:'饶晓志', runtime:'108分钟', awards:'年度黑马 · 票房逆袭典范' },
    { title:'南方车站的聚会', year:2019, dialect:'武汉话', bo:2, rating:7.4, tags:['戛纳','犯罪','黑色电影'], img:'assets/images/posters/IMG_9289.jpg', desc:'刁亦男执导的黑色电影，全程武汉方言。戛纳首映后国际影评界热烈讨论"武汉味"的美学价值。', director:'刁亦男', runtime:'113分钟', awards:'戛纳电影节主竞赛 · 金马奖最佳影片提名' },
    { title:'山河故人', year:2015, dialect:'山西方言(汾阳)', bo:0.3, rating:8.0, tags:['贾樟柯','戛纳','离散'], img:'assets/images/posters/山河故人.jpg', desc:'贾樟柯以山西方言讲述跨越26年的离散故事。方言是"故乡"最具体的声景记忆。', director:'贾樟柯', runtime:'126分钟', awards:'戛纳电影节主竞赛 · 金马奖最佳原著剧本' },
    { title:'秋菊打官司', year:1992, dialect:'陕西方言', bo:0.3, rating:8.5, tags:['威尼斯金狮','张艺谋','现实主义'], img:'assets/images/posters/秋菊打官司.jpg', desc:'硬朗陕音立住西北农村的执拗坦荡，获威尼斯金狮奖，中国现实主义方言电影开山之作。', director:'张艺谋', runtime:'100分钟', awards:'威尼斯电影节金狮奖 · 巩俐获最佳女演员' },
    { title:'童年往事', year:1985, dialect:'客家话', bo:0.01, rating:8.8, tags:['侯孝贤','自传','乡愁'], img:'assets/images/posters/童年往事.jpg', desc:'侯孝贤以客家乡音铺展少年成长与家族变迁，平淡日常里藏着深沉乡愁。台湾新电影运动的经典。', director:'侯孝贤', runtime:'137分钟', awards:'金马奖最佳原著剧本 · 柏林电影节费比西奖' },
    { title:'春江水暖', year:2019, dialect:'杭州话(吴语)', bo:0.02, rating:8.2, tags:['戛纳','艺术片','家族'], img:'assets/images/posters/春江水暖.jpg', desc:'富春山水中，温软乡音娓娓道来家族四季，铺展成一幅江南烟火长卷。', director:'顾晓刚', runtime:'150分钟', awards:'戛纳电影节影评人周闭幕片 · FIRST青年电影展最佳导演' },
    { title:'海角七号', year:2008, dialect:'闽南语(台湾)', bo:1.3, rating:8.1, tags:['台湾','音乐','爱情'], img:'assets/images/posters/海角七号.jpg', desc:'恒春风裹着闽南语的温柔，一封隔世情书道尽海岛的柔软与坚守。开启台湾电影"后海角时代"。', director:'魏德圣', runtime:'129分钟', awards:'金马奖最佳影片 · 台湾影史华语片票房冠军(2008)' },
    { title:'疯狂的石头', year:2006, dialect:'重庆方言', bo:0.25, rating:8.5, tags:['黑色喜剧','宁浩','多方言'], img:'assets/images/posters/IMG_9311.jpg', desc:'爽利重庆话适配黑色喜剧节奏，开启西南官话喜剧的创作热潮。小成本方言片的商业奇迹。', director:'宁浩', runtime:'98分钟', awards:'金马奖最佳原著剧本 · 华语黑色喜剧标杆' },
    { title:'一直游到海水变蓝', year:2020, dialect:'多方言', bo:0.07, rating:7.5, tags:['纪录片','文学','乡土'], img:'assets/images/posters/IMG_9319.jpg', desc:'贾樟柯执导文学纪录片，多地方言呈现贾平凹、余华、梁鸿等作家的口述史。方言在此是文学与土地的桥梁。', director:'贾樟柯', runtime:'112分钟', awards:'柏林电影节特别展映 · 纽约电影节入围' },
    { title:'杨梅洲', year:2012, dialect:'湘语(湘潭)', bo:0.005, rating:7.6, tags:['文艺片','家庭','湖南'], img:'assets/images/posters/杨梅洲.jpg', desc:'湘潭乡音诉说普通家庭的聚散羁绊，在如水日常里藏着湖湘乡土的温润质感。', director:'陈卓', runtime:'98分钟', awards:'FIRST青年电影展最佳导演提名' },
    { title:'麦兜故事', year:2001, dialect:'粤语(香港)', bo:0.15, rating:8.9, tags:['动画','香港','童年'], img:'assets/images/posters/麦兜故事.jpg', desc:'软糯港式粤语讲尽市井细碎温暖，几代人心中最鲜活的香港记忆。方言动画的永恒经典。', director:'袁建滔', runtime:'75分钟', awards:'金马奖最佳动画长片 · 香港电影金像奖' },
  ];

  function initFilmDB(){
    const grid = document.getElementById('filmGrid');
    if (!grid) return;

    let filterDialect = 'all';
    let searchQuery = '';
    let sortBy = 'bo'; // 'bo' | 'rating' | 'year' | 'title'

    function render(){
      let films = FILMS.filter(f => {
        if (filterDialect !== 'all'){
          const map = { minnan: ['闽南'], yue: ['粤'], wu: ['上海','吴语','杭州'], guanhua: ['官话','重庆','武汉','陕西','山西','贵州','西北'], hakka: ['客家'], xiang: ['湘'] };
          if (!(map[filterDialect]?.some(k => f.dialect.includes(k)) ?? false)) return false;
        }
        if (searchQuery){
          const q = searchQuery.toLowerCase();
          const match = [f.title, f.dialect, f.desc, f.director, ...f.tags].some(s => (s||'').toLowerCase().includes(q));
          if (!match) return false;
        }
        return true;
      });

      // Sort
      films.sort((a,b) => {
        if (sortBy === 'bo') return b.bo - a.bo;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'year') return b.year - a.year;
        if (sortBy === 'title') return a.title.localeCompare(b.title, 'zh');
        return 0;
      });

      if (films.length === 0){
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-3)"><span style="font-size:48px;display:block;margin-bottom:12px">🔍</span><p>没有找到匹配的电影</p><p style="font-size:12px;margin-top:4px">试试其他关键词或筛选项</p></div>';
        return;
      }

      grid.innerHTML = films.map(f => `
        <div class="film-card reveal" onclick="openFilmDetail('${f.title}')">
          <div class="film-img">
            ${f.img ? `<img src="${f.img}" alt="${f.title}" loading="lazy" onerror="this.parentElement.innerHTML='<span style=font-size:48px>🎬</span>'">` : '<span style="font-size:48px">🎬</span>'}
            <span class="dialect-tag">${f.dialect}</span>
            ${f.bo > 0 ? `<span class="bo-badge">${f.bo}亿</span>` : ''}
          </div>
          <div class="film-body">
            <h4>${f.title} <span class="film-year">${f.year}</span></h4>
            <div class="film-meta">
              <span>${f.bo > 0 ? '<span class="bo">'+f.bo+'亿</span>' : '电视剧'}</span>
              <span>豆瓣 ${f.rating}</span>
              ${f.director ? '<span class="film-director">'+f.director+'</span>' : ''}
            </div>
            <p class="film-desc">${f.desc}</p>
            <div class="film-tags">${f.tags.map(t=>'<span>'+t+'</span>').join('')}</div>
          </div>
        </div>`).join('');

      // Re-init reveal animations for new cards
      setTimeout(initReveal, 100);
    }

    // Filter buttons
    document.querySelectorAll('.film-filter-btn').forEach(btn => {
      btn.addEventListener('click', function(){
        document.querySelectorAll('.film-filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        filterDialect = this.getAttribute('data-dialect');
        render();
      });
    });

    // Search input
    const searchInput = document.getElementById('filmSearch');
    if (searchInput){
      searchInput.addEventListener('input', function(){
        searchQuery = this.value.trim();
        render();
      });
    }

    // Sort select
    const sortSelect = document.getElementById('filmSort');
    if (sortSelect){
      sortSelect.addEventListener('change', function(){
        sortBy = this.value;
        render();
      });
    }

    render();
  }

  /* ===== Film Detail Modal ===== */
  window.openFilmDetail = function(title){
    const film = FILMS.find(f => f.title === title);
    if (!film) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'film-modal-overlay';
    overlay.onclick = function(e){ if(e.target === this) closeModal(); };

    // Format director/runtime/awards
    const metaRows = [];
    if (film.director) metaRows.push(`<div class="fm-row"><span>导演</span><span>${film.director}</span></div>`);
    if (film.runtime) metaRows.push(`<div class="fm-row"><span>时长</span><span>${film.runtime}</span></div>`);
    metaRows.push(`<div class="fm-row"><span>方言</span><span>${film.dialect}</span></div>`);
    metaRows.push(`<div class="fm-row"><span>年份</span><span>${film.year}</span></div>`);
    if (film.bo > 0) metaRows.push(`<div class="fm-row"><span>票房</span><span class="fm-bo">${film.bo} 亿</span></div>`);
    metaRows.push(`<div class="fm-row"><span>豆瓣</span><span class="fm-rating">${film.rating}</span></div>`);
    if (film.awards) metaRows.push(`<div class="fm-row"><span>荣誉</span><span>${film.awards}</span></div>`);

    overlay.innerHTML = `<div class="film-modal">
      <button class="fm-close" onclick="this.closest('.film-modal-overlay').remove();document.body.style.overflow=''">✕</button>
      <div class="fm-hero">
        <div class="fm-poster">${film.img ? `<img src="${film.img}" alt="${film.title}" onerror="this.parentElement.innerHTML='<span style=font-size:64px>🎬</span>'">` : '<span style="font-size:64px">🎬</span>'}</div>
        <div class="fm-header">
          <h2 class="serif">${film.title}</h2>
          <p class="fm-dialect">${film.dialect}</p>
          <div class="fm-tags">${film.tags.map(t=>'<span>'+t+'</span>').join('')}</div>
        </div>
      </div>
      <div class="fm-body">
        <p class="fm-desc">${film.desc}</p>
        <div class="fm-meta-grid">${metaRows.join('')}</div>
      </div>
    </div>`;

    const closeModal = function(){ overlay.remove(); document.body.style.overflow = ''; };

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => { overlay.classList.add('open'); });

    // Close on Escape
    const escHandler = function(e){ if(e.key === 'Escape'){ closeModal(); document.removeEventListener('keydown', escHandler); }};
    document.addEventListener('keydown', escHandler);
  };

  /* ===== Back to Top ===== */
  function initBackToTop(){
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  }

  /* ===== Hero Slideshow ===== */
  function initHeroSlideshow(){
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dots span');
    if (!slides.length) return;
    let current = 0, timer;
    function goTo(i){
      slides[current].classList.remove('active');
      if (dots.length) dots[current].classList.remove('active');
      current = ((i % slides.length) + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots.length) dots[current].classList.add('active');
    }
    function next(){ goTo(current + 1); }
    timer = setInterval(next, 6000);
    dots.forEach((d,i) => d.addEventListener('click', ()=>{ goTo(i); clearInterval(timer); timer = setInterval(next, 6000); }));
    // Cinematic bars
    setTimeout(() => document.querySelectorAll('.hero-bar').forEach(b => b.classList.add('show')), 400);
    // Parallax
    const inner = document.getElementById('heroInner');
    if (inner && window.matchMedia('(pointer:fine)').matches){
      document.addEventListener('mousemove', e => {
        inner.style.transform = `translate(${(e.clientX/window.innerWidth-.5)*14}px,${(e.clientY/window.innerHeight-.5)*10}px)`;
      }, {passive:true});
    }
    document.addEventListener('visibilitychange', ()=>{
      if (document.hidden) clearInterval(timer);
      else timer = setInterval(next, 6000);
    });
  }

  /* ===== Init ===== */
  function init(){
    document.documentElement.classList.add('js');
    initTheme();
    initNav();
    initHeroSlideshow();
    initPageTransitions();
    initReveal();
    initCounters();
    initCharts();
    initFilmDB();
    initBackToTop();
    if (document.readyState === 'complete') initMap();
    else window.addEventListener('load', initMap);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
