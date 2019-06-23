<template>
  <div class="item">
    <div
      class="thumbnail"
      :style="'background-image: url('+data.thumbnail+');'"
    >
      <div class="likes">
        <fa
          icon="heart"
        />
        <p>{{data.likes.length}}</p>
      </div>
    </div>
    <router-link :to="'/module/'+data.user+'/'+data.id">
      <h2>{{ data.title }}</h2>
    </router-link>
    <Keywords
      :keywords="data.keywords"
    />
    <UserData
      :uid="data.user"
      :createdAt="data.createdAt"
    />
    <p
      v-if="data.price"
      class="price"
    >¥ {{ data.price }}</p>
    <p
      v-else
      class="price"
    >Free</p>
  </div>
</template>

<script>
import { db } from '@/main';
import UserData from '@/components/UserData';
import Keywords from '@/components/Keywords';

export default {
  props: ['dataId'],
  components: {
    UserData,
    Keywords,
  },
  data() {
    return {
      data: {},
    };
  },
  firestore() {
    return {
      data: db.collection('items').doc(this.$props.dataId),
    };
  },
};
</script>
