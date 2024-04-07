"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAtrasadosService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const date_fns_1 = require("date-fns");
class ListAtrasadosService {
    async execute() {
        const uniqueClients = {};
        const caixaEntries = await prisma_1.default.caixa.findMany({
            orderBy: [
                { client: { id: 'asc' } },
                { dataOperacao: 'desc' },
            ],
            select: {
                id: true,
                dataOperacao: true,
                valorPlano: true,
                valorAberto: true,
                client: true,
            },
        });
        //console.log('Todas as entradas do caixa:', caixaEntries);
        for (const entry of caixaEntries) {
            const clientId = entry.client.id;
            //console.log('Processando entrada:', entry);
            if (!uniqueClients[clientId] || entry.dataOperacao > uniqueClients[clientId].dataOperacao) {
                //console.log('Atualizando entrada mais recente para o cliente:', entry);
                uniqueClients[clientId] = entry;
            }
        }
        const filteredEntries = Object.values(uniqueClients).filter(entry => entry.valorAberto < 0);
        const results = filteredEntries.map(entry => ({
            id: entry.id,
            dataOperacao: (0, date_fns_1.format)(new Date(entry.dataOperacao), 'dd/MM/yyyy'),
            valorPlano: parseFloat(entry.valorPlano).toFixed(2),
            valorAberto: parseFloat(entry.valorAberto.toString()).toFixed(2),
            client: { id: entry.client.id, name: entry.client.name },
        }));
        for (const entry of results) {
            const clientId = entry.client.id;
            //console.log('idcliend', entry.client.id);
            if (uniqueClients[clientId]) {
                await prisma_1.default.clients.update({
                    where: { id: entry.client.id },
                    data: { situacao: false }
                });
            }
        }
        /// está mudando todos os clients para false
        return results;
    }
}
exports.ListAtrasadosService = ListAtrasadosService;
