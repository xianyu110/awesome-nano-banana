// 全局变量
let allCases = [];
let filteredCases = [];
let currentPage = 1;
let casesPerPage = 12;
let isLoading = false;

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
