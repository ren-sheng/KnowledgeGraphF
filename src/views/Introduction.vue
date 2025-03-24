<template>
  <div class="introduction">
    <div class="header">
      <h1>欢迎使用 ESI 知识图谱平台</h1>
      <p class="subtitle">站在巨人的肩膀上，探索学术世界</p>
      <!-- <p class="subtitle">站在张栩的肩膀上，探索学术世界</p> -->
    </div>

    <div class="content">
      <div class="section">
        <h2>平台简介</h2>
        <p>ESI 知识图谱平台是一个专业的学术搜索和分析工具，致力于为研究人员提供全面的学术资源检索和知识发现服务。
          通过整合多源数据，构建学术知识图谱，帮助用户快速获取相关领域的研究动态、专家信息和研究成果。</p>
      </div>



      <div class="section">
        <h2>AI赋能</h2>
        <div class="ai-features">
          <div class="deepseek-feature">
            <img src="@/assets/deepseek.png" alt="DeepSeek Logo" class="deepseek-logo">
            <div class="feature-text">
              <h3>DeepSeek 大语言模型</h3>
              <p>集成先进的 DeepSeek 大语言模型，提供智能问答和深度语义理解能力，
                 帮助用户更好地理解和挖掘学术内容。</p>
            </div>
          </div>
          
          <div class="graphrag-feature">
            <div class="feature-icon">📊</div>
            <div class="feature-text">
              <h3>GraphRAG 知识图谱增强</h3>
              <p>采用 GraphRAG 技术，结合知识图谱和检索增强生成，
                 为用户提供更准确和全面的学术信息检索服务。</p>
            </div>
          </div>
        </div>
      </div>



      <div class="section">
        <h2>核心功能</h2>
        <div class="features">
          <div class="feature">
            <h3>🔍 智能搜索</h3>
            <p>提供精准的学术文献搜索，支持多语言检索，快速定位相关研究成果。</p>
          </div>
          <div class="feature">
            <h3>👥 专家画像</h3>
            <p>展示学者完整的学术履历、研究方向、发表论文和引用数据，助力学术合作。</p>
          </div>
          <div class="feature">
            <h3>🏛️ 机构分析</h3>
            <p>深入分析研究机构的学术影响力、研究方向和合作网络。</p>
          </div>
          <div class="feature">
            <h3>🌐 研究领域</h3>
            <p>可视化展示学科领域分布，追踪研究热点和发展趋势。</p>
          </div>
          <div class="feature">
            <h3>🔄 作者消歧</h3>
            <p>采用先进的算法和规则，准确识别和区分同名作者。</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>技术特色</h2>
        <ul>
          <li>基于知识图谱的数据组织和展示</li>
          <li>智能的作者身份识别和消歧系统</li>
          <li>直观的可视化分析工具</li>
          <li>实时的数据更新和维护</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.introduction {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header {
  text-align: center;
  margin-bottom: 60px;
}

.header h1 {
  color: #4285f4;
  font-size: 2.5em;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 1.2em;
}

.section {
  margin-bottom: 50px;
}

.section h2 {
  color: #333;
  font-size: 1.8em;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #4285f4;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 20px;
}

.feature {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.feature h3 {
  color: #4285f4;
  margin-bottom: 10px;
  font-size: 1.2em;
}

.feature p {
  color: #666;
  line-height: 1.6;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 15px;
  padding-left: 25px;
  position: relative;
  color: #555;
}

ul li::before {
  content: "•";
  color: #4285f4;
  font-size: 1.5em;
  position: absolute;
  left: 0;
  top: -5px;
}

.divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, transparent, #409eff, transparent);
  margin: 20px 0;
}

.ai-section {
  margin: 20px 0;
}

.ai-features {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
}

.deepseek-feature,
.graphrag-feature {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.deepseek-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.feature-icon {
  font-size: 2.5rem;
  min-width: 60px;
  text-align: center;
}

.feature-text {
  flex: 1;
}

.feature-text h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.feature-text p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .ai-features {
    flex-direction: column;
  }
}
</style> 