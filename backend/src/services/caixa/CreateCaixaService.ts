import { Decimal } from '@prisma/client/runtime/library';
import prismaClient from '../../prisma';

interface CaixaRequest {
  client_id: string;
  valorPago: string;
}

class CreateCaixaService {
  async execute({ client_id, valorPago }: CaixaRequest) {
    if (client_id === "" || valorPago === "") {
      throw new Error("Preencha todos os campos!");
    }

    const client = await prismaClient.clients.findUnique({
      where: { id: client_id },
    });

    if (!client) {
      throw new Error("Cliente não encontrado!");
    }

    const lastCaixa = await prismaClient.caixa.findFirst({
      where: { client_id: client_id },
      orderBy: { dataOperacao: 'desc' },
    });

    const valorPlano = client.valorPlano.toString();

    

    const valorAberto = Decimal.add(lastCaixa.valorAberto, valorPago).toString();

   
    const situacao = undefined;

    if(parseFloat(valorAberto) >= 0){
      situacao === true;
    } else {
      situacao === false;
    }

    await prismaClient.clients.update({
      where: { id: client_id },
      data: { 
        situacao: situacao
      },
    });

    const caixa = await prismaClient.caixa.create({
      data: {
        dataOperacao: new Date(),
        client_id: client_id,
        valorPlano: valorPlano,
        valorAberto: valorAberto,
        valorPago: valorPago
      },
    });

 

           
    if(client.sessoesContador >= client.quantidadeSessoes){

     
      await prismaClient.clients.update({
        where: { id: client.id },
        data: {
          sessoesContador: 0,
          situacao: true
        }
      })

    } 
       
    return caixa;
  }
}

export { CreateCaixaService };
