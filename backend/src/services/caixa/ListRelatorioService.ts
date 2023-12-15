import prismaClient from "../../prisma";



class ListRelatorioService{

    async execute(){

        const caixa = await prismaClient.caixa.findMany({
            select: {
              id: true,
              dataOperacao: true,
              valorPlano: true,
              valorAberto: true,
              client:{
                select:{
                  name: true,
                }
              }
            },
            orderBy: {
              dataOperacao: 'desc'
            }
          });
        return caixa;

    }

}

export { ListRelatorioService }