const STORAGE_KEY = "playful-blind-box-state-v1";

const gifts = [
  {
    id: 1,
    boothLabel: "Booth 01",
    title: "维港夜色小惊喜",
    teaser: "占位礼物，等香港采购后替换",
    reveal: "这里会放你在香港买回来的第一份礼物描述。",
    icon: "🎐",
  },
  {
    id: 2,
    boothLabel: "Booth 02",
    title: "港风限定小物",
    teaser: "先保留神秘感",
    reveal: "这一格先留给第二份礼物，可以写品牌、颜色或一句有趣备注。",
    icon: "🛍️",
  },
  {
    id: 3,
    boothLabel: "Booth 03",
    title: "甜品系隐藏款",
    teaser: "之后再决定具体内容",
    reveal: "未来你可以把这里改成甜品券、零食、钥匙扣之类的内容。",
    icon: "🍮",
  },
  {
    id: 4,
    boothLabel: "Booth 04",
    title: "街头散步纪念",
    teaser: "占位中，待采购",
    reveal: "这份礼物目前还是占位，后续直接改文字就能上线给朋友抽。",
    icon: "🚋",
  },
  {
    id: 5,
    boothLabel: "Booth 05",
    title: "低调但很会选",
    teaser: "先留给未来的灵感",
    reveal: "如果你买到特别适合某个朋友的小东西，就可以替换这一格。",
    icon: "🌆",
  },
  {
    id: 6,
    boothLabel: "Booth 06",
    title: "压轴神秘彩蛋",
    teaser: "最后一份礼物预留位",
    reveal: "这一格适合放压轴款，也可以写成隐藏大奖或特别备注。",
    icon: "🎇",
  },
];

const boothGrid = document.getElementById("boothGrid");
const boothTemplate = document.getElementById("boothTemplate");
const boardStatus = document.getElementById("boardStatus");
const resetButton = document.getElementById("resetButton");
const resultModal = document.getElementById("resultModal");
const modalLabel = document.getElementById("modalLabel");
const modalTitle = document.getElementById("modalTitle");
const modalCopy = document.getElementById("modalCopy");

const state = loadState();

renderBooths();
bindEvents();
updateBoardStatus();

function loadState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return {
        openedIds: [],
      };
    }

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed.openedIds)) {
      throw new Error("Invalid saved state");
    }

    return {
      openedIds: parsed.openedIds,
    };
  } catch (error) {
    return {
      openedIds: [],
    };
  }
}

function saveState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderBooths() {
  boothGrid.innerHTML = "";

  gifts.forEach((gift) => {
    const fragment = boothTemplate.content.cloneNode(true);
    const button = fragment.querySelector(".booth-button");
    const meta = fragment.querySelector(".booth-meta");
    const name = fragment.querySelector(".booth-name");
    const hint = fragment.querySelector(".booth-hint");
    const icon = fragment.querySelector(".booth-icon");

    const isOpened = state.openedIds.includes(gift.id);

    meta.textContent = gift.boothLabel;
    name.textContent = gift.title;
    icon.textContent = gift.icon;
    hint.textContent = isOpened ? "已被抽取，结果已经锁定" : gift.teaser;

    button.dataset.giftId = String(gift.id);
    button.setAttribute("aria-label", `${gift.boothLabel}：${gift.title}`);

    if (isOpened) {
      button.classList.add("is-opened");
      button.disabled = true;
    }

    boothGrid.appendChild(fragment);
  });
}

function bindEvents() {
  boothGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".booth-button");
    if (!button) {
      return;
    }

    const giftId = Number(button.dataset.giftId);
    const gift = gifts.find((item) => item.id === giftId);

    if (!gift || state.openedIds.includes(giftId)) {
      return;
    }

    openGift(button, gift);
  });

  resetButton.addEventListener("click", () => {
    state.openedIds = [];
    saveState();
    renderBooths();
    updateBoardStatus();
  });
}

function openGift(button, gift) {
  button.classList.add("is-opening");

  window.setTimeout(() => {
    button.classList.remove("is-opening");
    button.classList.add("is-opened");
    button.disabled = true;

    state.openedIds.push(gift.id);
    saveState();
    renderBooths();
    updateBoardStatus();
    showResult(gift);
  }, 420);
}

function showResult(gift) {
  modalLabel.textContent = gift.boothLabel;
  modalTitle.textContent = gift.title;
  modalCopy.textContent = gift.reveal;

  if (typeof resultModal.showModal === "function") {
    resultModal.showModal();
    return;
  }

  window.alert(`${gift.boothLabel}\n${gift.title}\n\n${gift.reveal}`);
}

function updateBoardStatus() {
  boardStatus.textContent = `已开启 ${state.openedIds.length} / ${gifts.length}`;
}

// 未来如果你需要所有朋友看到同一状态，可以在这里接 Supabase 或 Firebase。
// 保留 gifts 数据结构不变，只需要把 loadState/saveState 改成远程读写即可。
