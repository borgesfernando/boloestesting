document.addEventListener("DOMContentLoaded", () => {
  carregarProjetos('especiais', PROJETOS.especiais.projetos, 'especiais-list', 'especiais.html');
  carregarProjetos('mensais', PROJETOS.mensais.projetos, 'mensais-list', 'mensais.html');
  carregarProjetos('acumulados', PROJETOS.acumulados.projetos, 'acumulados-list', 'acumulados.html');
});

// AVISO TOP FIXO — APENAS 15 DIAS ANTES DO FECHAMENTO DOS BOLÕES ESPECIAIS
(function exibirAvisoTopo() {
  const especiais = PROJETOS.especiais.projetos;
  const hoje = new Date();

  // Encontra o próximo especial com data limite no futuro
  const proximo = especiais
    .map(p => ({
      ...p,
      dataLimiteObj: new Date(p.dataLimite.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'))
    }))
    .filter(p => p.dataLimiteObj > hoje)
    .sort((a, b) => a.dataLimiteObj - b.dataLimiteObj)[0];

  if (!proximo) return;

  const diasRestantes = Math.ceil((proximo.dataLimiteObj - hoje) / (1000 * 60 * 60 * 24));
  // Aparece só se faltar 15 dias ou menos, e some se já passou
  if (diasRestantes > 0 && diasRestantes <= 15) {
    const mensagem = `⏳ Faltam ${diasRestantes} dia${diasRestantes > 1 ? 's' : ''} para garantir sua cota no Bolão "${proximo.nome}"!<br><span class="aviso-fechamento">Fechamento no dia ${proximo.dataLimite.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$1/$2/$3')}!</span>`;
    document.getElementById("mensagemAviso").innerHTML = mensagem;
    document.getElementById("btnParticipar").href = "templates/especiais.html?id=" + proximo.id;
    document.getElementById("avisoTopo").style.display = "flex";
  }
})();


function carregarProjetos(tipo, projetos, containerId, templateFile) {
  const container = document.getElementById(containerId);
  projetos.forEach(projeto => {
    //const tipoCor = projeto.id.split('-')[0]; // ex: lf, quina, mega
    const tipoCor = {
    'ds': 'dupla',
    'lf': 'lotofacil',
    'quina': 'quina',
    'mega': 'mega'
    }[projeto.id.split('-')[0]] || projeto.id.split('-')[0];
    const btnClasse = tipoCor;
    const card = document.createElement("div");
    card.className = `project-card ${tipoCor}`;
    const nome = projeto.nome;
    const apuracao = projeto.dataSorteio ? `<p class="project-date">Apuração: ${projeto.dataSorteio}</p>` : '';
    const detalhes = projeto.minimo
      ? `<p>Participamos quando o prêmio acumula acima de <strong>R$ ${projeto.minimo} milhões</strong></p>`
      : projeto.cotaMensal
        ? `<p>Bolões em todos os sorteios</p>`
        : '';
    const textoBotao = tipo === 'acumulados' || tipo === 'mensais' ? 'Mais informações' : 'Como Participar';
    const link = `templates/${templateFile}?id=${projeto.id}`;

    card.innerHTML = `
      <div class="project-info">
        <h3>${nome}</h3>
        ${apuracao || detalhes}
      </div>
      <a href="${link}" class="btn ${btnClasse}">${textoBotao}</a>
    `;

    container.appendChild(card);
  });
}
