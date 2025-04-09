<template>
  <div ref="container" class="isolated-html"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  html: {
    type: String,
    required: true
  }
})

const container = ref(null)
let shadowRoot = null

const updateContent = (html) => {
  if (shadowRoot) {
    shadowRoot.innerHTML = `
      <style>
        /* 基础样式 */
        :host {
          display: block;
          font-family: Arial, sans-serif;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        /* 搜索结果容器 */
        .search-results {
          width: 100%;
          background: transparent;
          border-radius: 0;
          box-shadow: none;
        }
        
        /* 搜索结果列表 */
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        /* 列表项样式 */
        li {
          padding: 16px 0;
          border-bottom: none;
          background: transparent;
          list-style-type: none; /* 确保移除列表项标记 */
        }
        
        /* 移除所有可能的列表项标记 */
        li::before,
        li::marker {
          content: none;
          display: none;
        }
        
        li:last-child {
          border-bottom: none;
        }
        
        /* 标题样式 */
        .title {
          font-size: 18px;
          line-height: 1.4;
          margin-bottom: 4px;
          color: #1a0dab;
        }
        
        /* 作者样式 */
        .authors {
          font-size: 14px;
          color: #006621;
          margin: 4px 0;
        }
        
        /* 链接样式 */
        a {
          color: #1a0dab;
          text-decoration: none;
          cursor: pointer;
        }
        
        a:hover {
          text-decoration: underline;
        }
        
        /* 摘要容器 */
        .abstract-container {
          position: relative;
          margin-top: 8px;
          padding-bottom: 24px;  /* 为展开按钮留出空间 */
        }
        
        /* 摘要内容 */
        .abstract-content {
          font-size: 14px;
          color: #545454;
          line-height: 1.6;
          position: relative;
          max-height: 4.8em;  /* 显示3行 */
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }
        
        /* 摘要展开状态 */
        .abstract-container.expanded .abstract-content {
          max-height: none;
        }
        
        /* 摘要渐变遮罩 */
        .abstract-content::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 1.6em;
          background: linear-gradient(transparent, white);
          pointer-events: none;
          opacity: 1;
          transition: opacity 0.3s;
        }
        
        /* 展开状态下隐藏遮罩 */
        .abstract-container.expanded .abstract-content::after {
          opacity: 0;
        }
        
        /* 展开/收起按钮 */
        .toggle-abstract {
          position: absolute;
          right: 0;
          bottom: 0;
          color: #1a0dab;
          cursor: pointer;
          background: none;
          border: none;
          padding: 4px 8px;
          font-size: 13px;
          font-weight: 500;
        }
        
        .toggle-abstract:hover {
          text-decoration: underline;
        }

        /* 关键词高亮 */
        .highlight {
          color: #dd4b39;
          font-weight: normal;
        }
      </style>
      <div class="search-results">
        ${html}
      </div>
    `

    // 处理链接点击事件
    shadowRoot.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.hasAttribute('data-expert-id')) {
        e.preventDefault()
        const expertId = e.target.getAttribute('data-expert-id')
        window.location.href = `/expert/${expertId}`
      }
    })

    // 处理摘要展开/收起
    const abstracts = shadowRoot.querySelectorAll('.abstract-container')
    abstracts.forEach(container => {
      const content = container.querySelector('.abstract-content')
      if (!content) return

      // 只有当内容超出显示范围时才添加展开按钮
      if (content.scrollHeight > content.clientHeight) {
        const toggle = document.createElement('button')
        toggle.className = 'toggle-abstract'
        toggle.textContent = '展开'
        container.appendChild(toggle)
        
        toggle.addEventListener('click', () => {
          const isExpanded = container.classList.toggle('expanded')
          toggle.textContent = isExpanded ? '收起' : '展开'
        })
      }
    })
  }
}

onMounted(() => {
  shadowRoot = container.value.attachShadow({ mode: 'open' })
  updateContent(props.html)
})

watch(() => props.html, (newHtml) => {
  updateContent(newHtml)
})
</script>

<style scoped>
.isolated-html {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}
</style> 