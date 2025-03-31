<template>
  <div ref="container"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
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
        /* 添加需要的基础样式 */
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }
        a {
          color: #1a0dab;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        /* 添加摘要相关样式 */
        .abstract-container {
          position: relative;
          margin-top: 10px;
        }
        .abstract-content {
          position: relative;
          max-height: 3.2em; /* 显示两行文字 */
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }
        .abstract-content::after {
          content: '...';
          position: absolute;
          bottom: 0;
          right: 0;
          padding-left: 40px;
          background: linear-gradient(to right, transparent, white 50%);
        }
        .abstract-container.expanded .abstract-content {
          max-height: none;
        }
        .abstract-container.expanded .abstract-content::after {
          display: none;
        }
        .toggle-abstract {
          cursor: pointer;
          color: #1a0dab;
          display: inline-block;
          margin-left: 5px;
        }
      </style>
      ${html}
    `

    // 添加点击事件处理
    shadowRoot.addEventListener('click', (e) => {
      // 处理链接点击
      if (e.target.tagName === 'A') {
        e.preventDefault()
        const href = e.target.getAttribute('href')
        if (href) {
          if (href.startsWith('/expert/')) {
            // 处理作者链接
            window.open(href, '_blank')
          } else if (href.startsWith('http://') || href.startsWith('https://')) {
            // 处理外部链接
            window.open(href, '_blank')
          }
        }
      }

      // 处理摘要展开/收起
      if (e.target.classList.contains('toggle-abstract')) {
        const container = e.target.closest('.abstract-container')
        if (container) {
          container.classList.toggle('expanded')
          e.target.textContent = container.classList.contains('expanded') ? '↑' : '↓'
        }
      }
    })

    // 初始化所有摘要为收起状态
    shadowRoot.querySelectorAll('.abstract-container').forEach(container => {
      container.classList.remove('expanded')
      const toggle = container.querySelector('.toggle-abstract')
      if (toggle) {
        toggle.textContent = '↓'
      }
    })
  }
}

onMounted(() => {
  shadowRoot = container.value.attachShadow({ mode: 'closed' })
  updateContent(props.html)
})

watch(() => props.html, (newHtml) => {
  updateContent(newHtml)
})
</script> 