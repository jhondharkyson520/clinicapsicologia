import prismaClient from '../../prisma';
import { parse } from 'date-fns';

interface UpdateClientRequest {
  id: string;
  name: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: string;
  tipoPlano: string;
  planoFamiliar: string | null;
  dataVencimento: string | null;
  valorPlano: number;
  quantidadeSessoes: number | null;
  situacao: boolean;
}

class UpdateClientService {
  async execute({
    id,
    name,
    email,
    cpf,
    telefone,
    endereco,
    tipoPlano,
    planoFamiliar,
    dataVencimento,
    valorPlano,
    quantidadeSessoes,
    situacao,
  }: UpdateClientRequest) {
    if (!id) {
      throw new Error("É necessário fornecer o ID do cliente para a atualização.");
    }

    const parsedDataVencimento = dataVencimento
      ? parse(dataVencimento, 'dd/MM/yyyy', new Date())
      : null;

    const client = await prismaClient.clients.update({
      where: { id },
      data: {
        name,
        email,
        cpf,
        telefone,
        endereco,
        tipoPlano,
        planoFamiliar,
        dataVencimento: parsedDataVencimento,
        valorPlano,
        quantidadeSessoes: quantidadeSessoes !== null ? quantidadeSessoes : undefined,
        situacao,
      },
    });

    return client;
  }
}

export { UpdateClientService };
