import prismaClient from "../../prisma";

class ListClientService{
    async execute(){
        const client = await prismaClient.clients.findMany({
            select:{
                id: true,
                name: true,
                email: true,
                telefone: true,
                dataVencimento: true,
                tipoPlano: true,
                valorPlano: true,
                quantidadeSessoes: true,
                situacao: true
            }
        })

        return client;
    }
}

export { ListClientService }