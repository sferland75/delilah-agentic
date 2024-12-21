# Assessment Report

## Client Information
Client ID: {{client_id}}
Assessment Date: {{date}}
Assessment Type: {{assessment_type}}

## Summary
{{summary}}

## Risk Assessment
Overall Risk Level: {{risk_level}}

{% for area, risk in risk_areas.items() %}
### {{area}}
- Risk Level: {{risk.level}}
- Key Findings: {{risk.findings}}
{% endfor %}

## Recommendations
{% for rec in recommendations %}
- {{rec}}
{% endfor %}

## Follow-up Plan
{% if follow_up_needed %}
Follow-up Required: Yes
Recommended Timeline: {{follow_up_timeline}}
Special Instructions: {{follow_up_instructions}}
{% else %}
Follow-up Required: No
Regular Care Plan: Continue with standard care schedule
{% endif %}

## Notes
{{additional_notes}}