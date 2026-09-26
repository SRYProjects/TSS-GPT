import { guideTopics } from "./diagnosticConfig";

export const findingTypes = {
  SOLID: "Solid",
  INCOMPLETE: "Incomplete",
  DISCONNECTED: "Disconnected",
  UNVERIFIED: "Unverified",
  UNKNOWN: "Unknown",
  PERFORMANCE: "Performance Problem",
  EXECUTION: "Execution Exposure"
};

const finding = ({
  id,
  type,
  title,
  support,
  why,
  direction,
  improvementEvidence,
  guideTopic,
  priority = 0,
  confidence = "supported"
}) => ({
  id,
  type,
  title,
  support,
  why,
  direction,
  improvementEvidence,
  guideTopic,
  priority,
  confidence
});

export function evaluateDirectFindings(answers) {
  const findings = [];

  // --------------------------------------------------
  // HOW SALES BEGIN
  // --------------------------------------------------

  if (
    answers.top_sources?.includes("We don't know which contribute most")
  ) {
    findings.push(
      finding({
        id: "unknown_source_contribution",
        type: findingTypes.UNKNOWN,
        title:
          "The business cannot currently determine which opportunity sources contribute most.",
        support:
          "You identified ways new business reaches you, but indicated that you do not know which sources contribute most.",
        why:
          "Without knowing which sources materially contribute to sales, decisions about where to invest selling effort can rest on assumption rather than evidence.",
        direction:
          "Establish a practical way to distinguish the contribution of the most important opportunity sources.",
        improvementEvidence:
          "Management can identify the important sources and support that conclusion with observable results.",
        guideTopic: guideTopics.salesSources,
        priority: 6
      })
    );
  }

  if (
    answers.source_objectives ===
    "Each important activity has a specific intended result"
  ) {
    if (answers.source_objective_verification) {
      findings.push(
        finding({
          id: "defined_source_objectives",
          type: findingTypes.SOLID,
          title:
            "Important opportunity sources have deliberately defined intended results.",
          support:
            "You indicated that important sales activities have specific intended results and identified those results.",
          why:
            "Defining what each source is expected to produce makes it possible to evaluate whether the activity is advancing the sales system as intended.",
          direction: null,
          improvementEvidence: null,
          guideTopic: guideTopics.objectives,
          priority: 0
        })
      );
    }
  }

  if (
    answers.source_objectives ===
    "Some do, but others are less clearly defined"
  ) {
    findings.push(
      finding({
        id: "partial_source_objectives",
        type: findingTypes.INCOMPLETE,
        title:
          "Some important opportunity sources operate without clearly defined intended results.",
        support:
          "You indicated that intended results are defined for some important sales activities but not others.",
        why:
          "An activity cannot be evaluated reliably when the business has not established what that activity is supposed to produce.",
        direction:
          "Define the intended result of the important opportunity sources that currently lack one.",
        improvementEvidence:
          "Each important source has an explicit result against which its performance can be evaluated.",
        guideTopic: guideTopics.objectives,
        priority: 7
      })
    );
  }

  if (
    [
      "We generally know what we want, but it isn't specifically defined",
      "We mostly perform the activities and judge the results afterward"
    ].includes(answers.source_objectives)
  ) {
    findings.push(
      finding({
        id: "undefined_source_objectives",
        type: findingTypes.INCOMPLETE,
        title:
          "Important opportunity-generating activities do not have sufficiently defined intended results.",
        support:
          `You described the current practice as: "${answers.source_objectives}".`,
        why:
          "Without a defined result, the business can measure activity or eventual sales but cannot reliably determine whether each source is doing the job expected of it.",
        direction:
          "Define what each important opportunity source must produce before evaluating whether it works.",
        improvementEvidence:
          "The business can state the intended result of each important source and evaluate that result directly.",
        guideTopic: guideTopics.objectives,
        priority: 9
      })
    );
  }

  if (
    answers.source_evidence ===
    "We track the result of each important source"
  ) {
    if (
      Array.isArray(answers.source_evidence_verification) &&
      answers.source_evidence_verification.length > 0
    ) {
      findings.push(
        finding({
          id: "source_tracking",
          type: findingTypes.SOLID,
          title:
            "The business uses recorded evidence to evaluate important opportunity sources.",
          support:
            "You indicated that important sources are tracked and identified recorded measures used to evaluate them.",
          why:
            "Recorded evidence gives management a stronger basis for determining which opportunity sources are producing useful results.",
          direction: null,
          improvementEvidence: null,
          guideTopic: guideTopics.evidence,
          priority: 0
        })
      );
    }
  }

  if (
    answers.source_evidence === "We track some sources but not others"
  ) {
    findings.push(
      finding({
        id: "partial_source_evidence",
        type: findingTypes.UNVERIFIED,
        title:
          "The effectiveness of some important opportunity sources remains unverified.",
        support:
          "You indicated that some sources are tracked while others are not.",
        why:
          "Uneven evidence can make weak and strong sources difficult to distinguish and can distort decisions about where sales effort belongs.",
        direction:
          "Establish evidence for the important sources whose results are not currently verified.",
        improvementEvidence:
          "Each important source can be evaluated against evidence relevant to its intended result.",
        guideTopic: guideTopics.evidence,
        priority: 7
      })
    );
  }

  if (
    answers.source_evidence ===
    "We rely mostly on experience or judgment"
  ) {
    findings.push(
      finding({
        id: "source_assumption",
        type: findingTypes.UNVERIFIED,
        title:
          "Conclusions about opportunity-source effectiveness rely primarily on judgment rather than evidence.",
        support:
          "You indicated that source effectiveness is determined mostly through experience or judgment.",
        why:
          "Experience can generate useful hypotheses, but it does not establish whether a source is producing its intended result.",
        direction:
          "Identify evidence that can verify whether the most important sources are producing the results expected of them.",
        improvementEvidence:
          "Important source-performance conclusions can be supported by observable or recorded results.",
        guideTopic: guideTopics.evidence,
        priority: 8
      })
    );
  }

  if (answers.source_evidence === "We don't really know") {
    findings.push(
      finding({
        id: "unknown_source_effectiveness",
        type: findingTypes.UNKNOWN,
        title:
          "The business cannot currently determine which opportunity sources are working.",
        support:
          "You indicated that you do not really know which ways of generating business are working.",
        why:
          "Without this visibility, management cannot reliably distinguish productive opportunity creation from activity that merely consumes resources.",
        direction:
          "Establish intended results and evidence for the most important sources first.",
        improvementEvidence:
          "Management can determine whether each important source produces its intended result.",
        guideTopic: guideTopics.evidence,
        priority: 9
      })
    );
  }

  // --------------------------------------------------
  // HOW SALES MOVE
  // --------------------------------------------------

  if (answers.process_clarity === "We have never really mapped it") {
    findings.push(
      finding({
        id: "unmapped_process",
        type: findingTypes.INCOMPLETE,
        title:
          "The business has not yet made its actual sales process sufficiently visible.",
        support:
          "You indicated that the process from buyer engagement through sale has never really been mapped.",
        why:
          "Until the actual path is visible, it is difficult to define what each part must accomplish, determine where opportunities break down, or improve the system deliberately.",
        direction:
          "Map the major path an opportunity follows from engagement through purchase.",
        improvementEvidence:
          "The business can describe the major sales path and the meaningful variations that affect it.",
        guideTopic: guideTopics.salesSources,
        priority: 10
      })
    );
  }

  if (answers.process_clarity === "Not sure") {
    findings.push(
      finding({
        id: "unknown_process",
        type: findingTypes.UNKNOWN,
        title:
          "Management does not currently have sufficient visibility into the sales process.",
        support:
          "You were not sure how clearly the path from buyer engagement through sale can be described.",
        why:
          "A sales system cannot be managed deliberately when the business cannot establish what actually happens as opportunities move through it.",
        direction:
          "Reconstruct the actual sales path before deciding what should be changed.",
        improvementEvidence:
          "Management can describe how opportunities normally progress and where meaningful variations occur.",
        guideTopic: guideTopics.salesSources,
        priority: 10
      })
    );
  }

  if (
    answers.process_order === "There is no consistent order" ||
    answers.process_clarity ===
      "It depends heavily on the salesperson or situation"
  ) {
    findings.push(
      finding({
        id: "variable_process",
        type: findingTypes.DISCONNECTED,
        title:
          "Opportunity progression depends substantially on individual practice or circumstance.",
        support:
          "Your answers indicate that the sales path lacks a consistently understood progression.",
        why:
          "Variation may be appropriate when conditions require it, but unmanaged variation makes it difficult to know whether opportunities are advancing deliberately or simply moving according to individual habit.",
        direction:
          "Determine which variations are intentionally required by selling conditions and which reflect an undefined process.",
        improvementEvidence:
          "Meaningful process variations can be explained by known conditions rather than individual preference alone.",
        guideTopic: guideTopics.objectives,
        priority: 8
      })
    );
  }

  if (answers.step_objectives === "No") {
    findings.push(
      finding({
        id: "no_step_objectives",
        type: findingTypes.INCOMPLETE,
        title:
          "Important sales activities occur without defined advancement objectives.",
        support:
          "You indicated that important process steps do not have specific results they are expected to produce.",
        why:
          "Completing an activity is not the same as advancing an opportunity. Without an intended result, the business cannot distinguish successful progression from merely performing the step.",
        direction:
          "Define what must be accomplished by each important step in the sales process.",
        improvementEvidence:
          "Each important step has an explicit buyer response, condition, or advancement result that indicates success.",
        guideTopic: guideTopics.objectives,
        priority: 10
      })
    );
  }

  if (
    answers.step_objectives ===
    "The results are generally understood but not specifically defined"
  ) {
    findings.push(
      finding({
        id: "informal_step_objectives",
        type: findingTypes.INCOMPLETE,
        title:
          "Sales-step objectives are understood informally rather than operationally defined.",
        support:
          "You indicated that expected results are generally understood but not specifically defined.",
        why:
          "Informal understanding allows different people to interpret successful completion differently and weakens consistent advancement and measurement.",
        direction:
          "Convert the understood purpose of important steps into explicit advancement objectives.",
        improvementEvidence:
          "People performing the same important step can identify the same required result and determine whether it occurred.",
        guideTopic: guideTopics.objectives,
        priority: 9
      })
    );
  }

  if (answers.step_objectives === "For some steps") {
    findings.push(
      finding({
        id: "partial_step_objectives",
        type: findingTypes.INCOMPLETE,
        title:
          "Some important sales steps have defined outcomes while others do not.",
        support:
          "You indicated that specific expected results exist for only some important process steps.",
        why:
          "Undefined steps create breaks in the logic of the sales process because successful advancement cannot be established consistently across the full path.",
        direction:
          "Identify the important steps without defined advancement outcomes and establish what each must accomplish.",
        improvementEvidence:
          "All important process steps have explicit advancement outcomes.",
        guideTopic: guideTopics.objectives,
        priority: 9
      })
    );
  }

  if (
    answers.step_evidence ===
    "We rely primarily on salesperson judgment"
  ) {
    findings.push(
      finding({
        id: "subjective_step_evidence",
        type: findingTypes.UNVERIFIED,
        title:
          "Sales-process advancement is evaluated primarily through salesperson judgment.",
        support:
          "You indicated that determining whether important steps succeeded relies primarily on salesperson judgment.",
        why:
          "Judgment may be useful, but without observable evidence the business cannot consistently verify whether the required buyer response or advancement actually occurred.",
        direction:
          "Define observable evidence for the results expected from the most important process steps.",
        improvementEvidence:
          "Important advancement decisions can be supported by observable buyer responses or recorded measures.",
        guideTopic: guideTopics.evidence,
        priority: 8
      })
    );
  }

  if (
    answers.step_evidence ===
    "We generally assume success if the opportunity continues"
  ) {
    findings.push(
      finding({
        id: "continuation_assumption",
        type: findingTypes.UNVERIFIED,
        title:
          "Continued opportunity activity is being used as a proxy for successful advancement.",
        support:
          "You indicated that a step is generally assumed successful when the opportunity continues.",
        why:
          "An opportunity can continue without the buyer having reached the result the step was intended to produce. That can allow unresolved conditions to accumulate later in the sale.",
        direction:
          "Establish evidence that verifies the intended result of important steps rather than inferring success from continuation alone.",
        improvementEvidence:
          "Step success can be distinguished from simple continuation of the opportunity.",
        guideTopic: guideTopics.evidence,
        priority: 8
      })
    );
  }

  if (
    answers.step_evidence ===
    "We don't evaluate individual steps this way"
  ) {
    findings.push(
      finding({
        id: "no_step_evidence",
        type: findingTypes.UNKNOWN,
        title:
          "The business cannot currently verify whether individual sales steps accomplish their intended purpose.",
        support:
          "You indicated that individual process steps are not evaluated against evidence of what they needed to accomplish.",
        why:
          "Without step-level evidence, management may know whether a sale eventually occurred but not where progression succeeded or failed.",
        direction:
          "Establish evidence for the intended results of the most consequential process steps.",
        improvementEvidence:
          "The business can determine whether important steps produced their required advancement result.",
        guideTopic: guideTopics.evidence,
        priority: 9
      })
    );
  }

  // --------------------------------------------------
  // BUYER PROGRESSION
  // --------------------------------------------------

  if (
    answers.buyer_understanding ===
    "We have not examined it this way"
  ) {
    findings.push(
      finding({
        id: "buyer_requirements_undefined",
        type: findingTypes.INCOMPLETE,
        title:
          "What buyers need to understand before choosing the company has not been deliberately established.",
        support:
          "You indicated that the business has not examined buyer understanding in this way.",
        why:
          "Seller activity can be consistent while buyer progression remains accidental if the business has not determined what the buyer must understand and conclude.",
        direction:
          "Establish what buyers must understand about relevance, differentiation, value, evidence, risk, and alternatives.",
        improvementEvidence:
          "The business can identify the important buyer conclusions its selling activity is designed to establish.",
        guideTopic: guideTopics.buyerProgression,
        priority: 9
      })
    );
  }

  if (
    answers.buyer_understanding ===
    "It is largely left to individual salespeople"
  ) {
    findings.push(
      finding({
        id: "buyer_progression_individual",
        type: findingTypes.DISCONNECTED,
        title:
          "Buyer progression depends substantially on individual salesperson practice.",
        support:
          "You indicated that what buyers need to understand is largely left to individual salespeople.",
        why:
          "This makes important buyer conclusions dependent on individual interpretation rather than an intentionally designed sales system.",
        direction:
          "Define the important buyer conclusions the sales process must deliberately establish.",
        improvementEvidence:
          "Salespeople work toward common buyer outcomes while retaining appropriate flexibility in how they achieve them.",
        guideTopic: guideTopics.buyerProgression,
        priority: 8
      })
    );
  }

  if (
    answers.buyer_preference ===
    "We don't distinguish interest from preference"
  ) {
    findings.push(
      finding({
        id: "preference_undefined",
        type: findingTypes.INCOMPLETE,
        title:
          "The sales system does not currently distinguish buyer interest from buyer preference.",
        support:
          "You indicated that interest and preference are not distinguished.",
        why:
          "A buyer can remain interested without favoring your company or offer. Treating the two as equivalent can overstate how far an opportunity has actually progressed.",
        direction:
          "Define what observable buyer response indicates movement from interest toward preference.",
        improvementEvidence:
          "The business can identify evidence that a buyer favors the company or offer rather than merely remaining interested.",
        guideTopic: guideTopics.buyerProgression,
        priority: 8
      })
    );
  }

  if (
    answers.buyer_preference ===
    "We mostly infer it from the conversation"
  ) {
    findings.push(
      finding({
        id: "preference_unverified",
        type: findingTypes.UNVERIFIED,
        title:
          "Buyer preference is primarily inferred rather than verified.",
        support:
          "You indicated that preference is mostly inferred from the sales conversation.",
        why:
          "Positive interaction does not necessarily establish that the buyer favors your offer over available alternatives.",
        direction:
          "Identify observable indications that reliably demonstrate buyer preference.",
        improvementEvidence:
          "Preference conclusions are supported by observable buyer behavior or explicit buyer response.",
        guideTopic: guideTopics.buyerProgression,
        priority: 8
      })
    );
  }

  if (answers.buyer_preference === "Not sure") {
    findings.push(
      finding({
        id: "preference_unknown",
        type: findingTypes.UNKNOWN,
        title:
          "The business cannot currently determine when buyer interest becomes preference.",
        support:
          "You were not sure how buyer preference is recognized.",
        why:
          "Without this distinction, management cannot reliably determine whether the sales system is creating preference or merely sustaining interest.",
        direction:
          "Determine what buyer behavior or response would establish meaningful preference.",
        improvementEvidence:
          "The business can recognize and verify movement from interest toward preference.",
        guideTopic: guideTopics.buyerProgression,
        priority: 8
      })
    );
  }

  if (
    answers.buyer_value ===
    "We mainly explain our value and assume the buyer understands"
  ) {
    findings.push(
      finding({
        id: "value_assumed",
        type: findingTypes.UNVERIFIED,
        title:
          "The business explains value but does not establish that buyers actually perceive sufficient value.",
        support:
          "You indicated that value is mainly explained and buyer understanding is then assumed.",
        why:
          "Communicating value is a seller activity. The relevant sales result is whether the buyer perceives enough value to justify choosing the offer.",
        direction:
          "Establish a practical way to verify buyer-perceived value.",
        improvementEvidence:
          "Buyer responses or actions provide evidence that sufficient value has been established.",
        guideTopic: guideTopics.buyerProgression,
        priority: 9
      })
    );
  }

  if (
    answers.buyer_value ===
    "We haven't defined how to determine this"
  ) {
    findings.push(
      finding({
        id: "value_undefined",
        type: findingTypes.INCOMPLETE,
        title:
          "The business has not defined how it will determine whether buyers perceive sufficient value.",
        support:
          "You indicated that there is no defined way to determine whether buyers perceive enough value.",
        why:
          "Without evidence of buyer-perceived value, an important condition for choosing the offer remains unknown.",
        direction:
          "Define what buyer response or behavior would demonstrate sufficient perceived value.",
        improvementEvidence:
          "The business can determine whether buyers perceive enough value to justify proceeding.",
        guideTopic: guideTopics.buyerProgression,
        priority: 9
      })
    );
  }

  if (answers.buyer_value === "Not sure") {
    findings.push(
      finding({
        id: "value_unknown",
        type: findingTypes.UNKNOWN,
        title:
          "The business cannot currently determine whether buyers perceive sufficient value.",
        support:
          "You were not sure how sufficient buyer-perceived value is determined.",
        why:
          "This leaves a central buying condition unknown and makes later losses harder to interpret.",
        direction:
          "Identify evidence that can establish whether buyers perceive sufficient value.",
        improvementEvidence:
          "Management can distinguish communicated value from value actually perceived by buyers.",
        guideTopic: guideTopics.buyerProgression,
        priority: 9
      })
    );
  }

  if (
    [
      "We focus primarily on the rational business case",
      "We have not examined this separately"
    ].includes(answers.buyer_benefit)
  ) {
    findings.push(
      finding({
        id: "benefit_incomplete",
        type: findingTypes.INCOMPLETE,
        title:
          "The sales approach does not consistently distinguish rational value from the buyer's reason to act.",
        support:
          `You described the current practice as: "${answers.buyer_benefit}".`,
        why:
          "A buyer may agree that an offer makes rational sense without having a sufficiently meaningful reason to proceed.",
        direction:
          "Determine what makes acting worthwhile to the buyer beyond the rational business case alone.",
        improvementEvidence:
          "The sales process deliberately establishes both sufficient value and a meaningful reason for the buyer to act.",
        guideTopic: guideTopics.buyerProgression,
        priority: 7
      })
    );
  }

  if (
    answers.resolution === "We have no consistent approach" ||
    answers.resolution === "Important issues often emerge late"
  ) {
    findings.push(
      finding({
        id: "resolution_incomplete",
        type: findingTypes.INCOMPLETE,
        title:
          "Remaining buying issues are not consistently surfaced and resolved before they threaten the sale.",
        support:
          `You described the current practice as: "${answers.resolution}".`,
        why:
          "Unresolved requirements, risks, terms, approvals, or concerns can prevent a willing buyer from proceeding even when interest and value are present.",
        direction:
          "Establish a deliberate way to identify and resolve material buying issues before they become late-stage obstacles.",
        improvementEvidence:
          "Important remaining issues are surfaced early enough to be resolved deliberately.",
        guideTopic: guideTopics.resolution,
        priority: 8
      })
    );
  }

  if (answers.resolution === "Not sure") {
    findings.push(
      finding({
        id: "resolution_unknown",
        type: findingTypes.UNKNOWN,
        title:
          "The business lacks visibility into how remaining buying issues are identified and resolved.",
        support:
          "You were not sure how consistently remaining buying issues are handled.",
        why:
          "Without this visibility, management cannot determine whether late-stage friction reflects buyer conditions, selling practice, or unresolved requirements.",
        direction:
          "Examine how material buying issues are currently surfaced and resolved.",
        improvementEvidence:
          "Management can identify how and when important remaining buying issues are addressed.",
        guideTopic: guideTopics.resolution,
        priority: 7
      })
    );
  }

  if (
    answers.readiness_evidence ===
      "The salesperson judges that they are ready" ||
    answers.readiness_evidence === "We have no consistent indicator"
  ) {
    findings.push(
      finding({
        id: "readiness_unverified",
        type: findingTypes.UNVERIFIED,
        title:
          "Buyer readiness to proceed is not supported by a consistent observable indicator.",
        support:
          `You identified "${answers.readiness_evidence}" as the clearest indication of readiness.`,
        why:
          "Without an observable buyer indication, the sales team may mistake positive interaction for an actual decision to proceed.",
        direction:
          "Define the buyer behavior or response that demonstrates willingness to work through final buying details.",
        improvementEvidence:
          "Readiness conclusions are supported by observable buyer action or explicit commitment.",
        guideTopic: guideTopics.resolution,
        priority: 7
      })
    );
  }

  // --------------------------------------------------
  // STALLS AND CAUSES
  // --------------------------------------------------

  if (answers.stall_point === "We don't know") {
    findings.push(
      finding({
        id: "stall_unknown",
        type: findingTypes.UNKNOWN,
        title:
          "The business cannot currently identify where promising opportunities most often break down.",
        support:
          "You indicated that you do not know where promising opportunities most often slow, stall, or disappear.",
        why:
          "Without knowing where progression breaks down, improvement efforts can target the wrong part of the system.",
        direction:
          "Establish enough process evidence to identify where promising opportunities most often stop advancing.",
        improvementEvidence:
          "Management can identify significant breakdown points using observable evidence.",
        guideTopic: guideTopics.evidence,
        priority: 9
      })
    );
  }

  if (
    answers.stall_confidence === "It is mainly salesperson judgment" ||
    answers.stall_confidence === "It is mostly our best guess"
  ) {
    findings.push(
      finding({
        id: "stall_cause_unverified",
        type: findingTypes.UNVERIFIED,
        title:
          "The apparent reasons opportunities stall remain hypotheses rather than established causes.",
        support:
          `You identified likely stall reasons, but described the evidence as: "${answers.stall_confidence}".`,
        why:
          "Changing the sales system around an assumed cause can consume effort without addressing what is actually preventing advancement.",
        direction:
          "Investigate the suspected causes and establish evidence before deciding what should change.",
        improvementEvidence:
          "The business can support its explanation of the breakdown with buyer feedback, records, or a strong repeatable pattern.",
        guideTopic: guideTopics.causes,
        priority: 10,
        confidence: "hypothesis"
      })
    );
  }

  if (answers.stall_confidence === "We don't know") {
    findings.push(
      finding({
        id: "stall_cause_unknown",
        type: findingTypes.UNKNOWN,
        title:
          "The business sees where opportunities stall but cannot yet determine why.",
        support:
          "A breakdown point was identified, but the cause is currently unknown.",
        why:
          "Knowing where a problem occurs is useful, but changing tactics before understanding why it occurs risks treating the wrong condition.",
        direction:
          "Investigate the breakdown point before selecting a corrective action.",
        improvementEvidence:
          "Evidence distinguishes the likely cause from alternative explanations.",
        guideTopic: guideTopics.causes,
        priority: 10
      })
    );
  }

  // --------------------------------------------------
  // IMPROVEMENT
  // --------------------------------------------------

  if (
    answers.weak_result_response ===
    "We usually act on the most likely explanation"
  ) {
    findings.push(
      finding({
        id: "cause_assumption",
        type: findingTypes.UNVERIFIED,
        title:
          "Changes may be made before the cause of weak performance is sufficiently established.",
        support:
          "You indicated that the business usually acts on the most likely explanation when results are weak.",
        why:
          "A plausible explanation is still a hypothesis. Acting before investigating can change the wrong part of the sales system.",
        direction:
          "Separate suspected causes from established causes and investigate before selecting the change.",
        improvementEvidence:
          "Important changes are based on evidence that distinguishes the likely cause from competing explanations.",
        guideTopic: guideTopics.causes,
        priority: 8
      })
    );
  }

  if (
    answers.weak_result_response ===
    "We tend to change tactics or push for more activity"
  ) {
    findings.push(
      finding({
        id: "activity_response",
        type: findingTypes.DISCONNECTED,
        title:
          "Weak sales results tend to trigger tactical change or additional activity before the underlying condition is established.",
        support:
          "You indicated that weak results usually lead to changed tactics or increased activity.",
        why:
          "More activity can amplify an ineffective part of the system if the actual constraint has not first been identified.",
        direction:
          "Investigate where and why the intended result is failing before changing tactics or increasing activity.",
        improvementEvidence:
          "Corrective action follows diagnosis of the weak result rather than preceding it.",
        guideTopic: guideTopics.causes,
        priority: 9
      })
    );
  }

  if (
    answers.testing === "We rarely test changes in a structured way" ||
    answers.testing ===
      "We judge primarily from experience and overall results"
  ) {
    findings.push(
      finding({
        id: "testing_incomplete",
        type: findingTypes.UNVERIFIED,
        title:
          "Sales changes are not consistently evaluated in a way that establishes whether they caused improvement.",
        support:
          `You described the current practice as: "${answers.testing}".`,
        why:
          "Overall results can change for many reasons. Without a baseline, deliberate change, expected result, and comparison, the business may incorrectly attribute improvement or decline to the change.",
        direction:
          "Use a deliberate test structure for important sales changes.",
        improvementEvidence:
          "Important changes establish the prior condition, intended change, expected improvement, evidence, and comparison afterward.",
        guideTopic: guideTopics.testing,
        priority: 8
      })
    );
  }

  if (answers.testing === "Not sure") {
    findings.push(
      finding({
        id: "testing_unknown",
        type: findingTypes.UNKNOWN,
        title:
          "Management lacks visibility into whether changes to the sales system actually improve performance.",
        support:
          "You were not sure how sales changes are evaluated.",
        why:
          "Without this visibility, the business cannot reliably learn which changes improve performance and which merely coincide with different results.",
        direction:
          "Establish a consistent method for testing important sales changes.",
        improvementEvidence:
          "Management can compare important deliberate changes against defined evidence.",
        guideTopic: guideTopics.testing,
        priority: 8
      })
    );
  }

  // --------------------------------------------------
  // EXECUTION
  // --------------------------------------------------

  if (
    answers.execution ===
    "It varies significantly by person or situation"
  ) {
    findings.push(
      finding({
        id: "execution_variation",
        type: findingTypes.EXECUTION,
        title:
          "Execution varies enough that it may be constraining sales-system performance.",
        support:
          "You indicated that execution varies significantly by person or situation.",
        why:
          "Even a sound sales system cannot produce reliable results when necessary work is performed inconsistently, unevenly, or without sufficient capability.",
        direction:
          "Determine which execution exposures materially affect important sales outcomes and address those conditions.",
        improvementEvidence:
          "Important sales work is performed consistently enough for system performance to be evaluated reliably.",
        guideTopic: guideTopics.execution,
        priority: 9
      })
    );
  }

  if (
    answers.execution === "We don't have enough visibility to know"
  ) {
    findings.push(
      finding({
        id: "execution_unknown",
        type: findingTypes.UNKNOWN,
        title:
          "Management cannot currently determine whether the sales approach is being executed consistently.",
        support:
          "You indicated that there is not enough visibility to know whether execution is consistent.",
        why:
          "Without execution visibility, weak results cannot be cleanly attributed to system design or the way the system is being worked.",
        direction:
          "Establish visibility into whether the important parts of the sales approach are actually being performed as intended.",
        improvementEvidence:
          "Management can distinguish system-design problems from execution deviations.",
        guideTopic: guideTopics.execution,
        priority: 9
      })
    );
  }

  return findings;
}

// --------------------------------------------------
// CROSS-ANSWER VALIDATION
// --------------------------------------------------

export function evaluateCrossAnswerFindings(answers) {
  const findings = [];

  const processClaimedClear =
    answers.process_clarity === "We have a clear, deliberate process";

  const objectivesWeak =
    answers.step_objectives === "For some steps" ||
    answers.step_objectives ===
      "The results are generally understood but not specifically defined" ||
    answers.step_objectives === "No";

  const evidenceWeak =
    answers.step_evidence === "We rely primarily on salesperson judgment" ||
    answers.step_evidence ===
      "We generally assume success if the opportunity continues" ||
    answers.step_evidence ===
      "We don't evaluate individual steps this way";

  if (processClaimedClear && (objectivesWeak || evidenceWeak)) {
    findings.push(
      finding({
        id: "clear_process_contradiction",
        type: findingTypes.DISCONNECTED,
        title:
          "The business has a recognizable sales process, but important parts are not yet operationally defined.",
        support:
          "You described the process as clear and deliberate, while other answers indicate that step outcomes or evidence of advancement are incomplete.",
        why:
          "A recognizable sequence of activities is not sufficient by itself. A managed process also requires clarity about what important steps must accomplish and how successful advancement is recognized.",
        direction:
          "Preserve the existing process structure, but define and verify the advancement outcomes that are currently incomplete.",
        improvementEvidence:
          "The process sequence, required step outcomes, and evidence of advancement agree with one another.",
        guideTopic: guideTopics.objectives,
        priority: 11
      })
    );
  }

  const sourceObjectivesStrong =
    answers.source_objectives ===
      "Each important activity has a specific intended result" &&
    answers.source_objective_verification;

  const sourceEvidenceWeak =
    answers.source_evidence ===
      "We rely mostly on experience or judgment" ||
    answers.source_evidence === "We don't really know";

  if (sourceObjectivesStrong && sourceEvidenceWeak) {
    findings.push(
      finding({
        id: "defined_but_unverified_sources",
        type: findingTypes.UNVERIFIED,
        title:
          "Important opportunity sources have defined purposes, but their effectiveness is not sufficiently verified.",
        support:
          "You identified intended results for important sources, but the business relies primarily on judgment or lacks evidence of whether those results occur.",
        why:
          "Defining an intended result is necessary, but the business still needs evidence that the activity actually produces it.",
        direction:
          "Connect each important source's intended result to evidence capable of verifying that result.",
        improvementEvidence:
          "The business can compare the intended result of each important source with evidence of whether that result occurs.",
        guideTopic: guideTopics.evidence,
        priority: 10
      })
    );
  }

  const valueCommunicationStrong =
    answers.buyer_understanding ===
      "We have deliberately worked this out";

  const valueVerificationWeak =
    answers.buyer_value ===
      "We address value but don't consistently verify it" ||
    answers.buyer_value ===
      "We mainly explain our value and assume the buyer understands" ||
    answers.buyer_value ===
      "We haven't defined how to determine this" ||
    answers.buyer_value === "Not sure";

  if (valueCommunicationStrong && valueVerificationWeak) {
    findings.push(
      finding({
        id: "value_communication_verification_gap",
        type: findingTypes.UNVERIFIED,
        title:
          "The business has deliberately developed what buyers should understand, but buyer-perceived value remains insufficiently verified.",
        support:
          "You indicated that buyer understanding has been deliberately worked out while also indicating that sufficient perceived value is not consistently verified.",
        why:
          "A well-developed value explanation does not establish that the buyer reached the intended conclusion.",
        direction:
          "Retain the developed value approach, but establish evidence that buyers actually perceive sufficient value.",
        improvementEvidence:
          "Buyer responses or actions verify that the intended value conclusion has been reached.",
        guideTopic: guideTopics.buyerProgression,
        priority: 10
      })
    );
  }

  const processDefined =
    answers.process_clarity === "We have a clear, deliberate process" &&
    [
      "Yes, for essentially every important step",
      "For some steps"
    ].includes(answers.step_objectives);

  const executionWeak =
    answers.execution ===
      "It varies significantly by person or situation";

  if (processDefined && executionWeak) {
    findings.push(
      finding({
        id: "system_execution_gap",
        type: findingTypes.EXECUTION,
        title:
          "The sales process appears more developed than its execution.",
        support:
          "Your answers indicate a deliberate process with defined outcomes for at least important steps, while execution varies significantly.",
        why:
          "Performance may be constrained less by the existence of the process than by whether necessary work is performed consistently, persistently, and capably.",
        direction:
          "Investigate the identified execution exposures before redesigning parts of the process that may already be viable.",
        improvementEvidence:
          "Execution becomes sufficiently consistent to evaluate the underlying process on its own merits.",
        guideTopic: guideTopics.execution,
        priority: 11
      })
    );
  }

  const systemUndefined =
    answers.process_clarity === "We have never really mapped it" ||
    answers.step_objectives === "No" ||
    answers.step_objectives ===
      "The results are generally understood but not specifically defined";

  if (systemUndefined && executionWeak) {
    findings.push(
      finding({
        id: "undefined_system_execution",
        type: findingTypes.INCOMPLETE,
        title:
          "Execution cannot yet be cleanly separated from an insufficiently defined sales system.",
        support:
          "Your answers indicate both substantial execution variation and important parts of the sales process that are not sufficiently defined.",
        why:
          "People cannot be expected to execute consistently against requirements that the business itself has not clearly established.",
        direction:
          "Clarify the required sales process and advancement outcomes before treating execution variation as the primary problem.",
        improvementEvidence:
          "The required system is sufficiently defined that deviations in execution can be identified independently.",
        guideTopic: guideTopics.objectives,
        priority: 12
      })
    );
  }

  const claimedTesting =
    answers.testing ===
    "We compare deliberate changes against meaningful evidence";

  const testingVerification = answers.testing_verification || [];

  const testingVerified =
    testingVerification.includes("We do all of these") ||
    [
      "What result is occurring before the change",
      "What specifically is being changed",
      "What improvement is expected",
      "What evidence will indicate whether it worked",
      "A comparison afterward"
    ].every((item) => testingVerification.includes(item));

  if (claimedTesting && !testingVerified) {
    findings.push(
      finding({
        id: "testing_claim_contradiction",
        type: findingTypes.UNVERIFIED,
        title:
          "The business describes its improvement process as evidence-based, but the verification does not yet establish a complete test discipline.",
        support:
          "You indicated that deliberate changes are compared against meaningful evidence, but the supporting test elements were incomplete.",
        why:
          "Without the prior condition, defined change, expected result, evidence, and comparison, improvement may be attributed to the wrong cause.",
        direction:
          "Complete the missing elements of the test structure for important sales changes.",
        improvementEvidence:
          "Important tests consistently establish the baseline, change, expected result, evidence, and comparison.",
        guideTopic: guideTopics.testing,
        priority: 9
      })
    );
  }

  return findings;
}
