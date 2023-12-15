import prismaClient from "../../prisma";

interface CaixaRequest{
    caixa_id: string;
}

class ListNameCaixaService{

    async execute({ caixa_id }: CaixaRequest){

        const findByName = await prismaClient.caixa.findFirst({
            where:{
                    client_id: caixa_id
            },
            orderBy: { dataOperacao: 'desc' },
            
        })

        return findByName;

    }

}

export { ListNameCaixaService }