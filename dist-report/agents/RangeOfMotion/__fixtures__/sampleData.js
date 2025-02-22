"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleJointData = exports.sampleShoulderData = void 0;
exports.sampleShoulderData = {
    joint: 'shoulder',
    movement: 'flexion',
    active: {
        right: 90,
        left: 160,
        normal: 180
    },
    passive: {
        right: 100,
        left: 170
    },
    painScale: {
        right: 6,
        left: 2
    },
    notes: "Limited by pain on right"
};
exports.sampleJointData = {
    functionalAssessment: {
        rangeOfMotion: {
            shoulder: [
                exports.sampleShoulderData,
                {
                    joint: 'shoulder',
                    movement: 'abduction',
                    active: {
                        right: 85,
                        left: 170,
                        normal: 180
                    },
                    passive: {
                        right: 95,
                        left: 175
                    },
                    painScale: {
                        right: 7,
                        left: 1
                    }
                }
            ],
            cervical: [
                {
                    joint: 'cervical',
                    movement: 'rotation',
                    active: {
                        right: 40,
                        left: 65,
                        normal: 80
                    },
                    painScale: {
                        right: 4,
                        left: 2
                    }
                }
            ]
        }
    }
};
