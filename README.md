## 使用原生 JS 实现前端路由

#### 基于 hash 实现

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>基于 hash 实现</title>
</head>
<body>
    <!-- 定义路由 -->
    <ul>
        <li><a href="#/home">Home</a></li>
        <li><a href="#/about">About</a></li>
    </ul>
    <!-- 渲染路由对应的UI -->
    <div id="routeView"></div>
</body>
<script>
    let routeView=document.getElementById("routeView");
    //监听 hashchange 事件
    window.addEventListener("hashchange",()=>{
        let hash=location.hash;
        routeView.innerHTML=hash;
    })
    //监听 DOMContentLoaded 事件
    window.addEventListener("DOMContentLoaded",()=>{
        if(!location.hash){
            location.hash="/";
        }else{
            let hash=location.hash;
            routeView.innerHTML=hash;
        }
    })
</script>
</html>
```

#### 基于 history 实现

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>基于 history 实现</title>
</head>
<body>
    <!-- 定义路由 -->
    <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="/about">About</a></li>
    </ul>
    <!-- 渲染路由对应的UI -->
    <div id="routeView"></div>
</body>
<script>
    let routeView=document.getElementById("routeView");
    //监听 hashchange 事件
    window.addEventListener("popstate",()=>{
        routeView.innerHTML=location.pathname;
    })
    //监听 DOMContentLoaded 事件
    window.addEventListener("DOMContentLoaded",()=>{
        if(!location.pathname){
            location.pathname="/";
        }else{
            routeView.innerHTML=location.pathname;
            let alist=document.querySelectorAll('a[href]');
            alist.forEach(el=>el.addEventListener('click',(e)=>{
                //组织 a 标签点击后默认行为
                e.preventDefault();
                history.pushState(null,'',el.getAttribute('href'));
                routeView.innerHTML=location.pathname;
            }))
            
        }
    })
</script>
</html>
```

## 手写建议 vue-router

#### 准备工作

安装 vue-cli

```bash
npm install -g @vue/cli
```

创建项目

```bash
vue create mini-router
```

安装插件

```
vue add router
```

首先把 `router` 文件夹修改为 `myrouter` ，并创建 `myrouter/myrouter.js` ，同步修改 `main.js` 和 `myrouter/index.js` 下的引用

修改 `main.js`

```js
import router from './myrouter'
```

修改 `myrouter/index.js`

```js
import VueRouter from './myrouter'
```

#### 编写代码

`myrouter/myrouter.js` 代码如下：

```js

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
```

#### 

