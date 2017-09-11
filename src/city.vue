<template>
    <span class="tag is-black">
        <slot></slot>
        <button class="delete is-small" @click="remove"></button>
    </span>
</template>
<script>
    export default {
        props: ['i'],
        name: 'city',
        methods: {
            remove(){
                this.$emit('remove', this.i)
            }
        }
    }
</script>