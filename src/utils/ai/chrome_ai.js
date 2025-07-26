import { getSettings, setSettings } from "@/utils/storage_settings";

let session = null;
let useFallback = "chrome"; // chrome | ollama | openai

export async function checkAPIAvailability() {
  try {
    if (typeof LanguageModel === "undefined" || typeof LanguageModel.availability !== "function") {
      console.warn("LanguageModel API not available. Falling back to Ollama.");
      useFallback = "ollama";
      return true;
    }

    const availability = await LanguageModel.availability();
    if (availability === "unavailable") {
      console.log("Chrome AI unavailable, using Ollama.");
      useFallback = "ollama";
      return true;
    }

    const ok = await initAI();
    if (!ok) {
      useFallback = "ollama";
      return true;
    }

    setSettings("ai_support", "True");
    useFallback = "chrome";
    return true;
  } catch (e) {
    console.warn("Fallback to openAI due to error:", e);
    useFallback = "openai";
    return true;
  } finally {
    console.log("当前使用：", useFallback);
  }
}

export async function initAI(systemPrompt = "") {
  if (useFallback !== "chrome") return true;

  try {
    if (!session && typeof LanguageModel !== "undefined") {
      session = await LanguageModel.create({
        initialPrompts: [
          {
            role: "system",
            content:
              systemPrompt ||
              "你是 激光射击训练系统（激光步枪或者激光手枪） 的AI，请根据以下数据，总结该用户在各个方面的成绩表现、优势与不足，并提供改进建议。(30-50字)" +
              "要求语言简明扼要，结构清晰，适合用于家长或本人阅读。" +
              "注意，给出的信息仅包含 ⽅向点 环数 时间 X轴 Y轴 。不要提 射速，时间 问题！！！！",
          },
        ],
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Model downloaded: ${e.loaded * 100}%`);
          });
        },
      });
    }
    return true;
  } catch (e) {
    console.error("initAI error:", e);
    session = null;
    return false;
  }
}

export async function tryAskAI(message) {
  const systemPrompt =
    getSettings("systemPrompt") ||
    "你是 激光射击训练系统（激光步枪或者激光手枪） 的AI，请根据以下数据，总结该用户在各个方面的成绩表现、优势与不足，并提供改进建议。(30-50字)" +
    "要求语言简明扼要，结构清晰，适合用于家长或本人阅读。" +
    "注意，给出的信息仅包含 ⽅向点 环数 时间 X轴 Y轴 。不要提 射速，时间 问题！！！！";

  async function ollama_chat(params) {
    const res = await fetch(`${window._CONFIG["VUE_ollama_BASE_URL"]}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) throw new Error("Ollama 接口请求失败");

    return await res.json();
  }

  async function openAI_completions(params) {
    const res = await fetch(`${window._CONFIG["VUE_AI_API_BASE_URL"]}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window._CONFIG["VUE_AI_API_KEY"]}`,
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) throw new Error("OpenAI 接口请求失败");

    return await res.json();
  }

  async function askWithFallback(level = 0) {
    try {
      if (useFallback === "chrome" && session) {
        return await session.prompt(message);
      }

      if (useFallback === "ollama") {
        const res = await ollama_chat({
          model: "qwen3:4b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          stream: false,
        });
        return (res.message && res.message.content) || JSON.stringify(res);
      }

      if (useFallback === "openai") {
        const res = await openAI_completions({
          model: "deepseek-v3",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          temperature: 0.7,
        });
        return (
          res.choices &&
          res.choices[0] &&
          res.choices[0].message &&
          res.choices[0].message.content
        ) || JSON.stringify(res);
      }
    } catch (err) {
      console.warn(`${useFallback} 出错，尝试回退：`, err);

      // 尝试顺序：chrome → ollama → openai
      if (useFallback === "chrome") {
        useFallback = "ollama";
      } else if (useFallback === "ollama") {
        useFallback = "openai";
      } else {
        throw err; // 最后一层 openai 也失败了，直接抛出
      }

      return await askWithFallback(level + 1);
    }
  }

  return await askWithFallback();
}

export function getAI() {
  return session;
}

export async function destroySession() {
  if (session && typeof session.destroy === "function") {
    await session.destroy();
    session = null;
  }
}

export async function clearAiHistory() {
  if (!session) return;
  const newSession = await session.clone();
  await session.destroy();
  session = newSession;
}
