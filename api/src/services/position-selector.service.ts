import { injectable } from 'inversify';
import { FastPositionAlgorithm } from '../position-algorithms/fast/position-calculator.service';
import { GradientDescentPositionAlgorithm } from '../position-algorithms/gradient-descent/gradient-descent-position.service';
import { PositionAlgorithm } from '../position-algorithms/position-algorithm';
import { RandomPositionAlgorithm } from '../position-algorithms/random/random-position.service';

@injectable()
export class PositionSelectorService {
    constructor(
        private fastPosition: FastPositionAlgorithm,
        private randomPosition: RandomPositionAlgorithm,
        private gradientDescent: GradientDescentPositionAlgorithm,
    ) {}

    private algorithmNameToClass(name: string) {
        switch (name) {
            case 'fast':
                return this.fastPosition;
            case 'random':
                return this.randomPosition;
            case 'gradient-descent':
                return this.gradientDescent;
        }
        throw new Error(`${name} is an unknown position algorithm.`);
    }

    private getAlgorithm(): PositionAlgorithm {
        let algorithmName = process.env['position-algorithm'] || 'fast';
        return this.algorithmNameToClass(algorithmName);
    }

    public recalculatePositionUsingSelectedAlgorithm() {
        const algo = this.getAlgorithm();
        algo.calculatePositions();
    }
}
