// RAGFlow 集成代码

import { getSettings } from "@/utils/storage_settings";

// 配置管理
const CONFIG = {
  get baseUrl() { return window._CONFIG["VUE_RAGFlow_BASE_URL"]; },
  get apiKey() { return window._CONFIG["VUE_RAGFlow_API_KEY"]; },
  get model() { return window._CONFIG["VUE_RAGFlow_MODEL"] || "deepseek-chat"; },
  get systemPrompt() {
    return getSettings("systemPrompt") ||
      `你是“激光射击训练系统”的智能分析助手。你的任务是：
      根据提供的成绩数据，**总结选手在比赛过程中的整体表现，分析其射击优势与不足，并提出可行的改进建议**。
      ## 输出格式严格按照如下要求，并在每个标题添加加粗和回车，避免数据过于密集：
      选手优点：
      ……
      
      存在问题：
      ……
      
      现场发挥改进建议：
      ……
      
      训练方案改进建议：
      ……
      （注：本总结由AI自动生成，仅供参考，具体训练效果请结合教练指导。）
      
      ## 重要规则：
      1. 项目为“10发”、“20发”、“30发”等普通项目时，**每10发视为一轮**，需按轮次总结表现变化；
      2. 项目为“混团”类比赛时，**不分轮次，直接整体分析**；
      3. **仅使用提供的环数和坐标（X轴、Y轴）进行分析，不能分析射速、心理状态或其他未给出的数据！**
      4. 坐标分析重点：
         - 是否集中：例如坐标是否接近中轴线（约在80, 80附近），是否分散；
         - 是否偏移：比如坐标多集中在“左上方”“右下方”“偏右”；
         - 表现是否稳定：是否存在明显波动、失误（如突然掉环）；
      5. 总结语言应简洁明了，面向家长或选手本人易于理解，控制在500字左右。
      `;
  },
  get temperature() {
    return Number(window._CONFIG["VUE_RAGFlow_TEMPERATURE"]);
  },
};

// 状态管理
const state = {
  chatId: null,
  sessionId: null
};

// 工具函数
const utils = {
  // 过滤思考标签
  filterThinkTags: function filterThinkTags(text) {
    return (text && text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()) || text;
  },

  // 创建带超时的请求
  async request(url, options = {}, timeout = 30000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${CONFIG.apiKey}`,
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  },

  // 处理响应数据
  parseResponse(data) {
    if (data.code !== 0) {
      throw new Error(`API错误: ${data.message}`);
    }

    let answer = null;
    const responseData = data.data;

    if (typeof responseData === 'string') {
      try {
        const cleanData = responseData.replace(/^data:/, '').trim();
        const parsedData = JSON.parse(cleanData);
        answer = parsedData.data && parsedData.data.answer;
      } catch {
        answer = responseData;
      }
    } else if (responseData && responseData.answer) {
      answer = responseData.answer;
    }

    return this.filterThinkTags(answer) || "未收到有效响应";
  }
};

// API 封装
const api = {
  // 列出所有聊天助手
  async listChats() {
    return await utils.request(`${CONFIG.baseUrl}/api/v1/chats`, { method: "GET" });
  },

  // 删除聊天助手
  async deleteChat(chatId) {
    return await utils.request(`${CONFIG.baseUrl}/api/v1/chats/${chatId}`, { method: "DELETE" });
  },

  // 创建聊天助手
  async createChat() {
    const body = {
      name: `激光射击训练AI_${Date.now()}`,
      dataset_ids: ["836021266e8d11f0a7d87aa539898340"],
      llm: {
        model_name: CONFIG.model,
        temperature: CONFIG.temperature
      },
      prompt: {
        prompt: CONFIG.systemPrompt,
        similarity_threshold: 0.2,
        keywords_similarity_weight: 0.7,
        top_n: 6,
        variables: [{ key: "knowledge", optional: true }]
      }
    };

    return await utils.request(`${CONFIG.baseUrl}/api/v1/chats`, {
      method: "POST",
      body: JSON.stringify(body)
    });
  },
  async ensureChat(){
    if (state.chatId){return state.chatId}
    const ai = api.createChat()
    const chatID = ai.data.chatId;
    state.chatId = chatID;
    state.sessionId = null;
    return state.chatId;
  },
  // 创建会话
  async createSession(chatId) {
    const body = { name: `射击分析_${Date.now()}` };
    return await utils.request(`${CONFIG.baseUrl}/api/v1/chats/${chatId}/sessions`, {
      method: "POST",
      body: JSON.stringify(body)
    });
  },

  // 发送消息
  async sendMessage(chatId, sessionId, message) {
    const body = {
      question: message,
      stream: false,
      session_id: sessionId
    };

    return await utils.request(`${CONFIG.baseUrl}/api/v1/chats/${chatId}/completions`, {
      method: "POST",
      body: JSON.stringify(body)
    });
  }
};

// 聊天管理
const chatManager = {
  // 清理旧的聊天助手
  async cleanup() {
    try {
      const listData = await api.listChats();
      if (listData.code === 0 && listData.data && listData.data.length > 0) {
        await Promise.allSettled(
          listData.data.map(chat => api.deleteChat(chat.id))
        );
        console.log("已清理旧的聊天助手");
      }
    } catch (error) {
      console.warn("清理旧聊天助手失败:", error);
    }
  },

  async createNewChat() {
    try{
      await this.cleanup();
      const createData = await api.createChat();
      state.chatId = createData.data.id;
      state.sessionId = null;
      console.log("创建RAGFlow聊天助手:", state.chatId);
      return state.chatId;
    }catch (e){
      console.error("创建RAGFlow聊天助手失败:", e);
      return e
    }
  },



  // 创建新会话
  async createNewSession(chatId) {
    const sessionData = await api.createSession(chatId);
    const sessionId = sessionData.data.id;

    state.sessionId = sessionId;
    console.log("创建新会话:", sessionId);

    return sessionId;
  }
};

// 主要聊天函数
async function ragflow_chat(message) {
  try {
    console.log("发送消息到RAGFlow:", message);

    const chatId = await chatManager.createNewChat();
    const sessionId = await chatManager.createNewSession(chatId);

    const responseData = await api.sendMessage(chatId, sessionId, message);
    const answer = utils.parseResponse(responseData);

    console.log("RAGFlow回答:", answer);
    return answer;

  } catch (error) {
    console.error("RAGFlow聊天失败:", error);
    throw error;
  }
}

// 导出接口
export async function tryAskAI(message) {
  try {
    return await ragflow_chat(message);
  } catch (error) {
    console.error("RAGFlow AI请求失败:", error);
    throw error;
  }
}

export async function destroySession() {
  state.chatId = null;
  state.sessionId = null;
}

export async function clearAiHistory() {
  state.sessionId = null;
}