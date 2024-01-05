import prismaClient from "../../prisma";
import { DateTime } from "luxon"; 

interface ClientRequest {
  name: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: string;
  tipoPlano: string;
  planoFamiliar?: string | null;
  dataVencimento?: string | null;
  valorPlano: number;
  quantidadeSessoes?: number | null;
  situacao: boolean;
}

class CreateClientService {
  async execute({
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
  }: ClientRequest) {
    if (
      name === "" ||
      email === "" ||
      cpf === "" ||
      telefone === "" ||
      endereco === "" ||
      tipoPlano === "" ||
      valorPlano === null ||
      situacao === null
    ) {
      throw new Error("Preencha todos os campos!");
    }

    const formattedDataVencimento =
      dataVencimento && DateTime.fromFormat(dataVencimento, "dd/MM/yyyy").toISO();

    const client = await prismaClient.clients.create({
      data: {
        name: name,
        email: email,
        cpf: cpf,
        telefone: telefone,
        endereco: endereco,
        tipoPlano: tipoPlano,
        valorPlano: valorPlano,
        planoFamiliar: planoFamiliar || null,
        dataVencimento: formattedDataVencimento || null,
        quantidadeSessoes: quantidadeSessoes || null,
        situacao: situacao,
      },
      select: {
        id: true,
        name: true,
        telefone: true,
        valorPlano: true,
        dataVencimento: true,
        situacao: true,
      },
    });

    return client;
  }
}

export { CreateClientService };