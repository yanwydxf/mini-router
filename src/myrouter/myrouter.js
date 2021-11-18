
let Vue;

class VueRouter{
    constructor(options){
        this.options=options
        this.mode = options.mode || "hash"
        //数据响应式
        Vue.util.defineReactive(
            this,
            'current',
            this.mode === "hash"?window.location.hash.slice(1) || '/':location.pathname || '/'
        )
        if (this.mode === "hash"){
            //监听url变化
            window.addEventListener('hashchange',()=>{
                this.current=window.location.hash.slice(1)
            })
        }
        else{
            //监听url变化
            window.addEventListener("popstate",()=>{
                this.current = location.pathname
            })
        }
    }

 
}
//插件要实现的install方法
VueRouter.install=function(_Vue){
    Vue=_Vue
    //通过全局混入，注册router实例
    Vue.mixin({
        beforeCreate(){
            if(this.$options.router){
                Vue.prototype.$router=this.$options.router;
            }
        }
    })
    //注册 router-view 组件
    Vue.component('router-view',{
        render(h){
            let component=null;
            const {current,options}=this.$router
            //根据路由匹配组件
            const route=options.routes.find((route)=>route.path===current)
            if(route){
                component=route.component
            }
            return h(component)
        }
    })
    //注册 router-link 组件
    Vue.component('router-link',{
        props:{
            to:{
                type:String,
                require:true
            }
        },
        render(h){
            const {mode}=this.$router
            //根据mode看是hash还是history
            let to = mode === "hash"?"#"+this.to:this.to
            return h('a',{attrs:{href:to},on:{
                click:(e)=>{
                    if(mode=='history'){
                        //阻止 a 标签的默认行为，防止刷新页面
                        e.preventDefault();
                        //向当前浏览器会话的历史堆栈中tianj
                        window.history.pushState(null,'',to);
                        //由于pushState 并不会触发popstate，所以需手动触发
                        var popStateEvent = new PopStateEvent('popstate',);
    dispatchEvent(popStateEvent);
                    }
                }
            }},this.$slots.default)
        }
    })
}
//导出VueRouter
export default VueRouter