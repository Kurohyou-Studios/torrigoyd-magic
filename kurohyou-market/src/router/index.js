import { createRouter, createWebHistory, useRoute } from 'vue-router'
import { computed } from 'vue';
import ItemSearcher from '@/views/ItemSearcher.vue';
import AvailableShops from '@/views/AvailableShops.vue';
import ShopDetail from '@/views/ShopDetail.vue';
import { useItemStore } from '@/stores/items';

export const initRouter = () => {
  const itemStore = useItemStore();
  itemStore.init();
  const baseBreadCrumb = {
    text:computed(() =>
      itemStore.location?.Name.replace(/"/g,'') ||
      ''  
    ),
    path:'/'
  };
  return createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path:'/',
        component: ItemSearcher,
        meta: {
          breadCrumb: [
            {
              ...baseBreadCrumb,
              active:'active'
            }       
          ]
        }
      },
      {
        path:'/shops/:shopID',
        component: ShopDetail,
        meta: {
          breadCrumb: [
            {
              ...baseBreadCrumb,
              path:'/'
            },
            {
              text:'Shops',
              path:'/shops'
            },
            {
              active:'active'
            }
          ]
        }
      },
      {
        path:'/shops',
        component: AvailableShops,
        meta: {
          breadCrumb: [
            {
              ...baseBreadCrumb,
              path:'/'
            },
            {
              text:'Shops',
              path:'/shops',
              active:'active'
            }
          ]
        }
      }
    ]
  });
};
