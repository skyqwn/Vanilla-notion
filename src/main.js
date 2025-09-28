// =============================================================
// Mini Notion
// -------------------------------------------------------------
// ✅ 구성: [상태/스토리지] → [테마] → [영속화] → [사이드바 폭/반응형] → [트리 렌더] →
// [드롭다운/인라인 이름변경] → [드래그앤드롭] → [라우팅] → [에디터/툴바]
// [이모지] → [즐겨찾기/새 하위] → [루트 추가] → [휴지통] → [즐겨찾기 모달]
// [퀵서치] → [설정/테마/내보내기/가져오기] → [컨펌 모달] → [단축키] → [init]
// =============================================================

// =====================
// Storage / State
// =====================
// - 앱의 모든 데이터는 메모리 state에 올라가며, 주요 변경 시 localStorage에 저장됩니다.
// - 문서 트리는 parentId + order 로 계층/정렬이 유지됩니다.
const STORAGE_KEY = "js-notion";

const defaultDocs = [
  {
    id: "welcome",
    title: "Welcome",
    icon: "📄",
    parentId: null,
    content: "<p>첫 문서: 좌측 트리에서 추가/삭제/정렬을 연습하세요.</p>",
    starred: false,
    order: 0,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: "guides",
    title: "Guides",
    icon: "",
    parentId: null,
    content:
      "<h2>Guide Index</h2><ul><li>Project Setup</li><li>Performance</li></ul>",
    starred: true,
    order: 1,
    createdAt: Date.now() - 84000000,
    updatedAt: Date.now() - 4200000,
  },
  {
    id: "setup",
    title: "Project Setup",
    icon: "🧰",
    parentId: "guides",
    content:
      "<h1>Setup</h1><p>npm, bundler, dev server… (이 예제는 Vanilla JS!)</p>",
    starred: false,
    order: 0,
    createdAt: Date.now() - 82000000,
    updatedAt: Date.now() - 4000000,
  },
  {
    id: "perf",
    title: "Performance",
    icon: "",
    parentId: "guides",
    content: "<p>CRP, LCP/FCP, 이미지/폰트 최적화 아이디어</p>",
    starred: false,
    order: 1,
    createdAt: Date.now() - 80000000,
    updatedAt: Date.now() - 3800000,
  },
];

const state = {
  docs: [], // 전체 문서(트리)
  trash: [], // 휴지통으로 이동한 문서들
  expanded: {}, // { [docId]: true } 펼침 상태 캐시
  activeId: null, // 현재 열려 있는 문서 id
  isMobile: matchMedia("(max-width:768px)").matches, // 반응형 플래그
};

function load() {
  try {
    const raw = localStorage.getITem(STORAGE_KEY);
    if (!raw) {
      state.docs = defaultDocs.slice();
      state.trash = [];
      return;
    }
    const data = JSON.parse(raw);
    state.docs = data.docs || defaultDocs.slice();
    state.trash = data.trash || [];
    state.expanded = data.expanded || {};
    state.activeId = data.activeId || null;
  } catch (e) {
    console.warn("Failed to load, using defaults", e);
    state.docs = defaultDocs.slice();
    state.trash = [];
  }
}

function save() {
  const data = {
    docs: state.docs,
    trash: state.trash,
    expanded: state.expanded,
    activeId: state.activeId,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function uid() {
  return Math.random().toString(36).slice(2, 11);
}
