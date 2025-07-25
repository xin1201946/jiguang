import { getSettings, setSettings } from "@/utils/storage_settings";

// 全局变量
let session = null;

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

    const availability = await LanguageModel.availability();
    if (availability === "unavailable") {
      setSettings('ai_support', 'False');
      console.log("AI is unavailable according to LanguageModel.availability().");
      return false;
    }

    // 如果模型是可下载的，可以添加额外的处理逻辑
    if (availability === "downloadable") {
      console.log("AI model is downloadable but not yet downloaded.");
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
export async function initAI(systemPrompt = "") {
  try {
    if (typeof LanguageModel === "undefined" || typeof LanguageModel.create !== "function") {
      console.error("LanguageModel API may be changed..")
      return false;
    }

    if (session) {
      console.log("AI session already initialized.");
      return true;
    }

    const systemPromptContent = systemPrompt || "你是 激光射击训练系统（激光步枪或者激光手枪） 的AI，请根据以下数据，总结该用户在各个方面的成绩表现、优势与不足，并提供改进建议。(50字)" +
      "要求语言简明扼要，结构清晰，适合用于家长或本人阅读。" +
      "注意，给出的信息仅包含 ⽅向点 环数 时间 X轴 Y轴 。不要提 射速，时间 问题！！！！"

    // 使用 initialPrompts 替代之前的 systemPrompt
    session = await LanguageModel.create({
      initialPrompts: [{ role: "system", content: systemPromptContent }],
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          console.log(`AI Model downloaded ${e.loaded * 100}%`);
        });
      }
    });

    setSettings('systemPrompt', systemPromptContent);
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
    inputUsage: session.inputUsage,
    inputQuota: session.inputQuota,
    remainingQuota: session.inputQuota - session.inputUsage
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
