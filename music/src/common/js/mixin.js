import { mapGetters } from 'vuex';
export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playlist'
        ])
    },
    methods: {
        handlePlaylist() {
            throw new Error('component must implement handlePlaylist method');
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.handlePlaylist(this.playlist);
        })
    },
    activated() {
        this.handlePlaylist(this.playlist);
    },
    watch: {
        playlist(newVal) {
            // console.log(newVal);
            this.handlePlaylist(newVal);
        }
    }
}