import { Request, Response } from "express";
import { ListRelatorioService } from "../../services/caixa/ListRelatorioService";
import prismaClient from "../../prisma";
import { Decimal } from '@prisma/client/runtime/library';

interface Caixa {
  id: string;
  dataOperacao: Date;
  valorPlano: Decimal;
  valorAberto: Decimal;
  client?: {
    name: string;
  };
}

interface RelatorioResponse {
  faturamentoMensal: number;
  faturamentoAnual: number;
  valoresAtrasados: number;
}

class ListRelatorioController {
  async handle(req: Request, res: Response) {
    const listRelatorio = new ListRelatorioService();
    const caixas: Caixa[] = await listRelatorio.execute();

    let faturamentoMensalTemp = 0;
    let faturamentoAnualTemp = 0;
    let valoresAtrasadosTemp = 0;

    const mesAtual = new Date().getMonth() + 1;
    const anoAtual = new Date().getFullYear();

    const ultimosPagamentos: Record<string, Caixa> = {};

    caixas.forEach((caixa) => {
      const clienteId = caixa.client?.name || 'SemCliente';

      if (!ultimosPagamentos[clienteId] || caixa.dataOperacao > ultimosPagamentos[clienteId].dataOperacao) {
        ultimosPagamentos[clienteId] = caixa;
      }
    });

    Object.values(ultimosPagamentos).forEach((caixa) => {
      const valorPlano = parseFloat(caixa.valorPlano.toString());
      const valorAberto = parseFloat(caixa.valorAberto.toString());

      if (caixa.dataOperacao.getMonth() + 1 === mesAtual && caixa.dataOperacao.getFullYear() === anoAtual) {
        const diferenca = Math.max(0, valorPlano - Math.max(valorAberto, 0)); // Evita valores negativos
        faturamentoMensalTemp += diferenca;
      }

      const diferencaAnual = Math.max(0, valorPlano - Math.max(valorAberto, 0)); // Evita valores negativos
      faturamentoAnualTemp += diferencaAnual;

      if (valorAberto > 0) {
        valoresAtrasadosTemp += valorAberto;
      }
    });

    const response: RelatorioResponse = {
      faturamentoMensal: faturamentoMensalTemp,
      faturamentoAnual: faturamentoAnualTemp,
      valoresAtrasados: valoresAtrasadosTemp,
    };

    return res.json(response);
  }
}

export { ListRelatorioController };
