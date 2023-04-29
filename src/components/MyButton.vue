<template>
    <div ref="button" class="mybutton">
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
let button = ref(null as unknown as HTMLDivElement)
const props = defineProps(['size', 'bgcolor', 'radius'])
onMounted(() => {
    nextTick(() => {
        if (props.size != null)
            button.value.style.setProperty('--size', props.size)
        if (props.bgcolor != null) {
            button.value.style.setProperty('--bgcolor', props.bgcolor)
            button.value.style.setProperty('--hover-bgcolor', props.bgcolor + '9A')
        } else {
            button.value.style.setProperty('--bgcolor', "#04b6fd")
            button.value.style.setProperty('--hover-bgcolor', "#04b6fd" + '9A')
        }

        let color = button.value.style.getPropertyValue('--bgcolor')

        button.value.addEventListener('mousedown', () => {
            button.value.style.setProperty('--hover-bgcolor', color + 'ff')
        })
        button.value.addEventListener('mouseup', () => {
            button.value.style.setProperty('--hover-bgcolor', color + '9A')
        })
        button.value.addEventListener('mouseout', () => {
            button.value.style.setProperty('--hover-bgcolor', color + '9A')
        })

        if (props.radius) {
            button.value.style.setProperty('--radius', props.radius)
        }
    })

})
</script>
<style lang="scss" scoped>
.mybutton {
    --size: 1;
    --bgcolor: #04b6fd;
    --hover-bgcolor: #04b6fd7A;
    --radius: 0;
    padding: calc(var(--size) * 5px) calc(var(--size) * 10px);
    background-color: var(--bgcolor);
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
    border-radius: var(--radius);
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    &:hover {
        background-color: var(--hover-bgcolor);
    }

    //兄弟选择器
    +.mybutton {
        margin-left: 10px;
    }
}
</style>