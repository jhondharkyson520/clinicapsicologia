// DetailClientService.ts
import prismaClient from "../../prisma";

interface DetailRequest {
    id: string;
}

class DetailClientService {
    async execute({ id }: DetailRequest) {
        const client = await prismaClient.clients.findUnique({
            where: {
                id: id
            },
            select: {
                name: true,
                email: true,
                cpf: true,
                telefone: true,
                endereco: true,
                tipoPlano: true,
                planoFamiliar: true,
                dataVencimento: true,
                valorPlano: true,
                quantidadeSessoes: true,
                situacao: true,
            }
        });

        //console.log(id);

        return client;
    }
}

export { DetailClientService };
