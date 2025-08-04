<template>
  <component
    :is="as"
    ref="containerRef"
    :class="`inline-block whitespace-pre-wrap tracking-tight ${className}`"
    v-bind="$attrs"
  >
    <span class="inline" :style="{ color: currentTextColor }">
      {{ displayedText }}
    </span>
    <span
      v-if="showCursor"
      ref="cursorRef"
      :class="`ml-1 inline-block opacity-100 ${
        hideCursorWhileTyping &&
        (currentCharIndex < currentText.length || isDeleting)
          ? 'hidden'
          : ''
      } ${cursorClassName}`"
    >
      {{ cursorCharacter }}
    </span>
  </component>
</template>

<script>
import { gsap } from 'gsap'

export default {
  name: 'TextType',
  props: {
    className: { type: String, default: '' },
    showCursor: { type: Boolean, default: true },
    hideCursorWhileTyping: { type: Boolean, default: false },
    cursorCharacter: { type: String, default: '|' },
    cursorBlinkDuration: { type: Number, default: 0.5 },
    cursorClassName: { type: String, default: '' },
    text: { type: [String, Array], required: true },
    as: { type: String, default: 'div' },
    typingSpeed: { type: Number, default: 50 },
    initialDelay: { type: Number, default: 0 },
    pauseDuration: { type: Number, default: 2000 },
    deletingSpeed: { type: Number, default: 30 },
    loop: { type: Boolean, default: true },
    textColors: { type: Array, default: () => [] },
    variableSpeed: { type: Object, default: null },
    onSentenceComplete: Function,
    startOnVisible: { type: Boolean, default: false },
    reverseMode: { type: Boolean, default: false }
  },
  data() {
    return {
      displayedText: '',
      currentCharIndex: 0,
      isDeleting: false,
      currentTextIndex: 0,
      isVisible: !this.startOnVisible,
      timeout: null
    }
  },
  computed: {
    textArray() {
      return Array.isArray(this.text) ? this.text : [this.text]
    },
    currentText() {
      const raw = this.textArray[this.currentTextIndex]
      return this.reverseMode ? raw.split('').reverse().join('') : raw
    },
    currentTextColor() {
      if (!this.textColors.length) return '#000000'
      return this.textColors[this.currentTextIndex % this.textColors.length]
    }
  },
  mounted() {
    if (this.showCursor && this.$refs.cursorRef) {
      gsap.set(this.$refs.cursorRef, { opacity: 1 })
      gsap.to(this.$refs.cursorRef, {
        opacity: 0,
        duration: this.cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      })
    }

    if (this.startOnVisible && this.$refs.containerRef) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) this.isVisible = true
          })
        },
        { threshold: 0.1 }
      )
      observer.observe(this.$refs.containerRef)
      this._observer = observer
    }

    this.$watch(
      () => [this.displayedText, this.currentCharIndex, this.isDeleting, this.isVisible],
      () => {
        if (!this.isVisible) return
        this.clearTimer()

        if (
          this.currentCharIndex === 0 &&
          !this.isDeleting &&
          this.displayedText === ''
        ) {
          this.timeout = setTimeout(() => {
            this.executeTyping()
          }, this.initialDelay)
        } else {
          this.executeTyping()
        }
      },
      { immediate: true, deep: true }
    )
  },
  beforeDestroy() {
    this.clearTimer()
    if (this._observer) this._observer.disconnect()
  },
  methods: {
    clearTimer() {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
    },
    getRandomSpeed() {
      if (!this.variableSpeed) return this.typingSpeed
      const { min, max } = this.variableSpeed
      return Math.random() * (max - min) + min
    },
    executeTyping() {
      if (this.isDeleting) {
        if (this.displayedText === '') {
          this.isDeleting = false

          if (
            this.currentTextIndex === this.textArray.length - 1 &&
            !this.loop
          )
            return

          if (this.onSentenceComplete) {
            this.onSentenceComplete(
              this.textArray[this.currentTextIndex],
              this.currentTextIndex
            )
          }

          this.currentTextIndex =
            (this.currentTextIndex + 1) % this.textArray.length
          this.currentCharIndex = 0

          this.timeout = setTimeout(() => {}, this.pauseDuration)
        } else {
          this.timeout = setTimeout(() => {
            this.displayedText = this.displayedText.slice(0, -1)
          }, this.deletingSpeed)
        }
      } else {
        if (this.currentCharIndex < this.currentText.length) {
          this.timeout = setTimeout(() => {
            this.displayedText += this.currentText[this.currentCharIndex]
            this.currentCharIndex += 1
          }, this.variableSpeed ? this.getRandomSpeed() : this.typingSpeed)
        } else if (this.textArray.length > 1) {
          this.timeout = setTimeout(() => {
            this.isDeleting = true
          }, this.pauseDuration)
        }
      }
    }
  }
}
</script>
