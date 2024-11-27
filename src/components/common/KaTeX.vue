<template>
  <div ref="mathContainer" v-html="renderedMath"></div>
</template>

<script>
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default {
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      renderedMath: '',
    };
  },
  watch: {
    content: {
      immediate: true,
      handler(newContent) {
        this.renderMath(newContent);
      },
    },
  },
  methods: {
    renderMath(content) {
      try {
        this.renderedMath = katex.renderToString(content, {
          throwOnError: false,
          displayMode: true, // 是否显示为块级
        });
      } catch (error) {
        console.error('LaTeX 渲染错误:', error);
        this.renderedMath = `<span style="color: red;">LaTeX Error</span>`;
      }
    },
  },
};
</script>
