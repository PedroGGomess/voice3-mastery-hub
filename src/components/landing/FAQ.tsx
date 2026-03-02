import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Como funcionam as sessões com AI?",
    a: "As sessões são interativas e adaptam-se ao teu nível. Podes praticar por texto, áudio ou roleplay. A AI dá-te feedback imediato sobre gramática, vocabulário e fluência.",
  },
  {
    q: "As aulas com professora são online?",
    a: "Sim, todas as aulas são online por videochamada. Marcas diretamente no calendário da plataforma conforme a disponibilidade da professora.",
  },
  {
    q: "Posso mudar de pack?",
    a: "Sim, podes fazer upgrade a qualquer momento. As sessões já concluídas são contabilizadas no novo pack.",
  },
  {
    q: "Como funciona para empresas?",
    a: "A empresa regista-se, adiciona alunos, atribui packs e acompanha o progresso de toda a equipa num dashboard dedicado.",
  },
  {
    q: "Quanto tempo dura cada sessão?",
    a: "As sessões AI são flexíveis e duram entre 15 a 30 minutos. As aulas com professora têm entre 30 a 60 minutos, dependendo do pack.",
  },
  {
    q: "Recebo certificado?",
    a: "Sim, ao concluir qualquer pack recebes um certificado Voice3 de Inglês Empresarial que podes partilhar no LinkedIn.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 bg-background" id="faq">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="premium-card px-6 border-0"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
