import prismaClient from "../../prisma";

class ListClientService {
    async execute() {
        const clients = await prismaClient.clients.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                telefone: true,
                dataVencimento: true,
                tipoPlano: true,
                planoFamiliar: true,
                valorPlano: true,
                quantidadeSessoes: true,
                situacao: true,
                sessoesContador: true
            }
        });

        const caixa = await prismaClient.caixa.findMany();
    

        const today = new Date(); 
        const dayOfMonth = today.getDate(); 

        for (const client of clients) {
           
            const hasPayment = caixa.some(payment => payment.client_id === client.id);
            if (client.dataVencimento && !hasPayment) {
                const vencimento = new Date(client.dataVencimento);
                const vencimentoDoMes = vencimento.getDate();
                
                if (dayOfMonth === vencimentoDoMes) {
                    await prismaClient.clients.update({
                        where: { id: client.id },
                        data: { situacao: false }
                    });
                } else {
                    await prismaClient.clients.update({
                        where: { id: client.id },
                        data: { situacao: true }
                    });
                }


                const valorAberto = client.valorPlano;

                await prismaClient.caixa.create({
                    data: {
                      dataOperacao: new Date(),
                      client_id: client.id,
                      valorPlano: client.valorPlano,
                      valorAberto: -valorAberto,
                      valorPago: 0
                    },
                  });

                  
                  

            } else if(client.sessoesContador >= client.quantidadeSessoes){
                const valorAberto = client.valorPlano;        
                await prismaClient.caixa.create({
                    data: {
                      dataOperacao: new Date(),
                      client_id: client.id,
                      valorPlano: client.valorPlano,
                      valorAberto: -valorAberto,
                      valorPago: 0
                    },
                  });
                  
               
               
                //console.log(`Cliente ${client.id} possui registro no caixa.`);
                continue;
            }
        }
        return clients;
    }
}

export { ListClientService };
