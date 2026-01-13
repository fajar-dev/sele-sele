export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return

    const { state } = useAuth()
    
    if (!state.token && to.path !== '/sign-in') {
      return navigateTo('/sign-in')
    }
})
