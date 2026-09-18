/**
 * Copy for the roofing, gardening and plumbing landing pages.
 *
 * Split out of site.js, which was carrying the business configuration and every
 * word of page content in one 533-line file.
 *
 * A note on what is and is not in here, because it is the difference between a
 * landing page that runs and one that gets an ad account suspended:
 *
 *  · Nothing claims a licence, certification, insurance, guarantee, rating,
 *    review, job count or years in business. None of that can be evidenced from
 *    here, so none of it is written.
 *  · No prices, discounts or response times. `factors` explains what moves a
 *    price without ever naming one — which is the honest and the useful answer,
 *    since the contractor sets it.
 *  · The operator is a platform. Copy says the contractor inspects, quotes and
 *    carries out the work, never "we" or "our technicians".
 *  · Everything else is general, checkable guidance of the kind a homeowner
 *    actually needs before a first phone call.
 */

export const SERVICE_DETAILS = {
  roofing: {
    slug: 'roofing',
    eyebrow: 'Roof inspections & repairs',
    title: 'Straightforward help for the roof over your head.',
    summary:
      'Tell us what you have noticed. We will connect you with a local roofing contractor who can explain the next sensible step, their availability and what they need in order to estimate the work.',
    image: '/images/roofing-service.webp',
    imageAlt: 'Roofing professionals safely inspecting a residential roof',
    highlights: ['Leak investigation', 'Shingle and tile repair', 'Routine roof checks', 'Gutter-related issues'],

    signs: [
      {
        title: 'Water marks',
        text: 'Stains on a ceiling or wall can indicate water entering from above. The stain is rarely directly beneath the entry point — water travels along rafters and decking before it drops, so the source is often several feet away.',
      },
      {
        title: 'Missing materials',
        text: 'Loose, slipped or missing roof coverings should be assessed before damage spreads. One displaced shingle exposes the underlayment beneath it, and that layer is not designed to be the outer surface for long.',
      },
      {
        title: 'Visible wear',
        text: 'Cracked flashing, damaged edges and persistent debris may deserve a closer look. Flashing around chimneys, valleys and vents fails more often than the field of the roof itself, because that is where movement and water concentrate.',
      },
      {
        title: 'Granules in the gutters',
        text: 'Asphalt shingles shed their mineral surface as they age. A heavy accumulation of grit in gutters or at downspout outlets suggests the covering is late in its life rather than damaged in one spot.',
      },
      {
        title: 'Daylight or damp in the loft',
        text: 'If the roof space is accessible, daylight through the boards, damp insulation or a musty smell after rain all point upward. This is usually the safest place for a homeowner to gather useful information.',
      },
      {
        title: 'Sagging or uneven lines',
        text: 'A ridge or slope that has stopped looking straight can indicate a structural issue rather than a surface one. This is worth describing on the call, because it changes who needs to attend and what equipment they bring.',
      },
    ],

    /* What an inspection typically covers. Deliberately "typically" — scope is
       the contractor's to set, and access dictates a lot of it. */
    included: [
      'The roof surface, where it can be reached safely',
      'Flashing at chimneys, valleys, vents and abutments',
      'Gutters, downspouts and how water leaves the roof',
      'Visible decking, rafters and insulation from inside the roof space',
      'The reported symptom, traced back towards its likely source',
      'A plain explanation of what was found and the options that follow',
    ],

    /* What moves the price, without naming one. */
    factors: [
      {
        title: 'Access and height',
        text: 'A single-storey roof reachable from a ladder is a different job from a third-storey one needing scaffolding or a lift. Access is often the largest single variable and is settled before anyone quotes.',
      },
      {
        title: 'Pitch and walkability',
        text: 'A steep roof cannot be walked safely without fall protection, which adds setup time and equipment to the same square footage of work.',
      },
      {
        title: 'Covering material',
        text: 'Asphalt shingle, clay or concrete tile, slate, metal and flat membrane each behave differently, cost differently and need different skills. Matching an existing material on an older roof can be harder than replacing an area outright.',
      },
      {
        title: 'What is under the surface',
        text: 'Decking that has been wet for a long time may need replacing, and that is usually not visible until the covering comes off. A good contractor tells you this is a possibility before starting rather than after.',
      },
      {
        title: 'Extent, not just severity',
        text: 'One failed flashing detail and a covering that has reached the end of its life can leak identically. The repair is not remotely the same, which is why a look beats a phone diagnosis.',
      },
      {
        title: 'Local requirements and disposal',
        text: 'Permits, inspections and tear-off disposal vary by jurisdiction and by the volume of material coming off. These are real line items, not padding.',
      },
    ],

    /* Preparation. Safety first — this is a trade where homeowner curiosity
       causes genuine injuries. */
    prepare: [
      'Note when the problem shows: during rain, after it stops, only in wind, or constantly. That timing narrows the cause considerably.',
      'Photograph what you can see from the ground or from a window. Do not go onto the roof.',
      'Check the roof space if there is safe access, and photograph any damp, staining or daylight.',
      'Find out the roof’s approximate age and whether it has been repaired before, if you know.',
      'Move vehicles and garden furniture away from the working area and note anything fragile below.',
      'Mention overhead power lines, restricted access, a shared or party wall, or anything that limits ladder placement.',
      'Put a container under an active drip and move belongings clear before anyone arrives.',
    ],

    timing: [
      {
        title: 'After a storm',
        text: 'Wind and hail damage is often discovered late because it does not leak immediately. Checking after severe weather is cheaper than discovering it through a ceiling.',
      },
      {
        title: 'Before the wet season',
        text: 'Small defects are easier to find, safer to work on and less disruptive to fix in dry, mild conditions than in the weather that exposes them.',
      },
      {
        title: 'When the covering nears its expected life',
        text: 'Materials have a rough service life. Knowing where a roof sits in that range turns an emergency into a planned decision with time to get comparisons.',
      },
      {
        title: 'Immediately, if water is entering',
        text: 'Active water ingress affects insulation, ceilings, wiring and framing. Containing it and getting an assessment quickly limits what has to be repaired later.',
      },
    ],

    process: [
      {
        number: '01',
        title: 'Call and describe it',
        text: 'Share the location, roof type, the symptom and what you can safely observe. Photographs help.',
      },
      {
        number: '02',
        title: 'Arrange an assessment',
        text: 'The contractor confirms a visit window and what access or equipment the job will need.',
      },
      {
        number: '03',
        title: 'Review the options',
        text: 'You get a clear explanation of what was found, and what each option does and does not address, before authorising anything.',
      },
    ],

    faqs: [
      {
        question: 'Can you quote from a photo?',
        answer:
          'Photos help with an initial discussion and sometimes rule things out, but most roofing issues need an on-site assessment before a reliable price can be given. A number quoted from a photograph tends to change once someone is actually on the roof, which helps nobody.',
      },
      {
        question: 'Do I need to climb onto the roof?',
        answer:
          'No, and please do not. Falls from height are among the most serious home-maintenance injuries there are. Describe or photograph only what you can see from the ground, a window or a safely accessible roof space.',
      },
      {
        question: 'Is every leak a full roof replacement?',
        answer:
          'No. The appropriate response depends on the roof, the defect and the extent of any hidden damage. Plenty of leaks are a single flashing or fixing detail. Be wary of anyone who reaches "full replacement" before looking.',
      },
      {
        question: 'Why is the damp patch not under the hole?',
        answer:
          'Water entering a roof runs along battens, rafters and decking until something stops it, then drops. The visible stain can be several feet from the entry point, and in a different room. This is normal and a large part of why tracing a leak needs access rather than a guess.',
      },
      {
        question: 'Should I claim on my insurance?',
        answer:
          'That depends on your policy, your deductible and the cause. Sudden storm damage is treated very differently from gradual wear, which most policies exclude. Get the assessment first so you know what actually happened, then talk to your insurer before work begins.',
      },
      {
        question: 'How long does a repair take?',
        answer:
          'A contained repair is often a single visit. Anything involving scaffolding, material ordering, decking replacement or a permit takes longer. Ask for the expected duration and what happens if weather interrupts, and get it in the written scope.',
      },
      {
        question: 'What happens if it rains partway through the work?',
        answer:
          'A roof opened up for work should be temporarily covered and made watertight at the end of each day or when weather turns. Ask how that will be handled before work starts — it is a reasonable question and a straight answer is a good sign.',
      },
    ],

    note: 'Roofing availability, scope and pricing depend on access, roof condition, materials and local requirements. Work at height and any structural repair should only be carried out by appropriately qualified people, and licensing rules differ by state, county and municipality.',
  },

  gardening: {
    slug: 'gardening',
    eyebrow: 'Garden care',
    title: 'A tidier, healthier outdoor space—without the guesswork.',
    summary:
      'From regular upkeep to a seasonal reset, call to discuss your garden and what you want prioritised. We will connect you with a local contractor who can set out a realistic plan.',
    image: '/images/gardening-service.webp',
    imageAlt: 'A professional gardener trimming a hedge in a residential garden',
    highlights: ['Lawn and border care', 'Hedge trimming', 'Garden tidy-ups', 'Seasonal maintenance'],

    signs: [
      {
        title: 'Overgrown edges',
        text: 'Beds, pathways and boundaries lose definition quickly without routine care. Edges are what make a garden read as maintained, which is why a tidy-up often looks like more work than it was.',
      },
      {
        title: 'Seasonal build-up',
        text: 'Leaves, spent growth and debris may need a focused clearance. Left on a lawn over winter, fallen leaves block light and encourage disease in the grass beneath.',
      },
      {
        title: 'Limited time',
        text: 'A planned maintenance schedule keeps a garden manageable year-round and is usually less work in total than repeated rescues from the same overgrown state.',
      },
      {
        title: 'Hedges outgrowing their space',
        text: 'A hedge left beyond its intended size is harder to bring back, because many species will not regenerate from bare old wood. Regular trimming keeps the option open.',
      },
      {
        title: 'Patchy or struggling lawn',
        text: 'Bare areas, moss or thinning grass usually point at compaction, shade, drainage or mowing height rather than a need for more feed. Worth diagnosing before treating.',
      },
      {
        title: 'Preparing to sell or let',
        text: 'Outdoor space is one of the first things a viewer forms an opinion about, and a tidy-up is among the cheaper interventions available before listing.',
      },
    ],

    included: [
      'Mowing, and edging to beds, paths and boundaries',
      'Weeding of beds and hard surfaces',
      'Hedge and shrub trimming within safe reach from the ground',
      'Pruning appropriate to the species and the season',
      'Leaf and debris clearance',
      'Removal of green waste, where that has been agreed in the scope',
    ],

    factors: [
      {
        title: 'Plot size and layout',
        text: 'Total area matters less than complexity. A plain rectangle of lawn is quick; the same area broken into beds, levels, steps and narrow paths is not.',
      },
      {
        title: 'Access',
        text: 'Gate width, steps, and whether there is rear access or everything has to come through the house all change how long a visit takes — especially when waste has to come out.',
      },
      {
        title: 'How overgrown it is',
        text: 'A garden maintained every fortnight is a different job from one untouched for two seasons. The first visit after a long gap is usually the longest.',
      },
      {
        title: 'Green waste volume',
        text: 'Disposal is charged by volume and is a real cost. A hedge reduction can generate far more material than its appearance suggests.',
      },
      {
        title: 'Frequency',
        text: 'Recurring visits are generally quicker each time than one-off rescues, because the work never gets ahead of the schedule.',
      },
      {
        title: 'What the work actually needs',
        text: 'Tree work, anything requiring a chainsaw at height, stump removal and work near power lines are specialist jobs with their own qualifications, and not every contractor offers them.',
      },
    ],

    prepare: [
      'Walk the garden and decide what matters most, so the first visit is spent on your priorities rather than guessed ones.',
      'Mark or mention any plant you do not want cut back. Assume nothing is obvious to someone seeing it for the first time.',
      'Clear toys, furniture, pots and anything fragile from the areas to be worked on.',
      'Secure pets indoors, and mention any pet waste so it can be handled safely.',
      'Point out irrigation lines, cables, lighting, septic covers and anything buried that a spade could find.',
      'Confirm whether green-waste removal is included before the visit, not after.',
      'Say if a boundary is shared — a hedge or tree on a line may need a conversation with a neighbour first.',
    ],

    timing: [
      {
        title: 'Early spring',
        text: 'Cut back, feed and prepare beds before growth accelerates. Getting ahead here makes the rest of the year considerably easier.',
      },
      {
        title: 'Through summer',
        text: 'Regular mowing, edging and watering guidance. Keeping to a rhythm prevents the mid-season point where everything gets away at once.',
      },
      {
        title: 'Autumn',
        text: 'Leaf clearance, cutting back spent growth and preparing for dormancy. Leaves left on a lawn over winter do real damage.',
      },
      {
        title: 'Winter',
        text: 'Structural pruning on dormant species, hard-surface clearance and planning. Many shrubs and fruit trees prefer to be cut in this window, and it is easier to see a garden’s bones.',
      },
    ],

    process: [
      {
        number: '01',
        title: 'Talk through the garden',
        text: 'Tell us the approximate size, the access, and the work you want prioritised.',
      },
      {
        number: '02',
        title: 'Confirm the scope',
        text: 'Agree access, green-waste expectations, frequency and the proposed visit with the contractor.',
      },
      {
        number: '03',
        title: 'Care and tidy',
        text: 'The agreed tasks are completed and the work area is left orderly.',
      },
    ],

    faqs: [
      {
        question: 'Do you offer one-off visits?',
        answer:
          'One-off and recurring options may both be available depending on the contractor and your location. Call to check what is offered near you. A one-off reset followed by a regular schedule is a common and sensible arrangement.',
      },
      {
        question: 'Is green-waste removal included?',
        answer:
          'That depends on the agreed scope. Disposal is charged by volume and is a genuine cost, so confirm it before booking rather than assuming either way. If you have your own green bin or compost, say so — it may reduce the quote.',
      },
      {
        question: 'Can work continue in poor weather?',
        answer:
          'Some tasks can. Others get rescheduled, either for safety or to avoid harming the garden — mowing saturated ground compacts the soil and tears the grass rather than cutting it.',
      },
      {
        question: 'Do I need to be home?',
        answer:
          'Usually not, provided there is access and the scope is agreed in advance. For a first visit it helps to be there for the first ten minutes so you can point things out in person.',
      },
      {
        question: 'How often should a garden be maintained?',
        answer:
          'It depends on the planting, the season and the standard you want. Many lawns want cutting every one to two weeks in the growing season and much less outside it. A contractor can suggest a rhythm once they have seen the space.',
      },
      {
        question: 'Can you cut my neighbour’s overhanging branches?',
        answer:
          'Rules on overhanging growth vary by jurisdiction and there are usually limits on what you may cut and what you must do with the cuttings. Trees can also carry preservation orders. Raise it on the call so it can be handled properly rather than becoming a dispute.',
      },
      {
        question: 'Do you handle tree work?',
        answer:
          'Felling, large limb removal and any chainsaw work at height are specialist jobs with their own qualifications and insurance requirements, and are not part of general garden maintenance. Ask when you call so you are matched with someone appropriate.',
      },
    ],

    note: 'Service scope may vary by season, site access, garden condition and local green-waste rules. Tree work, work near power lines and anything requiring a chainsaw at height should only be carried out by appropriately qualified people.',
  },

  plumbing: {
    slug: 'plumbing',
    eyebrow: 'Household plumbing',
    title: 'Clear next steps for everyday plumbing problems.',
    summary:
      'Call with the symptoms and location of the issue. We will connect you with a local plumbing contractor and explain what to do in the meantime.',
    image: '/images/plumbing-service.webp',
    imageAlt: 'A plumbing professional inspecting pipework beneath a kitchen sink',
    highlights: ['Leaks and drips', 'Blocked fixtures', 'Tap and toilet faults', 'Planned maintenance'],

    signs: [
      {
        title: 'Persistent dripping',
        text: 'A small leak wastes a surprising volume of water and can cause damage when left. A tap that drips once a second runs to thousands of litres over a year.',
      },
      {
        title: 'Slow drainage',
        text: 'Recurring slow flow or unpleasant smells may indicate a developing blockage. A drain that has been slow for weeks rarely clears itself and usually gets worse at the least convenient moment.',
      },
      {
        title: 'Unexpected moisture',
        text: 'Damp cabinets, walls or floors should be investigated to locate the source. Water tracks along pipes and joists, so the damp patch is frequently not above or beside the actual leak.',
      },
      {
        title: 'A drop in pressure',
        text: 'Reduced flow at one outlet usually points at that fixture. Reduced flow throughout the property points at something upstream, and occasionally at a leak you have not found yet.',
      },
      {
        title: 'Knocking or banging pipes',
        text: 'Noise when a tap or appliance valve shuts is often water hammer. It is worth resolving, because the pressure surge causing the noise is also working on the joints.',
      },
      {
        title: 'A water bill that has moved',
        text: 'An unexplained increase with no change in usage is one of the more reliable early signs of a concealed leak, sometimes underground or beneath a floor.',
      },
    ],

    included: [
      'Locating the source of the reported symptom rather than treating where it shows',
      'Isolating the affected section so the property can keep its water on where possible',
      'Testing after the work to confirm the fault is actually resolved',
      'An explanation of what failed and what the options are',
      'Advice on anything nearby that is heading the same way',
      'Clearing the work area and making the fixture safe to use',
    ],

    factors: [
      {
        title: 'Access to the pipework',
        text: 'A visible trap under a sink is straightforward. A pipe behind tiling, beneath a floor or in a wall means opening up, and then making good afterwards.',
      },
      {
        title: 'Parts',
        text: 'Common tap and toilet components are usually carried on the van. Older, imported or discontinued fittings may need ordering, which can turn one visit into two.',
      },
      {
        title: 'Urgency',
        text: 'A planned visit in working hours is priced differently from an out-of-hours call-out for an active leak. If it can safely wait, saying so is worth money.',
      },
      {
        title: 'What caused it',
        text: 'A single failed washer is not a system-wide pipe problem. Knowing which one you have needs an inspection, and changes the scope entirely.',
      },
      {
        title: 'Existing damage',
        text: 'Water that has been escaping for a while may have affected cabinetry, flooring or plasterwork. That is usually separate from the plumbing repair itself.',
      },
      {
        title: 'Regulated work',
        text: 'Gas appliances, some water-supply alterations and certain drainage work are restricted to specifically qualified people, with rules that differ by jurisdiction.',
      },
    ],

    prepare: [
      'Find your main shut-off valve now, before you need it. Most people look for it for the first time while standing in water.',
      'Note when the problem started, whether it is constant or intermittent, and whether anything changed just before it.',
      'Clear the cabinet or area under the fixture so it can be reached without unpacking your kitchen.',
      'Photograph the fixture and any visible pipework, including the underside — it helps identify fittings in advance.',
      'Do not pour drain chemicals down a blocked fixture before a visit. They rarely fix a real blockage and make the job hazardous for whoever opens the pipe.',
      'Move anything valuable or absorbent away from the damp area.',
      'If water is actively escaping, isolate the supply and place a container before anything else.',
    ],

    timing: [
      {
        title: 'Right away, if water is escaping',
        text: 'Isolate the supply and get it looked at. Water damage compounds quickly and costs far more to remedy than the plumbing repair that caused it.',
      },
      {
        title: 'Before winter, in cold climates',
        text: 'Insulating exposed pipework and knowing where the shut-off is are worth doing before the first freeze rather than during it.',
      },
      {
        title: 'Before a bathroom or kitchen refit',
        text: 'Understanding the condition of what is behind the units is cheaper before they are installed than after.',
      },
      {
        title: 'Not at all, for a genuine emergency',
        text: 'Flooding you cannot stop, water near electrics, or the smell of gas are not plumbing enquiries. Contact the appropriate emergency service or your utility provider first.',
      },
    ],

    process: [
      {
        number: '01',
        title: 'Describe the fault',
        text: 'Tell us what is affected, when it started and whether water is still flowing.',
      },
      {
        number: '02',
        title: 'Confirm attendance',
        text: 'Discuss the visit window, call-out details and any immediate precautions with the contractor.',
      },
      {
        number: '03',
        title: 'Assess before work',
        text: 'The issue and the proposed work are explained before you decide how to proceed.',
      },
    ],

    faqs: [
      {
        question: 'What should I do during an active leak?',
        answer:
          'If it is safe and you know how, isolate the relevant water supply at the shut-off valve, contain what is escaping, move belongings clear and call for guidance. If water is anywhere near electrics, treat it as an electrical hazard first and contact the appropriate emergency service.',
      },
      {
        question: 'Can you guarantee a price by phone?',
        answer:
          'Not always. The cause often needs inspecting before labour, parts and access requirements are known. A contractor can usually explain their call-out basis and what is likely, and should tell you before the cost changes rather than after.',
      },
      {
        question: 'Do you handle gas work?',
        answer:
          'Only appropriately qualified professionals should perform regulated gas work, and the qualification required differs by jurisdiction. Confirm credentials and local availability when you call. If you can smell gas, leave the property and contact your gas emergency service before anything else.',
      },
      {
        question: 'Where is my main shut-off valve?',
        answer:
          'Commonly where the supply enters the property — under the kitchen sink, in a utility area, near the water heater, or in a basement or crawl space. There is often an exterior stop valve near the boundary as well. Find it on a calm day and make sure it turns.',
      },
      {
        question: 'Will chemical drain cleaner fix a blockage?',
        answer:
          'Rarely, for a real blockage, and it brings problems. It can damage older pipework, it does not remove the obstruction, and it leaves caustic liquid sitting in the pipe for whoever opens it next. Tell the contractor if any has been used.',
      },
      {
        question: 'Why is the damp patch nowhere near the pipes?',
        answer:
          'Water follows pipes, joists and the underside of flooring until something interrupts it, then appears. Tracing it back to the source is much of the work, and is why a visual inspection beats describing where the wet patch is.',
      },
      {
        question: 'Who pays if a leak damaged my floor?',
        answer:
          'The plumbing repair and the resulting damage are usually two separate matters, and the second may involve your property insurer. Photograph everything before work starts, and ask the contractor to note what they found — that record is useful later.',
      },
    ],

    note: 'For flooding you cannot stop, water near electrics, a gas odour or another immediate safety threat, contact the appropriate emergency service or utility provider first. Regulated gas and water-supply work must only be carried out by appropriately qualified people, and the requirements differ by state, county and municipality.',
  },
};
