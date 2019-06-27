<template>
  <div class="tutorial">
    <h2>{{tutorial.name}}</h2>
    <UserData
      :uid="$route.params.uid"
      :date="tutorial.createdAt"
    />
  </div>
</template>

<script>
import { db } from '@/main';
import UserData from '@/components/UserData';

export default {
  components: {
    UserData,
  },
  data() {
    return {
      tutorial: {},
    };
  },
  firestore() {
    return {
      tutorial: db.collection('tutorials').doc(this.$route.params.id),
    };
  },
};
</script>
