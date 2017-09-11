<template>
    <button :class="[localActive ? 'is-success' : 'is-light', 'button']" @click="toggle()"><slot>{{!localActive ? 'Aktivera' : 'Avaktivera'}}</slot></button>
</template>
<script>
export default {
    props: ['active'],
    data(){
        return {
            localActive: this.active
        }
    },
    methods: {
        toggle(){
            this.localActive = !this.localActive;
            this.$emit('toggle');
        }
    },
}
</script>