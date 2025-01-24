export const BERG_TASKS = [
  {
    id: 1,
    title: "Sitting to Standing",
    instructions: "Please stand up. Try not to use your hands for support.",
    scoring: [
      { score: 4, description: "Able to stand without using hands and stabilize independently" },
      { score: 3, description: "Able to stand independently using hands" },
      { score: 2, description: "Able to stand using hands after several tries" },
      { score: 1, description: "Needs minimal aid to stand or to stabilize" },
      { score: 0, description: "Needs moderate or maximal assist to stand" }
    ]
  },
  {
    id: 2,
    title: "Standing Unsupported",
    instructions: "Please stand for 2 minutes without holding.",
    scoring: [
      { score: 4, description: "Able to stand safely 2 minutes" },
      { score: 3, description: "Able to stand 2 minutes with supervision" },
      { score: 2, description: "Able to stand 30 seconds unsupported" },
      { score: 1, description: "Needs several tries to stand 30 seconds unsupported" },
      { score: 0, description: "Unable to stand 30 seconds unassisted" }
    ]
  },
  {
    id: 3,
    title: "Sitting Unsupported",
    instructions: "Please sit with arms folded for 2 minutes.",
    scoring: [
      { score: 4, description: "Able to sit safely and securely 2 minutes" },
      { score: 3, description: "Able to sit 2 minutes under supervision" },
      { score: 2, description: "Able to sit 30 seconds" },
      { score: 1, description: "Able to sit 10 seconds" },
      { score: 0, description: "Unable to sit without support 10 seconds" }
    ]
  },
  {
    id: 4,
    title: "Standing to Sitting",
    instructions: "Please sit down.",
    scoring: [
      { score: 4, description: "Sits safely with minimal use of hands" },
      { score: 3, description: "Controls descent by using hands" },
      { score: 2, description: "Uses back of legs against chair to control descent" },
      { score: 1, description: "Sits independently but has uncontrolled descent" },
      { score: 0, description: "Needs assistance to sit" }
    ]
  },
  {
    id: 5,
    title: "Transfers",
    instructions: "Arrange chairs for pivot transfer. Ask subject to transfer one way toward a seat with armrests and one way toward a seat without armrests.",
    scoring: [
      { score: 4, description: "Able to transfer safely with minor use of hands" },
      { score: 3, description: "Able to transfer safely with definite need of hands" },
      { score: 2, description: "Able to transfer with verbal cueing and/or supervision" },
      { score: 1, description: "Needs one person to assist" },
      { score: 0, description: "Needs two people to assist or supervise to be safe" }
    ]
  },
  {
    id: 6,
    title: "Standing Unsupported with Eyes Closed",
    instructions: "Please close your eyes and stand still for 10 seconds.",
    scoring: [
      { score: 4, description: "Able to stand 10 seconds safely" },
      { score: 3, description: "Able to stand 10 seconds with supervision" },
      { score: 2, description: "Able to stand 3 seconds" },
      { score: 1, description: "Unable to keep eyes closed 3 seconds but stays steady" },
      { score: 0, description: "Needs help to keep from falling" }
    ]
  },
  {
    id: 7,
    title: "Standing Unsupported with Feet Together",
    instructions: "Place your feet together and stand without holding.",
    scoring: [
      { score: 4, description: "Able to place feet together independently and stand 1 minute safely" },
      { score: 3, description: "Able to place feet together independently and stand 1 minute with supervision" },
      { score: 2, description: "Able to place feet together independently but unable to hold for 30 seconds" },
      { score: 1, description: "Needs help to attain position but able to stand 15 seconds with feet together" },
      { score: 0, description: "Needs help to attain position and unable to hold for 15 seconds" }
    ]
  },
  {
    id: 8,
    title: "Reaching Forward with Outstretched Arm",
    instructions: "Lift arm to 90 degrees. Stretch out your fingers and reach forward as far as you can.",
    scoring: [
      { score: 4, description: "Can reach forward confidently >25 cm (10 inches)" },
      { score: 3, description: "Can reach forward >12.5 cm safely (5 inches)" },
      { score: 2, description: "Can reach forward >5 cm safely (2 inches)" },
      { score: 1, description: "Reaches forward but needs supervision" },
      { score: 0, description: "Loses balance while trying/requires external support" }
    ]
  },
  {
    id: 9,
    title: "Pick Up Object From Floor",
    instructions: "Pick up the shoe/slipper which is placed in front of your feet.",
    scoring: [
      { score: 4, description: "Able to pick up slipper safely and easily" },
      { score: 3, description: "Able to pick up slipper but needs supervision" },
      { score: 2, description: "Unable to pick up but reaches 2-5cm from slipper and keeps balance" },
      { score: 1, description: "Unable to pick up and needs supervision while trying" },
      { score: 0, description: "Unable to try/needs assist to keep from losing balance" }
    ]
  },
  {
    id: 10,
    title: "Turning to Look Behind",
    instructions: "Turn to look behind you over your left shoulder. Repeat to the right.",
    scoring: [
      { score: 4, description: "Looks behind from both sides and weight shifts well" },
      { score: 3, description: "Looks behind one side only, other side shows less weight shift" },
      { score: 2, description: "Turns sideways only but maintains balance" },
      { score: 1, description: "Needs supervision when turning" },
      { score: 0, description: "Needs assist to keep from losing balance or falling" }
    ]
  },
  {
    id: 11,
    title: "Turn 360 Degrees",
    instructions: "Turn completely around in a full circle. Pause. Then turn a full circle in the other direction.",
    scoring: [
      { score: 4, description: "Able to turn 360 degrees safely in 4 seconds or less" },
      { score: 3, description: "Able to turn 360 degrees safely one side only in 4 seconds or less" },
      { score: 2, description: "Able to turn 360 degrees safely but slowly" },
      { score: 1, description: "Needs close supervision or verbal cueing" },
      { score: 0, description: "Needs assistance while turning" }
    ]
  },
  {
    id: 12,
    title: "Placing Alternate Foot on Step",
    instructions: "Place each foot alternately on the step. Continue until each foot has touched the step 4 times.",
    scoring: [
      { score: 4, description: "Able to stand independently and safely and complete 8 steps in 20 seconds" },
      { score: 3, description: "Able to stand independently and complete 8 steps in >20 seconds" },
      { score: 2, description: "Able to complete 4 steps without aid with supervision" },
      { score: 1, description: "Able to complete >2 steps needs minimal assist" },
      { score: 0, description: "Needs assistance to keep from falling/unable to try" }
    ]
  },
  {
    id: 13,
    title: "Standing Unsupported One Foot in Front",
    instructions: "Place one foot directly in front of the other. If you feel you cannot place your foot directly in front, try to step far enough ahead that the heel of your forward foot is ahead of the toes of the other foot.",
    scoring: [
      { score: 4, description: "Able to place foot tandem independently and hold 30 seconds" },
      { score: 3, description: "Able to place foot ahead of other independently and hold 30 seconds" },
      { score: 2, description: "Able to take small step independently and hold 30 seconds" },
      { score: 1, description: "Needs help to step but can hold 15 seconds" },
      { score: 0, description: "Loses balance while stepping or standing" }
    ]
  },
  {
    id: 14,
    title: "Standing on One Leg",
    instructions: "Stand on one leg as long as you can without holding.",
    scoring: [
      { score: 4, description: "Able to lift leg independently and hold >10 seconds" },
      { score: 3, description: "Able to lift leg independently and hold 5-10 seconds" },
      { score: 2, description: "Able to lift leg independently and hold ≥3 seconds" },
      { score: 1, description: "Tries to lift leg unable to hold 3 seconds but remains standing independently" },
      { score: 0, description: "Unable to try or needs assist to prevent fall" }
    ]
  }
];