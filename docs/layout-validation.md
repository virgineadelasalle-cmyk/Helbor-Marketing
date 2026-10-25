# Layout financeiro

A versão atual substitui a cascata de layouts antigos por uma estrutura única: cabeçalho, navegação, indicadores e grade financeira. O espaço dos gráficos é calculado pelo layout flex/grid. Não há posicionamento absoluto de cartões financeiros.

Identidade: azul #00194C, turquesa #00D0D0 e dourado #D69647; Arial, alternativa permitida pelo guia. Logo oficial preservado. Sem novas dependências externas.

Verificação local sobre a exportação estática: 1366×680, 1366×600, 1024×600, 1440×900 e 390×844. Sem rolagem horizontal; sem rolagem da página no desktop; ranking, categorias, gráfico e atenção sem transbordamento interno. Conferência visual das capturas. Filtro mensal, ordenação, paginação, Escape e criação de solicitação exercitados via Playwright. Testes financeiros existentes preservados.

Limite do protótipo: armazenamento no navegador, seletor de perfil de demonstração e fotografia financeira da planilha. Não há autenticação real. O redesign não adiciona controles de acesso ou backend.

Publicação: limpar `.next` antes da compilação e conferir que as classes novas constam no CSS exportado. A compilação incremental anterior publicou CSS antigo.
