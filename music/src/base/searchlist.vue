<template>
    <div class="search-list" v-show="searches.length">
        <transition-group name="search-h-list" tag="ul" >
            <li :key="item" class="search-list-item" @click="selectItem(item)" v-for="item in searches">
                <span class="search-list-text">{{item}}</span>

                <span class="search-list-icon" @click.stop="deleteOne(item)">
                    <i class="search-icon-delete"></i>
                </span>
             </li>
        </transition-group>
    </div>
</template>
<script>
export default {
  props: {
    searches: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectItem(item) {
      this.$emit("select", item);
    },
    deleteOne(item) {
      this.$emit("delete", item);
    }
  }
};
</script>
<style>
.search-list-item {
  display: flex;
  align-items: center;
  height: 40px;
  overflow: hidden;
}
.search-h-list-enter-active,.search-h-list-leave-active{
    transition: all 0.1s;
}
.search-h-list-enter,.search-h-list-leave-to{
    height: 0;
}
.search-list-text{
     flex: 1;
}
.search-icon-delete{
    display: inline-block;
    background-image: url(../common/image/search-icon-delete.svg);
    width: 16px;
    height: 16px;
}
</style>
