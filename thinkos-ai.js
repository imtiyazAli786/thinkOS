/* thinkOS — AI Assistant Module */

// Global window properties for functions called directly from onclick HTML attributes
window.changeAiModelTop = changeAiModelTop;
window.toggleAiSettingsPanel = toggleAiSettingsPanel;
window.switchAiDrawerTab = switchAiDrawerTab;
window.executeAiDrawerAction = executeAiDrawerAction;
window.clearAiChat = clearAiChat;
window.toggleAiPopoverFullscreen = toggleAiPopoverFullscreen;
window.abortAiGeneration = abortAiGeneration;
window.saveApiKeyLocally = saveApiKeyLocally;
window.clearApiKeyLocally = clearApiKeyLocally;

// Offline AI & Note actions
window.thinkingSummarizeNote = thinkingSummarizeNote;
window.thinkingRewriteNote = thinkingRewriteNote;
window.thinkingImproveWriting = thinkingImproveWriting;
window.thinkingFixGrammar = thinkingFixGrammar;
window.thinkingBulletPoints = thinkingBulletPoints;
window.thinkingActionItems = thinkingActionItems;
window.thinkingDraftEmail = thinkingDraftEmail;
window.generateStickyEmail = generateStickyEmail;
window.thinkingBrainstorm = thinkingBrainstorm;
window.aiFeedback = aiFeedback;
window.maybeShowNoteSummary = maybeShowNoteSummary;
window.generateNoteSummary = generateNoteSummary;
window.scheduleAutoTagSuggestion = scheduleAutoTagSuggestion;
window.applyAllSuggestedTags = applyAllSuggestedTags;
window.dismissTagSuggestions = dismissTagSuggestions;
window.showInlineAiPopup = showInlineAiPopup;
window.closeInlineAiPopup = closeInlineAiPopup;
window.runInlineAiCustom = runInlineAiCustom;
window.runInlineAi = runInlineAi;
window.generateDailyDigest = generateDailyDigest;
window.insertAiBubbleToNote = insertAiBubbleToNote;
window.onAiProviderChange = onAiProviderChange;

/* --- State & Config --- */
let activeAiDrawerTab = 'write';

function getActiveAiProvider() {
  return localStorage.getItem("active_ai_provider") || "gemini";
}

function getAiApiKey(provider) {
  return decodeKey(localStorage.getItem(`user_${provider}_api_key`) || "");
}

function getAiModel(provider) {
  const customModel = localStorage.getItem(`user_${provider}_model`);
  if (customModel) return customModel;
  
  // Default fallback models
  switch (provider) {
    case 'openai': return 'gpt-4o';
    case 'anthropic': return 'claude-3-5-sonnet-20241022';
    case 'deepseek': return 'deepseek-chat';
    case 'nvidia': return 'nvidia/nemotron-3-ultra-550b-a55b';
    case 'openrouter': return 'google/gemini-2.5-flash';
    case 'huggingface': return 'meta-llama/Llama-3.3-70B-Instruct';
    case 'local': return 'llama3';
    case 'gemini':
    default:
      return 'gemini-2.5-flash';
  }
}

function getAiBaseUrl(provider) {
  const customUrl = localStorage.getItem(`user_${provider}_base_url`);
  if (customUrl) return customUrl;
  
  switch (provider) {
    case 'openai': return 'https://api.openai.com/v1';
    case 'deepseek': return 'https://api.deepseek.com/v1';
    case 'nvidia': return 'https://integrate.api.nvidia.com/v1';
    case 'openrouter': return 'https://openrouter.ai/api/v1';
    case 'huggingface': return 'https://router.huggingface.co/hf-inference/v1';
    case 'local': return 'http://localhost:11434/v1';
    default:
      return '';
  }
}

function onAiProviderChange() {
  const provider = getActiveAiProvider();
  const keyInput = document.getElementById("aiApiKeyInput");
  const urlInput = document.getElementById("aiBaseUrlInput");
  const modelInput = document.getElementById("aiModelInput");
  
  const keyContainer = document.getElementById("aiApiKeyContainer");
  const urlContainer = document.getElementById("aiBaseUrlContainer");
  const modelContainer = document.getElementById("aiModelContainer");
  const instructions = document.getElementById("aiProviderInstructions");

  if (!keyInput || !urlInput || !modelInput || !instructions) return;

  // Set instructions
  switch (provider) {
    case 'gemini':
      instructions.textContent = "Enter your Google Gemini API key to use the assistant. Saved securely in your browser.";
      keyContainer.style.display = "flex";
      urlContainer.style.display = "none";
      modelContainer.style.display = "none";
      keyInput.placeholder = "AIzaSy...";
      break;
    case 'openai':
      instructions.textContent = "Enter your OpenAI API key to use GPT-4o. Saved securely in your browser.";
      keyContainer.style.display = "flex";
      urlContainer.style.display = "none";
      modelContainer.style.display = "flex";
      keyInput.placeholder = "sk-...";
      modelInput.placeholder = "gpt-4o";
      break;
    case 'anthropic':
      instructions.textContent = "Enter your Anthropic Claude API key to use Claude 3.5 Sonnet. Saved securely in your browser.";
      keyContainer.style.display = "flex";
      urlContainer.style.display = "none";
      modelContainer.style.display = "flex";
      keyInput.placeholder = "sk-ant-...";
      modelInput.placeholder = "claude-3-5-sonnet-20241022";
      break;
    case 'deepseek':
      instructions.textContent = "Enter your DeepSeek API key to use DeepSeek-Chat. Saved securely in your browser.";
      keyContainer.style.display = "flex";
      urlContainer.style.display = "none";
      modelContainer.style.display = "flex";
      keyInput.placeholder = "sk-...";
      modelInput.placeholder = "deepseek-chat";
      break;
    case 'nvidia':
      instructions.textContent = "Enter your Nvidia NIM API key and model override to use Nvidia-hosted models (DeepSeek, Qwen). Saved securely in your browser.";
      keyContainer.style.display = "flex";
      urlContainer.style.display = "flex";
      modelContainer.style.display = "flex";
      keyInput.placeholder = "nvapi-...";
      urlInput.placeholder = "https://integrate.api.nvidia.com/v1";
      modelInput.placeholder = "nvidia/nemotron-3-ultra-550b-a55b or z-ai/glm-5.2";
      break;
    case 'openrouter':
      instructions.textContent = "Enter your OpenRouter API key and model name. OpenRouter bypasses browser CORS restrictions to run your models. Saved securely.";
      keyContainer.style.display = "flex";
      urlContainer.style.display = "none";
      modelContainer.style.display = "flex";
      keyInput.placeholder = "sk-or-v1-...";
      modelInput.placeholder = "google/gemini-2.5-flash";
      break;
    case 'huggingface':
      instructions.textContent = "Enter your Hugging Face Access Token (hf_...) and model ID to use open-source models via HF Serverless API. Saved securely.";
      keyContainer.style.display = "flex";
      urlContainer.style.display = "flex";
      modelContainer.style.display = "flex";
      keyInput.placeholder = "hf_...";
      urlInput.placeholder = "https://router.huggingface.co/hf-inference/v1";
      modelInput.placeholder = "meta-llama/Llama-3.3-70B-Instruct";
      break;
    case 'local':
      instructions.textContent = "Query your notes completely offline using a local AI runner (Ollama or LM Studio). No API Key required!";
      keyContainer.style.display = "none";
      urlContainer.style.display = "flex";
      modelContainer.style.display = "flex";
      urlInput.placeholder = "http://localhost:11434/v1";
      modelInput.placeholder = "llama3";
      break;
  }

  // Pre-fill existing config if available
  keyInput.value = getAiApiKey(provider);
  urlInput.value = localStorage.getItem(`user_${provider}_base_url`) || "";
  modelInput.value = localStorage.getItem(`user_${provider}_model`) || "";
}

function saveApiKeyLocally() {
  const provider = getActiveAiProvider();
  const key = document.getElementById("aiApiKeyInput").value.trim();
  const url = document.getElementById("aiBaseUrlInput").value.trim();
  const model = document.getElementById("aiModelInput").value.trim();

  localStorage.setItem("active_ai_provider", provider);
  
  if (key || provider === 'local') {
    localStorage.setItem(`user_${provider}_api_key`, encodeKey(key));
  }
  
  if (url) {
    localStorage.setItem(`user_${provider}_base_url`, url);
  } else {
    localStorage.removeItem(`user_${provider}_base_url`);
  }
  
  if (model) {
    localStorage.setItem(`user_${provider}_model`, model);
  } else {
    localStorage.removeItem(`user_${provider}_model`);
  }

  showThinkingToast("AI configuration saved successfully!");
  const panel = document.getElementById("aiSettingsDropdownPanel");
  if (panel) {
    panel.classList.add("hidden");
  }
  checkAiHealth();
}

function clearApiKeyLocally() {
  const provider = getActiveAiProvider();
  localStorage.removeItem(`user_${provider}_api_key`);
  localStorage.removeItem(`user_${provider}_base_url`);
  localStorage.removeItem(`user_${provider}_model`);
  checkAiHealth();
}

async function checkAiHealth() {
  const statusInline = document.getElementById("aiStatusInline");
  const statusDrawer = document.getElementById("aiStatus");
  const statusPopover = document.getElementById("aiStatusPopover");
  const statusCard = document.getElementById("aiCardStatus");
  const queryUi = document.getElementById("aiQuerySection");
  const clearBtn = document.getElementById("aiClearKeyBtn");

  // Unconditionally update setup panel instructions and pre-fill fields for selected provider
  onAiProviderChange();

  const provider = getActiveAiProvider();
  const apiKey = getAiApiKey(provider);
  const activeModel = getAiModel(provider);

  // Pre-populate selectors when opening
  const topSelect = document.getElementById("aiModelSelectorTop");
  if (topSelect) {
    topSelect.value = provider;
  }

  if (apiKey || provider === 'local') {
    if (queryUi) queryUi.style.display = "flex";
    if (clearBtn) clearBtn.classList.remove("hidden");
    
    let providerName = provider.toUpperCase();
    if (provider === 'gemini') providerName = "Gemini";
    if (provider === 'openai') providerName = "OpenAI";
    if (provider === 'anthropic') providerName = "Claude";
    if (provider === 'deepseek') providerName = "DeepSeek";
    if (provider === 'nvidia') providerName = "Nvidia NIM";
    if (provider === 'openrouter') providerName = "OpenRouter";
    if (provider === 'huggingface') providerName = "Hugging Face";
    if (provider === 'local') providerName = "Local AI";

    const statusText = `${providerName} Ready (${activeModel.split('/').pop()})`;
    if (statusInline) statusInline.textContent = statusText;
    if (statusDrawer) statusDrawer.textContent = statusText;
    if (statusPopover) statusPopover.textContent = statusText;
    if (statusCard) statusCard.textContent = statusText;
  } else {
    if (queryUi) queryUi.style.display = "flex";
    if (clearBtn) clearBtn.classList.add("hidden");
    
    const statusText = "Setup Required (API Key)";
    if (statusInline) statusInline.textContent = statusText;
    if (statusDrawer) statusDrawer.textContent = statusText;
    if (statusPopover) statusPopover.textContent = statusText;
    if (statusCard) statusCard.textContent = statusText;
  }
}

/* --- UI Utilities --- */

function isAiElVisible(el) {
  if (!el) return false;
  const style = window.getComputedStyle(el);
  return !el.closest(".hidden") && style.display !== "none" && style.visibility !== "hidden";
}

function getAiQueryInputElement() {
  const active = document.activeElement;
  if (active && ["aiCardQuery", "aiQueryPopover", "aiQueryInline", "aiQueryInput"].includes(active.id)) {
    return active;
  }
  const candidates = [
    DOM.aiQuery || document.getElementById("aiQueryPopover"),
    DOM.aiCardQuery || document.getElementById("aiCardQuery"),
    document.getElementById("aiQueryInline"),
    document.getElementById("aiQueryInput")
  ];
  return candidates.find(isAiElVisible) || candidates.find(Boolean) || null;
}

function getAiResultsElement() {
  const candidates = [
    document.getElementById("aiResultsPopover"),
    document.getElementById("aiCardResults"),
    document.getElementById("aiResultsInline"),
    document.getElementById("aiResults")
  ];
  return candidates.find(isAiElVisible) || candidates.find(Boolean) || null;
}

function setAiAskDisabled(disabled) {
  const sendBtn = document.getElementById("aiSendBtn");
  const stopBtn = document.getElementById("aiStopBtn");
  if (sendBtn) {
    sendBtn.disabled = !!disabled;
    sendBtn.classList.toggle("hidden", !!disabled);
  }
  if (stopBtn) {
    stopBtn.classList.toggle("hidden", !disabled);
  }
  // Also disable legacy ask buttons if present
  [
    document.getElementById("aiAskInlineBtn"),
    document.getElementById("aiAskBtn"),
    document.getElementById("aiCardAskBtn"),
    document.querySelector("#aiPopover button[onclick*='submitAi']")
  ].forEach(btn => { if (btn) btn.disabled = !!disabled; });
}

function adjustTextareaHeight(el) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 150) + 'px';
}

function handleQueryKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    executeAiDrawerAction();
  }
}

function abortAiGeneration() {
  if (aiAbortController) {
    aiAbortController.abort();
    aiAbortController = null;
  }
}

function clearAiChat() {
  // Clear Write & Think tab
  const writeHistory = document.getElementById("aiWriteChatHistory");
  if (writeHistory) {
    writeHistory.innerHTML = `
      <div class="ai-ask-welcome" style="display:flex; flex-direction:column; gap:14px; margin-top:4px;">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <div class="ai-shortcut-chip-container" style="display:flex; align-items:center; gap:6px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none; -ms-overflow-style:none;">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </div>`;
    refreshIcons(writeHistory);
  }
  // Clear Ask Your Notes tab
  const askHistory = document.getElementById("aiAskChatHistory");
  if (askHistory) {
    askHistory.innerHTML = `
      <div class="ai-ask-welcome" style="display:flex; flex-direction:column; gap:14px; margin-top:4px;">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <div class="ai-shortcut-chip-container" style="display:flex; align-items:center; gap:6px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none; -ms-overflow-style:none;">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </div>`;
    refreshIcons(askHistory);
  }
  aiChatTurns = [];
  askNotesTurns = [];
  lastAiWritePrompt = null;
  lastAiWriteContextItems = [];
  // Clear persisted chats
  try {
    localStorage.removeItem('ai_chat_history');
    localStorage.removeItem('ai_ask_chat_history');
  } catch(e) {}
  renderDynamicContextChips();
  showThinkingToast("Chat cleared");
}

function renderDynamicContextChips() {
  if (typeof findStickyById !== 'function' || typeof expandedStickyId === 'undefined') return;
  const activeNote = findStickyById(expandedStickyId || selectedStickyId);
  
  // 1. Write & Think suggestions
  const writeContainer = document.querySelector("#aiWriteChatHistory .ai-shortcut-chip-container");
  if (writeContainer) {
    const chips = [];
    if (activeNote && noteEditorOpen) {
      const title = activeNote.title || 'this note';
      chips.push({ label: `💡 Brainstorm on "${title}"`, query: `Help me brainstorm ideas for this note` });
      chips.push({ label: `📝 Summarize "${title}"`, query: `Summarize this note in 3 concise bullet points` });
      chips.push({ label: `✅ Action items in "${title}"`, query: `What are the key action items here?` });
      
      const hasTodos = (activeNote.blocks || []).some(b => b.type === 'todo');
      if (hasTodos) {
        chips.push({ label: `⏳ Incomplete tasks`, query: `Which tasks are incomplete?` });
      }
    } else {
      chips.push({ label: `💡 Brainstorm ideas`, query: `Help me brainstorm ideas for a new project` });
      chips.push({ label: `📝 Summarize note`, query: `Summarize my thoughts on...` });
      chips.push({ label: `✅ Action items`, query: `What are the key action items here?` });
    }
    
    writeContainer.innerHTML = chips.map(c => `
      <button data-query="${c.query.replace(/"/g, '&quot;')}" class="ai-shortcut-chip" style="white-space:nowrap; flex-shrink:0;">${c.label}</button>
    `).join('');
    writeContainer.querySelectorAll('.ai-shortcut-chip[data-query]').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.dataset.query || '';
        const inp = document.getElementById('aiQueryPopover');
        if (inp) { inp.value = q; inp.focus(); }
      });
    });
  }

  // 2. Ask Your Notes suggestions
  const askContainer = document.querySelector("#aiAskChatHistory .ai-shortcut-chip-container");
  if (askContainer) {
    const chips = [];
    // Try to grab some recent notes
    const recentNotes = (state.notes || []).filter(n => !n.archived).slice(0, 2);
    if (recentNotes.length > 0) {
      recentNotes.forEach(rn => {
        const title = rn.title || 'Untitled';
        chips.push({ label: `Summarize "${title}"`, query: `Summarize my note "${title}"` });
      });
      
      // Pull unique tags from all notes
      const allTags = [];
      (state.notes || []).forEach(n => {
        if (n.archived) return;
        (n.tags || []).forEach(t => {
          if (!allTags.includes(t)) allTags.push(t);
        });
      });
      if (allTags.length > 0) {
        const tag = allTags[0];
        chips.push({ label: `Find #${tag} notes`, query: `Show me all notes tagged with "${tag}"` });
      }
      
      chips.push({ label: `List actions/todos`, query: `List high-priority actions/todos across all my notes` });
    } else {
      chips.push({ label: `Summarize latest notes`, query: `Summarize my latest meeting notes` });
      chips.push({ label: `Find financial expenses`, query: `What are my main financial expenses?` });
      chips.push({ label: `List todos`, query: `List high-priority actions/todos` });
    }
    
    askContainer.innerHTML = chips.map(c => `
      <button data-query="${c.query.replace(/"/g, '&quot;')}" class="ai-shortcut-chip" style="white-space:nowrap; flex-shrink:0;">${c.label}</button>
    `).join('');
    askContainer.querySelectorAll('.ai-shortcut-chip[data-query]').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.dataset.query || '';
        const inp = document.getElementById('aiQueryPopover');
        if (inp) { inp.value = q; inp.focus(); }
      });
    });
  }
}

function toggleAiPopoverFullscreen() {
  const aiPopoverEl = document.getElementById("aiPopover");
  if (!aiPopoverEl) return;
  const isFullscreen = aiPopoverEl.classList.toggle("ai-popover-fullscreen");

  // Lock/unlock body scroll and hide/show underlying content
  document.body.classList.toggle("ai-fullscreen-mode", isFullscreen);

  if (isFullscreen) {
    // Clear any inline style overrides so fullscreen CSS takes full control
    aiPopoverEl.style.transform = '';
    aiPopoverEl.style.opacity = '';
    aiPopoverEl.style.width = '';
    aiPopoverEl.style.height = '';
    aiPopoverEl.style.top = '';
    aiPopoverEl.style.left = '';
    aiPopoverEl.style.right = '';
    aiPopoverEl.style.bottom = '';
    aiPopoverEl.style.pointerEvents = 'auto';
    aiPopoverEl.style.display = 'flex';
  } else {
    // Re-apply drawer-visible inline styles when shrinking back
    aiPopoverEl.style.transform = 'translateX(0)';
    aiPopoverEl.style.opacity = '1';
    aiPopoverEl.style.pointerEvents = 'auto';
  }

  // Persist fullscreen preference
  try { localStorage.setItem('ai_fullscreen', isFullscreen ? '1' : '0'); } catch(e) {}

  const expandBtn = document.getElementById("aiExpandToggleBtn");
  if (expandBtn) {
    if (isFullscreen) {
      expandBtn.setAttribute("title", "Collapse to Standard");
      expandBtn.innerHTML = `<i data-lucide="minimize-2" style="width:13px;height:13px;"></i>`;
    } else {
      expandBtn.setAttribute("title", "Expand to Fullscreen");
      expandBtn.innerHTML = `<i data-lucide="maximize-2" style="width:13px;height:13px;"></i>`;
    }
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons({ root: expandBtn });
    }
  }

  if (typeof showThinkingToast === 'function') {
    if (isFullscreen) {
      showThinkingToast("AI Assistant: Expanded to full page");
    }
  }
}

function changeAiModelTop(val) {
  localStorage.setItem("active_ai_provider", val);
  onAiProviderChange();
  checkAiHealth();
}

function toggleAiSettingsPanel() {
  const panel = document.getElementById("aiSettingsDropdownPanel");
  if (panel) {
    const isOpening = panel.classList.contains("hidden");
    if (isOpening) {
      onAiProviderChange();
    }
    panel.classList.toggle("hidden");
  }
}

function switchAiDrawerTab(tab) {
  activeAiDrawerTab = tab;
  
  const tabWrite = document.getElementById("aiTabWrite");
  const tabAsk = document.getElementById("aiTabAsk");
  const tabDigest = document.getElementById("aiTabDigest");
  const resultsPanel = document.getElementById("aiResultsPopover");
  const askPanel = document.getElementById("aiAskNotesPanel");
  const digestPanel = document.getElementById("aiDigestPanel");
  const querySection = document.getElementById("aiQuerySection");
  const sendBtn = document.getElementById("aiSendBtn");
  
  if (!tabWrite || !tabAsk || !resultsPanel || !askPanel) return;
  
  const resetTab = (tabEl) => {
    if (!tabEl) return;
    tabEl.classList.remove("active");
    tabEl.style.borderBottom = '2px solid transparent';
    tabEl.style.background = 'none';
    tabEl.style.color = 'var(--text-secondary)';
    tabEl.style.borderRadius = '0';
    tabEl.style.fontWeight = '500';
  };
  
  const activateTab = (tabEl) => {
    if (!tabEl) return;
    tabEl.classList.add("active");
    tabEl.style.borderBottom = '2px solid var(--accent)';
    tabEl.style.background = 'none';
    tabEl.style.color = 'var(--accent)';
    tabEl.style.borderRadius = '0';
    tabEl.style.fontWeight = '600';
  };
  
  resetTab(tabWrite);
  resetTab(tabAsk);
  resetTab(tabDigest);
  
  resultsPanel.style.display = "none";
  askPanel.style.display = "none";
  if (digestPanel) digestPanel.style.display = "none";
  if (querySection) querySection.style.display = "flex";
  
  if (tab === 'write') {
    activateTab(tabWrite);
    resultsPanel.style.display = "flex";
    const input = document.getElementById("aiQueryPopover");
    if (input) input.placeholder = "Ask anything...";
    if (sendBtn) sendBtn.textContent = "Ask";
  } else if (tab === 'ask') {
    activateTab(tabAsk);
    // Ensure askPanel contains the chat container if empty or missing
    if (!askPanel.querySelector('#aiAskChatHistory')) {
      askPanel.innerHTML = `<div id="aiAskChatHistory" style="flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:12px; min-height:0;">
        <div class="ai-ask-welcome" style="display:flex; flex-direction:column; gap:14px; margin-top:4px; flex-shrink:0;">
          <div style="display:flex; flex-direction:column; gap:6px;">
            <div class="ai-shortcut-chip-container" style="display:flex; align-items:center; gap:6px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none; -ms-overflow-style:none;">
            </div>
          </div>
        </div>
      </div>`;
    }
    askPanel.style.display = "flex";
    const input = document.getElementById("aiQueryPopover");
    if (input) input.placeholder = "Query your notes...";
    if (sendBtn) sendBtn.textContent = "Search";
  } else if (tab === 'digest') {
    activateTab(tabDigest);
    if (digestPanel) digestPanel.style.display = "flex";
    if (querySection) querySection.style.display = "none";
    // Auto-generate digest once per calendar day
    maybeAutoGenerateDigest();
  }
  
  renderDynamicContextChips();
}

function executeAiDrawerAction() {
  console.log("[AI Debug] executeAiDrawerAction called!");
  const provider = getActiveAiProvider();
  const apiKey = getAiApiKey(provider);
  console.log("[AI Debug] Active provider:", provider, "Has key:", !!apiKey);
  if (!apiKey && provider !== 'local') {
    showThinkingToast(`Please set your ${provider.toUpperCase()} API Key in the settings gear first!`);
    const panel = document.getElementById("aiSettingsDropdownPanel");
    if (panel) panel.classList.remove("hidden");
    return;
  }
  if (activeAiDrawerTab === 'write') {
    submitAiQuery();
  } else if (activeAiDrawerTab === 'ask') {
    askYourNotes();
  }
  // digest tab has no input box — do nothing
}

/* --- Retrieval --- */

function extractKeywords(text) {
  if (!text) return [];
  const stopWords = new Set(["the", "a", "an", "and", "or", "but", "if", "then", "else", "when", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now", "my", "me", "our", "us", "your", "what", "who", "which", "how", "why", "where"]);
  return text.toLowerCase()
    .replace(/[^\w\s#]/g, "")
    .split(/\s+/)
    .map(w => w.replace(/^#/, ""))
    .filter(w => w.length > 2 && !stopWords.has(w));
}

function getRelevantNotes(query, notes, limit = 10) {
  const kws = extractKeywords(query);
  const now = Date.now();
  const ONE_DAY = 86400000;
  
  if (kws.length === 0) {
    // Return most recently modified
    return [...notes]
      .filter(n => !n.archived)
      .sort((a, b) => safeParseTime(b.updatedAt || b.createdAt) - safeParseTime(a.updatedAt || a.createdAt))
      .slice(0, limit);
  }
  
  const scored = notes
    .filter(n => !n.archived)
    .map(n => {
      const title = (n.title || '').toLowerCase();
      const tags = (n.tags || []).join(' ').toLowerCase();
      // Use getNotePlainText to capture both note.text (simple notes) and note.blocks (rich notes)
      const body = getNotePlainText(n).toLowerCase();
      
      let score = 0;
      const bodyWords = body.split(/\s+/).length || 1;
      
      kws.forEach(kw => {
        // Title match is very high value
        if (title === kw) score += 30;
        else if (title.includes(kw)) score += 15;
        // Tag match
        if (tags.includes(kw)) score += 8;
        // TF (term frequency in body)
        const bodyMatches = (body.match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        score += Math.min(bodyMatches * 2 / bodyWords * 100, 10); // TF-capped at 10
      });
      
      // Recency boost: notes modified within 7 days get a bonus
      const noteTime = safeParseTime(n.updatedAt || n.createdAt);
      if (noteTime > 0) {
        const ageMs = now - noteTime;
        const ageDays = ageMs / ONE_DAY;
        if (ageDays < 1) score += 5;
        else if (ageDays < 7) score += 3;
        else if (ageDays < 30) score += 1;
      }
      
      return { note: n, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
  
  if (scored.length === 0) {
    return [...notes]
      .filter(n => !n.archived)
      .sort((a, b) => safeParseTime(b.updatedAt || b.createdAt) - safeParseTime(a.updatedAt || a.createdAt))
      .slice(0, limit);
  }
  return scored.slice(0, limit).map(item => item.note);
}

function findRelevantNotes(query, notes, limit = 3) {
  if (!query) return [];
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  if (words.length === 0) return [];
  
  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return notes
    .filter(n => !n.archived)
    .map(n => {
      const title = (n.title || "").toLowerCase();
      const content = getNotePlainText(n).toLowerCase();
      
      let score = 0;
      words.forEach(word => {
        const escapedWord = escapeRegExp(word);
        try {
          const regex = new RegExp(escapedWord, "g");
          const titleMatches = (title.match(regex) || []).length;
          score += titleMatches * 10;
          
          const contentMatches = (content.match(regex) || []).length;
          score += contentMatches;
        } catch (e) {
          if (title.includes(word)) score += 10;
          if (content.includes(word)) score += 1;
        }
      });
      
      return { note: n, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.note);
}

function searchNotes(query, notes) {
  if (!query || !query.trim()) {
    return notes.map(n => ({ note: n, score: 0, matchedIn: [] }));
  }
  
  const keywords = query.toLowerCase()
    .split(/\s+/)
    .map(w => w.replace(/^#/, '')) // strip leading #
    .filter(w => w.length > 0);
    
  if (keywords.length === 0) {
    return notes.map(n => ({ note: n, score: 0, matchedIn: [] }));
  }
  
  const results = [];
  
  notes.forEach(n => {
    const title = (n.title || "").toLowerCase();
    const tagsStr = (n.tags || []).join(" ").toLowerCase();
    
    // Get plain text of each block (including tables)
    const blockTexts = (n.blocks || []).map(b => {
      if (b.type === "table" && b.rows) {
        return b.rows.map(r => r.cells.map(c => getPlainTextContent(c.content || "").toLowerCase()).join(" ")).join(" ");
      }
      return getPlainTextContent(b.content || "").toLowerCase();
    });
    const bodyStr = blockTexts.join(" ");
    
    // Check if ALL keywords appear in the note (in any of the fields)
    const matchesAll = keywords.every(kw => {
      return title.includes(kw) || tagsStr.includes(kw) || bodyStr.includes(kw);
    });
    
    if (matchesAll) {
      const matchedIn = [];
      let score = 0;
      
      // Check which fields match at least one of the keywords
      const titleMatches = keywords.some(kw => title.includes(kw));
      const tagsMatches = keywords.some(kw => tagsStr.includes(kw));
      const bodyMatches = keywords.some(kw => bodyStr.includes(kw));
      
      if (titleMatches) {
        matchedIn.push('title');
        score += 3;
      }
      if (tagsMatches) {
        matchedIn.push('tags');
        score += 2;
      }
      if (bodyMatches) {
        matchedIn.push('body');
        score += 1;
      }
      
      results.push({
        note: n,
        score,
        matchedIn
      });
    }
  });
  
  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}

function highlightKeywords(text, keywords) {
  if (!text || !keywords || keywords.length === 0) return text;
  
  const cleanKeywords = keywords
    .map(w => w.replace(/^#/, ''))
    .filter(w => w.length > 0);
    
  if (cleanKeywords.length === 0) return text;
  
  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Sort keywords by length descending to avoid replacing sub-parts of words first
  const sortedKeywords = [...cleanKeywords].sort((a, b) => b.length - a.length);
  
  let highlighted = text;
  sortedKeywords.forEach(kw => {
    const escaped = escapeRegExp(kw);
    // Matches tag with optional leading # so '#500' gets highlighted cleanly as a whole tag
    const regex = new RegExp(`(#?${escaped})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark class="search-hit">$1</mark>');
  });
  return highlighted;
}

function getMatchSnippet(text, keywords, maxLength = 120) {
  if (!text) return "";
  const lowerText = text.toLowerCase();
  
  const cleanKeywords = keywords
    .map(w => w.replace(/^#/, ''))
    .filter(w => w.length > 0);
    
  if (cleanKeywords.length === 0) {
    return text.slice(0, maxLength);
  }
  
  let firstIndex = -1;
  cleanKeywords.forEach(kw => {
    const idx = lowerText.indexOf(kw.toLowerCase());
    if (idx !== -1 && (firstIndex === -1 || idx < firstIndex)) {
      firstIndex = idx;
    }
  });
  
  if (firstIndex === -1) {
    return text.slice(0, maxLength);
  }
  
  // Center the snippet around the first match
  const half = Math.floor(maxLength / 2);
  let start = Math.max(0, firstIndex - half);
  let end = Math.min(text.length, start + maxLength);
  
  if (end - start < maxLength) {
    start = Math.max(0, end - maxLength);
  }
  
  let snippet = text.slice(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";
  
  return snippet;
}

function getNotePlainText(note) {
  if (!note) return "";
  let textChunks = [];
  
  // 1. Direct text content (sticky cards / simple notes)
  if (note.text && typeof note.text === 'string' && note.text.trim()) {
    textChunks.push(typeof getPlainTextContent === 'function' ? getPlainTextContent(note.text) : note.text);
  }
  
  // 2. Blocks content (rich document notes)
  if (note.blocks && Array.isArray(note.blocks)) {
    note.blocks.forEach(b => {
      if (!b) return;
      if (b.type === 'table' && b.rows) {
        b.rows.forEach(r => {
          if (r && r.cells) {
            r.cells.forEach(c => {
              if (c && c.content) {
                textChunks.push(typeof getPlainTextContent === 'function' ? getPlainTextContent(c.content) : c.content);
              }
            });
          }
        });
      } else if (b.content) {
        textChunks.push(typeof getPlainTextContent === 'function' ? getPlainTextContent(b.content) : b.content);
      }
    });
  }

  // 3. Daily Taskboard — tasks array
  if (note.type === 'daily-taskboard' && Array.isArray(note.tasks) && note.tasks.length > 0) {
    textChunks.push(`\nTasks (${note.tasks.length}):`);
    note.tasks.forEach((t, i) => {
      if (!t) return;
      const status = t.checked ? '[done]' : '[pending]';
      const label = t.text || t.title || t.label || '';
      if (label) textChunks.push(`${i + 1}. ${status} ${label}`);
    });
  }

  // 4. Finance Note — income and expenses
  if (note.type === 'finance-note') {
    if (Array.isArray(note.income) && note.income.length > 0) {
      textChunks.push(`\nIncome entries (${note.income.length}):`);
      note.income.forEach(e => {
        if (e && e.description) textChunks.push(`- ${e.description}: ${e.amount || ''}`);
      });
    }
    if (Array.isArray(note.expenses) && note.expenses.length > 0) {
      textChunks.push(`\nExpense entries (${note.expenses.length}):`);
      note.expenses.forEach(e => {
        if (e && e.description) textChunks.push(`- ${e.description}: ${e.amount || ''}`);
      });
    }
  }

  // 5. Learning Subject / Learning Page — status, progress, revisit items, helpful links
  if (note.type === 'learning-subject' || note.type === 'learning-page') {
    if (note.status) textChunks.push(`Status: ${note.status}`);
    if (typeof note.progress === 'number') textChunks.push(`Progress: ${note.progress}%`);
    if (Array.isArray(note.revisitItems) && note.revisitItems.length > 0) {
      textChunks.push(`\nRevisit items:`);
      note.revisitItems.forEach(r => {
        if (typeof r === 'string' && r.trim()) textChunks.push(`- ${r}`);
        else if (r && r.text) textChunks.push(`- ${r.text}`);
      });
    }
    if (Array.isArray(note.helpfulLinks) && note.helpfulLinks.length > 0) {
      textChunks.push(`\nHelpful links:`);
      note.helpfulLinks.forEach(l => {
        if (typeof l === 'string' && l.trim()) textChunks.push(`- ${l}`);
        else if (l && l.url) textChunks.push(`- ${l.title || l.url}: ${l.url}`);
      });
    }
  }

  // 6. Daily Dashboard note — MIT slots, wins, energy, where I left off
  if (note.dateStr || note.mitSlots || note.winsToday) {
    if (note.dateStr) textChunks.push(`Date: ${note.dateStr}`);
    if (Array.isArray(note.mitSlots)) {
      note.mitSlots.forEach((m, i) => {
        if (m && m.text) textChunks.push(`MIT Task ${i + 1}: ${m.checked ? '[done]' : '[pending]'} ${m.text}`);
      });
    }
    if (Array.isArray(note.winsToday)) {
      const wins = note.winsToday.filter(Boolean);
      if (wins.length > 0) textChunks.push(`Wins today: ${wins.join(', ')}`);
    }
    if (note.whereILeftOff) textChunks.push(`Where I left off: ${note.whereILeftOff}`);
    if (note.tomorrowFirstTask) textChunks.push(`Tomorrow's first task: ${note.tomorrowFirstTask}`);
    if (typeof note.energyCheck === 'number') textChunks.push(`Energy level: ${note.energyCheck}/5`);
  }

  // 7. Parent/Subject notes (like "Drishti Testing") — content lives in child & nested sub-child notes
  if (typeof state !== 'undefined' && state.notes && note.id) {
    function isChildOrSubchild(n, subjectId) {
      if (!n || n.archived) return false;
      if (n.id === subjectId) return false;
      if (n.parentSubjectId === subjectId || n.parentId === subjectId) return true;
      if (Array.isArray(note.learningPageIds) && note.learningPageIds.includes(n.id)) return true;
      const getNote = (id) => typeof findStickyById === 'function' ? findStickyById(id) : state.notes.find(x => x.id === id);
      let curr = n.parentId ? getNote(n.parentId) : null;
      const visited = new Set();
      while (curr) {
        if (curr.id === subjectId) return true;
        if (visited.has(curr.id)) break;
        visited.add(curr.id);
        if (curr.parentSubjectId === subjectId) return true;
        curr = curr.parentId ? getNote(curr.parentId) : null;
      }
      return false;
    }

    const children = state.notes.filter(n => isChildOrSubchild(n, note.id));
    if (children.length > 0) {
      textChunks.push(`\nTopics/Areas/Pages under this note (${children.length} total):`);
      children.forEach((child, idx) => {
        let childText = child.title || 'Untitled';
        const childContent = (child.text || '') +
          (child.blocks || []).map(b => typeof getPlainTextContent === 'function'
            ? getPlainTextContent(b.content || '') : (b.content || '')).join(' ');
        if (childContent.trim()) childText += ': ' + childContent.trim().slice(0, 300);
        textChunks.push(`${idx + 1}. ${childText}`);
      });
    }
  }

  return textChunks.filter(Boolean).join(" ");
}


/* --- API Call Handlers --- */

async function callAiEndpoint(path, payload, onChunk) {
  const provider = getActiveAiProvider();
  const apiKey = getAiApiKey(provider);
  const model = getAiModel(provider);
  const baseUrl = getAiBaseUrl(provider);

  console.log("[AI Debug] callAiEndpoint path:", path, "provider:", provider, "model:", model, "baseUrl:", baseUrl);

  if (!apiKey && provider !== 'local') {
    throw new Error(`No API key configured for ${provider.toUpperCase()}. Please configure it in your AI Assistant Drawer.`);
  }

  // Build the final prompt.
  // rawPrompt payloads carry { systemPrompt, userMessage } objects — use them directly.
  // Non-raw payloads carry a plain string query — wrap with standard system instruction.
  let finalPrompt = "";
  let structuredSystemPrompt = null;
  let structuredUserMessage = null;
  const systemInstruction = `You are the thinkOS Knowledge Assistant, integrated into the user's note-taking workspace.
Rules:
1. When mentioning or referring to any note from the user's workspace, ALWAYS format it as a clickable markdown link using this exact syntax: [Note Title](note://note-id) (e.g., [Project Pitch](note://note-12345)). Do NOT use http:// or https:// for notes.
2. When the user asks about notebooks, folders, or tags, use the Workspace Structure context below to list the corresponding notes formatted with the link syntax.
3. Be helpful, concise, and structured.`;

  if (payload.rawPrompt) {
    const q = payload.query;
    if (q && typeof q === 'object' && q.systemPrompt && q.userMessage) {
      // Structured prompt from buildAskNotesPrompt / buildAskQueryWithHistory
      structuredSystemPrompt = q.systemPrompt;
      structuredUserMessage = q.userMessage;
      finalPrompt = `${q.systemPrompt}\n\n${q.userMessage}`; // flat fallback for Gemini
    } else {
      finalPrompt = typeof q === 'string' ? q : (q?.systemPrompt || '') + '\n\n' + (q?.userMessage || '');
    }
  } else {
    finalPrompt = payload.query || "";
    if (payload.contextItems && payload.contextItems.length > 0) {
      const contextStr = payload.contextItems
        .map(c => `[${c.type}] ${c.title || c.preview || ''}: ${c.text || ''}`)
        .join('\n');
      finalPrompt = `${systemInstruction}\n\nContext from your thinkOS:\n${contextStr}\n\nUser Question: ${finalPrompt}`;
    } else {
      finalPrompt = `${systemInstruction}\n\nUser Question: ${finalPrompt}`;
    }
    structuredSystemPrompt = systemInstruction;
    structuredUserMessage = payload.query || "";
  }

  try {
    aiAbortController = new AbortController();
    const timeoutId = setTimeout(() => {
      if (aiAbortController) aiAbortController.abort();
    }, 60000); // 60s timeout

    let answer = "";

    if (provider === "gemini") {
      answer = await callGeminiApi(apiKey, model, finalPrompt, aiAbortController.signal, onChunk);
    } else if (provider === "anthropic") {
      answer = await callAnthropicApi(apiKey, model, finalPrompt, aiAbortController.signal, onChunk);
    } else {
      // OpenAI-compatible: pass structured system+user if available for proper role separation
      answer = await callOpenAiCompatibleApi(
        provider, baseUrl, apiKey, model,
        structuredSystemPrompt || finalPrompt,
        structuredUserMessage || "",
        aiAbortController.signal, onChunk
      );
    }

    clearTimeout(timeoutId);
    aiAbortController = null;
    return { answer };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { answer: "⚠️ Generation stopped by user." };
    }
    console.error("AI Error:", err);
    aiAbortController = null;
    throw err;
  }
}

async function callGeminiApi(apiKey, model, promptText, signal, onChunk) {
  if (!onChunk) {
    // Fallback to non-streaming if no callback
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] }),
      signal
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || response.statusText || "Gemini API request failed");
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
  }

  // Streaming for Gemini
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] }),
    signal
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || response.statusText || "Gemini API request failed");
  }

  if (!response.body) throw new Error('Response body is null — cannot stream Gemini response.');
  let content = '';
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep last (possibly incomplete) line

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (raw === '[DONE]') continue;
      try {
        const json = JSON.parse(raw);
        const chunkText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (chunkText) {
          content += chunkText;
          onChunk(chunkText, 'content');
        }
      } catch (e) { /* skip malformed chunks */ }
    }
  }
  // Flush any remaining buffered data the server didn't terminate with \n
  if (buffer.trim() && buffer.startsWith('data: ')) {
    const raw = buffer.slice(6).trim();
    if (raw && raw !== '[DONE]') {
      try {
        const json = JSON.parse(raw);
        const chunkText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (chunkText) { content += chunkText; onChunk(chunkText, 'content'); }
      } catch (e) {}
    }
  }
  return content || "No response generated.";
}

function isThinkingModel(provider, model) {
  if (!model) return false;
  const lower = model.toLowerCase();
  return lower.includes('nemotron') || lower.includes('deepseek-r1') || lower.includes('qwq') || lower.includes('reasoning') || lower.includes('o1') || lower.includes('o3-mini');
}

async function callOpenAiCompatibleApi(provider, baseUrl, apiKey, model, systemPromptText, userMessageText, signal, onChunk) {
  const isThinker = (provider === 'nvidia' || provider === 'openrouter') && isThinkingModel(provider, model);

  // Build proper multi-turn messages array
  const messages = [];
  if (systemPromptText) messages.push({ role: "system", content: systemPromptText });
  if (userMessageText) messages.push({ role: "user", content: userMessageText });
  // Fallback: if only one arg passed (legacy call), treat it as a single user message
  if (messages.length === 0) messages.push({ role: "user", content: systemPromptText || "" });

  const requestBody = {
    model: model,
    messages,
    temperature: isThinker ? 1 : (provider === 'nvidia' ? 0.6 : 0.3),
    stream: true
  };

  if (!onChunk && !isThinker) requestBody.stream = false;

  // Add special Nvidia NIM options if using Nvidia NIM
  if (provider === 'nvidia') {
    requestBody.top_p = 0.95;
    requestBody.max_tokens = 16384;
    if (isThinker) {
      if (model.includes('nemotron')) {
        requestBody.chat_template_kwargs = { enable_thinking: true };
        requestBody.reasoning_budget = 16384;
      } else if (model.includes('deepseek-r1')) {
        requestBody.chat_template_kwargs = { thinking: true };
      }
    } else if (model.includes('deepseek')) {
      requestBody.chat_template_kwargs = { thinking: false };
      requestBody.top_k = 20;
    } else {
      requestBody.top_k = 20;
    }
  }

  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
  if (provider === 'openrouter') {
    headers["HTTP-Referer"] = window.location.origin || "https://thinkos.web.app";
    headers["X-Title"] = "thinkOS";
  }

  const cleanedBaseUrl = (baseUrl || "").trim().replace(/\/+$/, "");

  const response = await fetch(`${cleanedBaseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
    signal
  });

  console.log("[AI Debug] callOpenAiCompatibleApi request body:", requestBody);
  console.log("[AI Debug] Fetch status:", response.status, response.statusText);

  if (!response.ok) {
    let errMsg = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errData = await response.json();
      const detail = errData.error?.message || errData.message || errData.detail || JSON.stringify(errData);
      errMsg = `HTTP ${response.status}: ${detail}`;
    } catch (e) {}
    throw new Error(`${provider.toUpperCase()} API failed: ${errMsg}`);
  }

  if (!requestBody.stream) {
    const data = await response.json();
    const msg = data.choices?.[0]?.message;
    if (!msg) return "No response generated.";
    return msg.content || msg.reasoning_content || "No response generated.";
  }

  // Streaming Reader
  if (!response.body) throw new Error('Response body is null — cannot stream response.');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let reasoning = '';
  let content = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep last

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (raw === '[DONE]') continue;
      try {
        const json = JSON.parse(raw);
        const delta = json.choices?.[0]?.delta;
        if (!delta) continue;
        if (delta.reasoning_content) {
          reasoning += delta.reasoning_content;
          if (onChunk) onChunk(delta.reasoning_content, 'reasoning');
        }
        if (delta.content) {
          content += delta.content;
          if (onChunk) onChunk(delta.content, 'content');
        }
      } catch (e) { /* skip */ }
    }
  }
  // Flush residual buffer (last chunk if server didn't end with \n)
  if (buffer.trim() && buffer.startsWith('data: ')) {
    const raw = buffer.slice(6).trim();
    if (raw && raw !== '[DONE]') {
      try {
        const json = JSON.parse(raw);
        const delta = json.choices?.[0]?.delta;
        if (delta?.reasoning_content) { reasoning += delta.reasoning_content; if (onChunk) onChunk(delta.reasoning_content, 'reasoning'); }
        if (delta?.content) { content += delta.content; if (onChunk) onChunk(delta.content, 'content'); }
      } catch (e) {}
    }
  }

  if (!onChunk) {
    if (reasoning && content) return `<details><summary>💭 Thinking...</summary>\n${reasoning}\n</details>\n\n${content}`;
    return content || reasoning || 'No response generated.';
  }
  
  return (reasoning && content) ? `<details><summary>💭 Thinking...</summary>\n${reasoning}\n</details>\n\n${content}` : content || reasoning;
}

async function callAnthropicApi(apiKey, model, promptText, signal, onChunk) {
  const requestBody = {
    model: model,
    max_tokens: 4096,
    stream: !!onChunk,
    messages: [{ role: "user", content: promptText }]
  };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(requestBody),
    signal
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || response.statusText || "Claude API request failed");
  }

  if (!onChunk) {
    const data = await response.json();
    return data.content?.[0]?.text || "No response generated.";
  }

  // Streaming: parse Anthropic SSE events
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let content = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep incomplete last line

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (!raw || raw === '[DONE]') continue;
      try {
        const json = JSON.parse(raw);
        // Anthropic streaming: content_block_delta with text_delta
        if (json.type === 'content_block_delta' && json.delta?.type === 'text_delta') {
          const chunk = json.delta.text || '';
          if (chunk) {
            content += chunk;
            onChunk(chunk, 'content');
          }
        }
      } catch (e) { /* skip malformed */ }
    }
  }
  return content || "No response generated.";
}

function setAiResults(answer, citations = []) {
  const results = getAiResultsElement();
  if (!results) return;

  const content = (typeof marked !== 'undefined') ? marked.parse(answer) : answer;
  results.innerHTML = `<div class="ai-main-content">${content}</div>`;

  citations.forEach(c => {
    const item = document.createElement("span");
    item.className = "ai-citation";
    item.textContent = `[${c.type}] ${c.preview}`;
    results.appendChild(item);
  });
}

/* --- Prompt Engineering & History Builders --- */

function buildAskQueryWithHistory(userText) {
  const system = "You are an intelligent knowledge assistant for the user's 'thinkOS' dashboard. The user has provided their notes as context. Answer their question based heavily on the content of their notes. If the answer isn't in their notes, you can use your general knowledge, but prioritize their notes. Be concise and helpful.";
  const history = aiChatTurns
    .slice(-AI_CHAT_MAX_TURNS)
    .map((turn, idx) => `Turn ${idx + 1}\nUser: ${turn.user}\nAssistant: ${turn.assistant}`)
    .join("\n\n");
  const userPart = history
    ? `Conversation so far:\n${history}\n\nNew user message:\n${userText}`
    : userText;
  // Return structured object so callAiEndpoint can split system/user properly
  return { systemPrompt: system, userMessage: userPart };
}

function buildAskNotesPrompt(query, notesToSend, historyTurns = [], activeNote = null) {
  let notesContext = "";
  notesToSend.forEach((n, idx) => {
    const plain = getNotePlainText(n);
    const tags = (n.tags || []).join(", ");
    const wordCount = plain.split(/\s+/).filter(Boolean).length;
    const isPrimary = activeNote && n.id === activeNote.id;
    notesContext += `--- ${isPrimary ? '★ CURRENTLY OPEN NOTE (Primary Context)' : `NOTE #${idx + 1}`} ---\n`;
    notesContext += `ID: ${n.id}\n`;
    notesContext += `TITLE: ${n.title || 'Untitled Document'}\n`;
    notesContext += `TAGS: ${tags}\n`;
    notesContext += `CREATED: ${n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Unknown'}\n`;
    notesContext += `LAST MODIFIED: ${n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : 'Unknown'}\n`;
    notesContext += `WORD COUNT: ${wordCount}\n`;
    notesContext += `CONTENT:\n${plain}\n\n`;
  });
  
  const historyStr = historyTurns
    .map((turn, idx) => `Turn ${idx + 1}\nUser: ${turn.user}\nAssistant: ${turn.assistant}`)
    .join("\n\n");

  const primaryInstruction = activeNote
    ? `The user currently has the note "${activeNote.title || 'Untitled'}" open. Prioritize answering from this note's content. You may reference other notes if relevant.`
    : `Answer using the most relevant notes provided in the context.`;

  const exampleId = activeNote?.id || notesToSend[0]?.id || 'note-123';
  const exampleTitle = activeNote?.title || notesToSend[0]?.title || 'Meeting Notes';

  // Taskboard action instructions — only injected when a daily-taskboard is the active note
  let actionInstructions = '';
  if (activeNote && activeNote.type === 'daily-taskboard' && Array.isArray(activeNote.tasks) && activeNote.tasks.length > 0) {
    // Ensure every task has an ID (safety for older tasks without one)
    activeNote.tasks.forEach((t, i) => {
      if (!t.id) t.id = 'task_legacy_' + i;
    });

    const taskList = activeNote.tasks.map((t, i) =>
      `  ${i + 1}. [id:${t.id}] [current_priority:${t.priority || 'none'}] ${t.label || t.text || '(no label)'}`
    ).join('\n');

    actionInstructions = `

════════════════════════════════════════
TASKBOARD ACTION SYSTEM (CRITICAL INSTRUCTIONS)
════════════════════════════════════════
You are connected to the live taskboard "${activeNote.title}". You CAN directly modify it using ACTION blocks.

AUTONOMOUS PRIORITIZATION RULE:
When the user asks you to "set priorities", "prioritize my tasks", or "sort tasks":
1. DO NOT ASK the user which tasks should be P1, P2, or P3! You MUST intelligently evaluate each task yourself (urgency, importance, foundation vs refinement) and assign appropriate priorities (p1 = High/Urgent, p2 = Medium/Standard, p3 = Low/Later).
2. In your human-facing text response: Explain your reasoning using ONLY the task titles (NEVER mention raw IDs like "task_123" in conversational text).
3. At the very end of your response, ALWAYS append the \`\`\`action block so the user can apply your suggested priorities with a single click.

Live tasks on this board (use EXACT IDs in your ACTION block):
${taskList}

ACTION TYPES & FORMATS:

1. BATCH SET PRIORITIES (Preferred for prioritizing multiple tasks):
\`\`\`action
{"type":"set_priorities","noteId":"${activeNote.id}","priorities":[{"taskId":"exact_id_1","priority":"p1"},{"taskId":"exact_id_2","priority":"p2"},{"taskId":"exact_id_3","priority":"p3"}]}
\`\`\`
(priority values: "p1" = High, "p2" = Medium, "p3" = Low, "" = none)

2. REORDER / SORT tasks:
\`\`\`action
{"type":"reorder_tasks","noteId":"${activeNote.id}","order":["exact_id_first","exact_id_second","exact_id_third"]}
\`\`\`

3. ADD a new task:
\`\`\`action
{"type":"add_task","noteId":"${activeNote.id}","label":"Task label","priority":"p1"}
\`\`\`

4. MARK task done:
\`\`\`action
{"type":"complete_task","noteId":"${activeNote.id}","taskId":"exact_id"}
\`\`\`

5. DELETE task:
\`\`\`action
{"type":"delete_task","noteId":"${activeNote.id}","taskId":"exact_id"}
\`\`\`

OUTPUT RULES:
- Output the \`\`\`action block at the VERY END of your response on its own lines.
- Always use the EXACT task IDs from the list above in the JSON.
════════════════════════════════════════`;
  }

  let systemPrompt = `You are the thinkOS Knowledge Assistant, integrated into the user's private notes app.
${primaryInstruction}

Rules:
1. Ground your answer thoroughly in the notes context. If a note is marked "★ CURRENTLY OPEN NOTE", treat it as the primary source.
2. When mentioning, quoting, or citing any note, ALWAYS link to it using this exact syntax: [Note Title](note://note-id) (e.g. [${exampleTitle}](note://${exampleId})).
3. Keep the tone professional, concise, and structured.
4. Format your response in clean Markdown.
${actionInstructions}

User Notes Context:
${notesContext || "No matching notes found."}`;

  if (historyStr) {
    systemPrompt += `\n\nConversation so far:\n${historyStr}`;
  }

  // Return structured object so callAiEndpoint can split system/user properly
  return { systemPrompt, userMessage: query };
}

function _showAskNotesContextBadge(activeNote) {
  const historyEl = document.getElementById('aiAskChatHistory');
  if (!historyEl) return;
  // Remove any existing badge
  const existing = historyEl.querySelector('.ask-notes-context-badge');
  if (existing) existing.remove();
  
  const badge = document.createElement('div');
  badge.className = 'ask-notes-context-badge';
  badge.style.cssText = `
    display: flex; align-items: center; gap: 6px;
    background: var(--accent-soft, rgba(107,92,224,0.07));
    border: 1px solid var(--accent-border, rgba(107,92,224,0.15));
    border-radius: 8px; padding: 6px 10px;
    font-size: 11px; color: var(--text-secondary);
    margin-bottom: 4px; flex-shrink: 0;
  `;
  if (activeNote) {
    badge.innerHTML = `
      <span style="font-size:12px;">📄</span>
      <span>Answering from: <strong style="color:var(--text);">${activeNote.title || 'Untitled'}</strong></span>
      <span style="margin-left:auto; opacity:0.6;">+ all notes</span>
    `;
  } else {
    badge.innerHTML = `
      <span style="font-size:12px;">🗂️</span>
      <span style="color:var(--text-secondary);">Searching across all notes</span>
    `;
  }
  // Insert at top of history (before first bubble)
  historyEl.insertBefore(badge, historyEl.firstChild);
}

function formatAskResponse(text) {
  if (!text) return "";
  
  // First, escape HTML safely
  let html = esc(text);
  
  // Restore and style the collapsible details/summary block for the chain-of-thought (thinking)
  html = html.replace(
    /&lt;details&gt;\s*&lt;summary&gt;([\s\S]*?)&lt;\/summary&gt;\s*/gi,
    `<details style="
      background: var(--accent-hover, rgba(0,0,0,0.03));
      border: 1px solid var(--accent-border, rgba(0,0,0,0.08));
      border-radius: 8px;
      padding: 8px 12px;
      margin-bottom: 12px;
      font-size: 12px;
      color: var(--text-secondary);
    "><summary style="
      cursor: pointer;
      font-weight: 600;
      color: var(--text);
      outline: none;
      user-select: none;
      margin-bottom: 4px;
    ">$1</summary>`
  ).replace(/&lt;\/details&gt;/g, '</details>');

  // Convert newlines to line breaks to preserve formatting
  html = html.replace(/\n/g, '<br>');
  
  // Parse markdown bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight:700;">$1</strong>');
  
  // Parse bullet points
  html = html.replace(/^\s*-\s+(.*?)$/gm, '<li style="margin-left:14px; margin-bottom:4px;">$1</li>');
  
  // Parse Citations [Source: Title](noteId)
  const citationRegex = /\[Source:\s*([^\]]+)\]\(([^)]+)\)/gi;
  html = html.replace(citationRegex, (match, title, noteId) => {
    return `<span class="source-pill" onclick="toggleAiPopover(false); openNoteEditor('${noteId.trim()}');" style="
      display: inline-flex; align-items: center; gap: 4px; background: rgba(107, 92, 224, 0.08);
      color: rgb(107, 92, 224); border: 1px solid rgba(107, 92, 224, 0.15); border-radius: 12px;
      padding: 1px 8px; font-size: 11px; font-weight: 500; cursor: pointer; margin: 0 2px;
      transition: all 0.15s ease; user-select: none;
    ">🔗 ${title.trim()}</span>`;
  });

  // Parse direct Note Links [Title](note://noteId)
  const noteLinkRegex = /\[([^\]]+)\]\(note:\/\/([^)]+)\)/gi;
  html = html.replace(noteLinkRegex, (match, title, noteId) => {
    return `<span class="source-pill" onclick="toggleAiPopover(false); openNoteEditor('${noteId.trim()}');" style="
      display: inline-flex; align-items: center; gap: 4px; background: rgba(107, 92, 224, 0.08);
      color: rgb(107, 92, 224); border: 1px solid rgba(107, 92, 224, 0.15); border-radius: 12px;
      padding: 1px 8px; font-size: 11px; font-weight: 500; cursor: pointer; margin: 0 2px;
      transition: all 0.15s ease; user-select: none;
    ">🔗 ${title.trim()}</span>`;
  });
  
  return html;
}

/* --- Response Messaging Chunks --- */

window.copyAiBubbleText = function(btn) {
  const bubble = btn.closest('.ai-bubble-container');
  const textContainer = bubble ? bubble.querySelector('.ai-response-content') : null;
  const text = textContainer ? textContainer.innerText : '';
  navigator.clipboard.writeText(text).then(() => {
    showThinkingToast("Copied to clipboard!");
  }).catch(err => {
    console.error("Failed to copy text: ", err);
  });
};

function appendAskChatBubble(role, content = "") {
  const history = document.getElementById("aiAskChatHistory");
  if (!history) return "";
  
  const id = "bubble_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  const container = document.createElement("div");
  container.id = id;
  container.className = "ai-bubble-container";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.maxWidth = "85%";
  container.style.position = "relative";
  
  if (role === 'user' || role === 'assistant') {
    container.dataset.role = role;
    container.dataset.content = content;
  }
  
  if (role === 'user') {
    container.style.alignSelf = "flex-start";
    container.style.background = "var(--accent)";
    container.style.color = "var(--card)";
    container.style.borderRadius = "12px 12px 12px 0";
    container.style.padding = "8px 14px";
    container.style.fontSize = "13px";
    container.style.fontWeight = "500";
    container.style.fontFamily = "var(--font-sans)";
    container.style.marginBottom = "2px";
    container.textContent = content;
  } else if (role === 'assistant-loading') {
    container.style.alignSelf = "flex-start";
    container.style.background = "var(--card)";
    container.style.border = "1px solid var(--accent-border)";
    container.style.borderRadius = "12px 12px 12px 0";
    container.style.padding = "8px 12px";
    container.style.fontSize = "13px";
    container.style.color = "var(--text-secondary)";
    container.style.fontFamily = "var(--font-sans)";
    container.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:11px; font-weight:600; text-transform:uppercase; color:var(--accent); letter-spacing:0.05em;">Thinking</span>
        <div class="ai-loading-dots" style="display:flex; gap:3px;">
          <span style="width:4px; height:4px; border-radius:50%; background:var(--accent); animation: pulse 1s infinite alternate;"></span>
          <span style="width:4px; height:4px; border-radius:50%; background:var(--accent); animation: pulse 1s infinite alternate; animation-delay: 0.2s;"></span>
          <span style="width:4px; height:4px; border-radius:50%; background:var(--accent); animation: pulse 1s infinite alternate; animation-delay: 0.4s;"></span>
        </div>
      </div>
    `;
  } else {
    container.style.alignSelf = "flex-start";
    container.style.background = "var(--card)";
    container.style.border = "1px solid var(--accent-border)";
    container.style.borderRadius = "12px 12px 12px 0";
    container.style.padding = "10px 14px";
    container.style.fontSize = "13px";
    container.style.color = "var(--text)";
    container.style.fontFamily = "var(--font-sans)";
    container.style.lineHeight = "1.5";
    
    container.innerHTML = `
      <div class="ai-response-content">${formatAskResponse(content)}</div>
      <div style="display:flex; justify-content:flex-end; margin-top:6px; padding-top:4px; border-top:1px solid var(--border-soft); gap:6px; align-items:center;">
        <div style="display:flex; gap:2px; margin-right:auto;">
          <button onclick="aiFeedback(this,'good')" 
            style="background:none; border:none; color:var(--text-secondary); cursor:pointer; font-size:10px; display:flex; align-items:center; gap:2px; padding:2px 4px; border-radius:4px; transition: all 0.15s ease;"
            onmouseover="this.style.background='var(--border-soft)'; this.style.color='var(--text)';"
            onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)';"
            title="Helpful"
          >
            👍
          </button>
          <button onclick="aiFeedback(this,'bad')" 
            style="background:none; border:none; color:var(--text-secondary); cursor:pointer; font-size:10px; display:flex; align-items:center; gap:2px; padding:2px 4px; border-radius:4px; transition: all 0.15s ease;"
            onmouseover="this.style.background='var(--border-soft)'; this.style.color='var(--text)';"
            onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)';"
            title="Not helpful"
          >
            👎
          </button>
        </div>
        <button onclick="copyAiBubbleText(this)" 
          style="background:none; border:none; color:var(--text-secondary); cursor:pointer; font-size:10px; display:flex; align-items:center; gap:4px; padding:2px 4px; border-radius:4px; transition: all 0.15s ease;"
          onmouseover="this.style.background='var(--border-soft)'; this.style.color='var(--text)';"
          onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)';"
        >
          <i data-lucide="copy" style="width:11px;height:11px;"></i> Copy
        </button>
      </div>
    `;
  }
  
  history.appendChild(container);
  if (role !== 'user' && role !== 'assistant-loading') {
    refreshIcons(container);
  }
  history.scrollTop = history.scrollHeight;
  return id;
}

async function askYourNotes() {
  if (aiBusy) { return; }
  aiBusy = true; // Lock immediately to prevent TOCTOU double-fire
  const input = document.getElementById("aiQueryPopover");
  if (!input) return;
  const queryText = input.value.trim();
  if (!queryText) return;
  
  const historyTurns = [];
  const historyContainer = document.getElementById("aiAskChatHistory");
  if (historyContainer) {
    const bubbles = Array.from(historyContainer.children);
    let currentTurn = null;
    for (const bubble of bubbles) {
      const role = bubble.dataset.role;
      const content = bubble.dataset.rawMd || bubble.dataset.content;
      if (!role || !content) continue;
      if (role === 'user') {
        if (currentTurn) {
          historyTurns.push(currentTurn);
        }
        currentTurn = { user: content, assistant: "" };
      } else if (role === 'assistant' && currentTurn) {
        currentTurn.assistant = content;
      }
    }
    // Push turns even if assistant reply is empty (aborted/in-progress)
    if (currentTurn && currentTurn.user) {
      historyTurns.push(currentTurn);
    }
  }

  input.value = "";
  adjustTextareaHeight(input);
  
  appendAskChatBubble('user', queryText);
  
  const provider = getActiveAiProvider();
  const apiKey = getAiApiKey(provider);
  if (!apiKey && provider !== 'local') {
    appendAskChatBubble('assistant', `Please configure your ${provider.toUpperCase()} API Key in the AI settings (⚙️) to enable this feature.`);
    aiBusy = false; // Release lock on early return
    setAiAskDisabled(false);
    return;
  }
  
  // 1. Always inject the currently open note as PRIMARY context (highest priority)
  const activeNote = (typeof findStickyById === 'function') && (expandedStickyId || selectedStickyId)
    ? findStickyById(expandedStickyId || selectedStickyId)
    : null;

  // 2. Get relevant notes by keyword scoring (excluding active note to avoid duplicate)
  const candidateNotes = (state.notes || []).filter(n => !n.archived && (!activeNote || n.id !== activeNote.id));
  const relevantNotes = getRelevantNotes(queryText, candidateNotes, activeNote ? 4 : 5);

  // 3. Active note goes FIRST so it's the most prominent context for the AI
  const notesToSend = activeNote ? [activeNote, ...relevantNotes] : relevantNotes;

  const prompt = buildAskNotesPrompt(queryText, notesToSend, historyTurns, activeNote);

  // 4. Show note context indicator badge at top of Ask panel (only once per session)
  _showAskNotesContextBadge(activeNote);

  await _streamWriteResponse(prompt, [], /* rawPrompt= */ true);
}

async function _streamWriteResponse(prompt, contextItems, rawPrompt = false) {
  // Note: aiBusy is set by the callers (askYourNotes / submitAiQuery) before calling this
  if (!aiBusy) aiBusy = true; // Safety fallback in case called directly
  setAiAskDisabled(true);

  lastAiWritePrompt = prompt;
  lastAiWriteContextItems = contextItems;
  
  const isWrite = activeAiDrawerTab === 'write';
  const appendBubble = isWrite ? appendWriteChatBubble : appendAskChatBubble;
  
  const loaderId = appendBubble('assistant-loading');
  const bubbleId = loaderId;

  let responseAccumulator = '';
  let reasoningAccumulator = '';
  
  const bubbleContainer = document.getElementById(bubbleId);
  if (bubbleContainer) {
    bubbleContainer.dataset.role = 'assistant';
    bubbleContainer.style.alignSelf = "flex-start";
    bubbleContainer.style.background = "var(--card)";
    bubbleContainer.style.border = "1px solid var(--accent-border)";
    bubbleContainer.style.borderRadius = "12px 12px 12px 0";
    bubbleContainer.style.padding = "10px 14px";
    bubbleContainer.style.fontSize = "13px";
    bubbleContainer.style.color = "var(--text)";
    bubbleContainer.style.fontFamily = "var(--font-sans)";
    bubbleContainer.style.lineHeight = "1.5";
    bubbleContainer.innerHTML = `<div class="ai-response-content"><span class="ai-cursor-blink"></span></div>`;
  }
  
  function updateBubble() {
    if (!bubbleContainer) return;
    const contentDiv = bubbleContainer.querySelector('.ai-response-content');
    if (contentDiv) {
      let html = '';
      if (reasoningAccumulator) {
        html += `<details><summary>💭 Thinking...</summary>\n${reasoningAccumulator}\n</details>\n\n`;
      }
      html += responseAccumulator;
      
      const parsed = (typeof marked !== 'undefined') ? marked.parse(html) : formatAskResponse(html);
      
      contentDiv.innerHTML = parsed + '<span class="ai-cursor-blink"></span>';
      bubbleContainer.dataset.rawMd = html;
      
      if (typeof hljs !== 'undefined') {
        contentDiv.querySelectorAll('pre code').forEach((block) => {
          if (!block.dataset.highlighted) {
             hljs.highlightElement(block);
             block.dataset.highlighted = 'true';
          }
        });
      }
      
      const history = document.getElementById(isWrite ? "aiWriteChatHistory" : "aiAskChatHistory");
      if (history) history.scrollTop = history.scrollHeight;
    }
  }

  try {
    const payload = { query: prompt, mode: "chat", contextItems, rawPrompt };
    const data = await callAiEndpoint("/api/ai/query", payload, (chunk, type) => {
      if (type === 'reasoning') {
        reasoningAccumulator += chunk;
      } else {
        responseAccumulator += chunk;
      }
      updateBubble();
    });
    
    if (bubbleContainer) {
      const contentDiv = bubbleContainer.querySelector('.ai-response-content');
      if (contentDiv) {
        const cursor = contentDiv.querySelector('.ai-cursor-blink');
        if (cursor) cursor.remove();
      }
      
      bubbleContainer.innerHTML += `
        <div style="display:flex; justify-content:flex-end; margin-top:6px; padding-top:4px; border-top:1px solid var(--border-soft); gap:6px; align-items:center;">
          <div style="display:flex; gap:2px; margin-right:auto;">
            <button onclick="aiFeedback(this,'good')" 
              style="background:none; border:none; color:var(--text-secondary); cursor:pointer; font-size:10px; display:flex; align-items:center; gap:2px; padding:2px 4px; border-radius:4px; transition: all 0.15s ease;"
              onmouseover="this.style.background='var(--border-soft)'; this.style.color='var(--text)';"
              onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)';"
              title="Helpful"
            >
              👍
            </button>
            <button onclick="aiFeedback(this,'bad')" 
              style="background:none; border:none; color:var(--text-secondary); cursor:pointer; font-size:10px; display:flex; align-items:center; gap:2px; padding:2px 4px; border-radius:4px; transition: all 0.15s ease;"
              onmouseover="this.style.background='var(--border-soft)'; this.style.color='var(--text)';"
              onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)';"
              title="Not helpful"
            >
              👎
            </button>
          </div>
          <button onclick="insertAiBubbleToNote(this)" 
            style="background:none; border:none; color:var(--text-secondary); cursor:pointer; font-size:10px; display:flex; align-items:center; gap:4px; padding:2px 4px; border-radius:4px; transition: all 0.15s ease;"
            onmouseover="this.style.background='var(--border-soft)'; this.style.color='var(--text)';"
            onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)';"
          >
            <i data-lucide="plus-square" style="width:11px;height:11px;"></i> Insert to Note
          </button>
          <button onclick="copyAiBubbleText(this)" 
            style="background:none; border:none; color:var(--text-secondary); cursor:pointer; font-size:10px; display:flex; align-items:center; gap:4px; padding:2px 4px; border-radius:4px; transition: all 0.15s ease;"
            onmouseover="this.style.background='var(--border-soft)'; this.style.color='var(--text)';"
            onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)';"
          >
            <i data-lucide="copy" style="width:11px;height:11px;"></i> Copy
          </button>
        </div>
      `;
      refreshIcons(bubbleContainer);
    }
    
    const finalAnswer = reasoningAccumulator ? `<details><summary>💭 Thinking...</summary>\n${reasoningAccumulator}\n</details>\n\n${responseAccumulator}` : responseAccumulator;

    // ── Taskboard Deep-Link Action: parse ALL action blocks from response ──────
    // Supports multiple blocks in one response (e.g. set_priority for every task)
    const actionBlockRegex = /```action\s*([\s\S]*?)```/gi;
    const detectedActions = [];
    let actionMatch;
    while ((actionMatch = actionBlockRegex.exec(responseAccumulator)) !== null) {
      try {
        const parsed = JSON.parse(actionMatch[1].trim());
        if (parsed && parsed.type) detectedActions.push(parsed);
      } catch(e) {}
    }

    if (detectedActions.length > 0) {
      // Strip ALL action blocks from the visible bubble content
      const cleanedResponse = responseAccumulator.replace(/```action[\s\S]*?```/gi, '').trim();
      if (bubbleContainer) {
        const contentDiv = bubbleContainer.querySelector('.ai-response-content');
        if (contentDiv) {
          contentDiv.innerHTML = (typeof marked !== 'undefined')
            ? marked.parse(cleanedResponse)
            : formatAskResponse(cleanedResponse);
          bubbleContainer.dataset.rawMd = cleanedResponse;
        }
      }

      // Build a summary label for all detected actions
      const actionLabels = {
        reorder_tasks:  '📋 Sort / reorder tasks',
        add_task:       (a) => `➕ Add task: "${a.label || ''}"`,
        complete_task:  '✅ Mark task done',
        delete_task:    '🗑️ Delete task',
        set_priorities: (a) => `🏷️ Set priorities on ${(a.priorities || []).length} task(s)`,
        set_priority:   (a) => `🏷️ Set priority on ${detectedActions.filter(x => x.type === 'set_priority').length} task(s)`,
      };

      const summaryParts = [];
      const seenTypes = new Set();
      detectedActions.forEach(a => {
        if (!seenTypes.has(a.type)) {
          seenTypes.add(a.type);
          const lbl = actionLabels[a.type];
          summaryParts.push(typeof lbl === 'function' ? lbl(a) : (lbl || a.type));
        }
      });
      const actionSummary = summaryParts.join(' + ');
      const encodedActions = encodeURIComponent(JSON.stringify(detectedActions));

      const confirmStrip = document.createElement('div');
      confirmStrip.className = 'ai-action-confirm-strip';
      confirmStrip.style.cssText = 'margin-top:8px; padding:8px 10px; background:var(--card); border:1px solid var(--accent-border, rgba(107,92,224,0.25)); border-radius:8px; display:flex; align-items:center; gap:8px; font-size:11px;';
      confirmStrip.innerHTML = `
        <span style="flex:1; color:var(--text-secondary);">🤖 AI wants to: <strong style="color:var(--text);">${actionSummary}</strong></span>
        <button onclick="applyAiTaskboardActions(this, '${encodedActions}')"
          style="background:var(--accent,#6B5CE0); color:#fff; border:none; border-radius:6px; padding:4px 10px; font-size:11px; font-weight:600; cursor:pointer; font-family:var(--font-sans);">
          Apply ✓
        </button>
        <button onclick="this.parentElement.remove()"
          style="background:none; color:var(--text-secondary); border:1px solid var(--border); border-radius:6px; padding:4px 8px; font-size:11px; cursor:pointer; font-family:var(--font-sans);">
          Dismiss
        </button>
      `;
      bubbleContainer.appendChild(confirmStrip);
    }

    // Extract the user-facing text from the prompt (may be a structured {systemPrompt, userMessage} object)
    const userTurnText = (prompt && typeof prompt === 'object' && prompt.userMessage)
      ? prompt.userMessage
      : (typeof prompt === 'string' ? prompt : '');

    if (isWrite && finalAnswer) {
      aiChatTurns.push({ user: userTurnText, assistant: finalAnswer });
      if (aiChatTurns.length > AI_CHAT_MAX_TURNS) aiChatTurns = aiChatTurns.slice(-AI_CHAT_MAX_TURNS);
    } else if (!isWrite && finalAnswer) {
      askNotesTurns.push({ user: userTurnText, assistant: finalAnswer });
      if (askNotesTurns.length > AI_CHAT_MAX_TURNS) askNotesTurns = askNotesTurns.slice(-AI_CHAT_MAX_TURNS);
    }


    // Persist active chat to localStorage — save raw markdown, NOT innerHTML (avoids stored-XSS)
    try {
      const historyKey = isWrite ? 'ai_chat_history_md' : 'ai_ask_chat_history_md';
      const historyEl = document.getElementById(isWrite ? 'aiWriteChatHistory' : 'aiAskChatHistory');
      if (historyEl) {
        const bubbles = Array.from(historyEl.querySelectorAll('.ai-bubble-container[data-role]'));
        const serialized = bubbles.map(b => ({
          role: b.dataset.role,
          md: b.dataset.rawMd || b.textContent || ''
        }));
        localStorage.setItem(historyKey, JSON.stringify(serialized));
        // Remove old innerHTML-based keys if present
        localStorage.removeItem(isWrite ? 'ai_chat_history' : 'ai_ask_chat_history');
      }
    } catch(e) {}
    
    if (data && data.answer && data.answer.includes("Generation stopped by user")) {
      const contentDiv = bubbleContainer.querySelector('.ai-response-content');
      if (contentDiv) {
        contentDiv.innerHTML += `<br><br><span style="color:var(--text-secondary); font-style:italic; font-size:11px;">${data.answer}</span>`;
      }
    } else if (!responseAccumulator && data && data.answer) {
      const contentDiv = bubbleContainer ? bubbleContainer.querySelector('.ai-response-content') : null;
      if (contentDiv) {
        contentDiv.innerHTML = (typeof marked !== 'undefined') ? marked.parse(data.answer) : formatAskResponse(data.answer);
      }
    }
  } catch (error) {
    if (bubbleContainer) {
      const contentDiv = bubbleContainer.querySelector('.ai-response-content');
      if (contentDiv) {
        contentDiv.innerHTML += `<br><span style="color:var(--red)">⚠️ AI Error: ${error.message || "Request failed"}</span>`;
        const cursor = contentDiv.querySelector('.ai-cursor-blink');
        if (cursor) cursor.remove();
      }
    }
    console.error(error);
  } finally {
    aiBusy = false;
    setAiAskDisabled(false);
  }
}

async function submitAiQuery() {
  console.log("[AI Debug] submitAiQuery called!");
  if (aiBusy) {
    console.log("[AI Debug] submitAiQuery early exit: aiBusy is true");
    return;
  }
  const input = getAiQueryInputElement();
  console.log("[AI Debug] getAiQueryInputElement returned:", input ? input.id : "null");
  const userText = (input?.value || "").trim();
  console.log("[AI Debug] userText:", userText);
  if (!userText) return;
  if (input) {
    input.value = "";
    adjustTextareaHeight(input);
  }
  
  pendingAiTaskDraft = null;

  const welcome = document.querySelector('#aiWriteChatHistory .ai-ask-welcome');
  if (welcome) welcome.remove();

  appendWriteChatBubble('user', userText);

  let noteContexts = [];

  // 1. Always inject Workspace Structure metadata (all non-archived notes, notebooks, and tags)
  const getFolderLabel = (notebookKey) => {
    if (typeof formatNotebookLabel === 'function') {
      return formatNotebookLabel(notebookKey);
    }
    if (typeof window.formatNotebookLabel === 'function') {
      return window.formatNotebookLabel(notebookKey);
    }
    if (typeof state !== 'undefined' && state.notebookLabels && state.notebookLabels[notebookKey]) {
      return state.notebookLabels[notebookKey];
    }
    if (notebookKey === "inbox") return "Unsorted";
    return notebookKey || "Unsorted";
  };

  const activeNotes = ((typeof state !== 'undefined' && state.notes) || []).filter(n => !n.archived);
  if (activeNotes.length > 0) {
    const workspaceMeta = activeNotes
      .map(n => `- Note: "${n.title || 'Untitled'}" | ID: ${n.id} | Notebook/Folder: "${getFolderLabel(n.notebook)}" | Tags: [${(n.tags || []).join(', ')}]`)
      .join('\n');

    noteContexts.push({
      type: "Workspace Structure",
      title: "All Notebooks and Notes",
      text: workspaceMeta
    });
  }

  const activeNote = findStickyById(expandedStickyId || selectedStickyId);
  if (activeNote && noteEditorOpen) {
    noteContexts.push({
      type: "Active Note",
      title: activeNote.title || "Untitled",
      text: getNotePlainText(activeNote)
    });
  }

  // Always retrieve relevant notes based on search query matching
  const candidateNotes = activeNotes.filter(n => !activeNote || n.id !== activeNote.id);
  if (candidateNotes.length > 0) {
    const relevantNotes = findRelevantNotes(userText, candidateNotes, 3);
    relevantNotes.forEach(n => {
      noteContexts.push({
        type: "Relevant Note",
        title: n.title || "Untitled",
        text: getNotePlainText(n)
      });
    });
  }

  const query = buildAskQueryWithHistory(userText);
  await _streamWriteResponse(query, noteContexts, /* rawPrompt= */ true);
}

function appendWriteChatBubble(role, content = "") {
  const history = document.getElementById("aiWriteChatHistory");
  if (!history) return "";
  const id = "wbubble_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  const container = document.createElement("div");
  container.id = id;
  container.className = "ai-bubble-container";
  container.style.cssText = "display:flex; flex-direction:column; max-width:85%; position:relative;";
  if (role === 'user') {
    container.style.alignSelf = "flex-start";
    container.style.background = "var(--accent)";
    container.style.color = "var(--card)";
    container.style.borderRadius = "12px 12px 12px 0";
    container.style.padding = "8px 14px";
    container.style.fontSize = "13px";
    container.style.fontWeight = "500";
    container.style.fontFamily = "var(--font-sans)";
    container.style.marginBottom = "2px";
    container.textContent = content;
  } else if (role === 'assistant-loading') {
    container.style.alignSelf = "flex-start";
    container.style.background = "var(--card)";
    container.style.border = "1px solid var(--accent-border)";
    container.style.borderRadius = "12px 12px 12px 0";
    container.style.padding = "8px 12px";
    container.style.fontSize = "13px";
    container.innerHTML = `<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--accent);letter-spacing:0.05em;">Thinking</span><div class="ai-loading-dots" style="display:flex;gap:3px;"><span style="width:4px;height:4px;border-radius:50%;background:var(--accent);animation:pulse 1s infinite alternate;"></span><span style="width:4px;height:4px;border-radius:50%;background:var(--accent);animation:pulse 1s infinite alternate;animation-delay:0.2s;"></span><span style="width:4px;height:4px;border-radius:50%;background:var(--accent);animation:pulse 1s infinite alternate;animation-delay:0.4s;"></span></div></div>`;
  } else {
    container.style.alignSelf = "flex-start";
    container.style.background = "var(--card)";
    container.style.border = "1px solid var(--accent-border)";
    container.style.borderRadius = "12px 12px 12px 0";
    container.style.padding = "10px 14px";
    container.style.fontSize = "13px";
    container.style.color = "var(--text)";
    container.style.fontFamily = "var(--font-sans)";
    container.style.lineHeight = "1.5";
    container.innerHTML = `
      <div class="ai-response-content">${formatAskResponse(content)}</div>
      <div style="display:flex; justify-content:flex-end; margin-top:6px; padding-top:4px; border-top:1px solid var(--border-soft); gap:6px; align-items:center;">
        <div style="display:flex; gap:2px; margin-right:auto;">
          <button onclick="aiFeedback(this,'good')" 
            style="background:none; border:none; color:var(--text-secondary); cursor:pointer; font-size:10px; display:flex; align-items:center; gap:2px; padding:2px 4px; border-radius:4px; transition: all 0.15s ease;"
            onmouseover="this.style.background='var(--border-soft)'; this.style.color='var(--text)';"
            onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)';"
            title="Helpful"
          >
            👍
          </button>
          <button onclick="aiFeedback(this,'bad')" 
            style="background:none; border:none; color:var(--text-secondary); cursor:pointer; font-size:10px; display:flex; align-items:center; gap:2px; padding:2px 4px; border-radius:4px; transition: all 0.15s ease;"
            onmouseover="this.style.background='var(--border-soft)'; this.style.color='var(--text)';"
            onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)';"
            title="Not helpful"
          >
            👎
          </button>
        </div>
        <button onclick="copyAiBubbleText(this)" 
          style="background:none; border:none; color:var(--text-secondary); cursor:pointer; font-size:10px; display:flex; align-items:center; gap:4px; padding:2px 4px; border-radius:4px; transition: all 0.15s ease;"
          onmouseover="this.style.background='var(--border-soft)'; this.style.color='var(--text)';"
          onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)';"
        >
          <i data-lucide="copy" style="width:11px;height:11px;"></i> Copy
        </button>
      </div>
    `;
  }
  history.appendChild(container);
  if (role !== 'user' && role !== 'assistant-loading') {
    refreshIcons(container);
  }
  history.scrollTop = history.scrollHeight;
  return id;
}

const AI_PROMPT_TEMPLATES = {
  summarize:
    `You are a note summarization assistant.
Summarize the note below into exactly 3 concise bullet points.
Do NOT add opinions, plans, or extra facts.
Return ONLY the 3 bullet points.

NOTE:
{input}`,

  rewrite:
    `You are a rewriting assistant.
Rewrite the note below more clearly and concisely.
Preserve all meaning. Do NOT add new ideas.
Return ONLY the rewritten text.

NOTE:
{input}`,

  improveWriting:
    `You are a writing coach.
Improve the style, clarity, and flow of the text below.
Fix awkward phrasing. Keep the meaning intact.
Return ONLY the improved text.

TEXT:
{input}`,

  fixGrammar:
    `You are a grammar correction tool.
Fix all spelling, grammar, and punctuation errors in the text below.
Do NOT change the meaning or rewrite sentences unnecessarily.
Return ONLY the corrected text.

TEXT:
{input}`,

  bulletPoints:
    `You are a note formatter.
Convert the text below into a clean, structured bullet-point list.
Group related ideas under clear headings if needed.
Return ONLY the formatted bullet list.

TEXT:
{input}`,

  actionItems:
    `You are an action-item extractor.
Extract every concrete action item from the note below.
Format each as: "[ ] Action item"
Return ONLY the action item list.

NOTE:
{input}`,

  draftEmail:
    `You are an email drafting assistant.
Draft a clear, professional email based on the note below.
Include a subject line, greeting, body, and sign-off.
Do NOT mention AI or sticky notes.
Return ONLY the email text.

NOTE:
{input}`,

  brainstorm:
    `You are a creative brainstorming assistant.
Generate 8–10 fresh ideas inspired by the note below.
Be specific and creative. Format as a numbered list.
Return ONLY the ideas.

NOTE:
{input}`,

  concise:
    `You are a rewriting tool.
Rewrite the text below in a shorter, clearer way.
Keep the meaning exactly the same. Do NOT add new ideas.
Return ONLY the concise rewritten text.

TEXT:
{input}`,

  draftReply:
    `You are an email reply assistant.
Write a short, professional reply to the email below.
Be polite and clear. Do NOT mention AI or sticky notes.
Return ONLY the reply text.

EMAIL:
{input}`
};

async function submitAiTemplate(type) {
  if (aiBusy) return;
  const inputEl = getAiQueryInputElement();
  let userText = (inputEl?.value || "").trim();

  // Auto-fallback: use current open note's content when input is empty
  if (!userText) {
    const note = findStickyById(expandedStickyId || selectedStickyId);
    if (note) {
      const titlePart = note.title ? `${note.title}\n\n` : '';
      userText = `${titlePart}${getNotePlainText(note)}`.trim();
    }
  }

  if (!userText) {
    setAiResults("Please open a note or type some text first.");
    return;
  }

  const template = AI_PROMPT_TEMPLATES[type];
  if (!template) return;

  aiBusy = true;
  setAiAskDisabled(true);
  setAiResults("Thinking...", []);
  try {
    const prompt = template.replace("{input}", userText);
    const data = await callAiEndpoint("/api/ai/query", {
      query: prompt,
      mode: "chat",
      contextItems: []
    });
    setAiResults(data.answer || "No response.", []);
  } catch (error) {
    setAiResults(`AI Error: ${error.message || "Request failed"}`);
    console.error("[AI] submitAiTemplate error:", error);
  } finally {
    aiBusy = false;
    setAiAskDisabled(false);
  }
}

function _getNoteTextForAi() {
  const note = findStickyById(expandedStickyId || selectedStickyId);
  if (!note) return null;
  const titlePart = note.title ? `${note.title}\n\n` : '';
  return `${titlePart}${getNotePlainText(note)}`.trim() || null;
}

async function thinkingSummarizeNote() {
  const text = _getNoteTextForAi();
  if (!text) { setAiResults('Please open a note to summarize.'); if (typeof switchAiCardTab === 'function') switchAiCardTab('chat'); return; }
  const el = getAiQueryInputElement();
  if (el) el.value = text;
  await submitAiTemplate('summarize');
}

async function thinkingRewriteNote() {
  const text = _getNoteTextForAi();
  if (!text) { setAiResults('Please open a note to rewrite.'); if (typeof switchAiCardTab === 'function') switchAiCardTab('chat'); return; }
  const el = getAiQueryInputElement();
  if (el) el.value = text;
  await submitAiTemplate('rewrite');
}

async function thinkingImproveWriting() {
  const text = _getNoteTextForAi();
  if (!text) { setAiResults('Please open a note first.'); if (typeof switchAiCardTab === 'function') switchAiCardTab('chat'); return; }
  const el = getAiQueryInputElement();
  if (el) el.value = text;
  await submitAiTemplate('improveWriting');
}

async function thinkingFixGrammar() {
  const text = _getNoteTextForAi();
  if (!text) { setAiResults('Please open a note first.'); switchAiCardTab('chat'); return; }
  const el = getAiQueryInputElement();
  if (el) el.value = text;
  await submitAiTemplate('fixGrammar');
}

async function thinkingBulletPoints() {
  const text = _getNoteTextForAi();
  if (!text) { setAiResults('Please open a note first.'); switchAiCardTab('chat'); return; }
  const el = getAiQueryInputElement();
  if (el) el.value = text;
  await submitAiTemplate('bulletPoints');
}

async function thinkingActionItems() {
  const text = _getNoteTextForAi();
  if (!text) { setAiResults('Please open a note first.'); switchAiCardTab('chat'); return; }
  const el = getAiQueryInputElement();
  if (el) el.value = text;
  await submitAiTemplate('actionItems');
}

async function thinkingDraftEmail() {
  const text = _getNoteTextForAi();
  if (!text) { setAiResults('Please open a note first.'); switchAiCardTab('chat'); return; }
  const el = getAiQueryInputElement();
  if (el) el.value = text;
  await submitAiTemplate('draftEmail');
}

function generateStickyEmail() { thinkingDraftEmail(); }

async function thinkingBrainstorm() {
  const text = _getNoteTextForAi();
  if (!text) { setAiResults('Please open a note first.'); switchAiCardTab('chat'); return; }
  const el = getAiQueryInputElement();
  if (el) el.value = text;
  await submitAiTemplate('brainstorm');
}

/* --- Toggle AI Popover --- */

window.toggleAiPopover = function(open) {
  const popover = document.getElementById("aiPopover");
  if (!popover) return;

  aiPopoverOpen = (open !== undefined) ? open : !aiPopoverOpen;
  
  if (aiPopoverOpen) {
    popover.classList.add("ai-drawer-visible");
    popover.style.display = "flex";
    popover.style.pointerEvents = "auto";

    // Restore fullscreen if it was active before
    const wasFullscreen = localStorage.getItem('ai_fullscreen') === '1';
    if (wasFullscreen) {
      // Let CSS handle everything — clear inline overrides
      popover.style.transform = '';
      popover.style.opacity = '';
      popover.style.width = '';
      popover.style.height = '';
      popover.style.top = '';
      popover.style.left = '';
      popover.style.right = '';
      popover.style.bottom = '';
      popover.classList.add('ai-popover-fullscreen');
      document.body.classList.add('ai-fullscreen-mode');
      // Update expand button icon
      const expandBtn = document.getElementById("aiExpandToggleBtn");
      if (expandBtn) {
        expandBtn.setAttribute("title", "Collapse to Standard");
        expandBtn.innerHTML = `<i data-lucide="minimize-2" style="width:13px;height:13px;"></i>`;
        if (window.lucide) window.lucide.createIcons({ root: expandBtn });
      }
    } else {
      popover.style.transform = "translateX(0)";
      popover.style.opacity = "1";
    }
    
    document.body.classList.add("ai-drawer-open");
    checkAiHealth();
    renderDynamicContextChips();
    
    // Auto-focus the input box
    setTimeout(() => {
      const input = getAiQueryInputElement();
      if (input) input.focus();
    }, 100);
  } else {
    // If popover is fullscreen, toggle it off cleanly
    if (popover.classList.contains("ai-popover-fullscreen")) {
      popover.classList.remove('ai-popover-fullscreen');
      document.body.classList.remove('ai-fullscreen-mode');
      try { localStorage.setItem('ai_fullscreen', '0'); } catch(e) {}
    }
    
    popover.classList.remove("ai-drawer-visible");
    popover.style.transform = "translateX(calc(100% + 20px))";
    popover.style.opacity = "0";
    popover.style.pointerEvents = "none";
    
    document.body.classList.remove("ai-drawer-open");
    abortAiGeneration();
  }

  // Update layout matching the new margins
  debouncedRenderStickies();
};


window.dismissNoteSummary = dismissNoteSummary;
window._dismissedNoteSummaries = window._dismissedNoteSummaries || new Set();

function dismissNoteSummary(noteId) {
  window._dismissedNoteSummaries = window._dismissedNoteSummaries || new Set();
  window._dismissedNoteSummaries.add(noteId);
  const summaryBar = document.getElementById('noteSummaryBar');
  if (summaryBar) {
    summaryBar.classList.add('hidden');
    summaryBar.innerHTML = '';
  }
}

function maybeShowNoteSummary(note) {
  // Disabled automatic suggestion banner per user preference.
  // AI Summary is now available on-demand directly via slash command (/ai summary, /summary).
  return;
}

async function generateNoteSummary(noteId) {
  const note = findStickyById(noteId);
  if (!note) return;
  
  const summaryBar = document.getElementById('noteSummaryBar');
  if (!summaryBar) return;
  
  summaryBar.classList.remove('hidden');
  // Show loading
  summaryBar.innerHTML = `
    <div class="ai-suggestion-banner">
      <div class="ai-loading-dots" style="display:flex;gap:3px;align-items:center;height:14px;margin-right:4px;">
        <span style="width:4px;height:4px;border-radius:50%;background:var(--accent);animation:pulse 1s infinite alternate;"></span>
        <span style="width:4px;height:4px;border-radius:50%;background:var(--accent);animation:pulse 1s infinite alternate;animation-delay:0.2s;"></span>
        <span style="width:4px;height:4px;border-radius:50%;background:var(--accent);animation:pulse 1s infinite alternate;animation-delay:0.4s;"></span>
      </div>
      <span>Analyzing note and generating summary...</span>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons({ root: summaryBar });
  
  const text = getNotePlainText(note);
  const prompt = `Summarize this note in 3 concise bullet points. Be specific, not generic. Note title: "${note.title || 'Untitled'}"\n\nContent:\n${text.slice(0, 4000)}\n\nRespond with exactly 3 bullet points using "•" character. No intro text, no conversational text.`;
  
  try {
    const payload = { query: prompt, mode: "chat", contextItems: [] };
    const response = await callAiEndpoint("/api/ai/query", payload);
    let summary = response.answer || "Could not generate summary.";
    // Strip reasoning details block if present
    summary = summary.replace(/<details>[\s\S]*?<\/details>/gi, '').trim();
    
    // Format summary using formatAskResponse or marked if available
    const parsedSummary = (typeof marked !== 'undefined') ? marked.parse(summary) : formatAskResponse(summary);
    
    summaryBar.innerHTML = `
      <details open class="ai-summary-details">
        <summary style="display:flex; justify-content:space-between; align-items:center;">
          <span style="display:flex; align-items:center; gap:6px;">
            <i data-lucide="sparkles" style="width:14px; height:14px; color:var(--accent);"></i>
            AI Summary
          </span>
          <button class="note-summary-dismiss" onclick="dismissNoteSummary('${note.id}')" title="Close summary" style="
            background: none; border: none; color: var(--text-secondary); cursor: pointer;
            padding: 2px 4px; display: flex; align-items: center; justify-content: center;
            opacity: 0.6; transition: opacity 0.15s ease;
          " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.6'">
            <i data-lucide="x" style="width:13px; height:13px;"></i>
          </button>
        </summary>
        <div class="ai-summary-content">
          ${parsedSummary}
        </div>
      </details>
    `;
    if (window.lucide) window.lucide.createIcons({ root: summaryBar });
  } catch (error) {
    summaryBar.innerHTML = `
      <div class="ai-suggestion-banner" style="border-left-color: var(--red) !important;">
        <span style="color:var(--red);">⚠️ Failed to generate summary: ${error.message || 'Request failed'}</span>
        <button class="note-summary-trigger" onclick="generateNoteSummary('${noteId}')" style="color: var(--red) !important; background: color-mix(in srgb, var(--red) 8%, transparent) !important; border: 1px solid color-mix(in srgb, var(--red) 15%, transparent) !important;">Retry</button>
        <button class="note-summary-dismiss" onclick="dismissNoteSummary('${noteId}')" title="Close" style="
          background: none; border: none; color: var(--text-secondary); cursor: pointer;
          padding: 2px 4px; display: flex; align-items: center; justify-content: center;
          opacity: 0.6; margin-left: 6px;
        ">
          <i data-lucide="x" style="width:13px; height:13px;"></i>
        </button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ root: summaryBar });
  }
}

let autoTagTimer = null;

function scheduleAutoTagSuggestion(noteId) {
  if (autoTagTimer) clearTimeout(autoTagTimer);
  autoTagTimer = setTimeout(() => suggestTagsForNote(noteId), 5000); // 5s debounce
}

async function suggestTagsForNote(noteId) {
  // Guard: if the user navigated to a different note before the timer fired, abort
  if (noteId !== (expandedStickyId || selectedStickyId)) return;
  const note = findStickyById(noteId);
  if (!note) return;
  const text = getNotePlainText(note);
  if (text.split(/\s+/).filter(Boolean).length < 50) return; // Only suggest for > 50 words
  
  // Don't interrupt if noteSummaryBar has a summary active or currently generating
  const summaryBar = document.getElementById('noteSummaryBar');
  if (summaryBar && !summaryBar.classList.contains('hidden') && (summaryBar.querySelector('details') || summaryBar.textContent.includes('Generating') || summaryBar.textContent.includes('Analyzing'))) {
    return;
  }
  
  const provider = getActiveAiProvider();
  const apiKey = getAiApiKey(provider);
  if (!apiKey && provider !== 'local') return; // Silent return if not configured
  
  const existingTags = (note.tags || []).join(', ');
  const prompt = `Suggest 1-3 highly relevant, simple, lowercase tags for this note. Avoid generic tags. Return ONLY the tags as a comma-separated list without '#' symbol and without explanations.
Title: ${note.title || 'Untitled'}
Existing tags: ${existingTags || 'none'}
Content: ${text.slice(0, 1000)}
Tags:`;

  try {
    const response = await callAiEndpoint("/api/ai/query", { query: prompt, mode: "chat", contextItems: [] });
    let tagsStr = response.answer || "";
    // Strip reasoning details block if present
    tagsStr = tagsStr.replace(/<details>[\s\S]*?<\/details>/gi, '').trim();
    // Clean tag string
    tagsStr = tagsStr.replace(/Tags:/i, '').replace(/#/g, '').trim();
    if (!tagsStr) return;
    
    const suggestedTags = tagsStr.split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 1 && !(note.tags || []).map(et => et.toLowerCase()).includes(t))
      .slice(0, 3);
      
    if (suggestedTags.length === 0) return; // All tags already exist or empty
    
    showTagSuggestions(noteId, suggestedTags);
  } catch (error) {
    console.error("[AI Tag suggestion error]", error);
  }
}

function showTagSuggestions(noteId, suggestedTags) {
  const summaryBar = document.getElementById('noteSummaryBar');
  if (!summaryBar) return;
  
  summaryBar.innerHTML = `
    <div class="tag-suggestion-bar">
      <span style="font-weight: 600; color: var(--text-secondary); display: flex; align-items: center; gap: 4px;">
        <i data-lucide="tag" style="width:13px; height:13px; color:var(--accent);"></i>
        Suggested tags:
      </span>
      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        ${suggestedTags.map(tag => {
          const safeTag = tag.replace(/'/g, "\\'");
          return `<span class="suggested-tag-chip" onclick="applySingleSuggestedTag('${noteId}', '${safeTag}', this)" title="Click to add #${tag}" style="cursor:pointer;">+ #${tag}</span>`;
        }).join('')}
      </div>
      <div style="margin-left: auto; display: flex; gap: 6px;">
        <button class="btn-primary" onclick="applyAllSuggestedTags('${noteId}', ${JSON.stringify(suggestedTags).replace(/"/g, '&quot;')})">Add all</button>
        <button class="btn-secondary" onclick="dismissTagSuggestions()">Dismiss</button>
      </div>
    </div>
  `;
  summaryBar.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons({ root: summaryBar });
}

function applySingleSuggestedTag(noteId, tag, el) {
  const note = (typeof findStickyById === 'function') ? findStickyById(noteId) : null;
  if (!note) return;

  if (!note.tags) note.tags = [];
  const cleanTag = tag.replace(/^#/, '').trim();
  if (!note.tags.map(t => t.toLowerCase()).includes(cleanTag.toLowerCase())) {
    note.tags.push(cleanTag);
    note.updatedAt = Date.now();
    if (typeof renderLiveTags === 'function') renderLiveTags(note.tags);
    if (typeof renderSidebarTags === 'function') renderSidebarTags();
    if (typeof craftSave === 'function') craftSave();
    else if (typeof save === 'function') save({ debounced: true });
    showThinkingToast(`Tag #${cleanTag} added!`);
  }

  // Remove the clicked chip from the suggestion bar
  if (el) el.remove();

  // If no more chips remain in the suggestion bar, auto-dismiss the bar
  const summaryBar = document.getElementById('noteSummaryBar');
  if (summaryBar) {
    const remainingChips = summaryBar.querySelectorAll('.suggested-tag-chip');
    if (remainingChips.length === 0) {
      dismissTagSuggestions();
    }
  }
}

function applyAllSuggestedTags(noteId, suggestedTags) {
  const note = (typeof findStickyById === 'function') ? findStickyById(noteId) : null;
  if (!note) return;
  
  if (!note.tags) note.tags = [];
  let added = 0;
  suggestedTags.forEach(tag => {
    const cleanTag = tag.replace(/^#/, '').trim();
    if (!note.tags.map(t => t.toLowerCase()).includes(cleanTag.toLowerCase())) {
      note.tags.push(cleanTag);
      added++;
    }
  });
  
  note.updatedAt = Date.now();
  if (typeof renderLiveTags === 'function') renderLiveTags(note.tags);
  if (typeof renderSidebarTags === 'function') renderSidebarTags();
  if (typeof craftSave === 'function') craftSave();
  else if (typeof save === 'function') save({ debounced: true });
  dismissTagSuggestions();
  showThinkingToast(added > 0 ? "Tags added!" : "Tags already present.");
}

function dismissTagSuggestions() {
  const summaryBar = document.getElementById('noteSummaryBar');
  if (summaryBar) {
    summaryBar.classList.add('hidden');
    summaryBar.innerHTML = '';
  }
}


function showInlineAiPopup(anchorEl, note, block) {
  // Remove any existing inline AI popup
  const existing = document.getElementById('inlineAiPopup');
  if (existing) existing.remove();
  
  const rect = anchorEl.getBoundingClientRect();
  const popup = document.createElement('div');
  popup.id = 'inlineAiPopup';
  popup.className = 'inline-ai-popup';
  popup.innerHTML = `
    <div class="inline-ai-header">
      <i data-lucide="sparkles" style="width:12px; height:12px;"></i>
      <span>AI Command</span>
    </div>
    <div class="inline-ai-chips">
      <button onclick="runInlineAi('Continue writing', '${block.id}', '${note.id}')">✏️ Continue writing</button>
      <button onclick="runInlineAi('Fix grammar and spelling', '${block.id}', '${note.id}')">✅ Fix grammar</button>
      <button onclick="runInlineAi('Make it more concise', '${block.id}', '${note.id}')">✂️ Make concise</button>
      <button onclick="runInlineAi('Make it more formal', '${block.id}', '${note.id}')">👔 More formal</button>
    </div>
    <div class="inline-ai-input-row">
      <input id="inlineAiInput" placeholder="Type custom instruction..." onkeydown="if(event.key === 'Enter') runInlineAiCustom('${block.id}', '${note.id}')" />
      <button onclick="runInlineAiCustom('${block.id}', '${note.id}')">
        <i data-lucide="arrow-right" style="width:14px; height:14px;"></i>
      </button>
    </div>
  `;
  
  // Place it directly below the block content line
  popup.style.cssText = `
    position: fixed;
    top: ${rect.bottom + 8}px;
    left: ${Math.min(rect.left, window.innerWidth - 380)}px;
    z-index: 100000;
  `;
  
  document.body.appendChild(popup);
  
  const input = document.getElementById('inlineAiInput');
  if (input) input.focus();
  
  if (window.lucide) window.lucide.createIcons({ root: popup });
  
  // Close popup on click outside
  setTimeout(() => {
    const clickListener = (e) => {
      const inlinePopup = document.getElementById('inlineAiPopup');
      if (inlinePopup && !inlinePopup.contains(e.target) && !anchorEl.contains(e.target)) {
        inlinePopup.remove();
        document.removeEventListener('click', clickListener);
      }
    };
    document.addEventListener('click', clickListener);
  }, 100);
}

function closeInlineAiPopup() {
  const popup = document.getElementById('inlineAiPopup');
  if (popup) popup.remove();
}

function runInlineAiCustom(blockId, noteId) {
  const input = document.getElementById('inlineAiInput');
  const instruction = input ? input.value.trim() : '';
  if (!instruction) return;
  runInlineAi(instruction, blockId, noteId);
}

async function runInlineAi(instruction, blockId, noteId) {
  const note = findStickyById(noteId);
  if (!note) return;
  
  if (!note.blocks) return; // Simple notes without blocks can't use inline AI
  const block = note.blocks.find(b => b.id === blockId);
  if (!block) return;
  
  closeInlineAiPopup();
  
  const blockEl = document.getElementById(blockId);
  const contentEl = blockEl ? blockEl.querySelector('.craft-block-content') : null;
  if (!contentEl) return;
  
  // Get surrounding context of previous 2 blocks as context
  const idx = note.blocks.findIndex(b => b.id === blockId);
  let contextStr = "";
  if (idx > 0) {
    const prevBlocks = note.blocks.slice(Math.max(0, idx - 2), idx);
    contextStr = prevBlocks.map(b => getPlainTextContent(b.content || "")).join("\n");
  }
  
  const blockContent = getPlainTextContent(block.content || "");
  
  // Show active inline generation placeholder
  contentEl.innerHTML = `<span class="ai-inline-generating" style="color:var(--muted); font-style:italic;">AI is thinking...</span>`;
  
  const prompt = `You are an inline note assistant. Given the surrounding note context, process the current block content following this instruction.
Surrounding Context:
${contextStr}

Current Block Content:
${blockContent}

Instruction:
${instruction}

Provide ONLY the final direct processed text to replace or continue the current block. Do NOT wrap in quotes, do NOT include explanations, introduction, or conversational filler. Respond ONLY with the final text.`;

  try {
    let resultText = "";
    const payload = { query: prompt, mode: "chat", contextItems: [] };
    
    // We stream it directly into the block's innerHTML
    await callAiEndpoint("/api/ai/query", payload, (chunk, type) => {
      if (type === 'reasoning') return; // Skip reasoning chunks
      
      // Clear placeholder on first chunk
      const placeholder = contentEl.querySelector('.ai-inline-generating');
      if (placeholder) contentEl.innerHTML = "";
      
      resultText += chunk;
      // Use textContent during streaming to avoid interpreting AI tokens as HTML
      contentEl.textContent = resultText;
    });
    
    // Parse inline markdown before saving
    let finalContent = resultText;
    if (typeof marked !== 'undefined') {
      let html = marked.parse(resultText).trim();
      if (html.startsWith('<p>') && html.endsWith('</p>')) {
        html = html.slice(3, -4);
      }
      finalContent = html;
    } else {
      finalContent = resultText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
    }
    if (typeof safeHTML === 'function') {
      finalContent = safeHTML(finalContent);
    }
    
    block.content = finalContent;
    if (typeof renderBlockEditor === 'function') renderBlockEditor(note);
    if (typeof craftSave === 'function') craftSave();
    
    // Set caret focus back to block
    setTimeout(() => {
      const el = document.getElementById(blockId);
      if (el) {
        const cEl = el.querySelector('.craft-block-content');
        if (!cEl) return;
        cEl.focus();
        if (typeof placeCaretAtEnd === 'function') placeCaretAtEnd(cEl);
      }
    }, 50);
  } catch (error) {
    contentEl.innerHTML = blockContent; // Restore original content
    showThinkingToast(`Inline AI failed: ${error.message || 'Request failed'}`);
  }
}


// Auto-generate Daily Digest once per calendar day, use cached result otherwise
function maybeAutoGenerateDigest() {
  const digestContent = document.getElementById('aiDigestContent');
  if (!digestContent) return;

  const todayKey = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const cacheKey = 'ai_digest_cache';
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    if (cached && cached.date === todayKey && cached.html) {
      // Restore cached digest immediately
      digestContent.innerHTML = cached.html;
      if (window.lucide) window.lucide.createIcons({ root: digestContent });
      return;
    }
  } catch(e) {}

  // No valid cache — generate fresh
  generateDailyDigest();
}


async function generateDailyDigest() {
  const digestContent = document.getElementById('aiDigestContent');
  if (!digestContent) return;
  
  // Show loading state
  digestContent.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding: 48px 24px; gap: 16px; height: 100%;">
      <div class="ai-loading-dots" style="display:flex;gap:4px;">
        <span style="width:6px; height:6px; border-radius:50%; background:var(--accent); animation: pulse 1s infinite alternate;"></span>
        <span style="width:6px; height:6px; border-radius:50%; background:var(--accent); animation: pulse 1s infinite alternate; animation-delay: 0.2s;"></span>
        <span style="width:6px; height:6px; border-radius:50%; background:var(--accent); animation: pulse 1s infinite alternate; animation-delay: 0.4s;"></span>
      </div>
      <span style="font-size:13px; font-weight:500; color:var(--text-secondary);">Analyzing notes & gathering action items...</span>
    </div>
  `;
  
  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);
  const startOfDayMs = startOfDay.getTime();
  
  const todayNotes = (state.notes || []).filter(n => {
    const noteTime = safeParseTime(n.updatedAt || n.createdAt);
    return noteTime >= startOfDayMs && !n.archived;
  });
  
  let isFallback = false;
  let targetNotes = todayNotes;
  if (targetNotes.length === 0) {
    isFallback = true;
    targetNotes = (state.notes || [])
      .filter(n => !n.archived)
      .sort((a, b) => safeParseTime(b.updatedAt || b.createdAt) - safeParseTime(a.updatedAt || a.createdAt))
      .slice(0, 3);
  }
  
  const outstandingTodos = [];
  (state.notes || []).forEach(n => {
    if (n.archived) return;
    (n.blocks || []).forEach(b => {
      if (b.type === 'todo' && !b.checked) {
        const text = getPlainTextContent(b.content || "").trim();
        if (text) {
          outstandingTodos.push({ text, noteTitle: n.title || "Untitled" });
        }
      }
    });
  });
  
  let context = "";
  if (isFallback) {
    context += `No notes were modified today. Showing summaries for the 3 most recently modified notes:\n\n`;
  } else {
    context += `Here are the notes modified today:\n\n`;
  }
  
  targetNotes.forEach((n, idx) => {
    const text = getNotePlainText(n);
    context += `--- Note #${idx+1}: ${n.title || 'Untitled'} ---\nContent:\n${text.slice(0, 1500)}\n\n`;
  });
  
  context += `\nOutstanding action items/todos across all notes:\n`;
  if (outstandingTodos.length === 0) {
    context += `None.\n`;
  } else {
    outstandingTodos.slice(0, 10).forEach((todo, idx) => {
      context += `- [ ] ${todo.text} (from note: "${todo.noteTitle}")\n`;
    });
  }
  
  const currentHour = new Date().getHours();
  let greetingTime = "day";
  if (currentHour < 12) greetingTime = "morning";
  else if (currentHour < 18) greetingTime = "afternoon";
  else greetingTime = "evening";
  
  const prompt = `You are the Daily Digest generator for "thinkOS", a personal knowledge assistant.
Based on the following content, generate a beautiful, premium, markdown-formatted summary report.

Information Context:
${context}

Instructions:
1. Write a short, encouraging summary header: "Good ${greetingTime}! Here is your knowledge digest."
2. "Today's Focus" (or "Recent Focus" if fallback): Summarize key highlights and progress from the notes context. Focus on connecting ideas across notes.
3. "Action Items": List up to 5 highest-priority outstanding action items, formatted as markdown tasks. If there are none, note it.
4. "Themes & Insights": Suggest 2-3 tags or themes that tie these notes and action items together.

Return ONLY the markdown-formatted report. Do NOT wrap in extra tags or markdown code blocks.`;

  try {
    const payload = { query: prompt, mode: "chat", contextItems: [] };
    const response = await callAiEndpoint("/api/ai/query", payload);
    let reportText = response.answer || "Could not generate digest.";
    // Strip reasoning details block if present
    reportText = reportText.replace(/<details>[\s\S]*?<\/details>/gi, '').trim();
    
    // Parse markdown
    const parsedReport = (typeof marked !== 'undefined') ? marked.parse(reportText) : formatAskResponse(reportText);
    
    const digestHtml = `
      <div style="display:flex; flex-direction:column; gap:16px; line-height:1.6; color:var(--text); padding-bottom: 24px;">
        <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border-soft); padding-bottom:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <i data-lucide="sparkles" style="width:16px; height:16px; color:var(--accent);"></i>
            <span style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--accent); letter-spacing:0.05em;">Generated Digest</span>
          </div>
          <button onclick="generateDailyDigest()" style="background:none; border:none; color:var(--accent); font-weight:600; cursor:pointer; font-size:11px; display:flex; align-items:center; gap:4px;">
            <i data-lucide="rotate-cw" style="width:11px; height:11px;"></i> Refresh
          </button>
        </div>
        <div class="ai-response-content" style="font-size:13.5px;">
          ${parsedReport}
        </div>
      </div>
    `;
    digestContent.innerHTML = digestHtml;
    
    // Cache with today's date
    const todayKey = new Date().toISOString().slice(0, 10);
    try {
      localStorage.setItem('ai_digest_cache', JSON.stringify({ date: todayKey, html: digestHtml }));
    } catch(e) {}
    
    if (window.lucide) window.lucide.createIcons({ root: digestContent });
  } catch (error) {
    digestContent.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding: 48px 24px; gap: 16px; height: 100%;">
        <span style="color:var(--red); font-size:13px; font-weight:500;">⚠️ Failed to generate digest: ${error.message || 'Request failed'}</span>
        <button onclick="generateDailyDigest()" style="
          background: var(--accent);
          border: none;
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        ">Retry</button>
      </div>
    `;
  }
}


/* ─── Taskboard Deep-Link Action Dispatcher ─────────────────────────────── */

function applyAiTaskboardActions(btn, encodedActions) {
  let actions;
  try {
    const parsed = JSON.parse(decodeURIComponent(encodedActions));
    actions = Array.isArray(parsed) ? parsed : [parsed];
  } catch(e) {
    showThinkingToast('⚠️ Could not parse actions. Try again.');
    return;
  }

  for (const action of actions) {
    applyAiTaskboardAction(null, encodeURIComponent(JSON.stringify(action)));
  }

  // Remove the confirmation strip
  const strip = btn ? btn.closest('.ai-action-confirm-strip') : null;
  if (strip) strip.remove();
}

function applyAiTaskboardAction(btn, encodedAction) {
  let action;
  try {
    action = JSON.parse(decodeURIComponent(encodedAction));
  } catch(e) {
    showThinkingToast('⚠️ Could not parse action. Try again.');
    return;
  }

  const note = (typeof findStickyById === 'function') ? findStickyById(action.noteId) : null;
  if (!note) {
    showThinkingToast('⚠️ Note not found. Make sure the taskboard is still open.');
    return;
  }

  switch (action.type) {

    case 'reorder_tasks': {
      if (!Array.isArray(action.order) || action.order.length === 0) {
        showThinkingToast('⚠️ No order provided by AI.');
        return;
      }
      const taskMap = new Map((note.tasks || []).map(t => [t.id, t]));
      const reordered = action.order
        .map(id => taskMap.get(id))
        .filter(Boolean);
      // Append any tasks not mentioned by AI at the end (safety net)
      (note.tasks || []).forEach(t => {
        if (!action.order.includes(t.id)) reordered.push(t);
      });
      note.tasks = reordered;
      note.updatedAt = Date.now();
      if (typeof craftSave === 'function') craftSave();
      if (typeof renderDailyTaskboard === 'function') renderDailyTaskboard(note);
      showThinkingToast('✅ Tasks reordered!');
      break;
    }

    case 'add_task': {
      const label = (action.label || '').trim();
      if (!label) { showThinkingToast('⚠️ No task label provided.'); return; }
      const newTask = {
        id: 'task_' + (typeof generateUUID === 'function' ? generateUUID() : Date.now()),
        label,
        priority: action.priority || '',
        doneHistory: {},
        order: (note.tasks || []).length
      };
      note.tasks = note.tasks || [];
      note.tasks.push(newTask);
      note.updatedAt = Date.now();
      if (typeof craftSave === 'function') craftSave();
      if (typeof renderDailyTaskboard === 'function') renderDailyTaskboard(note);
      showThinkingToast(`✅ Task added: "${label}"`);
      break;
    }

    case 'complete_task': {
      const task = (note.tasks || []).find(t => t.id === action.taskId);
      if (!task) { showThinkingToast('⚠️ Task not found.'); return; }
      task.doneHistory = task.doneHistory || {};
      const today = (typeof getLocalDateKey === 'function') ? getLocalDateKey() : new Date().toISOString().split('T')[0];
      task.doneHistory[today] = true;
      note.updatedAt = Date.now();
      if (typeof craftSave === 'function') craftSave();
      if (typeof renderDailyTaskboard === 'function') renderDailyTaskboard(note);
      showThinkingToast(`✅ Task marked done: "${task.label}"`);
      break;
    }

    case 'delete_task': {
      const before = (note.tasks || []).length;
      note.tasks = (note.tasks || []).filter(t => t.id !== action.taskId);
      if (note.tasks.length === before) { showThinkingToast('⚠️ Task not found.'); return; }
      note.updatedAt = Date.now();
      if (typeof craftSave === 'function') craftSave();
      if (typeof renderDailyTaskboard === 'function') renderDailyTaskboard(note);
      showThinkingToast('✅ Task deleted.');
      break;
    }

    case 'set_priorities': {
      if (!Array.isArray(action.priorities) || action.priorities.length === 0) {
        showThinkingToast('⚠️ No priorities provided.');
        return;
      }
      let updatedCount = 0;
      action.priorities.forEach(pItem => {
        if (!pItem || !pItem.taskId) return;
        const task = (note.tasks || []).find(t => t.id === pItem.taskId);
        if (task) {
          const newPriority = (pItem.priority === 'none' || !pItem.priority) ? '' : pItem.priority;
          task.priority = newPriority;
          updatedCount++;
        }
      });
      note.updatedAt = Date.now();
      if (typeof craftSave === 'function') craftSave();
      if (typeof renderDailyTaskboard === 'function') renderDailyTaskboard(note);
      showThinkingToast(`✅ Set priorities on ${updatedCount} task(s)!`);
      break;
    }

    case 'set_priority': {
      const task = (note.tasks || []).find(t => t.id === action.taskId);
      if (!task) { showThinkingToast('⚠️ Task not found.'); return; }
      const validPriorities = ['p1', 'p2', 'p3', 'none', ''];
      const newPriority = (action.priority === 'none' || !action.priority) ? '' : action.priority;
      if (!validPriorities.includes(newPriority)) { showThinkingToast(`⚠️ Invalid priority: ${action.priority}`); return; }
      task.priority = newPriority;
      note.updatedAt = Date.now();
      if (typeof craftSave === 'function') craftSave();
      if (typeof renderDailyTaskboard === 'function') renderDailyTaskboard(note);
      const priorityLabel = { p1: 'P1 (High)', p2: 'P2 (Medium)', p3: 'P3 (Low)', '': 'No priority' }[newPriority] || newPriority;
      showThinkingToast(`✅ "${task.label}" → ${priorityLabel}`);
      break;
    }

    default:
      showThinkingToast(`⚠️ Unknown action type: ${action.type}`);
      return;
  }

  // Remove the confirmation strip if triggered from a single-action button
  const strip = btn ? btn.closest('.ai-action-confirm-strip') : null;
  if (strip) strip.remove();
}

function aiFeedback(btn, type) {
  const bubble = btn.closest('.ai-bubble-container');
  const provider = getActiveAiProvider();
  
  // Store feedback log
  const feedbackLog = JSON.parse(localStorage.getItem('ai_feedback_log') || '[]');
  feedbackLog.push({
    ts: Date.now(),
    type: type, // 'good' | 'bad'
    provider: provider,
    model: getAiModel(provider)
  });
  if (feedbackLog.length > 100) feedbackLog.splice(0, feedbackLog.length - 100);
  localStorage.setItem('ai_feedback_log', JSON.stringify(feedbackLog));
  
  // Disable both feedback buttons in this bubble
  const feedbackContainer = btn.parentElement;
  const buttons = feedbackContainer.querySelectorAll('button[onclick^="aiFeedback"]');
  buttons.forEach(b => {
    b.disabled = true;
    b.style.pointerEvents = 'none';
    b.style.opacity = '0.5';
  });
  
  if (type === 'good') {
    btn.innerHTML = '👍 Verified';
    btn.style.color = 'var(--green)';
    showThinkingToast('Thank you for your feedback!');
  } else {
    btn.innerHTML = '👎 Flagged';
    btn.style.color = 'var(--red)';
    // Show quick dropdown
    showFeedbackDropdown(btn, bubble);
  }
}

function showFeedbackDropdown(btn, bubble) {
  // Remove any existing feedback dropdown
  const existing = bubble.querySelector('.ai-feedback-dropdown');
  if (existing) existing.remove();

  const dropdown = document.createElement('div');
  dropdown.className = 'ai-feedback-dropdown';
  dropdown.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: var(--card);
    border: 1px solid var(--accent-border);
    border-radius: 8px;
    padding: 6px;
    position: absolute;
    bottom: 30px;
    right: 10px;
    z-index: 10000;
    box-shadow: var(--shadow-md);
  `;
  
  const options = [
    { label: 'Too long', value: 'too_long' },
    { label: 'Factually wrong', value: 'wrong' },
    { label: 'Not helpful', value: 'not_helpful' },
    { label: 'Off topic', value: 'off_topic' }
  ];
  
  options.forEach(opt => {
    const optBtn = document.createElement('button');
    optBtn.textContent = opt.label;
    optBtn.style.cssText = `
      background: none;
      border: none;
      color: var(--text);
      padding: 4px 8px;
      font-size: 11px;
      cursor: pointer;
      text-align: left;
      border-radius: 4px;
      transition: background 0.15s ease;
    `;
    optBtn.onmouseover = () => optBtn.style.background = 'var(--border-soft)';
    optBtn.onmouseout = () => optBtn.style.background = 'none';
    optBtn.onclick = () => {
      submitDetailedFeedback(opt.value);
      dropdown.remove();
    };
    dropdown.appendChild(optBtn);
  });
  
  bubble.appendChild(dropdown);
  
  // Close dropdown when clicked outside
  setTimeout(() => {
    const closeListener = (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.remove();
        document.removeEventListener('click', closeListener);
      }
    };
    document.addEventListener('click', closeListener);
  }, 100);
}

function submitDetailedFeedback(reason) {
  const feedbackLog = JSON.parse(localStorage.getItem('ai_feedback_log') || '[]');
  if (feedbackLog.length > 0) {
    feedbackLog[feedbackLog.length - 1].reason = reason;
    localStorage.setItem('ai_feedback_log', JSON.stringify(feedbackLog));
  }
  showThinkingToast(`Feedback submitted: ${reason.replace('_', ' ')}`);
}

/* --- Init --- */

const AI_DRAWER_HTML = `
    <div id="aiPopover" style="display: flex; flex-direction: column;">
      <!-- Header: 3-column layout: title | tabs (center) | controls -->
      <div class="ai-drawer-head" style="padding: 8px 12px 8px 16px; border-bottom: 1px solid var(--border-soft); background: var(--panel); display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; flex-shrink: 0;">
        <h3 style="font-size: 13px; font-weight: 600; display:flex; align-items:center; gap:6px; color:var(--text); margin:0; white-space:nowrap;">
          <i data-lucide="sparkles" style="width:14px;height:14px;color:var(--accent);"></i>
        </h3>

        <!-- Compact segmented tab control in center -->
        <div class="ai-drawer-tabs" style="display:flex; align-items:center; overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none; -webkit-overflow-scrolling:touch; min-width:0; margin:0 auto;">
          <div style="display:inline-flex; gap:8px; flex-shrink:0; align-items:center;">
            <button id="aiTabWrite" class="ai-drawer-tab active" onclick="switchAiDrawerTab('write')" style="
              background: none; color: var(--accent); border: none; border-bottom: 2px solid var(--accent); border-radius: 0;
              padding: 6px 4px; font-size: 11px; font-weight: 600; cursor: pointer;
              font-family: var(--font-sans); transition: all 0.18s ease; white-space: nowrap;
            ">Think</button>
            <button id="aiTabAsk" class="ai-drawer-tab" onclick="switchAiDrawerTab('ask')" style="
              background: none; color: var(--text-secondary); border: none; border-bottom: 2px solid transparent; border-radius: 0;
              padding: 6px 4px; font-size: 11px; font-weight: 500; cursor: pointer;
              font-family: var(--font-sans); transition: all 0.18s ease; white-space: nowrap;
            ">Ask Notes</button>
            <button id="aiTabDigest" class="ai-drawer-tab" onclick="switchAiDrawerTab('digest')" style="
              background: none; color: var(--text-secondary); border: none; border-bottom: 2px solid transparent; border-radius: 0;
              padding: 6px 4px; font-size: 11px; font-weight: 500; cursor: pointer;
              font-family: var(--font-sans); transition: all 0.18s ease; white-space: nowrap;
            ">Digest</button>
          </div>
        </div>

        <!-- Right controls -->
        <div style="display:flex; align-items:center; gap:4px; flex-shrink:0;">
          <select id="aiModelSelectorTop" onchange="changeAiModelTop(this.value)" style="
            background: var(--card); border: 1px solid var(--accent-border, rgba(0,0,0,0.1));
            border-radius: 9999px; padding: 2px 8px; font-size: 11px; cursor: pointer; color: var(--text);
            outline: none; font-family: var(--font-sans); height: 22px; font-weight: 500;
            max-width: 90px;
          ">
            <option value="gemini">Gemini</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Claude</option>
            <option value="deepseek">DeepSeek</option>
            <option value="nvidia">Nvidia NIM</option>
            <option value="openrouter">OpenRouter</option>
            <option value="huggingface">Hugging Face</option>
            <option value="local">Local AI</option>
          </select>
          <button id="aiClearChatBtn" onclick="clearAiChat()" style="background:none; border:none; cursor:pointer; color:var(--text-secondary); display:flex; align-items:center; justify-content:center; padding:4px;" title="Clear Chat / New Chat">
            <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
          </button>
          <button id="aiSettingsToggleBtn" onclick="toggleAiSettingsPanel()" style="background:none; border:none; cursor:pointer; color:var(--text-secondary); display:flex; align-items:center; justify-content:center; padding:4px;" title="AI Settings">
            <i data-lucide="settings" style="width:13px;height:13px;"></i>
          </button>
          <button id="aiExpandToggleBtn" onclick="toggleAiPopoverFullscreen()" style="background:none; border:none; cursor:pointer; color:var(--text-secondary); display:flex; align-items:center; justify-content:center; padding:4px;" title="Expand to Fullscreen">
            <i data-lucide="maximize-2" style="width:13px;height:13px;"></i>
          </button>
          <button id="aiClearKeyBtn" class="hidden" onclick="clearApiKeyLocally()" style="background: none; border: none; cursor: pointer; color: var(--red); display:flex; align-items:center; padding:4px;" title="Sign Out AI">
            <i data-lucide="log-out" style="width:13px;height:13px;"></i>
          </button>
          <button class="ai-drawer-close" onclick="toggleAiPopover(false)" title="Close AI Panel" style="background:none; border:none; cursor:pointer; font-size:14px; padding:4px; color:var(--text-secondary);">✕</button>
        </div>
      </div>

      <!-- Settings Dropdown Panel -->
      <div id="aiSettingsDropdownPanel" class="hidden" style="
        position: absolute; top: 44px; right: 12px; background: var(--card);
        border: 1px solid var(--accent-border); border-radius: 12px; padding: 12px;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
        width: 250px; z-index: 1000; display: flex; flex-direction: column; gap: 8px;
      ">
        <p id="aiProviderInstructions" style="font-size: 11px; color: var(--text-secondary); margin: 0; line-height: 1.4;"></p>
        
        <div id="aiApiKeyContainer" style="display: flex; flex-direction: column; gap: 4px;">
          <label style="font-size: 10px; font-weight: 600; opacity: 0.8; color: var(--text);">API Key</label>
          <input type="password" id="aiApiKeyInput" placeholder="AIzaSy..." style="
            border: 1px solid var(--accent-border); border-radius: 6px;
            padding: 6px 10px; font-size: 12px; background: var(--card); color: var(--text); outline: none;
          ">
        </div>

        <div id="aiBaseUrlContainer" style="display: none; flex-direction: column; gap: 4px;">
          <label style="font-size: 10px; font-weight: 600; opacity: 0.8; color: var(--text);">API Base URL</label>
          <input type="text" id="aiBaseUrlInput" placeholder="https://..." style="
            border: 1px solid var(--accent-border); border-radius: 6px;
            padding: 6px 10px; font-size: 12px; background: var(--card); color: var(--text); outline: none;
          ">
        </div>

        <div id="aiModelContainer" style="display: none; flex-direction: column; gap: 4px;">
          <label style="font-size: 10px; font-weight: 600; opacity: 0.8; color: var(--text);">Model Name override</label>
          <input type="text" id="aiModelInput" placeholder="gemini-2.5-flash" style="
            border: 1px solid var(--accent-border); border-radius: 6px;
            padding: 6px 10px; font-size: 12px; background: var(--card); color: var(--text); outline: none;
          ">
        </div>

        <button onclick="saveApiKeyLocally()" style="
          background: var(--accent); color: white; border: none; border-radius: 6px;
          padding: 6px 14px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s ease;
          width: fit-content; align-self: flex-end;
        ">
          Save Configuration
        </button>
      </div>

      <!-- Tab 1: Write & Think (Chat Bubble UI) -->
      <div id="aiResultsPopover" style="display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; background: var(--bg);">
        <div id="aiWriteChatHistory" style="flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:12px; min-height:0;">
          <div class="ai-ask-welcome" style="display:flex; flex-direction:column; gap:14px; margin-top:4px; flex-shrink:0;">

            <!-- Suggested AI Queries (Single Line Horizontal Row) -->
            <div style="display:flex; flex-direction:column; gap:6px;">
              <div class="ai-shortcut-chip-container" style="display:flex; align-items:center; gap:6px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none; -ms-overflow-style:none;">
                <button onclick="document.getElementById('aiQueryPopover').value = 'Help me brainstorm ideas for this note'; document.getElementById('aiQueryPopover').focus();" class="ai-shortcut-chip" style="white-space:nowrap; flex-shrink:0;">
                  💡 Brainstorm ideas
                </button>
                <button onclick="document.getElementById('aiQueryPopover').value = 'Summarize this note in 3 bullet points'; document.getElementById('aiQueryPopover').focus();" class="ai-shortcut-chip" style="white-space:nowrap; flex-shrink:0;">
                  📝 Summarize note
                </button>
                <button onclick="document.getElementById('aiQueryPopover').value = 'What are the key action items here?'; document.getElementById('aiQueryPopover').focus();" class="ai-shortcut-chip" style="white-space:nowrap; flex-shrink:0;">
                  ✅ Action items
                </button>
              </div>
            </div>
            <!-- Full Keyboard Shortcuts Guide Card -->
            <div class="ai-shortcuts-guide">
              <h4>
                <span>⌨️ Keyboard Shortcuts Reference</span>
              </h4>
              <table class="ai-shortcuts-table">
                <!-- Navigation & Global -->
                <tr>
                  <td><kbd class="shortcut-key">⌘ K</kbd> / <kbd class="shortcut-key">⌘ P</kbd></td>
                  <td>Command Palette & Quick Search</td>
                </tr>
                <tr>
                  <td><kbd class="shortcut-key">⌘ J</kbd></td>
                  <td>Toggle AI Assistant Drawer</td>
                </tr>
                <tr>
                  <td><kbd class="shortcut-key">⌘ N</kbd></td>
                  <td>Create New Note</td>
                </tr>
                <tr>
                  <td><kbd class="shortcut-key">⌘ T</kbd> / <kbd class="shortcut-key">⌘ W</kbd></td>
                  <td>New Tab / Close Tab</td>
                </tr>
                <tr>
                  <td><kbd class="shortcut-key">⌘ D</kbd> / <kbd class="shortcut-key">⌘ ⇧ E</kbd></td>
                  <td>Duplicate Note / Export PDF</td>
                </tr>

                <!-- Typing & Lists -->
                <tr>
                  <td><kbd class="shortcut-key"># </kbd> / <kbd class="shortcut-key">## </kbd> / <kbd class="shortcut-key">### </kbd></td>
                  <td>Headings (H1, H2, H3)</td>
                </tr>
                <tr>
                  <td><kbd class="shortcut-key">&gt; </kbd> Space</td>
                  <td>Quote Block</td>
                </tr>
                <tr>
                  <td><kbd class="shortcut-key">&gt;&gt; </kbd> Space</td>
                  <td>Toggle List</td>
                </tr>
                <tr>
                  <td><kbd class="shortcut-key">--- </kbd> Space</td>
                  <td>Divider Line</td>
                </tr>
                <tr>
                  <td><kbd class="shortcut-key">\`\`\` </kbd> Space</td>
                  <td>Code Block</td>
                </tr>
                <tr>
                  <td><kbd class="shortcut-key">|</kbd> / <kbd class="shortcut-key">! </kbd></td>
                  <td>Table / Callout Block</td>
                </tr>

                <!-- Formatting & Inline -->
                <tr>
                  <td><kbd class="shortcut-key">@</kbd></td>
                  <td>Mention Page / Insert Bi-link</td>
                </tr>
                <tr>
                  <td><kbd class="shortcut-key">#</kbd></td>
                  <td>Add Tag to Note</td>
                </tr>
                <tr>
                  <td><kbd class="shortcut-key">~~text~~</kbd> / <kbd class="shortcut-key">\`text\`</kbd></td>
                  <td>Strikethrough / Inline Code</td>
                </tr>
                <tr>
                  <td><kbd class="shortcut-key">Tab</kbd> / <kbd class="shortcut-key">⇧ Tab</kbd></td>
                  <td>Indent / Outdent List items</td>
                </tr>
              </table>
            </div>

          </div>
        </div>
      </div>

      <!-- Tab 2: Ask Your Notes Local Chat Panel -->
      <div id="aiAskNotesPanel" style="display: none; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; background: var(--bg);">
        <div id="aiAskChatHistory" style="flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:12px; min-height:0;">
          <div class="ai-ask-welcome" style="display:flex; flex-direction:column; gap:14px; margin-top:4px; flex-shrink:0;">
            
            <div style="display:flex; flex-direction:column; gap:6px;">
              <div class="ai-shortcut-chip-container" style="display:flex; align-items:center; gap:6px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none; -ms-overflow-style:none;">
                <button onclick="document.getElementById('aiQueryPopover').value = 'Summarize my latest meeting notes'; document.getElementById('aiQueryPopover').focus();" class="ai-shortcut-chip" style="white-space:nowrap; flex-shrink:0;">
                  Summarize my latest meeting notes
                </button>
                <button onclick="document.getElementById('aiQueryPopover').value = 'What are my main financial expenses?'; document.getElementById('aiQueryPopover').focus();" class="ai-shortcut-chip" style="white-space:nowrap; flex-shrink:0;">
                  What are my main financial expenses?
                </button>
                <button onclick="document.getElementById('aiQueryPopover').value = 'List high-priority actions/todos'; document.getElementById('aiQueryPopover').focus();" class="ai-shortcut-chip" style="white-space:nowrap; flex-shrink:0;">
                  List high-priority actions/todos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: Daily Digest Panel -->
      <div id="aiDigestPanel" style="display: none; flex-direction: column; flex: 1; min-height: 0; overflow-y: auto; background: var(--bg); padding: 16px;">
        <div id="aiDigestContent" style="display: flex; flex-direction: column; gap: 12px; height: 100%;">
          <div class="ai-ask-welcome" style="display:flex; flex-direction:column; gap:14px; margin-top:4px;">
            <div style="display:flex; flex-direction:column; gap:8px; align-items:center; text-align:center; padding: 24px 16px;">
              <i data-lucide="calendar" style="width:32px; height:32px; color:var(--accent); margin-bottom:8px;"></i>
              <h4 style="margin:0; font-size:15px; font-weight:600; color:var(--text);">Daily Digest</h4>
              <p style="margin:4px 0 16px; font-size:12px; color:var(--text-secondary); max-width:280px;">
                Get an AI-generated personalized summary of today's edits, outstanding tasks, and themes.
              </p>
              <button onclick="generateDailyDigest()" style="
                background: var(--accent);
                border: none;
                color: white;
                padding: 8px 18px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: var(--shadow-sm);
                transition: background 0.15s ease;
              ">
                ✨ Generate Today's Digest
              </button>
            </div>
          </div>
        </div>
      </div>


      <div class="ai-drawer-query" id="aiQuerySection">
        <textarea id="aiQueryPopover" placeholder="Ask anything..." rows="1"
          onkeydown="handleQueryKeydown(event)"
          oninput="adjustTextareaHeight(this)"></textarea>
        <button id="aiStopBtn" class="hidden" onclick="abortAiGeneration()" title="Stop generating">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2"></rect>
          </svg>
        </button>
        <button id="aiSendBtn" onclick="executeAiDrawerAction()">Ask</button>
      </div>
    </div>
`;function insertAiBubbleToNote(btn) {
  const bubble = btn.closest('.ai-bubble-container');
  const textContainer = bubble ? bubble.querySelector('.ai-response-content') : null;
  let rawMd = bubble ? (bubble.dataset.rawMd || textContainer?.innerText || '') : '';
  // Strip the thinking <details> block — don't insert AI reasoning into notes
  rawMd = rawMd.replace(/<details>[\s\S]*?<\/details>/gi, '').trim();
  if (!rawMd) {
    if (typeof showThinkingToast === 'function') showThinkingToast("Nothing to insert.");
    return;
  }

  const note = findStickyById(expandedStickyId || selectedStickyId);
  if (!note) {
    if (typeof showThinkingToast === 'function') showThinkingToast("Open a note first to insert AI response into it.");
    return;
  }

  // Parse markdown lines into blocks
  if (!note.blocks) note.blocks = [];
  const lines = rawMd.split('\n').filter(l => l.trim() !== '');
  lines.forEach(line => {
    let blockType = 'text';
    let content = line;
    // Check from most specific to least to avoid ## matching ###
    if (/^###\s/.test(line))       { blockType = 'h3'; content = line.replace(/^###\s/, ''); }
    else if (/^##\s/.test(line))   { blockType = 'h2'; content = line.replace(/^##\s/, ''); }
    else if (/^#\s/.test(line))    { blockType = 'h1'; content = line.replace(/^#\s/, ''); }
    else if (/^[-*]\s/.test(line)) { blockType = 'bullet'; content = line.replace(/^[-*]\s/, ''); }
    else if (/^\d+\.\s/.test(line)) { blockType = 'number'; content = line.replace(/^\d+\.\s/, ''); }
    else if (/^- \[ \]\s/.test(line)) { blockType = 'todo'; content = line.replace(/^- \[ \]\s/, ''); }
    
    // Parse inline markdown to HTML
    let parsedContent = content;
    if (typeof marked !== 'undefined') {
      let html = marked.parse(content).trim();
      if (html.startsWith('<p>') && html.endsWith('</p>')) {
        html = html.slice(3, -4);
      }
      parsedContent = html;
    } else {
      // Basic fallback regex for bold, italic, code
      parsedContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
    }

    // Sanitize
    if (typeof safeHTML === 'function') {
      parsedContent = safeHTML(parsedContent);
    } else if (typeof esc === 'function') {
      parsedContent = esc(parsedContent);
    }
    
    // Use helper createNewBlockObj if available, otherwise construct object manually
    const newBlock = (typeof createNewBlockObj === 'function') 
      ? createNewBlockObj(blockType, parsedContent) 
      : { id: "block_" + Date.now() + "_" + Math.floor(Math.random() * 100000), type: blockType, content: parsedContent };
    note.blocks.push(newBlock);
  });
  
  note.updatedAt = Date.now();
  if (typeof renderBlockEditor === 'function') renderBlockEditor(note);
  if (typeof craftSave === 'function') craftSave();
  if (typeof showThinkingToast === 'function') showThinkingToast("✅ Inserted into note!");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initAiDrawer();
  });
} else {
  initAiDrawer();
}

function initAiDrawer() {
  // Inject the HTML drawer directly into document.body to prevent parent positioning trap
  let popoverEl = document.getElementById("aiPopover");
  if (!popoverEl) {
    document.body.insertAdjacentHTML('beforeend', AI_DRAWER_HTML);
    popoverEl = document.getElementById("aiPopover");
  } else if (popoverEl.parentElement !== document.body) {
    document.body.appendChild(popoverEl);
  }

  // Restore persisted chat history — re-parse markdown to avoid stored-XSS via raw innerHTML
  function _restoreChatHistory(historyEl, storageKey, isWrite) {
    if (!historyEl) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;
      const turns = JSON.parse(saved);
      if (!Array.isArray(turns) || turns.length === 0) return;
      // Remove welcome screen if present
      const welcome = historyEl.querySelector('.ai-ask-welcome');
      if (welcome) welcome.remove();
      turns.forEach(turn => {
        const md = (turn.md || '').trim();
        if (!md) return;
        if (turn.role === 'user') {
          if (isWrite) appendWriteChatBubble('user', md);
          else appendAskChatBubble('user', md);
        } else if (turn.role === 'assistant') {
          if (isWrite) appendWriteChatBubble('assistant', md);
          else appendAskChatBubble('assistant', md);
          // Restore rawMd so copy/insert work correctly
          const last = historyEl.lastElementChild;
          if (last) last.dataset.rawMd = md;
        }
      });
      setTimeout(() => { historyEl.scrollTop = historyEl.scrollHeight; }, 100);
    } catch(e) {}
  }

  try {
    const writeHistory = document.getElementById('aiWriteChatHistory');
    _restoreChatHistory(writeHistory, 'ai_chat_history_md', true);
    const askHistory = document.getElementById('aiAskChatHistory');
    _restoreChatHistory(askHistory, 'ai_ask_chat_history_md', false);
    // Clean up legacy raw-HTML keys from old storage format
    localStorage.removeItem('ai_chat_history');
    localStorage.removeItem('ai_ask_chat_history');
  } catch(e) {}


  // Inject resize handle if not already present
  if (popoverEl && !popoverEl.querySelector('#aiResizeHandle')) {
    const handle = document.createElement('div');
    handle.id = 'aiResizeHandle';
    handle.title = 'Drag to resize';
    popoverEl.insertBefore(handle, popoverEl.firstChild);
    
    // Drag-to-resize logic
    let startX, startWidth;
    handle.addEventListener('mousedown', (e) => {
      if (popoverEl.classList.contains('ai-popover-fullscreen')) return; // no resize in fullscreen
      startX = e.clientX;
      startWidth = popoverEl.offsetWidth;
      handle.classList.add('dragging');
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';

      function onMove(ev) {
        const delta = startX - ev.clientX; // dragging left = increasing width
        const newWidth = Math.min(700, Math.max(320, startWidth + delta));
        popoverEl.style.setProperty('--ai-drawer-width', newWidth + 'px');
        document.documentElement.style.setProperty('--ai-drawer-width', newWidth + 'px');
      }
      function onUp() {
        handle.classList.remove('dragging');
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  // Update DOM cache properties if defined globally
  if (typeof DOM !== 'undefined') {
    DOM.aiPopover = document.getElementById("aiPopover");
    DOM.aiResults = document.getElementById("aiResultsPopover");
    DOM.aiQuery = document.getElementById("aiQueryPopover");
    DOM.aiCardQuery = document.getElementById("aiCardQuery");
  }

  // Re-run icon init
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Let the health checker bind UI
  checkAiHealth();
}

// Global click interceptor for AI deep-linking note:// protocol links
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && link.getAttribute('href')?.startsWith('note://')) {
    e.preventDefault();
    const noteId = link.getAttribute('href').replace('note://', '').trim();
    if (typeof toggleAiPopover === 'function') {
      toggleAiPopover(false);
    }
    if (typeof openNoteEditor === 'function') {
      openNoteEditor(noteId);
    }
  }
});

