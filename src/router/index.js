//导入vue-router
import {
    createRouter,
    createWebHistory
} from 'vue-router'

//导入组件
import HomeVue from "@/views/Home.vue";
import SearchVue from "@/views/search.vue";
import AreaVue from "@/views/area.vue";
import ExpertVue from "@/views/Expert.vue";
import InstitutionVue from "@/views/Institution.vue";
import AlgorithmDisambiguation from "@/views/AlgorithmDisambiguation.vue";
import RegularDisambiguationCo from "@/views/RegularDisambiguationCo.vue";
import RegularDisambiguationID from "@/views/RegularDisambiguationID.vue";

//定义路由关系
const routes = [
    // {
    //     path: '/login',
    //     component: LoginVue,
    // },
    {
        path: '/',
        component: HomeVue,
        //重定向
        // redirect: '/login',
        // 子路由
        children: [
            {
                path: '/search',
                name: 'search',
                meta: {name: "平台搜索"},
                component: SearchVue
            },
            {
                path: '/area',
                name: 'area',
                meta: {name: "研究领域"},
                component: AreaVue
            },
            {
                path: '/expert',
                name: 'expert',
                meta: {name: "学术专家"},
                component: ExpertVue
            },
            {
                path: '/institution',
                name: 'institution',
                meta: {name: "机构信息"},
                component: InstitutionVue
            },
            {
                path: '/algorithm',
                name: 'algorithm',
                meta: {name: "算法消歧"},
                component: AlgorithmDisambiguation,
            },
            //规则消歧id
            {
                path: '/RegularDisambiguationID',
                name: 'RDID',
                meta: {name: "作者ID规则消歧"},
                component: RegularDisambiguationID
            },
            //规则消歧合作者
            {
                path: '/RegularDisambiguationCo',
                name: 'RDCo',
                meta: {name: "作者合作者规则消歧"},
                component: RegularDisambiguationCo
            }
        ]
    },
    // 添加这个通配符路由 访问一个未定义的路径时，重定向到登录页面 最后一个元素
    // {
    //     path: '/:pathMatch(.*)*',
    //     redirect: '/login',
    // }
]

//创建路由器
const router = createRouter({
    //路由模式采用history模式
    history: createWebHistory(),
    //路由关系
    routes: routes
});

export default router
