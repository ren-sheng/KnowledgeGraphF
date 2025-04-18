//导入vue-router
import {createRouter, createWebHistory} from 'vue-router'

//导入组件
import HomeVue from "@/views/Home.vue";
import SearchVue from "@/views/search.vue";
import AreaVue from "@/views/area.vue";
import ExpertVue from "@/views/Expert.vue";
import InstitutionVue from "@/views/Institution.vue";
import AlgorithmDisambiguation from "@/views/AlgorithmDisambiguation.vue";
import RegularDisambiguationCo from "@/views/RegularDisambiguationCo.vue";
import RegularDisambiguationID from "@/views/RegularDisambiguationID.vue";
import IntroductionVue from "@/views/Introduction.vue"
import AiVue from '../views/AiVue.vue';
import KnowledgeVue from "@/views/Knowledge.vue";
import LocalKnowledgeVue from "@/views/LocalKnowledge.vue";

//定义路由关系
const routes = [
    {
        path: '/',
        component: HomeVue,
        children: [
            {
                path: '',  // 默认子路由
                name: 'introduction',
                meta: {name: "首页"},
                component: IntroductionVue
            },
            {
                path: '/ai',
                name: 'ai',
                meta: {name: "DeepSeek赋能"},
                component: AiVue
            },
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
            }, {
                path: '/knowledge',
                name: 'knowledge',
                meta: {name: "知识脉络"},
                component: KnowledgeVue,
            },
            {
                path: '/local_knowledge',
                name: 'local_knowledge',
                meta: {name: "本地知识"},
                component: LocalKnowledgeVue,
            },
            //规则消歧id
            {
                path: '/RegularDisambiguationID',
                name: 'RDID',
                meta: {name: "规则消歧"},
                component: RegularDisambiguationID
            },
            //规则消歧合作者
            {
                path: '/RegularDisambiguationCo',
                name: 'RDCo',
                meta: {name: "作者合作者规则消歧"},
                component: RegularDisambiguationCo
            },
            {
                path: '/expert/:id',
                name: 'Expert',
                meta: {name: "学术专家"},
                component: ExpertVue
            }
        ]
    }
]

//创建路由器
const router = createRouter({
    //路由模式采用history模式
    history: createWebHistory(),
    //路由关系
    routes: routes
});

export default router
