// 笑話庫
const jokes = [
    "老闆叫我打開 Excel，於是我打開了 C 槽，然後跟他 C-ya-later。",
    "為什麼工程師討厭大自然？因為 bug 太多了。",
    "我的薪水就像月經，一個月來一次，一個禮拜就沒了。",
    "老闆對我說：『你做事要有頭有尾！』於是我第一天上班就直接等下班。",
    "公司是我家，維持靠大家。所以我從來不打掃，因為我家很亂。",
    "老闆的畫的大餅，總是看得到吃不到，所以我決定自己帶便當。",
    "上班打卡制，下班責任制，原來這就是『公私分明』。",
    "我問 Siri：『最近的工作運如何？』Siri 開始播放『悲慘世界』。",
    "只要我上班夠頹廢，老闆就不知道我擅長什麼。",
    "老闆說要給我一個舞台，上班後我才發現，是叫我每天做戲。",
    "我每天的運動量，就是一邊聽老闆畫大餅，一邊點頭。",
    "老闆說他不會虧待我，我想想也是，畢竟我身上也沒什麼值得他虧的了。",
    "客戶虐我千百遍，我待客戶如初戀。畢竟，初戀也沒什麼好下場。",
    "上班是會呼吸的痛，它活在我身上所有角落。",
    "只要我裝死，工作的困難就追不上我。",
    "我對工作的熱情，大概只維持到領薪水那天。",
    "錢沒給到位，心裡全是怨。錢給到位了，老闆就是我的再生父母。",
    "我上班摸魚，老闆裝瞎，我們都有光明的未來。",
    "什麼是團隊精神？就是開會的時候，大家一起把責任推給那個沒來的人。",
    "每天叫醒我的不是夢想，是『貧窮』和『帳單』。"
];

// DOM 元素
const settingView = document.getElementById('setting-view');
const countdownView = document.getElementById('countdown-view');
const targetInput = document.getElementById('target-input');
const startBtn = document.getElementById('start-btn');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');
const thoughtInput = document.getElementById('thought-input');
const submitThoughtBtn = document.getElementById('submit-thought-btn');
const resetBtn = document.getElementById('reset-btn');
const thoughtsListContainer = document.getElementById('thoughts-list-container');
const jokeModal = document.getElementById('joke-modal');
const jokeText = document.getElementById('joke-text');
const continueBtn = document.getElementById('continue-btn');
const celebrationModal = document.getElementById('celebration-modal');
const restartBtn = document.getElementById('restart-btn');
const reviewModal = document.getElementById('review-modal');
const reviewBtn = document.getElementById('review-btn');
const reviewThoughtsContainer = document.getElementById('review-thoughts-container');
const backToCelebrationBtn = document.getElementById('back-to-celebration-btn');
const exportTxtBtn = document.getElementById('export-txt-btn');

// 應用程式狀態
let targetCount = 0;
let currentCount = 0;
let thoughtsList = [];

// 初始化應用程式
function initApp() {
    // 檢查 localStorage 中的 targetCount
    const savedTargetCount = localStorage.getItem('targetCount');
    
    if (savedTargetCount === null) {
        // 如果 targetCount 為 null，顯示設定畫面
        showSettingView();
    } else {
        // 如果 targetCount 存在，載入資料並顯示倒數畫面
        loadDataFromStorage();
        showCountdownView();
    }
}

// 顯示設定畫面
function showSettingView() {
    settingView.classList.remove('hidden');
    countdownView.classList.add('hidden');
}

// 顯示倒數畫面
function showCountdownView() {
    settingView.classList.add('hidden');
    countdownView.classList.remove('hidden');
    updateProgress();
    renderThoughtsList();
}

// 從 localStorage 載入資料
function loadDataFromStorage() {
    targetCount = parseInt(localStorage.getItem('targetCount')) || 0;
    currentCount = parseInt(localStorage.getItem('currentCount')) || 0;
    
    const savedThoughts = localStorage.getItem('thoughtsList');
    if (savedThoughts) {
        thoughtsList = JSON.parse(savedThoughts);
    } else {
        thoughtsList = [];
    }
}

// 儲存資料到 localStorage
function saveDataToStorage() {
    localStorage.setItem('targetCount', targetCount.toString());
    localStorage.setItem('currentCount', currentCount.toString());
    localStorage.setItem('thoughtsList', JSON.stringify(thoughtsList));
}

// 清空 localStorage
function clearStorage() {
    localStorage.removeItem('targetCount');
    localStorage.removeItem('currentCount');
    localStorage.removeItem('thoughtsList');
}

// 更新進度顯示
function updateProgress() {
    const percentage = targetCount > 0 ? (currentCount / targetCount) * 100 : 0;
    
    progressText.textContent = `進度: ${currentCount} / ${targetCount}`;
    progressFill.style.width = `${percentage}%`;
}

// 渲染念頭列表
function renderThoughtsList() {
    thoughtsListContainer.innerHTML = '';
    
    thoughtsList.forEach((thought, index) => {
        const thoughtItem = document.createElement('li');
        thoughtItem.className = 'thought-item';
        
        const thoughtHeader = document.createElement('div');
        thoughtHeader.className = 'thought-header';
        thoughtHeader.textContent = `第 ${index + 1} 次離職念頭 (${thought.timestamp})`;
        
        const thoughtContent = document.createElement('div');
        thoughtContent.className = 'thought-content';
        thoughtContent.textContent = thought.content;
        
        thoughtItem.appendChild(thoughtHeader);
        thoughtItem.appendChild(thoughtContent);
        thoughtsListContainer.appendChild(thoughtItem);
    });
}

// 隨機選擇笑話
function getRandomJoke() {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    return jokes[randomIndex];
}

// 顯示笑話彈出視窗
function showJokeModal() {
    jokeText.textContent = getRandomJoke();
    jokeModal.classList.remove('hidden');
}

// 隱藏笑話彈出視窗
function hideJokeModal() {
    jokeModal.classList.add('hidden');
}

// 顯示慶祝彈出視窗
function showCelebrationModal() {
    celebrationModal.classList.remove('hidden');
}

// 隱藏慶祝彈出視窗
function hideCelebrationModal() {
    celebrationModal.classList.add('hidden');
}

// 顯示回顧彈出視窗
function showReviewModal() {
    renderReviewThoughts();
    reviewModal.classList.remove('hidden');
}

// 隱藏回顧彈出視窗
function hideReviewModal() {
    reviewModal.classList.add('hidden');
}

// 渲染回顧念頭列表
function renderReviewThoughts() {
    reviewThoughtsContainer.innerHTML = '';
    
    if (thoughtsList.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'review-thought-item';
        emptyMessage.innerHTML = '<div class="review-thought-content" style="text-align: center; color: #999;">沒有記錄任何離職念頭</div>';
        reviewThoughtsContainer.appendChild(emptyMessage);
        return;
    }
    
    thoughtsList.forEach((thought, index) => {
        const thoughtItem = document.createElement('div');
        thoughtItem.className = 'review-thought-item';
        
        const thoughtHeader = document.createElement('div');
        thoughtHeader.className = 'review-thought-header';
        thoughtHeader.textContent = `第 ${index + 1} 次離職念頭 (${thought.timestamp})`;
        
        const thoughtContent = document.createElement('div');
        thoughtContent.className = 'review-thought-content';
        thoughtContent.textContent = thought.content;
        
        thoughtItem.appendChild(thoughtHeader);
        thoughtItem.appendChild(thoughtContent);
        reviewThoughtsContainer.appendChild(thoughtItem);
    });
}

// 輸出文字檔
function exportToTxt() {
    if (thoughtsList.length === 0) {
        alert('沒有離職念頭可以輸出！');
        return;
    }
    
    // 建立文字內容
    let txtContent = '離職倒數計時器 - 離職念頭回顧\n';
    txtContent += '='.repeat(50) + '\n\n';
    txtContent += `目標次數: ${targetCount}\n`;
    txtContent += `實際次數: ${currentCount}\n`;
    txtContent += `完成日期: ${new Date().toLocaleString('zh-TW')}\n\n`;
    txtContent += '離職念頭記錄:\n';
    txtContent += '-'.repeat(30) + '\n\n';
    
    thoughtsList.forEach((thought, index) => {
        txtContent += `第 ${index + 1} 次離職念頭 (${thought.timestamp})\n`;
        txtContent += thought.content + '\n\n';
    });
    
    txtContent += '\n' + '='.repeat(50) + '\n';
    txtContent += '感謝使用離職倒數計時器！\n';
    txtContent += '希望這些記錄能幫助你做出更好的決定。';
    
    // 建立並下載檔案
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `離職念頭回顧_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


// 事件監聽器
startBtn.addEventListener('click', () => {
    const inputValue = parseInt(targetInput.value);
    
    if (isNaN(inputValue) || inputValue < 1) {
        alert('請輸入大於等於 1 的數字！');
        return;
    }
    
    targetCount = inputValue;
    currentCount = 0;
    thoughtsList = [];
    
    saveDataToStorage();
    showCountdownView();
});

submitThoughtBtn.addEventListener('click', () => {
    const thoughtContent = thoughtInput.value.trim();
    
    if (thoughtContent === '') {
        alert('請輸入你的離職念頭！');
        return;
    }
    
    // 增加計數
    currentCount++;
    
    // 記錄念頭
    const now = new Date();
    const timestamp = now.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    thoughtsList.push({
        content: thoughtContent,
        timestamp: timestamp
    });
    
    // 更新顯示
    updateProgress();
    renderThoughtsList();
    
    // 清空輸入框
    thoughtInput.value = '';
    
    // 儲存資料
    saveDataToStorage();
    
    // 檢查是否達成目標
    if (currentCount >= targetCount) {
        // 如果達成目標，直接顯示慶祝彈出視窗，不顯示笑話
        showCelebrationModal();
    } else {
        // 如果還沒達成目標，顯示笑話
        showJokeModal();
    }
});

resetBtn.addEventListener('click', () => {
    if (confirm('確定要重設目標嗎？這將清空所有資料！')) {
        clearStorage();
        showSettingView();
    }
});

continueBtn.addEventListener('click', () => {
    hideJokeModal();
});

restartBtn.addEventListener('click', () => {
    clearStorage();
    hideCelebrationModal();
    showSettingView();
});

reviewBtn.addEventListener('click', () => {
    hideCelebrationModal();
    showReviewModal();
});

backToCelebrationBtn.addEventListener('click', () => {
    hideReviewModal();
    showCelebrationModal();
});

exportTxtBtn.addEventListener('click', () => {
    exportToTxt();
});

// 頁面載入時初始化應用程式
document.addEventListener('DOMContentLoaded', initApp);
