import prismaClient from "../../prisma";

class ListClientService{
    async execute(){
        const client = await prismaClient.clients.findMany({
            select:{
                id: true,
                name: true,
                email: true,
                telefone: true,
                vencimento: true,
                mensalidade: true
            }
        })

        return client;
    }
}

export { ListClientService }