export const DEFAULT_TRANSFER_VALUES = {
  bed_mobility: {
    supine_to_sit: {
      level: "independent",
      notes: "Observed during functional mobility assessment. Demonstrates proper technique using log roll method. Maintains proper spine alignment. No apparent difficulty or hesitation noted. Reports consistent performance at home."
    },
    rolling: {
      level: "independent",
      notes: "Demonstrates full range of motion and control during rolling. Uses appropriate technique and body mechanics. No increased pain or limitations reported with movement."
    },
    repositioning: {
      level: "independent",
      notes: "Able to adjust position in bed independently. Uses appropriate upper extremity support when needed. Reports ability to reposition during night as needed without difficulty."
    }
  },
  bed_transfers: {
    sit_to_stand: {
      level: "independent",
      notes: "Observed multiple sit-to-stand transfers during assessment. Uses proper body mechanics and demonstrates good eccentric control. No upper extremity assistance required. Natural movement pattern noted."
    },
    stand_to_sit: {
      level: "independent",
      notes: "Controlled descent observed. Maintains proper alignment and weight distribution. No loss of balance or need for external support. Reports consistent performance throughout day."
    }
  },
  toilet_transfers: {
    approach: {
      level: "independent",
      notes: "Not directly observed but self-reports independent toilet approach. Able to navigate bathroom space without difficulty. No environmental modifications required."
    },
    lowering: {
      level: "independent",
      notes: "Self-reported ability to lower to toilet height safely. Denies any difficulty with controlled descent. No grab bar requirements identified. Consistent with observed functional mobility level."
    },
    rising: {
      level: "independent",
      notes: "Reports independent rising from toilet height. Consistent with demonstrated sit-to-stand performance during assessment. No assistive devices or modifications required."
    }
  },
  shower_transfers: {
    shower_entry: {
      level: "independent",
      notes: "Reports independent shower entry. Describes appropriate technique over threshold. No balance issues reported with wet surfaces. Home setup includes non-slip mat for safety."
    },
    shower_exit: {
      level: "independent",
      notes: "Self-reports safe shower exit technique. Uses bath mat for drying feet before stepping out. No history of slips or near-falls reported. Consistent with observed balance abilities."
    },
    bath_entry: {
      level: "independent",
      notes: "Reports infrequent bath use but maintains ability to enter/exit safely when chosen. Describes appropriate technique using side of tub for support as needed. No assistance required."
    }
  },
  car_transfers: {
    car_entry: {
      level: "independent",
      notes: "Observed during arrival to assessment. Demonstrates smooth entry technique with appropriate sequencing. Uses door frame for support as needed. Reports consistent performance with various vehicle heights."
    },
    car_exit: {
      level: "independent",
      notes: "Demonstrated during departure. Shows proper technique leading with legs. Good weight-bearing control and balance. No difficulty noted with seat height. Reports ability to manage various vehicle types."
    }
  }
} as const;