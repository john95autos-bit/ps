/**
 * Copy for the pest-control pages: the four guides and the tiles that link to
 * them.
 *
 * The same rules that govern src/config/services.js apply here, and one more
 * that matters specifically for pest control:
 *
 *  · No product names, active ingredients, application rates or "safe for
 *    children and pets" assurances. Pesticide use is governed by the product
 *    label and by local law, both of which sit with the licensed applicator who
 *    attends — not with a website. Every mention of treatment defers to them.
 *  · No promise that anything will be eradicated, or stay gone. Recurrence
 *    depends on building condition, sanitation, neighbouring activity and
 *    follow-through, and a page that implies otherwise is writing a cheque the
 *    contractor has to bounce.
 *
 * What is here is identification and preparation guidance — the part a
 * homeowner can genuinely act on before anyone arrives, and the part that most
 * changes whether a first visit reaches a useful answer.
 */

export const PEST_TYPES = [
  {
    name: 'Cockroaches',
    href: '/pest-control/cockroach-control',
    blurb: 'Target harbourage areas and reduce the conditions that help activity return.',
  },
  {
    name: 'Termites',
    href: '/pest-control/termite-control',
    blurb: 'Inspection-led guidance for signs of termite activity and next-step options.',
  },
  {
    name: 'Bed bugs',
    href: '/pest-control/bed-bug-control',
    blurb: 'Careful assessment, preparation instructions and treatment planning.',
  },
  {
    name: 'Rodents',
    href: '/pest-control/rodent-control',
    blurb: 'Identify likely access points, activity patterns and practical control measures.',
  },
];

export const PEST_PAGES = {
  'cockroach-control': {
    title: 'Cockroach control for homes',
    pest: 'Cockroaches',
    intro:
      'Cockroaches shelter in warm, dark gaps close to food and water. A useful treatment plan starts by identifying which species is present, where it is harbouring and what conditions are supporting it — because those three answers change the approach entirely.',

    clues: [
      'Live insects seen at night',
      'Small droppings around cabinets',
      'Egg cases or shed skins',
      'A persistent musty odour',
      'Smear marks along edges in damp areas',
      'Activity concentrated near warmth or water',
    ],

    identify: [
      {
        title: 'Which species matters',
        text: 'German cockroaches are small and tan with two dark stripes behind the head, live indoors year-round and concentrate in kitchens and bathrooms. American cockroaches are much larger and reddish-brown, and are more often associated with drains, basements and voids. They are not treated the same way, which is why identification comes first.',
      },
      {
        title: 'Droppings',
        text: 'Smaller species leave specks resembling ground pepper or coffee grounds, usually in corners, inside cabinet hinges and along runs. Larger species leave bigger, more cylindrical droppings. Their location maps the harbourage better than a sighting does.',
      },
      {
        title: 'Egg cases and shed skins',
        text: 'A purse-shaped egg case, and the translucent skins nymphs leave as they grow, both indicate a population breeding on site rather than an individual that wandered in. This distinction changes the plan.',
      },
      {
        title: 'Seeing them in daylight',
        text: 'These are night-active insects. Regular daytime sightings in open areas often suggest the sheltered spaces are already crowded, which is useful information rather than a cause for panic.',
      },
      {
        title: 'The odour',
        text: 'Established activity can produce a distinctive musty smell, most noticeable in enclosed spaces such as a cabinet that has been shut for a while.',
      },
    ],

    conditions: [
      'Food debris, grease films behind and beneath appliances',
      'Standing water, condensation, leaking traps and dripping valves',
      'Warmth from motors — the backs of fridges, freezers and dishwashers',
      'Cardboard, paper and stored clutter that provides tight, dark gaps',
      'Gaps around pipework, cabinet voids and unsealed service penetrations',
      'Shared walls or service risers in apartments and terraced properties',
    ],

    approach: [
      'Inspect likely harbourage points',
      'Discuss food, water and access factors',
      'Apply an appropriate treatment where offered',
      'Explain cleaning and follow-up steps',
    ],

    prepare: [
      'Do not spray anything before the visit unless you are told to. Retail sprays scatter activity away from the places a treatment needs to reach and make the inspection much harder.',
      'Note exactly where and at what time you have seen activity — a map of sightings is genuinely valuable.',
      'Leave evidence in place. Resist wiping away droppings or smear marks before someone has seen them.',
      'Do clean up loose food debris and standing water, which is different from destroying evidence.',
      'Store food and pet food in sealed containers, and do not leave pet bowls down overnight.',
      'Clear access to the backs and undersides of appliances if you safely can.',
      'Tell the technician about children, pets, pregnancy, allergies and any respiratory condition before treatment.',
      'If you live in an apartment, mention it — shared voids mean neighbouring units may be part of the picture.',
    ],

    aftercare: [
      {
        title: 'Expect activity to rise first',
        text: 'Many approaches make insects move and feed, so sightings can briefly increase before they fall. That is usually the treatment working, not failing — but report what you see rather than guessing.',
      },
      {
        title: 'Do not clean away what was applied',
        text: 'Wiping or washing treated surfaces and edges can remove the treatment. Ask exactly where to avoid, and for how long, before anyone leaves.',
      },
      {
        title: 'Observe every re-entry instruction',
        text: 'Any ventilation period, re-entry time or surface precaution comes from the product label and from local law. Follow it exactly, and ask for it in writing if it was only said aloud.',
      },
      {
        title: 'Keep removing the conditions',
        text: 'Treatment addresses the population. Moisture, food access and harbourage are what decide whether it returns, and those stay with the property.',
      },
    ],

    faqs: [
      {
        question: 'Will one visit always solve the problem?',
        answer:
          'Not necessarily. The species, the level of activity, the building layout and the follow-up actions all affect the plan, and several species commonly need more than one visit. Ask what the plan is at the outset rather than assuming either way.',
      },
      {
        question: 'Should I spray before the visit?',
        answer:
          'Avoid adding products unless you have been instructed to. Retail sprays disperse activity into voids and adjoining rooms, which makes the inspection harder and can extend the treatment. Tell the technician if anything has already been used.',
      },
      {
        question: 'Does this mean my home is dirty?',
        answer:
          'No. Cleanliness influences how well a population is supported, but cockroaches arrive in deliveries, packaging, second-hand appliances and through shared walls and service voids. Well-kept homes get them too.',
      },
      {
        question: 'How did they get in?',
        answer:
          'Most often carried in — cardboard boxes, grocery deliveries, used appliances and furniture — or through connections to a neighbouring unit in shared buildings. Identifying the route matters, because it is the one that will be used again.',
      },
      {
        question: 'Are they a health risk?',
        answer:
          'They can contaminate food-preparation surfaces and stored food, and their debris is a recognised trigger for asthma and allergy in some people. That is the main reason to deal with them promptly rather than tolerate them.',
      },
      {
        question: 'Do I need to throw all my food away?',
        answer:
          'Not automatically. Anything in open packaging or showing contamination should go, but sealed and intact items are usually fine. Ask for guidance for your situation rather than emptying the kitchen pre-emptively.',
      },
      {
        question: 'How long before I see a difference?',
        answer:
          'It varies by species, method and how heavy the activity was. Ask the attending technician for a realistic window and what to do if you have not seen a change by then — a specific answer is a good sign.',
      },
    ],
  },

  'termite-control': {
    title: 'Termite inspection and control guidance',
    pest: 'Termites',
    intro:
      'Possible termite activity deserves a careful inspection. Similar-looking damage has other causes, damage is usually well advanced before it becomes visible, and the right response depends on the species and the construction — so avoid relying on photographs or surface signs alone.',

    clues: [
      'Mud-like shelter tubes',
      'Hollow or damaged timber',
      'Discarded wings',
      'Doors or floors changing unexpectedly',
      'Blistered or rippled paint and plaster',
      'Small piles of gritty pellets near woodwork',
    ],

    identify: [
      {
        title: 'Shelter tubes',
        text: 'Pencil-width tubes of soil and debris running up foundations, piers or walls are characteristic of subterranean species, which need to stay connected to soil moisture. Do not break them open — an intact tube tells an inspector far more than a disturbed one.',
      },
      {
        title: 'Swarmers are not flying ants',
        text: 'Termite swarmers have four wings of roughly equal length, a broad waist and straight, bead-like antennae. Flying ants have a pinched waist, elbowed antennae and noticeably shorter hind wings. Keep any you find, in a sealed bag or a little alcohol — identification from an actual specimen is far more reliable.',
      },
      {
        title: 'Discarded wings',
        text: 'Small piles of shed wings on windowsills, in webs or near light fittings indicate a swarm has taken place at that spot. Note the date; swarming season is informative.',
      },
      {
        title: 'How the timber sounds',
        text: 'Affected wood is often eaten from the inside, leaving a sound shell. A tap producing a hollow or papery sound where it should be solid is worth flagging, especially around skirting, frames and structural timber.',
      },
      {
        title: 'Frass, for drywood species',
        text: 'Drywood termites push small, hard, six-sided pellets out through kick-out holes, which accumulate in little piles beneath. That is a different species group with a different treatment, so mention it specifically.',
      },
      {
        title: 'Things that stop fitting',
        text: 'Doors and windows that have become stiff, floors that feel spongy, or paint that has blistered can all reflect moisture and timber changes beneath the surface — sometimes termites, sometimes a leak, occasionally both.',
      },
    ],

    conditions: [
      'Timber in direct contact with soil',
      'Persistent moisture from leaks, poor drainage or condensation',
      'Mulch, soil or stored timber banked against the structure',
      'Firewood, offcuts and cardboard stored against or under the property',
      'Poorly ventilated crawl spaces and sub-floor voids',
      'Landscaping or extensions that have bridged a previous treated barrier',
    ],

    approach: [
      'Review visible signs and property history',
      'Inspect accessible risk areas',
      'Explain findings and treatment choices',
      'Document prevention and monitoring steps',
    ],

    prepare: [
      'Leave shelter tubes, damaged timber and any swarm debris exactly as found.',
      'Collect a few insects or wings in a sealed bag if you can do so without disturbing the area.',
      'Note the date and location of any swarm you have seen — it often points at the nest direction.',
      'Clear access to crawl spaces, sub-floor hatches, the garage perimeter and the inside of the property boundary.',
      'Move stored boxes and timber away from walls so the base of the structure can be seen.',
      'Find any previous treatment, warranty or builder documentation. A property with a prior barrier is assessed differently.',
      'Mention any recent extension, re-landscaping, new patio or drainage change — these commonly breach an existing treated zone.',
      'Fix or report active leaks; sustained moisture is the single condition most worth removing.',
    ],

    aftercare: [
      {
        title: 'Monitoring is part of the job',
        text: 'Most approaches involve checking over time rather than a single event. Ask what the schedule is, who returns and what is being looked for.',
      },
      {
        title: 'Keep the conditions unfavourable',
        text: 'Soil-to-timber contact, mulch against the structure and unresolved moisture will undo good work. These stay your responsibility once the contractor has gone.',
      },
      {
        title: 'Do not disturb what was installed',
        text: 'Stations, treated zones and monitors need to stay where they were placed. Mention them to anyone doing landscaping or groundwork later.',
      },
      {
        title: 'Damage is a separate question',
        text: 'Controlling activity is not the same as repairing what has been eaten. Structural assessment and repair may need a different trade, and knowing whether it is needed is worth asking about explicitly.',
      },
    ],

    faqs: [
      {
        question: 'Can termites be confirmed from a photo?',
        answer:
          'A photo may help an initial conversation and can sometimes rule out a look-alike, but a proper inspection is usually needed to confirm activity and its extent. Much of what matters is in places a photograph does not reach.',
      },
      {
        question: 'Does every property need the same treatment?',
        answer:
          'No. Construction type, species, soil, access, the extent of activity and local standards can all change the recommended approach. Be cautious of a single fixed solution offered before anyone has inspected.',
      },
      {
        question: 'How do I tell termites from flying ants?',
        answer:
          'Look at the waist, the antennae and the wings. Termites have a broad waist, straight bead-like antennae and four wings of roughly equal length. Ants have a pinched waist, elbowed antennae and shorter hind wings. Keeping a specimen settles it properly.',
      },
      {
        question: 'How long have they been there?',
        answer:
          'Usually longer than the visible signs suggest, because timber is eaten from the inside and damage surfaces late. That is an argument for inspecting promptly, not for panic — this is rarely a problem measured in days.',
      },
      {
        question: 'Will they spread to my neighbour’s house?',
        answer:
          'Subterranean colonies live in soil and are not confined by a property line, so activity in an area is worth neighbours knowing about. What can be done about an adjoining property is a separate matter, and the inspecting contractor can explain the options.',
      },
      {
        question: 'Is my house going to collapse?',
        answer:
          'Very unlikely in the short term, and that framing is more often a sales technique than a finding. Structural significance is judged by what has actually been affected, which is exactly what an inspection is for.',
      },
      {
        question: 'Does home insurance cover termite damage?',
        answer:
          'Commonly not — many policies treat it as preventable damage rather than a sudden event. Check your own policy wording, and do it before commissioning work rather than after.',
      },
    ],
  },

  'bed-bug-control': {
    title: 'Bed bug inspection and treatment planning',
    pest: 'Bed bugs',
    intro:
      'Bed bugs hide in seams, joints and furniture close to where people sleep. Bites alone do not confirm an infestation and reactions vary enormously between people, so physical evidence and accurate preparation matter more here than with almost any other pest.',

    clues: [
      'Dark spotting near mattress seams',
      'Shed skins or small eggs',
      'Live bugs in cracks and joints',
      'Unexplained marks after sleep',
      'Small blood spots on bedding',
      'Activity concentrated within a few feet of the bed',
    ],

    identify: [
      {
        title: 'What an adult looks like',
        text: 'Roughly the size and shape of an apple seed, flat, oval and reddish-brown, becoming rounder and darker after feeding. They are visible to the naked eye — you do not need magnification to find one.',
      },
      {
        title: 'Young ones are much harder to see',
        text: 'Nymphs are smaller and close to translucent, which is why an inspection can find evidence where a casual look found nothing. Eggs are about a millimetre, pale and often tucked into seams.',
      },
      {
        title: 'Dark spotting',
        text: 'Small dark marks along seams, on the bed frame or on the wall behind the headboard are digested blood. This is usually the first evidence found, and is more reliable than bites.',
      },
      {
        title: 'Where to actually look',
        text: 'Mattress seams and tags, the box spring and its underside, the bed frame joints, the headboard and the wall behind it, and then outward: bedside furniture, skirting and the seams of nearby upholstered seating.',
      },
      {
        title: 'Bites do not settle it',
        text: 'Reactions differ hugely — some people show nothing at all, others react days later. Lines or clusters are suggestive but not diagnostic, and plenty of other things cause similar marks. Look for the physical signs.',
      },
    ],

    conditions: [
      'Recent travel, or a stay in shared or temporary accommodation',
      'Second-hand mattresses, upholstered furniture and bed frames',
      'Adjoining units in apartment buildings, via shared voids and services',
      'Visitors’ luggage, and bags set down in infested places',
      'Clutter around the bed, which multiplies hiding places',
      'Previously treated activity that was not followed up',
    ],

    approach: [
      'Inspect sleeping and resting areas',
      'Confirm preparation requirements',
      'Use an appropriate treatment plan',
      'Schedule follow-up where needed',
    ],

    prepare: [
      'Do not start sleeping in another room. It is the single most common way a problem in one room becomes a problem in three.',
      'Do not move mattresses, bedding or furniture to other parts of the property, and do not put them outside where someone else may take them.',
      'Do not discard the mattress before advice. It is often unnecessary, and carrying it through the property can spread activity.',
      'Launder bedding and affected clothing on the hottest setting the fabric allows, and dry it hot — the dryer does most of the work.',
      'Bag laundered items and keep them sealed until treatment is complete.',
      'Reduce clutter around the bed so the perimeter and the skirting can actually be reached.',
      'Follow the contractor’s written preparation list exactly. It exists because incomplete preparation is the usual reason a treatment underperforms.',
      'Tell the technician about children, pets, pregnancy, allergies and any respiratory condition, and mention if you are in an apartment.',
    ],

    aftercare: [
      {
        title: 'Follow-up visits are normal',
        text: 'Eggs are resistant to many methods, so more than one visit is common and is not a sign that the first one failed. Ask for the schedule up front.',
      },
      {
        title: 'Keep sleeping in the same bed',
        text: 'Counter-intuitive, but it matters. Moving elsewhere spreads the problem and removes the cue that draws them into the treated area.',
      },
      {
        title: 'Encasements and monitors',
        text: 'Mattress and box-spring encasements make future inspection much easier and trap anything left inside. Interceptors under the legs give you an ongoing read.',
      },
      {
        title: 'Watch how it gets back in',
        text: 'Luggage, second-hand furniture and neighbouring units are the common routes. In an apartment, resolving only your unit can be a temporary fix — raise it with the building manager.',
      },
    ],

    faqs: [
      {
        question: 'Do bites prove I have bed bugs?',
        answer:
          'No. Skin reactions have many causes and some people do not react at all. Look for physical evidence — dark spotting, shed skins, eggs or live insects — and arrange an inspection if you are unsure.',
      },
      {
        question: 'Should I throw away my mattress?',
        answer:
          'Not automatically, and not before advice. It is frequently unnecessary, carrying it out can spread activity through the property, and an encasement is often the better answer. If one is discarded it should be wrapped and marked so nobody takes it.',
      },
      {
        question: 'Does this mean my home is dirty?',
        answer:
          'No. Bed bugs feed on blood, not crumbs, and are found in spotless homes and expensive hotels alike. Clutter gives them more places to hide, but cleanliness is not what attracts them.',
      },
      {
        question: 'Can I treat this myself?',
        answer:
          'Self-treatment has a poor record and commonly makes things worse by scattering activity into adjoining rooms and voids, which extends the professional work needed afterwards. Preparation is the part you genuinely can do, and it makes a real difference.',
      },
      {
        question: 'How long does it take to resolve?',
        answer:
          'Usually weeks rather than days, across more than one visit, because of the egg stage. Ask the attending technician for a realistic schedule and what they expect at each stage.',
      },
      {
        question: 'Will they spread to my neighbours?',
        answer:
          'In apartment buildings they can move between units through shared voids and services. If you rent or live in a multi-unit building, tell the manager — treating units in isolation while an adjoining one is untreated tends to be a repeating cycle.',
      },
      {
        question: 'How do I avoid bringing them back from a trip?',
        answer:
          'Keep luggage off the bed and floor, check the mattress seams and headboard area on arrival, and when you get home put everything straight into a hot wash and a hot dryer rather than back into the bedroom.',
      },
    ],
  },

  'rodent-control': {
    title: 'Rodent control and entry-point guidance',
    pest: 'Rodents',
    intro:
      'Rodent activity is best addressed by combining control with sanitation and practical steps to reduce re-entry. Which species is present changes both the method and the sequence, so identification comes before anything gets sealed or set.',

    clues: [
      'Droppings or gnaw marks',
      'Scratching in walls or ceilings',
      'Damaged food packaging',
      'Greasy marks along edges',
      'Shredded paper, fabric or insulation gathered into nests',
      'A persistent ammonia-like smell in enclosed spaces',
    ],

    identify: [
      {
        title: 'Droppings tell you the species',
        text: 'Mouse droppings are small, dark and pointed at the ends, roughly the size of a grain of rice, and are scattered widely. Rat droppings are substantially larger and more often found in concentrated latrine areas. That difference shapes the whole approach.',
      },
      {
        title: 'Rub marks',
        text: 'Dark greasy smears along skirting, joists, pipes and entry holes come from repeated travel along the same route. They mark the runs, which is exactly where control measures need to go.',
      },
      {
        title: 'Gnaw marks',
        text: 'Incisors grow continuously, so gnawing is constant. Fresh marks are pale and sharp-edged; older ones darken. Damage to cabling is the reason this is not purely a nuisance problem.',
      },
      {
        title: 'Sound, and when you hear it',
        text: 'Scratching or scurrying in walls, ceilings or under floors, usually around dusk and through the night. Note the time and the location — it narrows the search considerably.',
      },
      {
        title: 'Behaviour differs',
        text: 'Mice are inquisitive and investigate new objects quickly. Rats are wary of anything new in their environment and may avoid it for days. This is why results are not always immediate and why moving things around can set progress back.',
      },
      {
        title: 'The gaps involved are small',
        text: 'A young mouse needs a gap of about the width of a pencil; a rat needs little more than the diameter of a coin. Proofing tends to be about many small openings rather than one obvious hole.',
      },
    ],

    conditions: [
      'Gaps at service penetrations, air bricks, eaves and around doors',
      'Accessible food — pet bowls, bird feed, open packaging, compost',
      'Bins that do not close fully, or are stored against the building',
      'Dense vegetation, ivy and stored material against external walls',
      'Overhanging branches giving roof access',
      'Drainage defects and unsealed redundant pipework',
    ],

    approach: [
      'Inspect activity and likely entry points',
      'Discuss safe control options',
      'Recommend proofing priorities',
      'Review sanitation and monitoring',
    ],

    prepare: [
      'Do not seal every hole you find before getting advice. Sequence matters, and premature sealing can trap animals inside the structure.',
      'Note when you hear activity and where in the building — times and locations are the most useful thing you can provide.',
      'Clear access to lofts, cupboards, sub-floor hatches and the backs of kitchen units.',
      'Move stored boxes away from external walls so the perimeter can be inspected.',
      'Secure food and pet food in sealed hard containers, and lift pet bowls overnight.',
      'Check bin lids close properly and move bins away from the building if you can.',
      'Cut back vegetation touching external walls and branches that reach the roof.',
      'Tell the technician about children, pets, livestock and any wildlife you do not want affected, before anything is placed.',
    ],

    aftercare: [
      {
        title: 'Proofing follows control, not the other way round',
        text: 'Sealing an active structure can leave animals inside with no way out, which creates an odour problem and often more damage. Follow the recommended sequence even when it feels slow.',
      },
      {
        title: 'Handle droppings carefully',
        text: 'Do not sweep or dry-vacuum droppings or nesting material — that puts particles into the air. Ventilate the space first, dampen the area, and use gloves. Ask the technician for the correct method for your situation.',
      },
      {
        title: 'Expect some noise to continue briefly',
        text: 'Activity does not stop the moment a visit ends, particularly with wary species. Report what you hear and when, rather than assuming nothing is happening.',
      },
      {
        title: 'Monitoring closes it out',
        text: 'The work is finished when there is no fresh evidence, not when the last visit happened. Agree what will be checked and over what period.',
      },
    ],

    faqs: [
      {
        question: 'Can you seal every entry point immediately?',
        answer:
          'Timing depends on the species and the level of activity. Sealing too early can trap animals inside the building, which creates a worse problem than the one you started with. Follow the recommended sequence.',
      },
      {
        question: 'Are baits safe around children and pets?',
        answer:
          'Products and placement must follow their label and local rules, and that judgement belongs to the licensed technician attending. Tell them about children, pets, livestock and sensitive areas before anything is placed, and ask what has been used and where.',
      },
      {
        question: 'How did they get in?',
        answer:
          'Usually through several small openings rather than one obvious one — service penetrations, air bricks, eaves, gaps under doors and defective drainage. A young mouse needs roughly a pencil-width gap.',
      },
      {
        question: 'Why am I still hearing noise after a visit?',
        answer:
          'Some species are cautious of anything new and may take days to interact with control measures, and activity tails off rather than stopping abruptly. Keep a note of what you hear and when, and report it — that record genuinely helps.',
      },
      {
        question: 'Is it a health risk?',
        answer:
          'Rodents can contaminate food and surfaces, and droppings and urine carry recognised risks, which is why the cleaning method matters. Gnawed electrical cabling is a separate and serious hazard worth checking for.',
      },
      {
        question: 'Do I need to throw all my food away?',
        answer:
          'Anything gnawed, opened or contaminated should go. Sealed, intact packaging is usually fine. Moving dry goods into hard sealed containers is worth doing regardless, since cardboard and plastic film are not barriers.',
      },
      {
        question: 'Can I just use traps from a shop?',
        answer:
          'They have a place, particularly for a single mouse, but placement, sequence and proofing are what decide the outcome. If activity persists past a couple of weeks, or you are hearing noise inside the structure, it is worth getting it looked at properly.',
      },
    ],
  },
};
