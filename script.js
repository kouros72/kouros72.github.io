// 1. 도시 좌표 정보 (서울, 제주)
const CITIES = {
  seoul: {
    name: '서울',
    lat: 37.5665,
    lon: 126.9780
  },
  jeju: {
    name: '제주',
    lat: 33.4996,
    lon: 126.5312
  }
};

// 2. WMO 날씨 코드 매핑 (아이콘 및 한국어 설명)
function getWeatherInfo(code) {
  const weatherMap = {
    0: { desc: '맑음', icon: '☀️' },
    1: { desc: '대체로 맑음', icon: '🌤️' },
    2: { desc: '구름 조금', icon: '⛅' },
    3: { desc: '흐림', icon: '☁️' },
    45: { desc: '안개', icon: '🌫️' },
    48: { desc: '짙은 안개', icon: '🌫️' },
    51: { desc: '약한 이슬비', icon: '🌦️' },
    53: { desc: '이슬비', icon: '🌦️' },
    55: { desc: '강한 이슬비', icon: '🌧️' },
    56: { desc: '진눈깨비성 이슬비', icon: '🌨️' },
    57: { desc: '강한 진눈깨비 이슬비', icon: '🌨️' },
    61: { desc: '약한 비', icon: '🌦️' },
    63: { desc: '비', icon: '🌧️' },
    65: { desc: '강한 비', icon: '🌧️' },
    66: { desc: '어는 비', icon: '🌨️' },
    67: { desc: '강한 어는 비', icon: '🌨️' },
    71: { desc: '약한 눈', icon: '🌨️' },
    73: { desc: '눈', icon: '❄️' },
    75: { desc: '강한 눈', icon: '❄️' },
    77: { desc: '싸락눈', icon: '❄️' },
    80: { desc: '소나기', icon: '🌦️' },
    81: { desc: '강한 소나기', icon: '🌧️' },
    82: { desc: '폭우', icon: '⛈️' },
    85: { desc: '약한 눈보라', icon: '🌨️' },
    86: { desc: '강한 눈보라', icon: '❄️' },
    95: { desc: '뇌우', icon: '⛈️' },
    96: { desc: '우박을 동반한 뇌우', icon: '⛈️' },
    99: { desc: '강한 우박 뇌우', icon: '⛈️' }
  };

  return weatherMap[code] || { desc: '기상 정보', icon: '🌤️' };
}

// 3. 명언 목록
const QUOTES = [
  {
    text: '천리 길도 한 걸음부터 시작된다.',
    author: '노자'
  },
  {
    text: '성공은 최종적인 것이 아니며, 실패는 치명적인 것이 아니다. 중요한 것은 계속 나아가는 용기다.',
    author: '윈스턴 처칠'
  },
  {
    text: '오늘 할 수 있는 일을 내일로 미루지 마라.',
    author: '벤자민 프랭클린'
  },
  {
    text: '우리가 반복적으로 하는 것이 곧 우리 자신이다. 그러므로 탁월함은 행동이 아니라 습관이다.',
    author: '아리스토텔레스'
  },
  {
    text: '가장 큰 영광은 한 번도 실패하지 않음이 아니라, 쓰러질 때마다 다시 일어서는 데 있다.',
    author: '공자'
  },
  {
    text: '미래를 예측하는 가장 좋은 방법은 미래를 창조하는 것이다.',
    author: '피터 드러커'
  },
  {
    text: '단순함이 궁극의 정교함이다.',
    author: '레오나르도 다빈치'
  },
  {
    text: '꿈을 계속 간직하고 있으면 반드시 실현할 때가 온다.',
    author: '요한 볼프강 폰 괴테'
  },
  {
    text: '어제와 똑같이 살면서 다른 미래를 기대하는 것은 정신병 초기 증세이다.',
    author: '알베르트 아인슈타인'
  },
  {
    text: '배움에는 끝이 없다. 삶이 있는 한 배움도 계속된다.',
    author: '세네카'
  }
];

let currentQuoteIndex = 0;

// 4. 현재 날짜 및 시간 표시
function updateDateTime() {
  const now = new Date();
  const dateEl = document.getElementById('currentDate');
  const timeEl = document.getElementById('currentTime');

  const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });

  const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  if (dateEl) dateEl.textContent = dateFormatter.format(now);
  if (timeEl) timeEl.textContent = timeFormatter.format(now);
}

// 5. 날씨 데이터 가져오기 (Open-Meteo 무료 API 사용)
async function fetchCityWeather(cityKey, cityData) {
  const descEl = document.getElementById(`${cityKey}-desc`);
  const iconEl = document.getElementById(`${cityKey}-icon`);
  const tempEl = document.getElementById(`${cityKey}-temp`);
  const minmaxEl = document.getElementById(`${cityKey}-minmax`);
  const detailEl = document.getElementById(`${cityKey}-detail`);

  try {
    if (descEl) descEl.textContent = '날씨 불러오는 중...';

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityData.lat}&longitude=${cityData.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FSeoul&wind_speed_unit=ms`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('날씨 API 응답 오류');
    }

    const data = await response.json();
    const current = data.current;
    const daily = data.daily;

    const temp = Math.round(current.temperature_2m);
    const humidity = current.relative_humidity_2m;
    const windSpeed = current.wind_speed_10m.toFixed(1);
    const maxTemp = Math.round(daily.temperature_2m_max[0]);
    const minTemp = Math.round(daily.temperature_2m_min[0]);
    const weatherInfo = getWeatherInfo(current.weather_code);

    if (descEl) descEl.textContent = weatherInfo.desc;
    if (iconEl) iconEl.textContent = weatherInfo.icon;
    if (tempEl) tempEl.textContent = `${temp}°`;
    if (minmaxEl) minmaxEl.textContent = `최고 ${maxTemp}° / 최저 ${minTemp}°`;
    if (detailEl) detailEl.textContent = `습도 ${humidity}% · 바람 ${windSpeed}m/s`;
  } catch (error) {
    console.error(`${cityData.name} 날씨 조회 실패:`, error);
    if (descEl) descEl.textContent = '날씨 정보를 불러올 수 없습니다';
    if (iconEl) iconEl.textContent = '⚠️';
  }
}

function loadAllWeather() {
  Object.entries(CITIES).forEach(([key, cityData]) => {
    fetchCityWeather(key, cityData);
  });
}

// 6. 명언 표시 및 전환
function showQuote(index) {
  const quoteTextEl = document.getElementById('quoteText');
  const quoteAuthorEl = document.getElementById('quoteAuthor');
  const quote = QUOTES[index];

  if (!quoteTextEl || !quoteAuthorEl) return;

  quoteTextEl.style.opacity = '0';
  quoteAuthorEl.style.opacity = '0';

  setTimeout(() => {
    quoteTextEl.textContent = `"${quote.text}"`;
    quoteAuthorEl.textContent = `— ${quote.author}`;
    quoteTextEl.style.opacity = '1';
    quoteAuthorEl.style.opacity = '1';
  }, 180);
}

function showRandomQuote() {
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * QUOTES.length);
  } while (nextIndex === currentQuoteIndex && QUOTES.length > 1);

  currentQuoteIndex = nextIndex;
  showQuote(currentQuoteIndex);
}

// 7. 검색창 및 다크 모드 이벤트 초기화
function initEvents() {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearBtn');
  const searchForm = document.getElementById('searchForm');
  const luckyBtn = document.getElementById('luckyBtn');
  const refreshWeatherBtn = document.getElementById('refreshWeatherBtn');
  const newQuoteBtn = document.getElementById('newQuoteBtn');
  const themeToggle = document.getElementById('themeToggle');

  // 검색어 입력 시 지우기(X) 버튼 토글
  if (searchInput && clearBtn) {
    searchInput.addEventListener('input', () => {
      clearBtn.hidden = searchInput.value.trim().length === 0;
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.hidden = true;
      searchInput.focus();
    });
  }

  // 검색 폼 제출 처리 (URL 형태면 바로 이동, 아니면 구글 검색)
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      const query = searchInput.value.trim();
      if (!query) {
        e.preventDefault();
        searchInput.focus();
        return;
      }

      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
      if (urlPattern.test(query) && !query.includes(' ')) {
        e.preventDefault();
        const targetUrl = query.startsWith('http://') || query.startsWith('https://')
          ? query
          : `https://${query}`;
        window.location.href = targetUrl;
      }
    });
  }

  // I'm Feeling Lucky 버튼 동작
  if (luckyBtn && searchInput) {
    luckyBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=1`;
      } else {
        window.location.href = 'https://doodles.google/';
      }
    });
  }

  // 날씨 새로고침 버튼
  if (refreshWeatherBtn) {
    refreshWeatherBtn.addEventListener('click', loadAllWeather);
  }

  // 다른 명언 보기 버튼
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener('click', showRandomQuote);
  }

  // 다크 모드 토글 및 로컬 스토리지 저장
  const savedTheme = localStorage.getItem('google-home-theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('google-home-theme', isDark ? 'dark' : 'light');
    });
  }
}

// 초기 실행
document.addEventListener('DOMContentLoaded', () => {
  updateDateTime();
  setInterval(updateDateTime, 1000 * 30);

  // 오늘 날짜 기반으로 초기 명언 선택
  const todayIndex = new Date().getDate() % QUOTES.length;
  currentQuoteIndex = todayIndex;
  showQuote(currentQuoteIndex);

  loadAllWeather();
  initEvents();
});
