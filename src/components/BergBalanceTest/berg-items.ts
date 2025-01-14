export const bergItems = [
  {
    id: 1,
    title: "Sitting to Standing",
    description: "Instructions: Please stand up. Try not to use your hands for support.",
    scoring: [
      { score: 4, criteria: "Able to stand without using hands and stabilize independently" },
      { score: 3, criteria: "Able to stand independently using hands" },
      { score: 2, criteria: "Able to stand using hands after several tries" },
      { score: 1, criteria: "Needs minimal aid to stand or to stabilize" },
      { score: 0, criteria: "Needs moderate or maximal assist to stand" }
    ]
  },
  {
    id: 2,
    title: "Standing Unsupported",
    description: "Instructions: Please stand for two minutes without holding.",
    scoring: [
      { score: 4, criteria: "Able to stand safely 2 minutes" },
      { score: 3, criteria: "Able to stand 2 minutes with supervision" },
      { score: 2, criteria: "Able to stand 30 seconds unsupported" },
      { score: 1, criteria: "Needs several tries to stand 30 seconds unsupported" },
      { score: 0, criteria: "Unable to stand 30 seconds unassisted" }
    ]
  },
  {
    id: 3,
    title: "Sitting Unsupported",
    description: "Instructions: Please sit with arms folded for 2 minutes.",
    scoring: [
      { score: 4, criteria: "Able to sit safely and securely 2 minutes" },
      { score: 3, criteria: "Able to sit 2 minutes under supervision" },
      { score: 2, criteria: "Able to sit 30 seconds" },
      { score: 1, criteria: "Able to sit 10 seconds" },
      { score: 0, criteria: "Unable to sit without support 10 seconds" }
    ]
  },
  {
    id: 4,
    title: "Standing to Sitting",
    description: "Instructions: Please sit down.",
    scoring: [
      { score: 4, criteria: "Sits safely with minimal use of hands" },
      { score: 3, criteria: "Controls descent by using hands" },
      { score: 2, criteria: "Uses back of legs against chair to control descent" },
      { score: 1, criteria: "Sits independently but has uncontrolled descent" },
      { score: 0, criteria: "Needs assistance to sit" }
    ]
  },
  {
    id: 5,
    title: "Transfers",
    description: "Instructions: Arrange chairs for pivot transfer. Ask subject to transfer one way toward a seat with armrests and one way toward a seat without armrests.",
    scoring: [
      { score: 4, criteria: "Able to transfer safely with minor use of hands" },
      { score: 3, criteria: "Able to transfer safely definite need of hands" },
      { score: 2, criteria: "Able to transfer with verbal cueing and/or supervision" },
      { score: 1, criteria: "Needs one person to assist" },
      { score: 0, criteria: "Needs two people to assist or supervise to be safe" }
    ]
  },
  {
    id: 6,
    title: "Standing with Eyes Closed",
    description: "Instructions: Please close your eyes and stand still for 10 seconds.",
    scoring: [
      { score: 4, criteria: "Able to stand 10 seconds safely" },
      { score: 3, criteria: "Able to stand 10 seconds with supervision" },
      { score: 2, criteria: "Able to stand 3 seconds" },
      { score: 1, criteria: "Unable to keep eyes closed 3 seconds but stays steady" },
      { score: 0, criteria: "Needs help to keep from falling" }
    ]
  },
  {
    id: 7,
    title: "Standing with Feet Together",
    description: "Instructions: Place your feet together and stand without holding.",
    scoring: [
      { score: 4, criteria: "Able to place feet together independently and stand 1 minute safely" },
      { score: 3, criteria: "Able to place feet together independently and stand for 1 minute with supervision" },
      { score: 2, criteria: "Able to place feet together independently but unable to hold for 30 seconds" },
      { score: 1, criteria: "Needs help to attain position but able to stand 15 seconds with feet together" },
      { score: 0, criteria: "Needs help to attain position and unable to hold for 15 seconds" }
    ]
  },
  {
    id: 8,
    title: "Reaching Forward with Outstretched Arm",
    description: "Instructions: Lift arm to 90 degrees. Stretch out your fingers and reach forward as far as you can.",
    scoring: [
      { score: 4, criteria: "Can reach forward confidently >25 cm (10 inches)" },
      { score: 3, criteria: "Can reach forward >12.5 cm safely (5 inches)" },
      { score: 2, criteria: "Can reach forward >5 cm safely (2 inches)" },
      { score: 1, criteria: "Reaches forward but needs supervision" },
      { score: 0, criteria: "Loses balance while trying/requires external support" }
    ]
  },
  {
    id: 9,
    title: "Pick Up Object From Floor",
    description: "Instructions: Pick up the shoe/slipper which is placed in front of your feet.",
    scoring: [
      { score: 4, criteria: "Able to pick up slipper safely and easily" },
      { score: 3, criteria: "Able to pick up slipper but needs supervision" },
      { score: 2, criteria: "Unable to pick up but reaches 2-5cm from slipper and keeps balance" },
      { score: 1, criteria: "Unable to pick up and needs supervision while trying" },
      { score: 0, criteria: "Unable to try/needs assist to keep from losing balance" }
    ]
  },
  {
    id: 10,
    title: "Turning to Look Behind",
    description: "Instructions: Turn to look behind you over your left shoulder. Repeat to the right.",
    scoring: [
      { score: 4, criteria: "Looks behind from both sides and weight shifts well" },
      { score: 3, criteria: "Looks behind one side only other side shows less weight shift" },
      { score: 2, criteria: "Turns sideways only but maintains balance" },
      { score: 1, criteria: "Needs supervision when turning" },
      { score: 0, criteria: "Needs assist to keep from losing balance or falling" }
    ]
  },
  {
    id: 11,
    title: "Turn 360 Degrees",
    description: "Instructions: Turn completely around in a full circle. Pause. Then turn a full circle in the other direction.",
    scoring: [
      { score: 4, criteria: "Able to turn 360 degrees safely in 4 seconds or less" },
      { score: 3, criteria: "Able to turn 360 degrees safely one side only in 4 seconds or less" },
      { score: 2, criteria: "Able to turn 360 degrees safely but slowly" },
      { score: 1, criteria: "Needs close supervision or verbal cueing" },
      { score: 0, criteria: "Needs assistance while turning" }
    ]
  },
  {
    id: 12,
    title: "Placing Alternate Foot on Step/Stool",
    description: "Instructions: Place each foot alternately on the step/stool. Continue until each foot has touched the step/stool four times.",
    scoring: [
      { score: 4, criteria: "Able to stand independently and safely and complete 8 steps in 20 seconds" },
      { score: 3, criteria: "Able to stand independently and complete 8 steps in >20 seconds" },
      { score: 2, criteria: "Able to complete 4 steps without aid with supervision" },
      { score: 1, criteria: "Able to complete >2 steps needs minimal assist" },
      { score: 0, criteria: "Needs assistance to keep from falling/unable to try" }
    ]
  },
  {
    id: 13,
    title: "Standing with One Foot in Front",
    description: "Instructions: (DEMONSTRATE) Place one foot directly in front of the other. If you feel that you cannot place your foot directly in front, try to step far enough ahead that the heel of your forward foot is ahead of the toes of the other foot.",
    scoring: [
      { score: 4, criteria: "Able to place foot tandem independently and hold 30 seconds" },
      { score: 3, criteria: "Able to place foot ahead of other independently and hold 30 seconds" },
      { score: 2, criteria: "Able to take small step independently and hold 30 seconds" },
      { score: 1, criteria: "Needs help to step but can hold 15 seconds" },
      { score: 0, criteria: "Loses balance while stepping or standing" }
    ]
  },
  {
    id: 14,
    title: "Standing on One Leg",
    description: "Instructions: Stand on one leg as long as you can without holding.",
    scoring: [
      { score: 4, criteria: "Able to lift leg independently and hold >10 seconds" },
      { score: 3, criteria: "Able to lift leg independently and hold 5-10 seconds" },
      { score: 2, criteria: "Able to lift leg independently and hold ≥ 3 seconds" },
      { score: 1, criteria: "Tries to lift leg unable to hold 3 seconds but remains standing" },
      { score: 0, criteria: "Unable to try or needs assist to prevent fall" }
    ]
  }
];