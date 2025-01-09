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
      </style>
      ${html}
    `
    shadowRoot.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        e.preventDefault()
        const href = e.target.getAttribute('href')
        if (href && href.startsWith('/expert/')) {
          window.open(href, '_blank')
        }
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