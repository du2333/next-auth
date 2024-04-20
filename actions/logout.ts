"use server"

import { signOut } from "@/auth"

export const logout = async () => {
    // using server action to do some server side stuff before signing out the user
    await signOut();
}