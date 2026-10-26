# Corretor ON — ajustes operacionais e financeiros

## Auditoria e limites

O projeto é uma exportação estática Next.js publicada no GitHub Pages. Não há API, autenticação, banco de dados ou armazenamento privado. O seletor de perfil é uma demonstração. O usuário confirmou que ainda não existe ambiente de TI disponível. Não foram implementadas permissões fictícias nem armazenados documentos pessoais em localStorage.

## Entregue

- Formulários extraídos para `src/app/request-form.tsx`: evento com horário, cidade, local, endereço, participantes, alimentação nas quatro opções solicitadas, Outro condicional, estimativa opcional em reais e observações independentes; ida/volta da passagem; check-in/out e região da hospedagem; categorias de reembolso preservando a descrição histórica.
- Data de criação adicionada somente aos novos registros. Datas antigas ausentes são apresentadas como não informadas na origem. Data de atividade, retorno, saída e lançamento financeiro distintas. Ordenação por abertura e atividade; filtros operacionais e de reembolso. CPF/RG não são coletados na versão pública.
- Dashboard mensal como padrão no mês atual de São Paulo, inclusive ao reabrir pelo menu. Ano selecionável, incluindo anos sem dados. Operação independente do período financeiro, cores e textos de status, atalhos para listagem, prioridades com datas próximas e abertura mais antiga. Importações sem status operacional não são inventadas como recebidas ou finalizadas.
- Gráficos somente na visão anual. Modelo financeiro em `src/lib/corretor.ts` recompõe valores a partir dos registros, preserva a exclusão dos 18 registros com pendências/históricos, deduplica IDs e utiliza competência explícita para novas despesas. Estimativa não reserva; aprovação reserva; finalização substitui reserva pelo realizado; cancelamento libera. Verba disponível e saldo orçamentário mantêm a definição anterior; comprometido e saldo após reservas são apresentados separadamente.
- Aprovação financeira com salvamento explícito do valor e competência em `src/app/approval-fields.tsx`; histórico aditivo das alterações financeiras. Rateio exclusivamente monetário, total distribuído, restante/excedente e divisão igual com centavos em `src/app/allocation-editor.tsx`. Sem alteração de rateios existentes. SPE preservada; CNPJ só pode ser preservado se já estiver no registro, não consta do catálogo atual e não foi inventado.
- Componentes do Estúdio de Apresentações e suas chaves de armazenamento não foram alterados.

## Migrações

Nenhuma migração de banco foi executada: não há banco. Campos opcionais aditivos `createdAt`, `approvedCents`, `competence`, `financialDate`, `financialHistory`; registros legados permanecem legíveis sem regravação. Arquivo público da planilha não foi modificado.

## Pendências que impedem conclusão integral

- CPF/RG: validador de dígitos implementado e testado; coleta, máscara e consulta não liberadas sem autenticação e autorização no servidor.
- Comprovantes: upload, download restrito, substituição e histórico de arquivos dependem de armazenamento privado. Novos reembolsos são bloqueados com a mensagem de comprovante obrigatório; não há exceção que permita enviá-los sem anexo.
- Regras críticas devem ser reaplicadas no servidor antes da operação real. Testes de isolamento entre usuários e consulta de anexos não podem passar sem essa infraestrutura.
- Não há edição compartilhada nem produção autenticada. Os dados financeiros públicos já autorizados continuam públicos; documentos novos não foram publicados.

## Validação

Lint e build estático aprovados. Dez testes Node aprovados: totais originais (R$ 1.326.100,00 verba e R$ 742.262,80 realizado elegível), imutabilidade, centavos, rejeição de valores inválidos, CPF, estados financeiros, duplicidade, ano sem verba e datas legadas.

Playwright: evento completo, Outro, estimativa ausente, consulta das datas, aprovação e reserva, card em andamento, bloqueio de reembolso sem anexo, rateio em reais e divisão igual. Hospedagem e região, troca mensal/anual e ano sem verba, ausência do painel financeiro no perfil de demonstração do solicitante. Layout em 1366×600, 1024×600 e 390×844; sem transbordamento dos componentes financeiros no desktop ou horizontal no celular. Isso não constitui teste de autorização no servidor.

## Como validar

1. Marketing → Painel: mês atual, quatro estados operacionais e prioridades. Clique em Anual para gráficos; escolha 2027 para testar ausência de orçamento.
2. Novo pedido → Evento: preencher detalhes, alimentação Outro e estimativa; conferir data de abertura na lista.
3. Abrir o pedido: salvar valor aprovado e competência, depois selecionar Aprovada. Painel mostra a reserva separada.
4. Quem paga esta despesa: selecionar produtos, preencher custo, dividir igualmente e salvar; valores inconsistentes impedem salvar.
5. Finalizar com rateio completo e competência; comparar realizado/reserva. Cancelar libera compromisso.
6. Reembolso: escolher categoria e tentar enviar sem comprovante; deve ser bloqueado. Não inserir documentos pessoais em campos livres.
