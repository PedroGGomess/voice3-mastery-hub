import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, ChevronRight, Star, Trophy } from "lucide-react";
import { toast } from "sonner";
import PlatformLayout from "@/components/PlatformLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getVocabProgress, markWordLearned, awardPoints } from "@/lib/persistence";

const MS_PER_DAY = 86400000;

interface WordEntry {
  id: string;
  word: string;
  pronunciation: string;
  definition: string;
  weak: string;
  power: string;
  examples: [string, string];
  drill: string;
  answer: string;
}

const WORD_SETS: WordEntry[][] = [
  // Set 0
  [
    { id: "w0-0", word: "Expedite", pronunciation: "EK-spuh-dyt", definition: "To accelerate the progress of; to make happen sooner.", weak: "speed up", power: "expedite", examples: ["We must expedite the approval process to meet Q3 targets.", "The CEO asked us to expedite onboarding for the new acquisition team."], drill: "We need to ___ the client proposal before the board meeting.", answer: "expedite" },
    { id: "w0-1", word: "Synergy", pronunciation: "SIN-er-jee", definition: "The combined effect that exceeds the sum of individual contributions.", weak: "working together", power: "synergy", examples: ["The merger created powerful synergy between both distribution networks.", "We're looking for synergy across product and marketing functions."], drill: "The two departments created remarkable ___ by aligning their KPIs.", answer: "synergy" },
    { id: "w0-2", word: "Acumen", pronunciation: "AK-yoo-men", definition: "The ability to make good judgments and quick decisions, especially in business.", weak: "good at business", power: "acumen", examples: ["Her financial acumen helped navigate the company through the recession.", "Investors cited his strategic acumen as key to the fund's performance."], drill: "His market ___ allowed him to spot the acquisition opportunity early.", answer: "acumen" },
    { id: "w0-3", word: "Efficacy", pronunciation: "EF-ih-kuh-see", definition: "The ability to produce a desired or intended result.", weak: "how well it works", power: "efficacy", examples: ["The efficacy of the new onboarding program is measurable within 30 days.", "We must evaluate the efficacy of each marketing channel independently."], drill: "The pilot data confirmed the ___ of the new training approach.", answer: "efficacy" },
    { id: "w0-4", word: "Leverage", pronunciation: "LEV-er-ij", definition: "To use something to maximum advantage.", weak: "use", power: "leverage", examples: ["We can leverage our existing client relationships to expand the partnership.", "The firm leveraged its data infrastructure to build a competitive moat."], drill: "Let's ___ our existing partnerships to accelerate market entry.", answer: "leverage" },
  ],
  // Set 1
  [
    { id: "w1-0", word: "Paradigm", pronunciation: "PAIR-uh-dyme", definition: "A typical example or pattern; a model of thinking that defines an era.", weak: "way of thinking", power: "paradigm", examples: ["This acquisition represents a paradigm shift in how we approach distribution.", "The digital paradigm has redefined consumer expectations permanently."], drill: "The new leadership team triggered a complete ___ shift in company culture.", answer: "paradigm" },
    { id: "w1-1", word: "Iterative", pronunciation: "IT-er-uh-tiv", definition: "Relating to or involving repetition of a process with the goal of improvement.", weak: "trial and error", power: "iterative", examples: ["Our product development follows an iterative cycle of build, measure, and learn.", "An iterative approach to strategy allows rapid course correction."], drill: "The team used an ___ process to refine the go-to-market plan.", answer: "iterative" },
    { id: "w1-2", word: "Cadence", pronunciation: "KAY-dens", definition: "A rhythm or pattern of activity, especially in business operations.", weak: "schedule", power: "cadence", examples: ["Establishing a weekly reporting cadence kept all stakeholders aligned.", "The sales team needed a more structured outreach cadence."], drill: "We established a bi-weekly ___ for leadership alignment meetings.", answer: "cadence" },
    { id: "w1-3", word: "Traction", pronunciation: "TRAK-shun", definition: "The degree to which an idea, product, or initiative is gaining momentum.", weak: "progress", power: "traction", examples: ["The pilot program gained real traction in the Southeast region within 60 days.", "Investors want to see measurable traction before committing capital."], drill: "The new product feature gained significant ___ among enterprise clients.", answer: "traction" },
    { id: "w1-4", word: "Bandwidth", pronunciation: "BAND-width", definition: "The capacity to handle additional workload or responsibility.", weak: "time or availability", power: "bandwidth", examples: ["Do we have the bandwidth to absorb a second acquisition this quarter?", "The team lacks the bandwidth to execute on three strategic priorities simultaneously."], drill: "I don't have the ___ to take on this project alongside the current workload.", answer: "bandwidth" },
  ],
  // Set 2
  [
    { id: "w2-0", word: "Holistic", pronunciation: "hoh-LIS-tik", definition: "Characterized by the belief that parts of a system are interconnected and best understood in relation to the whole.", weak: "overall", power: "holistic", examples: ["A holistic view of customer experience includes post-sale engagement.", "We need a more holistic approach to talent development."], drill: "The consultant recommended a ___ review of all business units.", answer: "holistic" },
    { id: "w2-1", word: "Scalable", pronunciation: "SKAY-luh-bul", definition: "Able to grow or be adapted to meet increasing demands without proportional cost increase.", weak: "can grow", power: "scalable", examples: ["Before we invest, I need to see a scalable revenue model.", "The infrastructure must be scalable before we target enterprise clients."], drill: "The founders built a ___ platform that could handle 10x the current load.", answer: "scalable" },
    { id: "w2-2", word: "Benchmark", pronunciation: "BENCH-mark", definition: "A standard or reference point used for comparison.", weak: "comparison", power: "benchmark", examples: ["We use industry benchmarks to assess whether our margins are competitive.", "The benchmark for team productivity in this sector is 85% utilization."], drill: "The new KPI targets were set using industry ___ data.", answer: "benchmark" },
    { id: "w2-3", word: "Catalyst", pronunciation: "KAT-uh-list", definition: "A person or event that causes or accelerates change.", weak: "trigger", power: "catalyst", examples: ["The regulatory change became a catalyst for digital transformation across the sector.", "The new COO acted as a catalyst for operational efficiency."], drill: "The pandemic was a ___ for remote-work adoption across industries.", answer: "catalyst" },
    { id: "w2-4", word: "Viable", pronunciation: "VY-uh-bul", definition: "Capable of working successfully; feasible.", weak: "possible", power: "viable", examples: ["We need three viable alternatives before the board presentation.", "The current pricing model is not viable at this scale."], drill: "The team presented two ___ strategies for the expansion into Asia.", answer: "viable" },
  ],
  // Set 3
  [
    { id: "w3-0", word: "Pragmatic", pronunciation: "prag-MAT-ik", definition: "Dealing with things sensibly and realistically, rather than theoretically.", weak: "practical", power: "pragmatic", examples: ["A pragmatic approach to budget cuts starts with data, not assumptions.", "Leadership appreciated his pragmatic response to the supply chain crisis."], drill: "The CFO's ___ solution saved the team months of unnecessary analysis.", answer: "pragmatic" },
    { id: "w3-1", word: "Mitigate", pronunciation: "MIT-ih-gayt", definition: "To make less severe, serious, or painful.", weak: "reduce", power: "mitigate", examples: ["Our risk strategy is designed to mitigate exposure in volatile markets.", "We implemented redundancy protocols to mitigate downtime risk."], drill: "The new policy was designed to ___ compliance risk across all divisions.", answer: "mitigate" },
    { id: "w3-2", word: "Alignment", pronunciation: "uh-LYN-ment", definition: "The state of being in agreement or cooperation among all parties on goals.", weak: "agreement", power: "alignment", examples: ["We need cross-functional alignment before committing resources.", "The lack of alignment between sales and product is costing us deals."], drill: "Achieving executive ___ on the strategy took three weeks.", answer: "alignment" },
    { id: "w3-3", word: "Stakeholder", pronunciation: "STAYK-hohl-der", definition: "A person with an interest or concern in a business's outcomes.", weak: "important person", power: "stakeholder", examples: ["All key stakeholders must be aligned before the announcement.", "The project failed due to inadequate stakeholder engagement."], drill: "The PM mapped out every ___ before launching the initiative.", answer: "stakeholder" },
    { id: "w3-4", word: "Trajectory", pronunciation: "truh-JEK-tuh-ree", definition: "The path or course followed by a business, career, or initiative over time.", weak: "direction", power: "trajectory", examples: ["At this trajectory, we'll reach profitability by Q2.", "The company's growth trajectory has outpaced all sector benchmarks."], drill: "Our current revenue ___ puts us on track to double ARR by year-end.", answer: "trajectory" },
  ],
  // Set 4
  [
    { id: "w4-0", word: "Granular", pronunciation: "GRAN-yoo-ler", definition: "Detailed and precise; relating to fine-grained data or analysis.", weak: "detailed", power: "granular", examples: ["I need granular data on customer acquisition costs by channel.", "The board requested a more granular breakdown of the R&D budget."], drill: "Could you provide a ___ analysis of churn rates by cohort?", answer: "granular" },
    { id: "w4-1", word: "Disruptive", pronunciation: "dis-RUP-tiv", definition: "Radically changing or innovating an industry through new approaches.", weak: "new and different", power: "disruptive", examples: ["Their pricing model is genuinely disruptive in a commoditized market.", "Disruptive technology requires disruptive go-to-market thinking."], drill: "The startup's ___ approach challenged incumbents who had dominated for decades.", answer: "disruptive" },
    { id: "w4-2", word: "Robust", pronunciation: "roh-BUST", definition: "Strong and effective in all circumstances; comprehensive.", weak: "good or strong", power: "robust", examples: ["We need a robust compliance framework before we expand internationally.", "The platform's architecture is robust enough to handle peak demand periods."], drill: "The audit revealed that their data governance policy was not ___ enough.", answer: "robust" },
    { id: "w4-3", word: "Iterate", pronunciation: "IT-er-ayt", definition: "To perform or repeat a process with the aim of improving a result.", weak: "try again", power: "iterate", examples: ["We'll iterate on the prototype based on customer feedback in Week 2.", "Great product teams iterate fast and fail cheaply."], drill: "The design team continued to ___ on the UX until retention improved.", answer: "iterate" },
    { id: "w4-4", word: "Optimize", pronunciation: "OP-tih-myz", definition: "To make the best or most effective use of a situation or resource.", weak: "make better", power: "optimize", examples: ["We need to optimize the sales funnel before increasing ad spend.", "The goal is to optimize margin, not just revenue."], drill: "The operations team was tasked with ___ the supply chain for speed.", answer: "optimize" },
  ],
  // Set 5
  [
    { id: "w5-0", word: "Cohesive", pronunciation: "koh-HEE-siv", definition: "United and working well together as a team or unit.", weak: "together", power: "cohesive", examples: ["A cohesive leadership team is the company's greatest competitive asset.", "Without cohesive messaging, the campaign lost impact."], drill: "Building a ___ culture requires deliberate investment in shared values.", answer: "cohesive" },
    { id: "w5-1", word: "Accountability", pronunciation: "uh-kown-tuh-BIL-ih-tee", definition: "The obligation to accept responsibility for one's actions and performance.", weak: "being responsible", power: "accountability", examples: ["Accountability starts at the executive level, not the front line.", "We need clear accountability structures before launching the new product line."], drill: "The performance review system was redesigned to reinforce ___ at every level.", answer: "accountability" },
    { id: "w5-2", word: "Precedent", pronunciation: "PRES-uh-dent", definition: "An earlier event that serves as an example or guide for future situations.", weak: "example from the past", power: "precedent", examples: ["Approving this request sets a dangerous precedent for scope creep.", "There is strong legal precedent supporting our position."], drill: "Accepting the discount now would set a ___ that undercuts our pricing strategy.", answer: "precedent" },
    { id: "w5-3", word: "Decisive", pronunciation: "dih-SY-siv", definition: "Having or showing the ability to make decisions quickly and effectively.", weak: "quick at deciding", power: "decisive", examples: ["The market rewards decisive action, not deliberation.", "She was known for being decisive under pressure—a rare trait at that level."], drill: "The board praised his ___ response to the reputational crisis.", answer: "decisive" },
    { id: "w5-4", word: "Concise", pronunciation: "kun-SYS", definition: "Giving a lot of information clearly and in a few words; brief.", weak: "short", power: "concise", examples: ["Executives expect concise briefings—never more than one page.", "A concise value proposition outperforms a detailed feature list."], drill: "The pitch was effective because it was ___ and backed by strong data.", answer: "concise" },
  ],
  // Set 6
  [
    { id: "w6-0", word: "Empirical", pronunciation: "em-PEER-ih-kul", definition: "Based on observation or experience rather than theory.", weak: "based on facts", power: "empirical", examples: ["We need empirical evidence before changing the compensation model.", "The empirical data from the pilot phase was conclusive."], drill: "The decision was grounded in ___ research across 500 customer interviews.", answer: "empirical" },
    { id: "w6-1", word: "Circumspect", pronunciation: "SER-kum-spekt", definition: "Wary and unwilling to take risks; careful to consider all circumstances.", weak: "careful", power: "circumspect", examples: ["In volatile markets, a circumspect approach to M&A is advisable.", "She was circumspect about endorsing the new vendor without a pilot."], drill: "The CFO was ___ about committing capital without full due diligence.", answer: "circumspect" },
    { id: "w6-2", word: "Mandate", pronunciation: "MAN-dayt", definition: "An official order or authority given to carry out a policy or task.", weak: "requirement", power: "mandate", examples: ["The new mandate from the board is zero tolerance for compliance lapses.", "We have a clear mandate to accelerate digital transformation."], drill: "The CEO issued a ___ for all divisions to reduce overhead by 15%.", answer: "mandate" },
    { id: "w6-3", word: "Proliferate", pronunciation: "pro-LIF-er-ayt", definition: "To grow or produce rapidly; to spread quickly.", weak: "spread or grow fast", power: "proliferate", examples: ["SaaS tools have proliferated to the point of creating workflow fragmentation.", "Misinformation proliferates when there is no clear communication strategy."], drill: "Competing products began to ___ after the patent expired.", answer: "proliferate" },
    { id: "w6-4", word: "Nascent", pronunciation: "NAY-sent", definition: "Just coming into existence and beginning to develop.", weak: "new", power: "nascent", examples: ["The company entered a nascent market and defined the category.", "This is still a nascent technology—first-mover advantage is significant."], drill: "Their investment thesis focused on ___ markets with no dominant incumbents.", answer: "nascent" },
  ],
  // Set 7
  [
    { id: "w7-0", word: "Delineate", pronunciation: "dih-LIN-ee-ayt", definition: "To describe or indicate something precisely.", weak: "explain clearly", power: "delineate", examples: ["Before the kickoff, we need to delineate each team's responsibilities.", "The contract must delineate the scope of work with precision."], drill: "The project charter was designed to ___ ownership at every stage.", answer: "delineate" },
    { id: "w7-1", word: "Substantiate", pronunciation: "sub-STAN-shee-ayt", definition: "To provide evidence to support or prove the truth of something.", weak: "back up", power: "substantiate", examples: ["You need to substantiate that revenue projection with pipeline data.", "The claim was never substantiated and was withdrawn before the board meeting."], drill: "The analyst was asked to ___ the growth forecast with market data.", answer: "substantiate" },
    { id: "w7-2", word: "Preclude", pronunciation: "preh-KLOOD", definition: "To prevent something from happening; to make something impossible.", weak: "stop from happening", power: "preclude", examples: ["Legal constraints preclude us from commenting on the acquisition.", "Budget limitations preclude a full rollout before Q4."], drill: "The exclusivity clause would ___ any future partnerships with competitors.", answer: "preclude" },
    { id: "w7-3", word: "Contiguous", pronunciation: "kun-TIG-yoo-us", definition: "Sharing a common border; adjacent or touching.", weak: "next to each other", power: "contiguous", examples: ["We're looking to acquire contiguous office space for team expansion.", "The two markets aren't contiguous—distribution strategy must differ."], drill: "The new warehouse was chosen for its ___ location to our main facility.", answer: "contiguous" },
    { id: "w7-4", word: "Attrition", pronunciation: "uh-TRISH-un", definition: "The gradual reduction of a workforce or customer base through departure.", weak: "people leaving", power: "attrition", examples: ["We're targeting sub-5% annual attrition across the engineering team.", "Customer attrition in Q3 exceeded acquisition—a warning signal."], drill: "The retention program was launched in response to rising talent ___.", answer: "attrition" },
  ],
  // Set 8
  [
    { id: "w8-0", word: "Incremental", pronunciation: "in-kruh-MEN-tul", definition: "Relating to small, regular increases or additions.", weak: "small step", power: "incremental", examples: ["Incremental gains in NPS compound significantly over three years.", "The incremental cost of adding the feature doesn't justify the revenue uplift."], drill: "The team focused on ___ improvements that would collectively move the needle.", answer: "incremental" },
    { id: "w8-1", word: "Tangible", pronunciation: "TAN-juh-bul", definition: "Clear and definite; real; able to be measured.", weak: "real and measurable", power: "tangible", examples: ["We need tangible outcomes by end of Q2, not a progress report.", "Investors responded positively to the tangible cost savings."], drill: "The initiative must deliver ___ results within 90 days to justify continuation.", answer: "tangible" },
    { id: "w8-2", word: "Contingent", pronunciation: "kun-TIN-jent", definition: "Dependent on certain conditions; subject to circumstances.", weak: "depends on", power: "contingent", examples: ["The funding is contingent on hitting our Series A milestones.", "All offers are contingent on satisfactory due diligence."], drill: "The board's approval is ___ on the legal team clearing the IP issue.", answer: "contingent" },
    { id: "w8-3", word: "Proliferating", pronunciation: "pro-LIF-er-ay-ting", definition: "Increasing rapidly in number; multiplying.", weak: "growing everywhere", power: "proliferating", examples: ["Proliferating compliance requirements are straining mid-market legal teams.", "We're facing proliferating competition from low-cost alternatives."], drill: "The ___ number of vendors made procurement consolidation a priority.", answer: "proliferating" },
    { id: "w8-4", word: "Pervasive", pronunciation: "per-VAY-siv", definition: "Spreading widely throughout an area or group.", weak: "everywhere", power: "pervasive", examples: ["The culture of mediocrity was pervasive before the new leadership arrived.", "Digital transformation is now pervasive across every industry vertical."], drill: "The ___ use of informal communication channels was undermining transparency.", answer: "pervasive" },
  ],
  // Set 9
  [
    { id: "w9-0", word: "Impetus", pronunciation: "IM-peh-tus", definition: "A force that makes something happen or happen more quickly.", weak: "reason or push", power: "impetus", examples: ["The regulatory deadline provided the impetus for finally migrating to cloud.", "Customer churn gave the product team the impetus to rebuild the onboarding flow."], drill: "The board's ultimatum was the ___ the team needed to finally launch.", answer: "impetus" },
    { id: "w9-1", word: "Calibrate", pronunciation: "KAL-ih-brayt", definition: "To carefully assess and adjust for a particular situation or requirement.", weak: "adjust", power: "calibrate", examples: ["We need to calibrate our growth expectations to current market conditions.", "The incentive structure must be calibrated to the performance baseline."], drill: "The CFO asked the team to ___ revenue projections against conservative assumptions.", answer: "calibrate" },
    { id: "w9-2", word: "Implicit", pronunciation: "im-PLIS-it", definition: "Implied though not directly expressed.", weak: "understood without saying", power: "implicit", examples: ["There was an implicit agreement that the partnership would be exclusive.", "The implicit expectation is that the report lands before the board meeting."], drill: "The ___ assumption in the model was that margins would hold steady.", answer: "implicit" },
    { id: "w9-3", word: "Exacerbate", pronunciation: "ex-AS-er-bayt", definition: "To make a problem, bad situation, or negative feeling worse.", weak: "make worse", power: "exacerbate", examples: ["The delay will exacerbate an already challenging client relationship.", "Micromanagement tends to exacerbate the performance problems it tries to solve."], drill: "Cutting the training budget would ___ the skills gap we're already facing.", answer: "exacerbate" },
    { id: "w9-4", word: "Codify", pronunciation: "KOH-dih-fy", definition: "To arrange into a systematic set of rules or procedures.", weak: "write down officially", power: "codify", examples: ["We need to codify the decision-making process before we scale the team.", "The compliance team was tasked with codifying standards across all regions."], drill: "The new HR director began to ___ performance management practices company-wide.", answer: "codify" },
  ],
  // Set 10
  [
    { id: "w10-0", word: "Prioritize", pronunciation: "pry-OR-ih-tyz", definition: "To designate or treat as more important than other things.", weak: "focus on first", power: "prioritize", examples: ["We must prioritize deals with the highest strategic fit, not just highest revenue.", "The crisis forced us to prioritize speed over perfection."], drill: "The executive team needs to ___ the three initiatives with highest ROI potential.", answer: "prioritize" },
    { id: "w10-1", word: "Transient", pronunciation: "TRAN-shent", definition: "Lasting only for a short time; impermanent.", weak: "temporary", power: "transient", examples: ["The dip in engagement is transient—driven by seasonal factors, not structural issues.", "Transient market volatility should not drive long-term structural decisions."], drill: "The board was reassured that the revenue dip was ___ and not systemic.", answer: "transient" },
    { id: "w10-2", word: "Confluence", pronunciation: "KON-floo-ens", definition: "An act or process of merging; the meeting of two or more forces.", weak: "combination of factors", power: "confluence", examples: ["A confluence of market conditions created a once-in-a-decade opportunity.", "The confluence of regulatory pressure and consumer demand accelerated our pivot."], drill: "A ___ of factors—talent, timing, and technology—made the product possible.", answer: "confluence" },
    { id: "w10-3", word: "Relentless", pronunciation: "rih-LENT-les", definition: "Continuing without becoming weaker; persistent and determined.", weak: "never stopping", power: "relentless", examples: ["The team's relentless focus on the customer drove NPS from 32 to 71.", "Relentless execution is what separates strategy from outcome."], drill: "Her ___ pursuit of operational excellence became the foundation of the turnaround.", answer: "relentless" },
    { id: "w10-4", word: "Enumerate", pronunciation: "ih-NYOO-mer-ayt", definition: "To mention items one by one; to count and list.", weak: "list out", power: "enumerate", examples: ["Please enumerate the three core risks before we proceed.", "The proposal should enumerate deliverables, timelines, and ownership."], drill: "The consultant was asked to ___ every assumption embedded in the model.", answer: "enumerate" },
  ],
  // Set 11
  [
    { id: "w11-0", word: "Articulate", pronunciation: "ar-TIK-yoo-layt", definition: "To express an idea clearly and coherently.", weak: "explain well", power: "articulate", examples: ["She could articulate the value proposition in under 30 seconds.", "Leaders who articulate vision clearly inspire disproportionate followership."], drill: "The founder struggled to ___ the company's mission in a single sentence.", answer: "articulate" },
    { id: "w11-1", word: "Credibility", pronunciation: "kred-ih-BIL-ih-tee", definition: "The quality of being trusted and believed in.", weak: "being trusted", power: "credibility", examples: ["Your credibility in the room depends on the data you bring, not your title.", "The company's credibility took a hit after the failed product launch."], drill: "Delivering on every commitment is how you build ___ with the board.", answer: "credibility" },
    { id: "w11-2", word: "Nuanced", pronunciation: "NOO-anst", definition: "Characterized by subtle distinctions or careful attention to detail.", weak: "detailed and careful", power: "nuanced", examples: ["The market opportunity requires a nuanced approach—one size won't fit all.", "Her nuanced reading of the competitive landscape gave the board confidence."], drill: "The answer to that question is ___ and requires more than a yes or no.", answer: "nuanced" },
    { id: "w11-3", word: "Succinctly", pronunciation: "suk-SINKT-lee", definition: "In a brief and clearly expressed manner.", weak: "quickly and simply", power: "succinctly", examples: ["The best executive presentations state the recommendation succinctly, then back it up.", "He succinctly summarized three hours of analysis into a single chart."], drill: "The board appreciated how ___ she communicated the risk exposure.", answer: "succinctly" },
    { id: "w11-4", word: "Tenacity", pronunciation: "teh-NAS-ih-tee", definition: "The quality of being very determined; persistence.", weak: "not giving up", power: "tenacity", examples: ["Her tenacity in pursuing the partnership over 18 months is what made it happen.", "Tenacity without direction is just stubbornness—vision matters."], drill: "The startup's ___ in the face of rejection eventually won over the enterprise client.", answer: "tenacity" },
  ],
];

const VocabularyAccelerator = () => {
  const { currentUser } = useAuth();
  const [drillInputs, setDrillInputs] = useState<Record<string, string>>({});
  const [drillResults, setDrillResults] = useState<Record<string, "correct" | "incorrect" | null>>({});
  const [learnedToday, setLearnedToday] = useState<string[]>([]);
  const [bonusAwarded, setBonusAwarded] = useState(false);
  const [totalLearned, setTotalLearned] = useState(0);

  const dayIndex = Math.floor(Date.now() / MS_PER_DAY) % 12;
  const dailyWords = WORD_SETS[dayIndex];

  useEffect(() => {
    if (currentUser) {
      const progress = getVocabProgress(currentUser.id);
      setTotalLearned(progress.learnedWords.length);
      const todayLearned = dailyWords.filter(w => progress.learnedWords.includes(w.id)).map(w => w.id);
      setLearnedToday(todayLearned);
    }
  }, [currentUser, dayIndex]);

  function handleDrillSubmit(word: WordEntry) {
    const input = (drillInputs[word.id] || "").trim().toLowerCase();
    const correct = input === word.answer.toLowerCase();
    setDrillResults(prev => ({ ...prev, [word.id]: correct ? "correct" : "incorrect" }));

    if (correct && currentUser && !learnedToday.includes(word.id)) {
      markWordLearned(currentUser.id, word.id);
      awardPoints(currentUser.id, { source: "vocabulary", sourceId: word.id, sourceName: `Vocab: ${word.word}`, points: 5 });
      const newLearned = [...learnedToday, word.id];
      setLearnedToday(newLearned);
      setTotalLearned(prev => prev + 1);
      toast.success(`Correct! +5 pts`);

      if (newLearned.length === dailyWords.length && !bonusAwarded) {
        awardPoints(currentUser.id, { source: "vocabulary-daily-bonus", sourceId: "daily-bonus", sourceName: "Vocabulary Daily Bonus", points: 25 });
        setBonusAwarded(true);
        toast.success("🎉 All 5 words mastered today! +25 bonus pts");
      }
    } else if (!correct) {
      toast.error("Not quite. Try again!");
    }
  }

  return (
    <PlatformLayout>
      <div className="min-h-screen p-6 md:p-10" style={{ background: "#0B1A2A", color: "#F4F2ED" }}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BookOpen size={28} style={{ color: "#B89A5A" }} />
              <div>
                <h1 className="text-2xl font-bold">Vocabulary Accelerator</h1>
                <p style={{ color: "#8E96A3" }} className="text-sm">5 power words every day</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "#1C1F26" }}>
              <Trophy size={16} style={{ color: "#B89A5A" }} />
              <span className="text-sm font-semibold">{totalLearned} learned</span>
            </div>
          </div>

          {/* Progress */}
          <div className="p-4 rounded-xl mb-8" style={{ background: "#1C1F26" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: "#8E96A3" }}>Today's progress</span>
              <span className="text-sm font-bold" style={{ color: "#B89A5A" }}>{learnedToday.length}/{dailyWords.length}</span>
            </div>
            <div className="w-full rounded-full h-2" style={{ background: "#0B1A2A" }}>
              <motion.div
                className="h-2 rounded-full"
                style={{ background: "#B89A5A" }}
                initial={{ width: 0 }}
                animate={{ width: `${(learnedToday.length / dailyWords.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Word cards */}
          <div className="space-y-6">
            {dailyWords.map((word, i) => {
              const learned = learnedToday.includes(word.id);
              const drillResult = drillResults[word.id];

              return (
                <motion.div
                  key={word.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl overflow-hidden"
                  style={{ background: "#1C1F26", border: learned ? "1px solid #B89A5A" : "1px solid #2a2f3a" }}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold" style={{ color: learned ? "#B89A5A" : "#F4F2ED" }}>{word.word}</h3>
                          {learned && <CheckCircle size={18} style={{ color: "#B89A5A" }} />}
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: "#8E96A3" }}>{word.pronunciation}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs px-3 py-1 rounded-full" style={{ background: "#0B1A2A", color: "#8E96A3" }}>
                        <span style={{ color: "#ef4444" }}>{word.weak}</span>
                        <ChevronRight size={12} />
                        <span style={{ color: "#B89A5A" }}>{word.power}</span>
                      </div>
                    </div>

                    <p className="text-sm mt-3 mb-4 leading-relaxed" style={{ color: "#F4F2ED" }}>{word.definition}</p>

                    <div className="space-y-2 mb-4">
                      {word.examples.map((ex, ei) => (
                        <div key={ei} className="flex gap-2">
                          <Star size={12} className="mt-1 flex-shrink-0" style={{ color: "#B89A5A" }} />
                          <p className="text-xs leading-relaxed" style={{ color: "#8E96A3" }}>"{ex}"</p>
                        </div>
                      ))}
                    </div>

                    {/* Drill */}
                    <div className="p-4 rounded-lg" style={{ background: "#0B1A2A" }}>
                      <p className="text-xs mb-2" style={{ color: "#8E96A3" }}>Fill in the blank:</p>
                      <p className="text-sm mb-3">{word.drill}</p>
                      <div className="flex gap-2">
                        <input
                          value={drillInputs[word.id] || ""}
                          onChange={e => setDrillInputs(prev => ({ ...prev, [word.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === "Enter") handleDrillSubmit(word); }}
                          placeholder="Type the word..."
                          disabled={learned}
                          className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
                          style={{
                            background: "#1C1F26",
                            color: "#F4F2ED",
                            border: drillResult === "correct" ? "1px solid #B89A5A" : drillResult === "incorrect" ? "1px solid #ef4444" : "1px solid #2a2f3a",
                          }}
                        />
                        {!learned && (
                          <button
                            onClick={() => handleDrillSubmit(word)}
                            className="px-4 py-2 rounded-lg text-sm font-bold"
                            style={{ background: "#B89A5A", color: "#0B1A2A" }}
                          >
                            Check
                          </button>
                        )}
                      </div>
                      <AnimatePresence>
                        {drillResult && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-xs mt-2"
                            style={{ color: drillResult === "correct" ? "#B89A5A" : "#ef4444" }}
                          >
                            {drillResult === "correct" ? `✓ Correct! The word is "${word.answer}"` : `✗ Try again. Hint: starts with "${word.answer[0]}"`}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
};

export default VocabularyAccelerator;
