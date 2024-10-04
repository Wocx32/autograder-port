

export const load = async (event) => {
    return {
        username: event.locals.user ? event.locals.user.username : null
    }
}