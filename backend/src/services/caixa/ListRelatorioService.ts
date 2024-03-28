import prismaClient from "../../prisma";



class ListRelatorioService{

    async execute(){

        const caixa = await prismaClient.caixa.findMany({
            select: {
              id: true,
              dataOperacao: true,
              valorPlano: true,
              valorAberto: true,
              valorPago: true,
              client:{
                select:{
                  id: true,
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