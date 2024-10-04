import { Lucia } from "lucia"
import { PrismaAdapter } from "@lucia-auth/adapter-prisma"
import { client } from "./db"
import { dev } from "$app/environment"


const adapter = new PrismaAdapter(client.session, client.user)

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: !dev
        }
    },
    getUserAttributes: (attributes) => {
        return {
            username: attributes.username
        }
    }
})