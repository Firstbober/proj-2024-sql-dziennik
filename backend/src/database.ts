import { PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient();

export async function checkIfLogged(token: string): Promise<User | null> {
    if(token == undefined) return null;
    console.log(token)
    
    const session = await prisma.session.findUnique({
        select: {
            user: true
        },
        where: {
            token: token
        }
    })

    if(session == null) return null;
    
    return session.user;
}

export default prisma;