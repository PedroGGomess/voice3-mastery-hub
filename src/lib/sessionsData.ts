export interface SessionContent {
  type: 'text' | 'vocabulary' | 'phrases';
  title: string;
  body?: string;
  items?: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface Session {
  id: number;
  title: string;
  objective: string;
  time: string;
  content: SessionContent[];
  quiz: QuizQuestion[];
  exercise: string;
}

export const sessionsData: Session[] = [
  {
    id: 1,
    title: 'Introdução ao Inglês Empresarial',
    objective: 'Vocabulário base e apresentação pessoal profissional',
    time: '20 min',
    content: [
      {
        type: 'text',
        title: 'Bem-vindo ao Inglês Empresarial',
        body: 'Business English is a specialized form of English used in professional contexts — meetings, emails, presentations, and negotiations. In this session, you\'ll learn the foundational vocabulary and phrases to introduce yourself confidently in any professional setting.',
      },
      {
        type: 'vocabulary',
        title: 'Vocabulário Essencial',
        items: [
          'Colleague — colega de trabalho',
          'Stakeholder — parte interessada',
          'Deadline — prazo',
          'Agenda — agenda / ordem de trabalhos',
          'Follow up — dar seguimento',
          'Action item — ponto de ação',
          'Feedback — retorno / comentário',
          'Brief — resumo / informar',
        ],
      },
      {
        type: 'phrases',
        title: 'Frases de Apresentação Profissional',
        items: [
          '"Nice to meet you. I\'m [Name] from [Company]."',
          '"I\'m responsible for [area/department]."',
          '"I work closely with [team/person] on [project]."',
          '"I\'ve been in this role for [time period]."',
          '"My main focus is on [main responsibility]."',
          '"Please feel free to reach out if you have any questions."',
        ],
      },
      {
        type: 'text',
        title: 'Dicas de Comunicação',
        body: 'When introducing yourself in English, keep it concise — 3-4 sentences maximum. State your name, your role, your company (if relevant), and one key responsibility or connection to the person you\'re meeting. Speak clearly and maintain eye contact. A firm handshake and a confident smile go a long way.',
      },
    ],
    quiz: [
      {
        question: 'What does "deadline" mean in Portuguese?',
        options: ['Linha morta', 'Prazo', 'Início', 'Meta'],
        correct: 1,
      },
      {
        question: 'Which phrase is best for introducing yourself professionally?',
        options: [
          '"Hey, I\'m João!"',
          '"Nice to meet you. I\'m João from Tech Corp."',
          '"You can call me João."',
          '"I am the João."',
        ],
        correct: 1,
      },
      {
        question: 'What does "stakeholder" mean?',
        options: ['Acionista apenas', 'Parte interessada', 'Chefe de equipa', 'Cliente'],
        correct: 1,
      },
      {
        question: 'What is "follow up" in Portuguese?',
        options: ['Seguir em frente', 'Dar seguimento', 'Ir a seguir', 'Seguimento acima'],
        correct: 1,
      },
      {
        question: 'How long should a professional self-introduction be?',
        options: ['10 sentences', '1 sentence', '3-4 sentences', 'As long as needed'],
        correct: 2,
      },
    ],
    exercise: 'Write a 3-sentence professional introduction in English. Include your name, role, and one key responsibility. Then practice saying it aloud until it feels natural.',
  },
  {
    id: 2,
    title: 'Email Profissional',
    objective: 'Escrever emails formais e informais em inglês',
    time: '25 min',
    content: [
      {
        type: 'text',
        title: 'A Arte do Email Profissional',
        body: 'Professional emails in English follow a clear structure: greeting, context/purpose, details, call to action, and closing. The tone depends on your relationship with the recipient — formal for new contacts, semi-formal for colleagues, informal for close team members.',
      },
      {
        type: 'vocabulary',
        title: 'Expressões para Emails',
        items: [
          'I am writing to — Escrevo para',
          'Please find attached — Em anexo encontra',
          'As per our conversation — Conforme a nossa conversa',
          'I would appreciate — Agradecia',
          'Looking forward to — Aguardo com expectativa',
          'Best regards — Com os melhores cumprimentos',
          'Kind regards — Com os meus cumprimentos',
          'As discussed — Conforme discutido',
          'Further to — Na sequência de',
          'I hope this finds you well — Espero que esteja bem',
        ],
      },
      {
        type: 'phrases',
        title: 'Estrutura de um Email Formal',
        items: [
          'Abertura: "Dear Mr./Ms. [Surname]," ou "Dear [First Name],"',
          'Contexto: "I am writing to you regarding..."',
          'Detalhes: "As we discussed on [date], the key points are..."',
          'Ação: "Could you please confirm by [date]?"',
          'Fecho: "Please do not hesitate to contact me if you have any questions."',
          'Despedida: "Kind regards," / "Best regards," / "Yours sincerely,"',
        ],
      },
      {
        type: 'text',
        title: 'Emails Informais vs Formais',
        body: 'Informal: "Hi [First Name], Hope you\'re well! Just wanted to check in on..."\nFormal: "Dear Mr. Smith, I hope this message finds you well. I am writing to enquire about..."\n\nKey difference: contractions (I\'m, don\'t, won\'t) are fine in informal emails but avoid them in formal ones.',
      },
    ],
    quiz: [
      {
        question: 'What does "Please find attached" mean in Portuguese?',
        options: ['Por favor encontre', 'Em anexo encontra', 'Encontre por favor', 'Anexo em baixo'],
        correct: 1,
      },
      {
        question: 'Which is the correct formal email opening?',
        options: ['"Hey John!"', '"Yo John,"', '"Dear Mr. Smith,"', '"To John Smith"'],
        correct: 2,
      },
      {
        question: '"I am writing to you regarding" is used to...',
        options: ['Close an email', 'Establish context/purpose', 'Express gratitude', 'Request a meeting'],
        correct: 1,
      },
      {
        question: 'Which closing is most formal?',
        options: ['Cheers', 'Best', 'Yours sincerely', 'Take care'],
        correct: 2,
      },
      {
        question: 'Should you use contractions (I\'m, don\'t) in formal emails?',
        options: ['Yes, always', 'No, avoid them', 'Only on Fridays', 'Only if short'],
        correct: 1,
      },
    ],
    exercise: 'Write a formal email requesting a meeting with a potential client. Include: subject line, greeting, purpose, proposed dates/times, and professional closing. Keep it under 150 words.',
  },
  {
    id: 3,
    title: 'Reuniões — Participação Ativa',
    objective: 'Expressar opiniões e fazer sugestões em reuniões',
    time: '25 min',
    content: [
      {
        type: 'text',
        title: 'Participar Ativamente em Reuniões',
        body: 'Meetings in English can be challenging — fast pace, multiple speakers, and cultural nuances. The key is to have a bank of phrases ready for different situations: agreeing, disagreeing politely, asking for clarification, and presenting your point of view.',
      },
      {
        type: 'phrases',
        title: 'Frases para Reuniões',
        items: [
          'Opinião: "In my opinion..." / "From my perspective..." / "I believe that..."',
          'Concordar: "I completely agree." / "That\'s a great point." / "Absolutely."',
          'Discordar: "I see your point, but..." / "I\'m not sure I agree, because..." / "Have we considered...?"',
          'Pedir clareza: "Could you elaborate on that?" / "What do you mean by...?" / "Could you repeat that, please?"',
          'Sugerir: "What if we...?" / "Have we thought about...?" / "One option could be..."',
          'Interromper: "Sorry to interrupt, but..." / "If I may add..." / "Just to jump in here..."',
        ],
      },
      {
        type: 'vocabulary',
        title: 'Vocabulário de Reuniões',
        items: [
          'Minutes — ata da reunião',
          'Agenda — ordem de trabalhos',
          'AOB — Assuntos diversos (Any Other Business)',
          'Action points — pontos de ação',
          'To table — adiar (UK) / apresentar (US)',
          'Consensus — consenso',
          'Chair — presidir/moderador',
          'Take the floor — tomar a palavra',
        ],
      },
      {
        type: 'text',
        title: 'Como Gerir Desacordos',
        body: 'Disagreeing professionally is an art. Always acknowledge the other person\'s view before presenting yours: "I understand your point, and while I see the merit in that approach, I think we should also consider..." This shows respect and keeps the conversation constructive.',
      },
    ],
    quiz: [
      {
        question: 'What are "minutes" in a meeting context?',
        options: ['Tempo em minutos', 'Ata da reunião', 'Pontos de ação', 'Agenda'],
        correct: 1,
      },
      {
        question: 'Which is a polite way to disagree?',
        options: [
          '"You\'re wrong."',
          '"That\'s not right."',
          '"I see your point, but I think we should consider..."',
          '"No, that won\'t work."',
        ],
        correct: 2,
      },
      {
        question: 'How do you politely interrupt in a meeting?',
        options: [
          '"STOP! I have something to say!"',
          '"Sorry to interrupt, but..."',
          '"Let me talk now."',
          '"Shut up, please."',
        ],
        correct: 1,
      },
      {
        question: 'What does "take the floor" mean?',
        options: ['Ir ao chão', 'Tomar a palavra', 'Sair da sala', 'Limpar o chão'],
        correct: 1,
      },
      {
        question: '"Have we thought about...?" is used to...',
        options: ['Ask a question', 'Make a suggestion', 'Disagree', 'Close the meeting'],
        correct: 1,
      },
    ],
    exercise: 'Write a short dialogue (4-6 exchanges) simulating a meeting where two colleagues discuss a project deadline. One wants to extend it, the other disagrees. Use at least 3 phrases from this session.',
  },
  {
    id: 4,
    title: 'Apresentações (Parte 1)',
    objective: 'Estruturar e iniciar uma apresentação profissional impactante',
    time: '30 min',
    content: [
      {
        type: 'text',
        title: 'A Estrutura de uma Apresentação Profissional',
        body: 'A great business presentation follows a clear structure: Opening (hook + agenda), Body (3 main points with evidence), and Closing (summary + call to action). The opening is crucial — you have 30 seconds to capture your audience\'s attention.',
      },
      {
        type: 'phrases',
        title: 'Como Começar uma Apresentação',
        items: [
          'Boas-vindas: "Good morning/afternoon everyone. Thank you for joining us today."',
          'Apresentação: "My name is [Name] and I\'m here to talk about [topic]."',
          'Hook: "Did you know that...?" / "Imagine a world where..." / "Last year, our company..."',
          'Agenda: "Today, I\'ll cover three main areas: first... second... and finally..."',
          'Duração: "This presentation will take approximately [X] minutes."',
          'Q&A: "Please hold your questions until the end." / "Feel free to interrupt if you have questions."',
        ],
      },
      {
        type: 'vocabulary',
        title: 'Vocabulário de Apresentações',
        items: [
          'Slide deck — conjunto de slides',
          'Handout — material de apoio',
          'Takeaway — ponto principal / lição',
          'Data-driven — baseado em dados',
          'Key finding — descoberta principal',
          'Executive summary — sumário executivo',
          'To elaborate — desenvolver / aprofundar',
          'In a nutshell — em resumo',
        ],
      },
      {
        type: 'text',
        title: 'Dicas para o Início Perfeito',
        body: 'The first 30 seconds of your presentation set the tone. Avoid starting with "So, um, I\'m going to talk about..." Instead, start with a powerful statement, a surprising statistic, or a question. Then clearly state what your audience will learn and why it matters to them — this gives them a reason to stay engaged.',
      },
    ],
    quiz: [
      {
        question: 'What is a "handout" in a presentation?',
        options: ['Aplausos', 'Material de apoio', 'Mão levantada', 'Gesto'],
        correct: 1,
      },
      {
        question: 'What does "in a nutshell" mean?',
        options: ['Dentro de uma noz', 'Em resumo', 'Com detalhes', 'Especificamente'],
        correct: 1,
      },
      {
        question: 'A good presentation opening should...',
        options: [
          'Start with "Um, so..." to seem natural',
          'Immediately show all your slides',
          'Hook the audience with a question or surprising fact',
          'Last at least 5 minutes',
        ],
        correct: 2,
      },
      {
        question: 'What is an "executive summary"?',
        options: ['Resumo para executivos only', 'Sumário executivo conciso', 'Email do CEO', 'Relatório completo'],
        correct: 1,
      },
      {
        question: 'When should you state the agenda in a presentation?',
        options: ['At the very end', 'In the middle', 'Near the beginning, after the opening hook', 'Never'],
        correct: 2,
      },
    ],
    exercise: 'Write the opening 3 sentences of a presentation about your company\'s best product or service. Include a hook, your name/topic, and the agenda for your 3 main points.',
  },
  {
    id: 5,
    title: 'Apresentações (Parte 2)',
    objective: 'Dominar o delivery e responder a perguntas com confiança',
    time: '25 min',
    content: [
      {
        type: 'text',
        title: 'Desenvolver e Concluir uma Apresentação',
        body: 'The body of your presentation should flow logically. Use signposting language to guide your audience through your content. Each point should follow the: Statement → Evidence → Explanation structure. Close with impact — summarize your key points, restate your recommendation, and give a clear call to action.',
      },
      {
        type: 'phrases',
        title: 'Linguagem de Transição e Conclusão',
        items: [
          'Transição: "Moving on to..." / "This brings me to my next point..." / "As you can see from this slide..."',
          'Enfatizar: "I\'d like to draw your attention to..." / "Crucially..." / "The key point here is..."',
          'Concluir: "To sum up..." / "In conclusion..." / "To wrap up what we\'ve covered today..."',
          'Recomendação: "Based on the data, I recommend..." / "My proposal is..."',
          'Call to action: "I\'d like to ask you to..." / "The next step would be..."',
          'Q&A: "I\'d now like to open the floor to questions." / "Are there any questions?"',
        ],
      },
      {
        type: 'phrases',
        title: 'Responder a Perguntas Difíceis',
        items: [
          '"That\'s a great question. Let me think about that for a moment."',
          '"I\'m glad you raised that point."',
          '"Could you clarify what you mean by...?"',
          '"I don\'t have the exact data on hand, but I can follow up after."',
          '"That\'s outside the scope of today\'s presentation, but it\'s worth exploring."',
          '"I\'d prefer to address that offline — can we connect after the session?"',
        ],
      },
    ],
    quiz: [
      {
        question: 'What phrase do you use to transition between points?',
        options: [
          '"Anyway..."',
          '"Moving on to my next point..."',
          '"So, like..."',
          '"Whatever..."',
        ],
        correct: 1,
      },
      {
        question: 'How should you respond when you don\'t know the answer to a question?',
        options: [
          '"I don\'t know."',
          '"That\'s a stupid question."',
          '"I don\'t have the exact data, but I can follow up after."',
          'Ignore the question',
        ],
        correct: 2,
      },
      {
        question: 'What does "opening the floor to questions" mean?',
        options: ['Abrir a porta', 'Convidar perguntas do público', 'Abrir o PowerPoint', 'Começar a apresentação'],
        correct: 1,
      },
      {
        question: 'The structure for each point in a presentation should be:',
        options: [
          'Question → Answer → Repeat',
          'Statement → Evidence → Explanation',
          'Title → Summary → Outro',
          'Data → Opinion → Data',
        ],
        correct: 1,
      },
      {
        question: '"To sum up" is used to...',
        options: ['Add more detail', 'Begin the presentation', 'Summarize at the end', 'Ask a question'],
        correct: 2,
      },
    ],
    exercise: 'Write a 2-paragraph conclusion for a presentation on why your team should adopt a new workflow tool. Include: summary of 3 key points, your recommendation, and a clear call to action.',
  },
  {
    id: 6,
    title: 'Negociação em Inglês',
    objective: 'Técnicas de negociação e linguagem persuasiva em inglês',
    time: '30 min',
    content: [
      {
        type: 'text',
        title: 'Negociar em Inglês com Confiança',
        body: 'Negotiation in English requires both language skills and strategy. Key principles: know your BATNA (Best Alternative To a Negotiated Agreement), start with your ideal position, make concessions strategically, and always look for win-win solutions. The language you use can either close or kill a deal.',
      },
      {
        type: 'vocabulary',
        title: 'Vocabulário de Negociação',
        items: [
          'BATNA — Melhor alternativa a um acordo negociado',
          'Win-win — Situação mutuamente benéfica',
          'Concession — concessão',
          'Counter-offer — contraproposta',
          'Bottom line — limite mínimo / essencial',
          'Leverage — alavancagem / vantagem',
          'Deadlock — impasse',
          'Deal-breaker — ponto não negociável',
        ],
      },
      {
        type: 'phrases',
        title: 'Frases de Negociação',
        items: [
          'Abrir: "I\'d like to discuss the terms of our agreement."',
          'Proposta: "We\'re prepared to offer..." / "Our proposal would be..."',
          'Contraproposta: "I understand your position, however, we would need..."',
          'Concessão: "We could be flexible on [X] if you could meet us on [Y]."',
          'Pressão de tempo: "We\'d need to have this resolved by [date]."',
          'Fechar: "I think we\'ve found a good solution for both parties." / "Shall we put this in writing?"',
          'Quando há impasse: "Perhaps we should take a short break and reconvene."',
        ],
      },
    ],
    quiz: [
      {
        question: 'What is a "deal-breaker"?',
        options: ['Uma boa oferta', 'Ponto não negociável', 'Quebrar um contrato', 'Fim da negociação'],
        correct: 1,
      },
      {
        question: 'What does BATNA stand for?',
        options: [
          'Best And Total Negotiation Agreement',
          'Best Alternative To a Negotiated Agreement',
          'Business And Trade Negotiation Act',
          'Basic Agreement Terms and Numbers',
        ],
        correct: 1,
      },
      {
        question: '"We could be flexible on X if you could meet us on Y" demonstrates...',
        options: ['Refusing the deal', 'Making a concession conditionally', 'Ending negotiations', 'Agreeing fully'],
        correct: 1,
      },
      {
        question: 'What is "leverage" in a negotiation?',
        options: ['Uma alavanca física', 'Vantagem negocial', 'Um contrato', 'A proposta inicial'],
        correct: 1,
      },
      {
        question: 'When there\'s a deadlock, you should...',
        options: [
          'Walk out immediately',
          'Give in completely',
          'Suggest taking a break and reconvening',
          'Raise your voice',
        ],
        correct: 2,
      },
    ],
    exercise: 'Write a short negotiation dialogue (4-5 exchanges) where you are trying to negotiate a 15% discount with a supplier who initially refuses. Use at least 3 negotiation phrases from this session.',
  },
  {
    id: 7,
    title: 'Entrevistas de Emprego',
    objective: 'Responder com confiança a perguntas comuns de entrevistas em inglês',
    time: '25 min',
    content: [
      {
        type: 'text',
        title: 'Preparar a Entrevista em Inglês',
        body: 'Job interviews in English follow predictable patterns. Most interviewers use competency-based questions (Tell me about a time when...) and open-ended questions (Why do you want to work here?). The STAR method (Situation, Task, Action, Result) is your best framework for answering behavioral questions.',
      },
      {
        type: 'phrases',
        title: 'Respostas a Perguntas Comuns',
        items: [
          '"Tell me about yourself": "I\'m a [profession] with [X] years of experience in [field]. My expertise lies in [key skills]. Most recently, I [achievement]."',
          '"What\'s your greatest strength?": "One of my key strengths is [strength]. For example, in my previous role, I [specific example]."',
          '"Why do you want this role?": "I\'m particularly interested in this position because [reason]. I believe my background in [X] would allow me to [contribution]."',
          '"Where do you see yourself in 5 years?": "I\'d like to [career goal], and I see this role as an important step towards that, as [connection to role]."',
          '"What\'s your greatest weakness?": "I\'ve noticed I sometimes [weakness], but I\'ve been working on this by [action]. As a result, [improvement]."',
        ],
      },
      {
        type: 'vocabulary',
        title: 'Vocabulário de Entrevistas',
        items: [
          'Competency-based — baseado em competências',
          'STAR method — Situação, Tarefa, Ação, Resultado',
          'Track record — historial comprovado',
          'Value-add — valor acrescentado',
          'Cross-functional — multifuncional',
          'Deliverables — entregáveis',
          'KPIs — Indicadores-chave de desempenho',
          'Onboarding — integração',
        ],
      },
    ],
    quiz: [
      {
        question: 'What does the STAR method stand for?',
        options: [
          'Skills, Training, Achievements, References',
          'Situation, Task, Action, Result',
          'Strong, Thoughtful, Articulate, Ready',
          'Story, Task, Ability, Result',
        ],
        correct: 1,
      },
      {
        question: 'How should you answer "What\'s your greatest weakness?"',
        options: [
          'Say you have no weaknesses',
          'Name a weakness, but show how you\'re working on it',
          'Refuse to answer',
          'Give a very detailed personal failure',
        ],
        correct: 1,
      },
      {
        question: 'What is "onboarding"?',
        options: ['Embarcar num avião', 'Processo de integração numa empresa', 'Formação online', 'Carta de apresentação'],
        correct: 1,
      },
      {
        question: 'Competency-based questions usually start with...',
        options: [
          '"What is your salary expectation?"',
          '"Tell me about a time when..."',
          '"Where do you live?"',
          '"When can you start?"',
        ],
        correct: 1,
      },
      {
        question: 'What are "KPIs"?',
        options: ['Conhecimentos Práticos Importantes', 'Indicadores-chave de desempenho', 'Key Personal Interests', 'Tipos de contrato'],
        correct: 1,
      },
    ],
    exercise: 'Using the STAR method, write a 4-sentence answer to: "Tell me about a time when you had to deal with a difficult colleague or client." Make it professional and specific.',
  },
  {
    id: 8,
    title: 'Comunicação Oral Avançada',
    objective: 'Fluência, pronúncia e expressão natural em contexto profissional',
    time: '30 min',
    content: [
      {
        type: 'text',
        title: 'O Próximo Nível: Comunicação Oral Avançada',
        body: 'Advanced oral communication goes beyond vocabulary and grammar — it\'s about sounding natural, being persuasive, and adapting your style to different audiences and contexts. This final session focuses on fluency techniques, idiomatic language, and high-impact communication strategies used by native speakers.',
      },
      {
        type: 'vocabulary',
        title: 'Expressões Idiomáticas de Negócio',
        items: [
          '"On the same page" — em sintonia / alinhados',
          '"Touch base" — contactar brevemente',
          '"Circle back" — retomar o assunto',
          '"Move the needle" — fazer diferença / progredir',
          '"Low-hanging fruit" — oportunidade fácil',
          '"Bandwidth" — capacidade / disponibilidade',
          '"Drill down" — aprofundar / detalhar',
          '"Pivot" — mudar de direção estrategicamente',
          '"Synergy" — sinergia',
          '"Game changer" — algo que muda tudo',
        ],
      },
      {
        type: 'phrases',
        title: 'Técnicas de Comunicação Avançada',
        items: [
          'Para ganhar tempo: "That\'s an interesting point — let me think about that."',
          'Para enfatizar: "The bottom line is..." / "What it really comes down to is..."',
          'Para mostrar empatia: "I completely understand where you\'re coming from."',
          'Para ser assertivo: "I\'d like to be clear about..." / "My position on this is..."',
          'Para suavizar crítica: "I appreciate the effort, and I think we could take this even further by..."',
          'Para persuadir: "Consider this: if we [action], we could [benefit]."',
          'Para fazer uma pausa natural: "Let me put it this way..." / "The way I see it..."',
        ],
      },
      {
        type: 'text',
        title: 'Pronúncia e Ritmo',
        body: 'Natural English speech has rhythm — stressed syllables, weak forms, and connected speech. Key tips: stress content words (nouns, verbs, adjectives) and reduce function words (the, a, of, to). Use pauses strategically — silence is powerful. Record yourself speaking and listen back — you\'ll quickly identify areas to improve.',
      },
    ],
    quiz: [
      {
        question: 'What does "on the same page" mean?',
        options: ['Na mesma página do livro', 'Em sintonia / alinhados', 'No mesmo capítulo', 'De acordo com o texto'],
        correct: 1,
      },
      {
        question: 'What does "low-hanging fruit" refer to in business?',
        options: ['Fruta barata', 'Oportunidade fácil de alcançar', 'Salário baixo', 'Meta fácil de atingir'],
        correct: 1,
      },
      {
        question: '"I completely understand where you\'re coming from" is used to show...',
        options: ['Disagreement', 'Confusion', 'Empathy', 'Authority'],
        correct: 2,
      },
      {
        question: 'In natural English speech, which words are typically stressed?',
        options: ['Articles and prepositions', 'Content words (nouns, verbs, adjectives)', 'Function words only', 'All words equally'],
        correct: 1,
      },
      {
        question: 'What does "pivot" mean in a business context?',
        options: ['Girar fisicamente', 'Mudar de direção estrategicamente', 'Cortar custos', 'Fazer uma apresentação'],
        correct: 1,
      },
    ],
    exercise: 'Record yourself (or write out) a 1-minute spoken response to: "Describe a challenging project you led and what you learned from it." Use at least 4 idiomatic expressions from this session. Focus on natural rhythm and pausing.',
  },
];

export default sessionsData;
