const SUPABASE_URL = "https://vdlqidhoprpuxznmapks.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_1RHGj6VZ3QTDyL0gQ4FtXQ_PsTDh5Xa";
const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

let gifts = [];

const boothGrid = document.getElementById("boothGrid");
const boothTemplate = document.getElementById("boothTemplate");
const boardStatus = document.getElementById("boardStatus");
const resetButton = document.getElementById("resetButton");
const resultModal = document.getElementById("resultModal");
const modalLabel = document.getElementById("modalLabel");
const modalTitle = document.getElementById("modalTitle");
const modalCopy = document.getElementById("modalCopy");

const state = {
  openedIds: [],
  isLoading: false,
};

bindEvents();
renderBooths();
updateBoardStatus("正在连接展位状态...");
loadBoxes();
subscribeToBoxes();

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
    loadBoxes();
  });
}

async function loadBoxes() {
  setLoading(true);

  const { data, error } = await supabaseClient
    .from("blind_boxes")
    .select("*")
    .order("id", { ascending: true });

  setLoading(false);

  if (error) {
    console.error(error);
    updateBoardStatus("展位状态加载失败");
    return;
  }

  gifts = data ?? [];
  state.openedIds = gifts.filter((item) => item.opened).map((item) => item.id);
  renderBooths();
  updateBoardStatus();
}

async function openGift(button, gift) {
  if (state.isLoading) {
    return;
  }

  button.classList.add("is-opening");

  const { data, error } = await supabaseClient
    .from("blind_boxes")
    .update({
      opened: true,
      opened_at: new Date().toISOString(),
    })
    .eq("id", gift.id)
    .eq("opened", false)
    .select()
    .maybeSingle();

  button.classList.remove("is-opening");

  if (error) {
    console.error(error);
    window.alert("开盒失败，请稍后再试。");
    return;
  }

  if (!data) {
    await loadBoxes();
    window.alert("这个盲盒刚刚已经被别人抽走了。");
    return;
  }

  await loadBoxes();
  showResult(data);
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

function updateBoardStatus(message) {
  if (message) {
    boardStatus.textContent = message;
    return;
  }

  boardStatus.textContent = `已开启 ${state.openedIds.length} / ${gifts.length}`;
}

function setLoading(isLoading) {
  state.isLoading = isLoading;
  resetButton.disabled = isLoading;
}

function subscribeToBoxes() {
  supabaseClient
    .channel("blind-box-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "blind_boxes" },
      () => {
        loadBoxes();
      }
    )
    .subscribe();
}
