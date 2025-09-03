// 全局变量
let allCases = [];
let filteredCases = [];
let currentPage = 1;
let casesPerPage = 12;
let isLoading = false;
let currentLanguage = 'zh';
let currentTheme = 'dark'; // 默认黑暗主题

// 多语言文本
const translations = {
    zh: {
        'nav.home': '首页',
        'nav.cases': '案例展示',
        'nav.about': '关于',
        'nav.contribute': '贡献',
        'hero.subtitle': '精选的Gemini图像生成案例合集',
        'hero.description': '借助Google的Gemini模型，展示AI图像生成与编辑的先进能力，为您的创意创作提供灵感！',
        'hero.stats.cases': '精选案例',
        'hero.stats.models': 'AI模型对比',
        'hero.stats.contributors': '贡献者',
        'hero.actions.browse': '浏览案例',
        'hero.actions.github': 'GitHub仓库',
        'cases.title': '精选案例',
        'cases.description': '探索各种创意应用场景，从Q版插画到3D渲染，从风格转换到创意合成',
        'filter.category': '分类：',
        'filter.all': '全部案例',
        'filter.3d': '3D渲染',
        'filter.anime': '动漫风格',
        'filter.realistic': '写实风格',
        'filter.creative': '创意合成',
        'filter.sort': '排序：',
        'sort.newest': '最新优先',
        'sort.oldest': '最早优先',
        'sort.popular': '热门优先',
        'search.placeholder': '搜索案例...',
        'load.more': '加载更多'
    },
    en: {
        'nav.home': 'Home',
        'nav.cases': 'Cases',
        'nav.about': 'About',
        'nav.contribute': 'Contribute',
        'hero.subtitle': 'Curated collection of Gemini image generation cases',
        'hero.description': 'Powered by Google\'s Gemini model, showcasing advanced AI image generation and editing capabilities to inspire your creative work!',
        'hero.stats.cases': 'Featured Cases',
        'hero.stats.models': 'AI Model Comparison',
        'hero.stats.contributors': 'Contributors',
        'hero.actions.browse': 'Browse Cases',
        'hero.actions.github': 'GitHub Repo',
        'cases.title': 'Featured Cases',
        'cases.description': 'Explore various creative application scenarios, from Q-version illustrations to 3D rendering, from style conversion to creative synthesis',
        'filter.category': 'Category:',
        'filter.all': 'All Cases',
        'filter.3d': '3D Rendering',
        'filter.anime': 'Anime Style',
        'filter.realistic': 'Realistic Style',
        'filter.creative': 'Creative Synthesis',
        'filter.sort': 'Sort:',
        'sort.newest': 'Newest First',
        'sort.oldest': 'Oldest First',
        'sort.popular': 'Most Popular',
        'search.placeholder': 'Search cases...',
        'load.more': 'Load More'
    },
    ja: {
        'nav.home': 'ホーム',
        'nav.cases': 'ケース',
        'nav.about': '概要',
        'nav.contribute': '貢献',
        'hero.subtitle': 'Gemini画像生成ケースの厳選コレクション',
        'hero.description': 'GoogleのGeminiモデルを活用し、AI画像生成・編集の先進機能を紹介。創造的な作業にインスピレーションを提供！',
        'hero.stats.cases': '注目ケース',
        'hero.stats.models': 'AIモデル比較',
        'hero.stats.contributors': '貢献者',
        'hero.actions.browse': 'ケースを見る',
        'hero.actions.github': 'GitHubリポジトリ',
        'cases.title': '注目ケース',
        'cases.description': 'Q版イラストから3Dレンダリング、スタイル変換から創造的合成まで、様々な創造的応用シナリオを探索',
        'filter.category': 'カテゴリ：',
        'filter.all': '全ケース',
        'filter.3d': '3Dレンダリング',
        'filter.anime': 'アニメスタイル',
        'filter.realistic': 'リアルスタイル',
        'filter.creative': '創造的合成',
        'filter.sort': 'ソート：',
        'sort.newest': '最新順',
        'sort.oldest': '古い順',
        'sort.popular': '人気順',
        'search.placeholder': 'ケースを検索...',
        'load.more': 'もっと読み込む'
    },
    ko: {
        'nav.home': '홈',
        'nav.cases': '케이스',
        'nav.about': '소개',
        'nav.contribute': '기여',
        'hero.subtitle': 'Gemini 이미지 생성 케이스 엄선 컬렉션',
        'hero.description': 'Google의 Gemini 모델을 활용하여 AI 이미지 생성 및 편집의 고급 기능을 보여주며, 창의적인 작업에 영감을 제공합니다!',
        'hero.stats.cases': '주요 케이스',
        'hero.stats.models': 'AI 모델 비교',
        'hero.stats.contributors': '기여자',
        'hero.actions.browse': '케이스 둘러보기',
        'hero.actions.github': 'GitHub 저장소',
        'cases.title': '주요 케이스',
        'cases.description': 'Q버전 일러스트부터 3D 렌더링, 스타일 변환부터 창의적 합성까지 다양한 창의적 응용 시나리오 탐색',
        'filter.category': '카테고리:',
        'filter.all': '모든 케이스',
        'filter.3d': '3D 렌더링',
        'filter.anime': '애니메 스타일',
        'filter.realistic': '사실적 스타일',
        'filter.creative': '창의적 합성',
        'filter.sort': '정렬:',
        'sort.newest': '최신순',
        'sort.oldest': '오래된순',
        'sort.popular': '인기순',
        'search.placeholder': '케이스 검색...',
        'load.more': '더 보기'
    }
};

// DOM 元素
const casesGrid = document.getElementById('cases-grid');
const loadMoreBtn = document.getElementById('load-more-btn');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');
const caseCount = document.getElementById('case-count');

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // 初始化主题
    initTheme();

    // 初始化语言
    initLanguage();

    // 加载案例数据
    loadCases();

    // 设置事件监听器
    setupEventListeners();

    // 设置导航
    setupNavigation();

    // 设置滚动监听
    setupScrollToTop();

    // 更新统计数据
    updateStats();
}

// 加载案例数据
async function loadCases() {
    try {
        // 首先尝试加载预生成的JSON数据
        const response = await fetch('./cases-data.json');
        if (response.ok) {
            allCases = await response.json();
        } else {
            // 如果JSON不存在，使用模拟数据
            allCases = await generateMockCases();
        }

        filteredCases = [...allCases];

        // 渲染案例
        renderCases();

        // 更新统计数据
        updateStats();

    } catch (error) {
        console.error('加载案例数据失败:', error);
        showError('无法加载案例数据，请稍后重试');
    }
}

// 生成模拟案例数据（实际部署时会动态读取cases目录）
async function generateMockCases() {
    const cases = [];
    // 这里应该动态读取cases目录下的所有yml文件
    // 暂时使用模拟数据

    // 尝试读取一些真实的案例数据
    for (let i = 1; i <= 20; i++) {
        try {
            const caseData = await loadCaseData(i);
            if (caseData) {
                cases.push({
                    id: i,
                    ...caseData,
                    category: getCategoryFromTitle(caseData.title || caseData.title_en),
                    tags: generateTags(caseData.title || caseData.title_en)
                });
            }
        } catch (error) {
            // 跳过不存在的案例
            continue;
        }
    }

    return cases;
}

// 加载单个案例数据
async function loadCaseData(caseId) {
    try {
        const response = await fetch(`./cases/${caseId}/case.yml`);
        if (!response.ok) {
            return null;
        }

        const yamlText = await response.text();

        // 简单的YAML解析（实际项目中应该使用专门的YAML解析库）
        return parseYaml(yamlText);
    } catch (error) {
        console.error(`加载案例 ${caseId} 失败:`, error);
        return null;
    }
}

// 简单的YAML解析器（简化版）
function parseYaml(yamlText) {
    const lines = yamlText.split('\n');
    const data = {};
    let currentKey = '';
    let currentValue = '';
    let inMultiline = false;

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith('#')) continue;

        if (trimmed.includes(':') && !inMultiline) {
            // 保存之前的键值对
            if (currentKey) {
                data[currentKey] = currentValue.trim();
            }

            const colonIndex = line.indexOf(':');
            currentKey = line.substring(0, colonIndex).trim();
            currentValue = line.substring(colonIndex + 1).trim();

            // 检查是否是多行文本
            if (currentValue.startsWith('|')) {
                inMultiline = true;
                currentValue = '';
            }
        } else if (inMultiline) {
            if (trimmed === '') {
                // 空行结束多行文本
                inMultiline = false;
                data[currentKey] = currentValue.trim();
                currentKey = '';
                currentValue = '';
            } else {
                currentValue += line + '\n';
            }
        } else if (currentKey) {
            currentValue += ' ' + trimmed;
        }
    }

    // 保存最后一个键值对
    if (currentKey) {
        data[currentKey] = currentValue.trim();
    }

    return data;
}

// 根据标题确定分类
function getCategoryFromTitle(title) {
    if (!title) return 'other';

    const titleLower = title.toLowerCase();

    if (titleLower.includes('3d') || titleLower.includes('立体') || titleLower.includes('模型')) {
        return '3d';
    } else if (titleLower.includes('动漫') || titleLower.includes('anime') || titleLower.includes('q版') || titleLower.includes('chibi')) {
        return 'anime';
    } else if (titleLower.includes('写实') || titleLower.includes('realistic') || titleLower.includes('photo')) {
        return 'realistic';
    } else if (titleLower.includes('创意') || titleLower.includes('合成') || titleLower.includes('creative')) {
        return 'creative';
    }

    return 'other';
}

// 生成标签
function generateTags(title) {
    if (!title) return [];

    const tags = [];
    const titleLower = title.toLowerCase();

    if (titleLower.includes('3d') || titleLower.includes('立体')) tags.push('3D');
    if (titleLower.includes('动漫') || titleLower.includes('anime')) tags.push('动漫');
    if (titleLower.includes('q版') || titleLower.includes('chibi')) tags.push('Q版');
    if (titleLower.includes('写实')) tags.push('写实');
    if (titleLower.includes('创意')) tags.push('创意');
    if (titleLower.includes('风格')) tags.push('风格转换');
    if (titleLower.includes('合成')) tags.push('图像合成');

    return tags;
}

// 渲染案例
function renderCases() {
    const startIndex = 0;
    const endIndex = currentPage * casesPerPage;
    const casesToShow = filteredCases.slice(startIndex, endIndex);

    if (startIndex === 0) {
        casesGrid.innerHTML = '';
    }

    casesToShow.forEach((caseData, index) => {
        const caseCard = createCaseCard(caseData);
        caseCard.style.animationDelay = `${index * 0.1}s`;
        casesGrid.appendChild(caseCard);
    });

    // 更新加载更多按钮
    updateLoadMoreButton();
}

// 创建案例卡片
function createCaseCard(caseData) {
    const card = document.createElement('div');
    card.className = 'case-card';
    card.innerHTML = `
        <img src="./cases/${caseData.id}/${caseData.image}" alt="${caseData.alt_text || caseData.alt_text_en || caseData.title}" class="case-image" loading="lazy">
        <div class="case-content">
            <h3 class="case-title">
                <span class="case-number">#${caseData.id}</span>
                ${caseData.title || caseData.title_en}
            </h3>
            <div class="case-author">
                <i class="fas fa-user"></i>
                ${caseData.author || '未知作者'}
            </div>
            <div class="case-tags">
                ${caseData.tags.map(tag => `<span class="case-tag">${tag}</span>`).join('')}
            </div>
            <div class="case-actions">
                <button class="case-action" onclick="viewCase(${caseData.id})">
                    <i class="fas fa-eye"></i>
                    查看详情
                </button>
                <a href="${caseData.source_links ? caseData.source_links[0].url : '#'}" target="_blank" class="case-action">
                    <i class="fas fa-external-link-alt"></i>
                    原文
                </a>
            </div>
        </div>
    `;

    return card;
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    searchInput.addEventListener('input', debounce(handleSearch, 300));

    // 分类过滤
    categoryFilter.addEventListener('change', handleFilter);

    // 排序
    sortFilter.addEventListener('change', handleSort);

    // 加载更多
    loadMoreBtn.addEventListener('click', loadMoreCases);

    // 主题切换
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // 语言切换
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', changeLanguage);
    }

    // 导航切换（移动端）
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

// 处理搜索
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    currentPage = 1;

    if (query) {
        filteredCases = allCases.filter(caseData =>
            (caseData.title && caseData.title.toLowerCase().includes(query)) ||
            (caseData.title_en && caseData.title_en.toLowerCase().includes(query)) ||
            (caseData.prompt && caseData.prompt.toLowerCase().includes(query)) ||
            (caseData.author && caseData.author.toLowerCase().includes(query)) ||
            (caseData.tags && caseData.tags.some(tag => tag.toLowerCase().includes(query)))
        );
    } else {
        filteredCases = [...allCases];
    }

    applyCurrentFilters();
    renderCases();
}

// 处理分类过滤
function handleFilter() {
    const category = categoryFilter.value;
    currentPage = 1;

    if (category === 'all') {
        filteredCases = [...allCases];
    } else {
        filteredCases = allCases.filter(caseData => caseData.category === category);
    }

    renderCases();
}

// 处理排序
function handleSort() {
    const sortBy = sortFilter.value;
    currentPage = 1;

    filteredCases.sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return b.id - a.id;
            case 'oldest':
                return a.id - b.id;
            case 'popular':
                // 这里可以根据点赞数或其他指标排序
                return Math.random() - 0.5; // 暂时随机
            default:
                return 0;
        }
    });

    renderCases();
}

// 应用当前过滤器
function applyCurrentFilters() {
    const category = categoryFilter.value;

    if (category !== 'all') {
        filteredCases = filteredCases.filter(caseData => caseData.category === category);
    }
}

// 加载更多案例
function loadMoreCases() {
    if (isLoading) return;

    currentPage++;
    renderCases();
}

// 更新加载更多按钮
function updateLoadMoreButton() {
    const totalCases = filteredCases.length;
    const shownCases = currentPage * casesPerPage;

    if (shownCases >= totalCases) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
        loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> 加载更多';
    }
}

// 查看案例详情
function viewCase(caseId) {
    const caseData = allCases.find(c => c.id === caseId);
    if (!caseData) return;

    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <div class="modal-body">
                <img src="./cases/${caseData.id}/${caseData.image}" alt="${caseData.alt_text || caseData.alt_text_en}" class="modal-image">
                <h2 class="modal-title">${caseData.title || caseData.title_en}</h2>

                <div class="modal-meta">
                    <div class="modal-meta-item">
                        <i class="fas fa-user"></i>
                        ${caseData.author || '未知作者'}
                    </div>
                    <div class="modal-meta-item">
                        <i class="fas fa-hashtag"></i>
                        案例 #${caseData.id}
                    </div>
                    ${caseData.source_links ? `
                        <div class="modal-meta-item">
                            <i class="fas fa-link"></i>
                            <a href="${caseData.source_links[0].url}" target="_blank">查看原文</a>
                        </div>
                    ` : ''}
                </div>

                ${caseData.prompt ? `
                    <div class="modal-prompt">
                        <strong>提示词：</strong><br>
                        ${caseData.prompt}
                    </div>
                ` : ''}

                ${caseData.prompt_en ? `
                    <div class="modal-prompt">
                        <strong>Prompt:</strong><br>
                        ${caseData.prompt_en}
                    </div>
                ` : ''}

                <div class="case-tags">
                    ${caseData.tags.map(tag => `<span class="case-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// 关闭模态框
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// 设置导航
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // 更新活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// 设置滚动到顶部按钮
function setupScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.onclick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
}

// 更新统计数据
function updateStats() {
    caseCount.textContent = allCases.length;
}

// 显示错误信息
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div style="
            background: #fee2e2;
            color: #dc2626;
            padding: 1rem;
            border-radius: 8px;
            margin: 2rem 0;
            text-align: center;
        ">
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
        </div>
    `;

    casesGrid.innerHTML = '';
    casesGrid.appendChild(errorDiv);
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 主题切换功能
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
    }
    applyTheme();
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme();
}

function applyTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('#theme-toggle i');
    
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
        if (themeIcon) {
            themeIcon.className = 'fas fa-moon';
        }
    } else {
        body.classList.remove('light-theme');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
    }
}

// 语言切换功能
function initLanguage() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    }
    
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    
    updateLanguage();
}

function changeLanguage(event) {
    const newLanguage = event.target.value;
    if (translations[newLanguage]) {
        currentLanguage = newLanguage;
        localStorage.setItem('language', currentLanguage);
        updateLanguage();
    }
}

function updateLanguage() {
    // 更新页面语言属性
    document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : currentLanguage;
    
    // 更新所有带有 data-i18n 属性的元素
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // 更新搜索框占位符
    const searchInput = document.getElementById('search-input');
    if (searchInput && translations[currentLanguage]['search.placeholder']) {
        searchInput.placeholder = translations[currentLanguage]['search.placeholder'];
    }
    
    // 更新选择框选项
    updateSelectOptions();
}

function updateSelectOptions() {
    // 更新分类过滤器选项
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        const options = categoryFilter.querySelectorAll('option');
        options.forEach(option => {
            const value = option.value;
            let key;
            switch (value) {
                case 'all': key = 'filter.all'; break;
                case '3d': key = 'filter.3d'; break;
                case 'anime': key = 'filter.anime'; break;
                case 'realistic': key = 'filter.realistic'; break;
                case 'creative': key = 'filter.creative'; break;
            }
            if (key && translations[currentLanguage][key]) {
                option.textContent = translations[currentLanguage][key];
            }
        });
    }
    
    // 更新排序过滤器选项
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
        const options = sortFilter.querySelectorAll('option');
        options.forEach(option => {
            const value = option.value;
            let key;
            switch (value) {
                case 'newest': key = 'sort.newest'; break;
                case 'oldest': key = 'sort.oldest'; break;
                case 'popular': key = 'sort.popular'; break;
            }
            if (key && translations[currentLanguage][key]) {
                option.textContent = translations[currentLanguage][key];
            }
        });
    }
    
    // 更新加载更多按钮
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn && translations[currentLanguage]['load.more']) {
        const span = loadMoreBtn.querySelector('span') || loadMoreBtn;
        const textNode = Array.from(span.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        if (textNode) {
            textNode.textContent = translations[currentLanguage]['load.more'];
        }
    }
}

// 页面加载完成后初始化
window.addEventListener('load', () => {
    // 延迟加载图片
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});
