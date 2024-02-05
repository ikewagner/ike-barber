import { authOptions } from "@/app/_lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export default handler;
export { authOptions };
