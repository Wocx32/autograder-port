import { lucia } from "$lib/server/auth"
import { fail, redirect } from "@sveltejs/kit"
import { generateIdFromEntropySize } from "lucia"
import { hash } from "@node-rs/argon2"
import { client } from "$lib/server/db"


export const actions = {
    default: async (event) => {
        const formData = await event.request.formData()
        const username = formData.get("username")
        const password = formData.get("password")

        if (
            typeof username !== "string" ||
            username.length < 3 ||
            username.length > 31 ||
            !/^[a-z0-9_-]+$/.test(username)
        ) {
            return fail(400, {
                message: "Invalid username"
            })
        }
        if (typeof password !== "string" || password.length < 6 || password.length > 255) {
            return fail(400, {
                message: "Invalid password"
            })
        }

        const userId = generateIdFromEntropySize(10)
        const passwordHash = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        })

        await client.user.create({
            data: {
                id: userId,
                username,
                password_hash: passwordHash
            }
        })

        const session = await lucia.createSession(userId, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        })

        redirect(302, "/")
    }
    // @ts-ignore
}