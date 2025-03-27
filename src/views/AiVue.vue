<template>
  <div class="chat-container">
    <!-- 头部 -->
    <div class="chat-header">
      <img src="@/assets/deepseek.png" alt="DeepSeek Logo" class="deepseek-logo">
      <h2>DeepSeek AI 助手</h2>
    </div>

    <!-- 聊天记录区域 -->
    <div class="chat-messages" ref="messageContainer">
      <div v-for="(message, index) in messages" 
           :key="index" 
           :class="['message', message.role]">
        <div class="message-content">
          <img v-if="message.role === 'assistant'" 
               src="@/assets/deepseek.png" 
               alt="DeepSeek" 
               class="avatar">
          <div v-else class="avatar user-avatar">
            <el-icon><User /></el-icon>
          </div>
          <div class="text">{{ message.content }}</div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input">
      <el-input
        v-model="userInput"
        type="textarea"
        :rows="3"
        placeholder="请输入您的问题..."
        @keyup.enter.native="sendMessage"
      />
      <el-button type="primary" @click="sendMessage" :disabled="!userInput.trim()">
        发送
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User } from '@element-plus/icons-vue'

const messages = ref([
  {
    role: 'assistant',
    content: '您好！我是 DeepSeek AI 助手，很高兴为您提供帮助。我可以回答您关于学术研究、论文写作、研究方向等方面的问题。请问有什么我可以帮您的吗？'
  },
  {
    role: 'user',
    content: '请介绍一下深度学习在计算机视觉领域的最新发展趋势。'
  },
  {
    role: 'assistant',
    content: '深度学习在计算机视觉领域的最新发展呈现出几个重要趋势：首先是自监督学习的突破，通过预训练模型学习图像的通用表示，大幅减少了对标注数据的依赖。其次是多模态融合方向，将视觉与语言、音频等多种模态结合，提升模型的理解能力。第三是轻量化和高效化，通过模型压缩、知识蒸馏等技术，实现在边缘设备上的部署。此外，3D视觉理解、视频理解等方向也取得重要进展，为自动驾驶、机器人视觉等应用提供支持。值得注意的是，基础模型在视觉领域的应用也越来越广泛，展现出强大的迁移学习能力。'
  },
  {
    role: 'user',
    content: '这些发展趋势对学术研究有什么启示？'
  },
  {
    role: 'assistant',
    content: '这些发展趋势对学术研究有几个重要启示：第一，跨学科融合将成为主流，研究人员需要具备多领域知识，特别是在深度学习、计算机视觉和数学等方面。第二，数据和算力的重要性日益突出，需要关注大规模数据集的构建和高效计算方法的研究。第三，理论研究和实际应用的结合更加紧密，建议研究者在理论创新的同时，也要考虑成果的实用价值。第四，开源合作和知识共享变得更加重要，参与开源项目和学术交流可以加速研究进展。最后，研究方向的选择要既考虑学术前沿性，也要关注产业需求，找到二者的平衡点。'
  },
  {
    role: 'user',
    content: '在论文写作方面，如何提高论文的创新性和学术价值？'
  },
  {
    role: 'assistant',
    content: '提高论文的创新性和学术价值需要从多个维度考虑：首先，选题要具有前瞻性和挑战性，建议通过系统的文献综述找到研究空白点或现有方法的局限性。其次，研究方法要具有创新性，可以考虑新算法设计、新模型构建或新的问题解决思路。第三，实验设计要严谨完善，需要充分的对比实验和消融实验来验证方法的有效性。第四，结果分析要深入透彻，不仅要关注性能提升，还要分析原因机制。第五，要注重理论创新与工程应用的结合，提出的方法既要有理论支撑，又要具备实用价值。最后，论文写作要逻辑清晰，语言准确，图表规范，确保研究工作能够清晰地传达给读者。'
  },
  {
    role: 'user',
    content: '如何看待人工智能领域的伦理问题？'
  },
  {
    role: 'assistant',
    content: '人工智能领域的伦理问题是一个复杂而重要的话题，需要从多个角度深入思考：首先，数据隐私保护问题日益突出，AI系统的训练需要大量数据，如何在确保模型性能的同时保护个人隐私是一个关键挑战。其次，算法偏见问题需要重视，模型可能会继承训练数据中的偏见，导致不公平的决策结果。第三，AI技术的双重使用性问题，同一技术既可能带来便利，也可能被用于不当目的。第四，AI对就业市场的影响，需要考虑如何平衡技术发展和社会稳定。此外，还需要关注AI系统的可解释性、安全性和责任归属等问题。建议在技术发展的同时，加强伦理准则的制定和监管机制的建设。'
  },
  {
    role: 'user',
    content: '在多模态学习领域，目前有哪些重要的研究方向？'
  },
  {
    role: 'assistant',
    content: '多模态学习领域当前有几个重要的研究方向：第一，跨模态表示学习，致力于将不同模态的数据映射到同一语义空间，提升模态间的互操作性。第二，多模态融合策略研究，探索更有效的模态融合方法，如注意力机制、图神经网络等。第三，多模态预训练模型，通过大规模数据预训练获取通用的多模态表示。第四，多模态对齐问题，研究如何建立不同模态数据间的精确对应关系。第五，多模态生成任务，如跨模态生成、多模态数据增强等。此外，多模态学习在医疗诊断、智能教育、人机交互等领域的应用也是重要研究方向。关键是要解决模态间的异构性、不对齐性和互补性等挑战。'
  },
  {
    role: 'user',
    content: '如何评估一个研究工作的学术影响力？'
  },
  {
    role: 'assistant',
    content: '评估研究工作的学术影响力需要综合多个维度：首先是传统的文献计量指标，包括论文被引用次数、期刊影响因子、h指数等，这些指标能够量化反映研究成果的学术影响。其次是研究工作的创新突破性，评估其是否开创了新的研究方向或解决了领域内的重要难题。第三是研究成果的实际应用价值，包括技术转化情况、产业应用效果等。第四是学术共同体的认可度，如在重要会议的报告、同行评议意见等。第五是研究工作的持续性影响，是否促进了领域的长期发展。此外，还要考虑研究成果的社会影响力，包括媒体关注度、政策影响等多个方面。'
  }
])

const userInput = ref('')
const messageContainer = ref(null)

const sendMessage = () => {
  if (!userInput.value.trim()) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: userInput.value
  })

  // 模拟AI响应
  setTimeout(() => {
    messages.value.push({
      role: 'assistant',
      content: '感谢您的提问。作为一个专业的学术助手，我建议从以下几个方面思考这个问题：首先，要明确研究的理论基础和创新点，确保研究工作建立在扎实的学术积累之上。其次，要注意研究方法的规范性和可重复性，这是确保研究质量的关键。再次，要关注研究成果的实际应用价值，使理论研究能够更好地服务于实践。同时，建议关注该领域的最新进展和前沿动态，及时调整研究方向。最后，跨学科交叉研究可能会带来新的突破点，值得关注。'
    })
  }, 1000)

  userInput.value = ''
}

// 监听消息变化，自动滚动到底部
// onMounted(() => {
//   watchEffect(() => {
//     if (messages.value.length) {
//       nextTick(() => {
//         messageContainer.value.scrollTop = messageContainer.value.scrollHeight
//       })
//     }
//   })
// })
</script>

<style scoped>
.chat-container {
  height: 89vh;
  max-width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden; /* 添加这行，防止外层出现滚动条 */
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #eee;
  height: 50px; /* 固定头部高度 */
}

.deepseek-logo {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  margin-bottom: 20px;
}

.message-content {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.assistant .message-content {
  margin-right: auto;
}

.user .message-content {
  margin-left: auto;
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.user-avatar {
  background: #409EFF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.text {
  padding: 12px 16px;
  border-radius: 8px;
  background: #f4f4f4;
  line-height: 1.6;
}

.user .text {
  background: #409EFF;
  color: white;
}

.chat-input {
  padding: 10px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
}

.chat-input :deep(.el-textarea__inner) {
  resize: none;
}

.chat-input .el-button {
  align-self: flex-end;
}
</style>
