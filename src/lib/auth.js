import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
  
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [GitHub],
    callbacks: {
        async redirect({ url, baseUrl }) {
            return `${baseUrl}/welcome?fromSignIn=true`; // Redirect to the welcome page after signing in
        },
    },
});


async function signInCallback(user) {
    try {
        const res = fetch("http://localhost:3000/api/createUser", {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "x-api-key": process.env.AUTH_SECRET
            }
        });
    } catch (e) {
        console.log(e)
    }
}