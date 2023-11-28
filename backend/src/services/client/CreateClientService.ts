import prismaClient from "../../prisma";

interface ClientRequest{
    name: string;
    email: string;
    cpf: string;
    telefone: string;
    endereco: string;
    mensalidade: string;
    vencimento: Date;
    situacao: boolean;
}

class CreateClientService{
    async execute({
        name,
        email,
        cpf,
        telefone,
        endereco,
        mensalidade,
        vencimento,
        situacao
    }: ClientRequest){
        
        if(
            name === '' || email === '' || cpf === '' || telefone === '' 
            || endereco === '' || mensalidade === '' || vencimento === null 
            || situacao === null
        ){
            throw new Error('Preencha todos os campos!');
        }

        const client = await prismaClient.clients.create({
            data:{
                name: name,
                email: email,
                cpf: cpf,
                telefone: telefone,
                endereco: endereco,
                mensalidade: mensalidade,
                vencimento: vencimento,
                situacao: situacao,
            },
            select:{
                id: true,
                name: true,
                telefone: true,
                mensalidade: true,
                vencimento: true,
                situacao: true
            }
        })

        return client;

    }
}

export { CreateClientService }