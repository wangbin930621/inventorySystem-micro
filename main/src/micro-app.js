import store from './store'

const microApps = [
  {
    name: 'sub-app',
    entry: process.env.VUE_APP_SUB_APP,
    activeRule: '/sub-app'
  }
]

const apps = microApps.map(item => {
  return {
    ...item,
    container: '#sub-container', // 子应用挂载的div
    props: {
      routerBase: item.activeRule, // 下发基础路由
      getGlobalState: store.getGlobalState // 下发getGlobalState方法
    }
  }
})

export default apps
