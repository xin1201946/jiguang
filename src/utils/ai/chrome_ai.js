import { getSettings, setSettings } from "@/utils/storage_settings";

// 全局变量（JS 中不能直接 declare global，只能假设全局对象存在）
let session = null;
let user_name = getSettings('user_name') || 'User';

/**
 * 检查 AI API 是否可用。
 */
export async function checkAPIAvailability() {
  try {
    if (typeof LanguageModel === "undefined" || typeof LanguageModel.availability !== "function") {
      console.warn("LanguageModel API is not defined or not fully available.");
      setSettings('ai_support', 'False');
      return false;
    }

    const capabilities = await LanguageModel.availability();
    if (capabilities.available === "unavailable") {
      setSettings('ai_support', 'False');
      console.log("AI is unavailable according to LanguageModel.availability().");
      return false;
    }

    const isInitialized = await initAI();
    if (!isInitialized) {
      console.warn("AI capabilities seem available but failed to initialize a session.");
      setSettings('ai_support', 'False');
      return false;
    }

    setSettings('ai_support', 'True');
    return true;

  } catch (error) {
    console.error("Error during AI availability check:", error);
    setSettings('ai_support', 'False');
    return false;
  }
}

/**
 * 初始化 AI 会话
 */
export async function initAI(systemPrompt) {
  try {
    if (typeof LanguageModel === "undefined" || typeof LanguageModel.create !== "function") {
      console.error("LanguageModel api may be changed..")
      return false;
    }

    if (session) {
      console.log("AI session already initialized.");
      return true;
    }

    const prompt = systemPrompt || getSettings('systemPrompt') ||
      "你是MeetHub会议系统的AI助手。你可以帮助用户进行语音转录、翻译、生成会议摘要和回答会议相关问题。" +
      "当前用户是：" + user_name + "。" +
      "请用简洁、专业的语言回答问题，并根据会议内容提供有用的建议。" +
      "对于翻译任务，请只返回翻译结果，不要添加额外说明。" +
      "对于摘要任务，请按照要求的JSON格式返回结构化数据。";

    session = await LanguageModel.create({ systemPrompt: prompt });
    setSettings('systemPrompt', prompt);
    setSettings('ai_support', 'True');
    console.log("AI session initialized successfully.");
    return true;
  } catch (error) {
    console.error("Failed to initialize AI session:", error);
    setSettings('ai_support', 'False');
    session = null;
    return false;
  }
}

/**
 * 释放 AI 会话资源。
 */
export async function destroySession() {
  if (session) {
    try {
      await session.destroy();
      console.log("AI session destroyed.");
    } catch (e) {
      console.warn("Failed to destroy session:", e);
    } finally {
      session = null;
    }
  }
}

/**
 * 清除 AI 会话历史。
 */
export async function clearAiHistory() {
  if (!session) {
    console.warn("No active AI session to clear history from.");
    return;
  }
  try {
    const newSession = await session.clone();
    await session.destroy();
    session = newSession;
    console.log("AI session history cleared by cloning.");
  } catch (e) {
    console.warn("Failed to clear AI history:", e);
  }
}

/**
 * 确保 AI 会话可用。
 */
async function ensureSession() {
  if (session) return true;
  return await initAI();
}

/**
 * 向 AI 提问（非流式）。
 */
export async function tryAskAI(something) {
  if (!(await ensureSession())) {
    return 'AI session is not initialized or supported.';
  }
  if (getSettings('ai_support') !== "True") {
    return 'AI support is disabled in settings.';
  }

  try {
    return await session.prompt(something);
  } catch (error) {
    console.error("Error during AI prompt:", error);
    return `Sorry, something went wrong while asking the AI: ${error.message || 'unknown error'}.`;
  }
}

/**
 * 流式提问 AI。
 */
export async function tryAskAIStream(something, onChunk) {
  if (!(await ensureSession())) {
    return 'AI session is not initialized or supported for streaming.';
  }

  if (getSettings('ai_support') !== "True") {
    return 'AI support is disabled in settings.';
  }

  let fullResponse = "";
  try {
    const stream = session.promptStreaming(something);
    for await (const chunk of stream) {
      fullResponse += chunk;
      if (typeof onChunk === 'function') {
        onChunk(chunk, fullResponse);
      }
    }
    return fullResponse;
  } catch (error) {
    console.error("Error during AI streaming prompt:", error);
    return `Sorry, something went wrong during AI streaming: ${error.message || 'unknown error'}.`;
  }
}

/**
 * 获取当前会话信息。
 */
export function getSessionInfo() {
  if (!session) return null;
  return {
    tokensSoFar: session.tokensSoFar,
    maxTokens: session.maxTokens,
    tokensLeft: session.tokensLeft
  };
}

export function getAI() {
  try {
    if (session) {
      return session;
    }
  } catch (e) {
    console.error(e.toString());
    return e;
  }
}

export function tryDestoryAI() {
  try {
    if (session) {
      session.destroy();
      session = null;
    }
    return "Done";
  } catch (e) {
    console.error(e.toString());
    return e.toString();
  }
}
