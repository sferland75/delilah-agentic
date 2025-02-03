import { AssessmentData } from '../../../../../types/assessment';
import { formatIndependenceLevel } from '../adl/basicADL';

export const generateForm1Section = (data: AssessmentData) => {
  const { basic } = data.assessment.adl;
  
  const bathing = {
    independence: formatIndependenceLevel(basic.bathing?.shower?.independence),
    notes: basic.bathing?.shower?.notes ?? "Not assessed"
  };

  const dressing = {
    independence: formatIndependenceLevel(basic.dressing?.lower_body?.independence),
    notes: basic.dressing?.lower_body?.notes ?? "Not assessed"
  };

  return {
    bathing,
    dressing
  };
};
