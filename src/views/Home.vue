<template>
  <div class="home">
    <!-- Navigation -->
    <nav class="nav-bar">
      <div class="nav-container">
        <!-- 品牌 -->
        <div class="nav-brand">
          <div class="brand-icon">🎯</div>
          <span class="brand-text">激光射击训练系统</span>
        </div>

        <!-- 菜单 -->
        <div class="nav-menu">
          <a
            v-for="item in menu"
            :key="item.name"
            :href="item.href"
            class="nav-link"
            :class="{ active: current === item.href }"
            @click.prevent="current = item.href"
          >
            {{ item.name }}
          </a>

        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title" style='height: 80px'>
            <TextType
              :text="['激光射击训练系统']"
              :typingSpeed="100"
              :pauseDuration="70000"
              :showCursor="false"
              cursorCharacter=""
            />
          </h1>
          <p class="hero-subtitle">
            集成AI分析与Agent助手的智能射击训练平台<br>
            支持项目预设、设备管理、大屏显示的完整解决方案
          </p>
          <div class="hero-actions">
            <button class="cta-button" @click='route_login' style='background: #FFFFFF; color: #000000;'>
              开始体验
              <span class="button-arrow">→</span>
            </button>
          </div>
        </div>

        <!-- Floating Elements -->
        <div >
          <div class="tilted-card">
            <img src='/HomePage.png' alt="Shooting Training Platform" class="card-image">
          </div>
        </div>
      </div>
    </section>


    <!-- Core Features Section -->
    <section class="features-section" id='features'>
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">核心功能特色</h2>
          <p class="section-subtitle">五大核心优势，打造智能化射击训练生态</p>
        </div>

        <div class="features-grid">
          <!-- AI Analysis Feature -->
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3 class="feature-title">AI智能分析</h3>
            <p class="feature-desc">AI分析个人成绩并自动生成训练总结报告，精准识别改进点</p>
            <div class="feature-demo">
              <div class="ai-report-preview">
                <div class="report-item">
                  <span class="report-metric">命中率</span>
                  <span class="report-value trend-up">89.2% ↗</span>
                </div>
                <div class="report-item">
                  <span class="report-metric">稳定性</span>
                  <span class="report-value trend-down">偏差-15% ↘</span>
                </div>
                <div class="ai-suggestion">💡 建议加强瞄准稳定性训练</div>
              </div>
            </div>
          </div>

          <!-- Agent Assistant Feature -->
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3 class="feature-title">Agent数据助手</h3>
            <p class="feature-desc">智能助手辅助管理员快速查询数据库信息，提升检索效率</p>
            <div class="feature-demo">
              <div class="agent-chat">
                <div class="chat-message user">查询今日训练数据</div>
                <div class="chat-message agent">
                  <div class="typing-indicator">Agent正在查询...</div>
                  找到16场训练，总计4038次射击
                </div>
              </div>
            </div>
          </div>

          <!-- Project Presets Feature -->
          <div class="feature-card">
            <div class="feature-icon">⚙️</div>
            <h3 class="feature-title">项目预设管理</h3>
            <p class="feature-desc">支持项目预设配置，便于后期赛事基于预设快速创建</p>
            <div class="feature-demo">
              <div class="preset-list">
                <div class="preset-item">
                  <span class="preset-name">🎯 10米步枪决赛</span>
                  <span class="preset-status">已配置</span>
                </div>
                <div class="preset-item">
                  <span class="preset-name">🏆 团体赛模式</span>
                  <span class="preset-status">已配置</span>
                </div>
                <div class="preset-item">
                  <span class="preset-name">📊 训练评估</span>
                  <span class="preset-status">已配置</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Device Management Feature -->
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3 class="feature-title">设备状态监控</h3>
            <p class="feature-desc">实时监控平板、激光枪、激光靶等设备状态信息</p>
            <div class="feature-demo">
              <div class="device-status">
                <div class="device-row">
                  <span class="device-type">📱 平板设备</span>
                  <span class="device-count">3台在线</span>
                </div>
                <div class="device-row">
                  <span class="device-type">🔫 激光枪</span>
                  <span class="device-count">9支就绪</span>
                </div>
                <div class="device-row">
                  <span class="device-type">🎯 激光靶</span>
                  <span class="device-count">88个运行中</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Big Screen Display Feature -->
          <div class="feature-card wide">
            <div class="feature-icon">🖥️</div>
            <h3 class="feature-title">大屏可视化显示</h3>
            <p class="feature-desc">大屏直观显示击中靶位、实时排名信息，提升观赛体验</p>
            <div class="feature-demo">
              <div class="big-screen-preview">
                <div class="screen-header">
                  <span class="competition-title">决赛-甲组男子10米激光步枪20发-1</span>
                  <span class="live-time">2025-08-03 19:26</span>
                </div>
                <div class="screen-content">
                  <div class="targets-section">
                    <div class="target-display">
                      <div class="target-rings">
                        <div class="ring ring-10"></div>
                        <div class="ring ring-9"></div>
                        <div class="ring ring-8"></div>
                        <div class="hit-point" style="top: 45%; left: 48%;"></div>
                      </div>
                      <div class="target-info">
                        <span class="shooter-name">选手A</span>
                        <span class="current-score">66.1</span>
                      </div>
                    </div>
                    <div class="target-display">
                      <div class="target-rings">
                        <div class="ring ring-10"></div>
                        <div class="ring ring-9"></div>
                        <div class="ring ring-8"></div>
                        <div class="hit-point" style="top: 52%; left: 46%;"></div>
                      </div>
                      <div class="target-info">
                        <span class="shooter-name">选手B</span>
                        <span class="current-score">66.1</span>
                      </div>
                    </div>
                  </div>
                  <div class="ranking-section">
                    <div class="rank-item">
                      <span class="rank-pos">1</span>
                      <span class="rank-name">选手B</span>
                      <span class="rank-score">66.1</span>
                    </div>
                    <div class="rank-item">
                      <span class="rank-pos">2</span>
                      <span class="rank-name">选手A</span>
                      <span class="rank-score">66.1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer class="footer" id='footer'>
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-links">
            <div style='color: grey'>激光射击模拟系统</div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Trend from '@/components/Trend'
import AvatarList from '@/components/AvatarList'
import CountDown from '@/components/CountDown/CountDown'
import Ellipsis from '@/components/Ellipsis'
import NumberInfo from '@/components/NumberInfo'
import TextType from '@/components/TextType/TextType.vue'
import AIChat from '@/components/ai/AIChat.vue'

const AvatarListItem = AvatarList.AvatarItem

export default {
  name: 'Home',
  components: {
    AIChat,
    TextType,
    NumberInfo,
    Ellipsis,
    CountDown,
    Trend,
    AvatarList,
    AvatarListItem
  },
  data() {
    return {
      current: '#', // 默认首页被选中
      menu: [
        { name: '首页', href: '#' },
        { name: '核心功能特色', href: '#features' },
        // 你还可以加更多项
      ],
      targetTime: new Date().getTime() + 3900000
    }
  },
  methods: {
    route_login() {
      this.$router.push('/user/login')
    }
  }
}
</script>

<style scoped>
/* Reset and Base */
* {
  box-sizing: border-box;
}

.home {
  min-height: 100vh;
  background: #0a0a0f;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
}

/* Navigation */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  font-size: 24px;
}

.brand-text {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.nav-menu {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link.active,
.nav-link:hover {
  color: #ffffff;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #8b5cf6, #a855f7);
  border-radius: 1px;
}

.nav-actions {
  display: flex;
  align-items: center;
}

.github-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  color: #8b5cf6;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Hero Section */
.hero {
  height: 100vh;
  padding: 170px 24px 80px;
  position: relative;
  background: radial-gradient(ellipse at top, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.hero-content {
  max-width: 500px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.4);
}

.button-arrow {
  transition: transform 0.3s ease;
}

.cta-button:hover .button-arrow {
  transform: translateX(4px);
}


.tilted-card {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 10px;
  padding: 5px;
  /* 修改：添加背景、边框和阴影 */
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3),
  0 0 80px rgba(139, 92, 246, 0.3),
  0 0 120px rgba(139, 92, 246, 0.1);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  /* 修改：增加倾斜效果 */
  transform: rotate3d(1, 1, 0, 10deg) scale(0.9);
  transform-style: preserve-3d;
  animation: float 6s ease-in-out infinite;
}

.tilted-card:hover {
  transform: rotate3d(0, 0, 0, 0deg) scale(1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
  0 0 100px rgba(139, 92, 246, 0.4),
  0 0 150px rgba(139, 92, 246, 0.2);
}


.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 5px;
  /* 修改：图片边框，使其看起来更像是在容器内 */
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(1deg); }
}

/* Features Section */
.features-section {
  padding: 120px 24px;
  background: rgba(255, 255, 255, 0.01);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  margin-top: 60px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 32px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card.wide {
  grid-column: 1 / -1;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(139, 92, 246, 0.3);
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.1);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
  display: block;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
}

.feature-desc {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 24px;
}

.feature-demo {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* AI Report Preview */
.ai-report-preview {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.report-metric {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.report-value {
  font-weight: 600;
  font-size: 14px;
}

.trend-up {
  color: #10b981;
}

.trend-down {
  color: #f59e0b;
}

.ai-suggestion {
  margin-top: 8px;
  padding: 12px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(139, 92, 246, 0.2);
}

/* Agent Chat */
.agent-chat {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-message {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  max-width: 80%;
}

.chat-message.user {
  background: rgba(139, 92, 246, 0.2);
  color: white;
  align-self: flex-end;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.chat-message.agent {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
  align-self: flex-start;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.typing-indicator {
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  font-size: 12px;
  margin-bottom: 4px;
}

/* Preset List */
.preset-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preset-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.preset-name {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.preset-status {
  font-size: 12px;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

/* Device Status */
.device-status {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.device-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.device-type {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.device-count {
  font-size: 14px;
  color: #10b981;
  font-weight: 600;
}

/* Big Screen Preview */
.big-screen-preview {
  background: #1a237e;
  border-radius: 12px;
  padding: 16px;
  color: white;
  font-family: 'Monaco', 'Menlo', monospace;
}

.screen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.competition-title {
  font-size: 14px;
  font-weight: 600;
}

.live-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.screen-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.targets-section {
  display: flex;
  gap: 16px;
}

.target-display {
  flex: 1;
  text-align: center;
}

.target-rings {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: #f5f5f5;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid #333;
}

.ring-10 {
  top: 30%;
  left: 30%;
  right: 30%;
  bottom: 30%;
  background: #000;
}

.ring-9 {
  top: 25%;
  left: 25%;
  right: 25%;
  bottom: 25%;
  background: #333;
}

.ring-8 {
  top: 20%;
  left: 20%;
  right: 20%;
  bottom: 20%;
  background: #666;
}

.hit-point {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ff4444;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 8px #ff4444;
}

.target-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.shooter-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.current-score {
  font-size: 16px;
  font-weight: 700;
  color: #ffd700;
}

.ranking-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.rank-pos {
  font-size: 14px;
  font-weight: 700;
  color: #ffd700;
  min-width: 20px;
}

.rank-name {
  flex: 1;
  font-size: 12px;
}

.rank-score {
  font-size: 12px;
  font-weight: 600;
  color: #10b981;
}

/* Components Section */
.components-section {
  padding: 120px 24px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
}

.component-showcase.reverse > * {
  direction: ltr;
}

/* Footer */
.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 30px 24px 40px;
  background: rgba(255, 255, 255, 0.01);
}

.footer-container {
  width:100%;
  margin: 0 auto;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.footer-links {
  display: flex;
  gap: 32px;
}

.footer-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: rgba(255, 255, 255, 0.9);
}


.footer-bottom p {
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-container {
    padding: 12px 16px;
  }

  .nav-menu {
    display: none;
  }

  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }


  .footer-content {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .footer-links {
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 100px 16px 60px;
  }

  .components-section {
    padding: 80px 16px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>