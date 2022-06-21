<template>
    <div>
        <div class="headline text--primary mb-4"></div>
        <v-textarea
            no-resize
            outlined
            dense
            rows="6"
            :counter="$root.config.text.limit"
            placeholder="请输入文本"
            v-model="$root.send.editText"
            @keyup.ctrl.enter="update"
        ></v-textarea>
        <div class="text-right">
            <v-btn
                color="primary"
                :block="$vuetify.breakpoint.smAndDown"
                :disabled="!$root.send.editText || !$root.websocket || $root.send.editText.length > $root.config.text.limit"
                @click="update"
            >保存</v-btn>
        </div>
    </div>
</template>

<script>
export default {
    name: 'edit-text',
    methods: {
        update() {
            // console.log(`Update id = ${this.$root.send.editId} content = ${this.$root.send.editText}`);
            const editId = this.$root.send.editId;
            const editContent = this.$root.send.editText.trim();
            if (editId < 0 || !editContent) {
                this.$toast(`保存失败：${!editContent ? "内容为空" : "id 有误"}`);
                return;
            }
            this.$http.post(`/updateText/${editId}`, editContent, {headers: {'Content-Type': 'text/plain'}}).then(response => {
                this.$toast('保存成功');
                // this.textContent = '';
            }).catch(error => {
                if (error.response && error.response.data.msg) {
                    this.$toast(`保存失败：${error.response.data.msg}`);
                } else {
                    this.$toast('保存失败');
                }
            });
        },
    },
}
</script>