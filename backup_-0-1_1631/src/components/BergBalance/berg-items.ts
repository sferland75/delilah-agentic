export const BERG_ITEMS = [
  {
    id: 'sittingToStanding',
    title: 'Sitting to Standing',
    instruction: 'Please stand up. Try not to use your hands for support.',
    scores: [
      { value: 4, label: '4 - Able to stand without using hands and stabilize independently' },
      { value: 3, label: '3 - Able to stand independently using hands' },
      { value: 2, label: '2 - Able to stand using hands after several tries' },
      { value: 1, label: '1 - Needs minimal aid to stand or to stabilize' },
      { value: 0, label: '0 - Needs moderate or maximal assist to stand' }
    ]
  },
  {
    id: 'standingUnsupported',
    title: 'Standing Unsupported',
    instruction: 'Please stand for 2 minutes without holding.',
    scores: [
      { value: 4, label: '4 - Able to stand safely 2 minutes' },
      { value: 3, label: '3 - Able to stand 2 minutes with supervision' },
      { value: 2, label: '2 - Able to stand 30 seconds unsupported' },
      { value: 1, label: '1 - Needs several tries to stand 30 seconds unsupported' },
      { value: 0, label: '0 - Unable to stand 30 seconds unassisted' }
    ]
  },
  {
    id: 'sittingUnsupported',
    title: 'Sitting Unsupported',
    instruction: 'Please sit with arms folded for 2 minutes.',
    scores: [
      { value: 4, label: '4 - Able to sit safely and securely 2 minutes' },
      { value: 3, label: '3 - Able to sit 2 minutes under supervision' },
      { value: 2, label: '2 - Able to sit 30 seconds' },
      { value: 1, label: '1 - Able to sit 10 seconds' },
      { value: 0, label: '0 - Unable to sit without support 10 seconds' }
    ]
  },
  {
    id: 'standingToSitting',
    title: 'Standing to Sitting',
    instruction: 'Please sit down.',
    scores: [
      { value: 4, label: '4 - Sits safely with minimal use of hands' },
      { value: 3, label: '3 - Controls descent by using hands' },
      { value: 2, label: '2 - Uses back of legs against chair to control descent' },
      { value: 1, label: '1 - Sits independently but has uncontrolled descent' },
      { value: 0, label: '0 - Needs assistance to sit' }
    ]
  },
  {
    id: 'transfers',
    title: 'Transfers',
    instruction: 'Arrange chairs for pivot transfer. Ask subject to transfer one way toward a seat with armrests and one way toward a seat without armrests.',
    scores: [
      { value: 4, label: '4 - Able to transfer safely with minor use of hands' },
      { value: 3, label: '3 - Able to transfer safely with definite need of hands' },
      { value: 2, label: '2 - Able to transfer with verbal cueing and/or supervision' },
      { value: 1, label: '1 - Needs one person to assist' },
      { value: 0, label: '0 - Needs two people to assist or supervise to be safe' }
    ]
  },
  {
    id: 'standingEyesClosed',
    title: 'Standing Unsupported with Eyes Closed',
    instruction: 'Please close your eyes and stand still for 10 seconds.',
    scores: [
      { value: 4, label: '4 - Able to stand 10 seconds safely' },
      { value: 3, label: '3 - Able to stand 10 seconds with supervision' },
      { value: 2, label: '2 - Able to stand 3 seconds' },
      { value: 1, label: '1 - Unable to keep eyes closed 3 seconds but stays steady' },
      { value: 0, label: '0 - Needs help to keep from falling' }
    ]
  },
  {
    id: 'standingFeetTogether',
    title: 'Standing Unsupported with Feet Together',
    instruction: 'Place your feet together and stand without holding.',
    scores: [
      { value: 4, label: '4 - Able to place feet together independently and stand 1 minute safely' },
      { value: 3, label: '3 - Able to place feet together independently and stand 1 minute with supervision' },
      { value: 2, label: '2 - Able to place feet together independently but unable to hold for 30 seconds' },
      { value: 1, label: '1 - Needs help to attain position but able to stand 15 seconds with feet together' },
      { value: 0, label: '0 - Needs help to attain position and unable to hold for 15 seconds' }
    ]
  },
  {
    id: 'reachingForward',
    title: 'Reaching Forward with Outstretched Arm',
    instruction: 'Lift arm to 90 degrees. Stretch out your fingers and reach forward as far as you can.',
    scores: [
      { value: 4, label: '4 - Can reach forward confidently >25 cm (10 inches)' },
      { value: 3, label: '3 - Can reach forward >12.5 cm safely (5 inches)' },
      { value: 2, label: '2 - Can reach forward >5 cm safely (2 inches)' },
      { value: 1, label: '1 - Reaches forward but needs supervision' },
      { value: 0, label: '0 - Loses balance while trying/requires external support' }
    ]
  },
  {
    id: 'retrieveObject',
    title: 'Pick Up Object From Floor',
    instruction: 'Pick up the shoe/slipper which is placed in front of your feet.',
    scores: [
      { value: 4, label: '4 - Able to pick up slipper safely and easily' },
      { value: 3, label: '3 - Able to pick up slipper but needs supervision' },
      { value: 2, label: '2 - Unable to pick up but reaches 2-5cm from slipper and keeps balance' },
      { value: 1, label: '1 - Unable to pick up and needs supervision while trying' },
      { value: 0, label: '0 - Unable to try/needs assist to keep from losing balance' }
    ]
  },
  {
    id: 'turningToLookBehind',
    title: 'Turning to Look Behind',
    instruction: 'Turn to look behind you over your left shoulder. Repeat to the right.',
    scores: [
      { value: 4, label: '4 - Looks behind from both sides and weight shifts well' },
      { value: 3, label: '3 - Looks behind one side only, other side shows less weight shift' },
      { value: 2, label: '2 - Turns sideways only but maintains balance' },
      { value: 1, label: '1 - Needs supervision when turning' },
      { value: 0, label: '0 - Needs assist to keep from losing balance or falling' }
    ]
  },
  {
    id: 'turn360',
    title: 'Turn 360 Degrees',
    instruction: 'Turn completely around in a full circle. Pause. Then turn a full circle in the other direction.',
    scores: [
      { value: 4, label: '4 - Able to turn 360 degrees safely in 4 seconds or less' },
      { value: 3, label: '3 - Able to turn 360 degrees safely one side only in 4 seconds or less' },
      { value: 2, label: '2 - Able to turn 360 degrees safely but slowly' },
      { value: 1, label: '1 - Needs close supervision or verbal cueing' },
      { value: 0, label: '0 - Needs assistance while turning' }
    ]
  },
  {
    id: 'alternateFootOnStep',
    title: 'Placing Alternate Foot on Step',
    instruction: 'Place each foot alternately on the step. Continue until each foot has touched the step 4 times.',
    scores: [
      { value: 4, label: '4 - Able to stand independently and safely and complete 8 steps in 20 seconds' },
      { value: 3, label: '3 - Able to stand independently and complete 8 steps in >20 seconds' },
      { value: 2, label: '2 - Able to complete 4 steps without aid with supervision' },
      { value: 1, label: '1 - Able to complete >2 steps needs minimal assist' },
      { value: 0, label: '0 - Needs assistance to keep from falling/unable to try' }
    ]
  },
  {
    id: 'tandemStance',
    title: 'Standing Unsupported One Foot in Front',
    instruction: 'Place one foot directly in front of the other. If you feel you cannot place your foot directly in front, try to step far enough ahead that the heel of your forward foot is ahead of the toes of the other foot.',
    scores: [
      { value: 4, label: '4 - Able to place foot tandem independently and hold 30 seconds' },
      { value: 3, label: '3 - Able to place foot ahead of other independently and hold 30 seconds' },
      { value: 2, label: '2 - Able to take small step independently and hold 30 seconds' },
      { value: 1, label: '1 - Needs help to step but can hold 15 seconds' },
      { value: 0, label: '0 - Loses balance while stepping or standing' }
    ]
  },
  {
    id: 'standingOnOneLeg',
    title: 'Standing on One Leg',
    instruction: 'Stand on one leg as long as you can without holding.',
    scores: [
      { value: 4, label: '4 - Able to lift leg independently and hold >10 seconds' },
      { value: 3, label: '3 - Able to lift leg independently and hold 5-10 seconds' },
      { value: 2, label: '2 - Able to lift leg independently and hold ≥3 seconds' },
      { value: 1, label: '1 - Tries to lift leg unable to hold 3 seconds but remains standing independently' },
      { value: 0, label: '0 - Unable to try or needs assist to prevent fall' }
    ]
  }
] as const;

// Define default values - all items start at maximum score (4)
export const createDefaultBergItem = () => ({
  score: 4,
  notes: 'No identified limitations.'
});

// Create default values object with all items
export const DEFAULT_BERG_VALUES = BERG_ITEMS.reduce((acc, item) => {
  acc[item.id] = createDefaultBergItem();
  return acc;
}, {} as Record<string, { score: number; notes: string }>);

// Add general notes field
export const DEFAULT_BERG_ASSESSMENT = {
  items: DEFAULT_BERG_VALUES,
  generalNotes: 'No identified limitations.',
  totalScore: 56  // Perfect score to start
} as const;