<template>
    <v-hover
        v-slot:default="{ hover }"
    >
        <v-card :elevation="hover ? 6 : 2" class="mb-2">
            <v-card-text class="d-flex flex-row align-center">
                <div class="flex-grow-1 mr-2" style="min-width: 0">
                    <div class="title text-truncate text--primary" @click="expand = !expand">
                        {{`文本消息（共${meta.content.length}字）`}}<v-icon>{{expand ? mdiChevronUp : mdiChevronDown}}</v-icon>
                    </div>
                    <div class="text-truncate" @click="expand = !expand" v-html="textPreview()" v-linkified style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;white-space:normal !important;"></div>
                    <v-expand-transition>
                        <div v-show="expand">
                            <v-divider class="my-2"></v-divider>
                            <div ref="content" v-html="meta.content.replace(/\n/g, '<br>')" v-linkified></div>
                        </div>
                    </v-expand-transition>
                </div>

                <div class="align-self-center text-no-wrap">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <a :href="`zhuji://ext:8888/addSnippetAct?cct=${encodeContent()}`">
                                <v-btn v-on="on" icon color="grey">
                                    <v-icon>{{mdiExportVariant }}</v-icon>
                                </v-btn>
                            </a>
                        </template>
                        <span>投送到珠玑</span>
                    </v-tooltip>
                    
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" icon color="grey" @click="copyText">
                                <v-icon>{{mdiContentCopy}}</v-icon>
                            </v-btn>
                        </template>
                        <span>复制</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" icon color="grey" @click="deleteItem">
                                <v-icon>{{mdiClose}}</v-icon>
                            </v-btn>
                        </template>
                        <span>删除</span>
                    </v-tooltip>
                </div>
            </v-card-text>
        </v-card>
    </v-hover>
</template>

<script>
import {
    mdiChevronUp,
    mdiChevronDown,
    mdiContentCopy,
    mdiClose,
    mdiExportVariant,
} from '@mdi/js';

export default {
    name: 'received-text',
    props: {
        meta: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            expand: false,
            mdiChevronUp,
            mdiChevronDown,
            mdiContentCopy,
            mdiClose,
            mdiExportVariant,
        };
    },
    methods: {
        encodeContent() {
            const content = new DOMParser().parseFromString(this.meta.content, 'text/html').documentElement.textContent;
            const result = encodeURI(content.trim())
            return result;
        },
        textPreview() {
            let sanitizedContent = this.meta.content.trim().replace(/\n/g, '');
            const strLen = sanitizedContent.length
            const limit = 30;
            const semiLmt = Math.round(limit/2)
            if (strLen > limit) {
                sanitizedContent = sanitizedContent.substr(0, semiLmt) + "……" + sanitizedContent.substr(strLen - semiLmt, strLen)
            }
            return sanitizedContent;
        },
        shareText() {
            this.$toast('navigator only works over HTTPS...');
            navigator.share({
                // title: '',
                text: this.meta.content,
                // url: '',
            });
        },
        copyText() {
            let el = document.createElement('textarea');
            el.value = new DOMParser().parseFromString(this.meta.content, 'text/html').documentElement.textContent;
            el.style.cssText = 'top:0;left:0;position:fixed';
            document.body.appendChild(el);
            el.focus();
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            this.$toast('复制成功');
        },
        deleteItem() {
            this.$http.delete(`/revoke/${this.meta.id}`).then(() => {
                this.$toast('已删除文本消息');
            }).catch(error => {
                if (error.response && error.response.data.msg) {
                    this.$toast(`消息删除失败：${error.response.data.msg}`);
                } else {
                    this.$toast('消息删除失败');
                }
            });
        },
    },
}
</script>