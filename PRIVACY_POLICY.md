# Política de Privacidade - Agente B1N0 (SEED-PR)

## 1. Visão Geral
Esta Política de Privacidade descreve como a extensão **Agente B1N0** coleta, processa e armazena dados. Esta ferramenta foi desenvolvida para uso exclusivo institucional no âmbito do programa Robótica Paraná, da **Secretaria de Estado da Educação do Paraná (SEED-PR)**.

## 2. Coleta de Dados e Telemetria
Para fins de auditoria pedagógica e gestão de ativos tecnológicos, a extensão coleta os seguintes metadados técnicos:

* **Identificação do Dispositivo:** Número de série de patrimônio (em Chromebooks gerenciados) ou um identificador único (ID) gerado aleatoriamente e armazenado localmente (Windows/Linux).
* **Logs de Atividade:** Registro do momento exato (timestamp) de cliques nos botões de "Upload" e "Atualização de Firmware" nas IDEs *Arduino Cloud* e *mBlock Web*.
* **Informações de Hardware:** Identificação do modelo da placa de robótica conectada (ex: Arduino Uno, ESP32, mBot).
* **Identificação de Rede:** Endereço IP local e público, utilizado estritamente para associar a atividade à unidade escolar correspondente.

## 3. Minimização de Dados e Privacidade
Em conformidade com as boas práticas de proteção de dados:
* **NÃO** coletamos informações de identificação pessoal (PII) como nomes, e-mails ou CPFs.
* **NÃO** coletamos o conteúdo do código-fonte ou projetos desenvolvidos pelos usuários.
* **NÃO** acessamos o histórico de navegação ou dados de outros websites.

## 4. Finalidade e Uso
Os dados coletados destinam-se exclusivamente a:
1. Monitorar a frequência e o volume de uso dos kits de robótica na rede estadual.
2. Gerar relatórios estatísticos para apoio pedagógico e tomada de decisão da SEED-PR.
3. Validar a distribuição e a eficiência dos recursos tecnológicos nas escolas.

## 5. Transferência e Armazenamento
Os metadados são transmitidos via protocolo seguro **HTTPS** para um endpoint privado (Google Apps Script) hospedado no ecossistema **Google Workspace for Education** da SEED-PR. Os dados são organizados em planilhas institucionais e não são compartilhados com terceiros ou utilizados para fins publicitários.

## 6. Consentimento e Governança
Ao utilizar as estações de trabalho da rede estadual com a extensão instalada, o uso de telemetria técnica é aplicado conforme as diretrizes de governança de TI da SEED-PR para monitoramento de ativos públicos.

---
*Última atualização: Abril de 2026*
