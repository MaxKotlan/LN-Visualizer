import { injectable } from 'inversify';
import { FastPositionAlgorithm } from '../position-algorithms/fast/position-calculator.service';
import { GradientDescentPositionAlgorithm } from '../position-algorithms/gradient-descent/gradient-descent-position.service';
import { PositionAlgorithm } from '../position-algorithms/position-algorithm';
import { RandomPositionAlgorithm } from '../position-algorithms/random/random-position.service';
import { ConfigService } from './config.service';

@injectable()
export class PositionSelectorService {
    constructor(
        private fastPosition: FastPositionAlgorithm,
        private randomPosition: RandomPositionAlgorithm,
        private gradientDescent: GradientDescentPositionAlgorithm,
        private configService: ConfigService,
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
        let algorithmName =
            this.configService.getConfig().positionAlgorithm?.toLowerCase() || 'fast';
        return this.algorithmNameToClass(algorithmName);
    }

    public recalculatePositionUsingSelectedAlgorithm() {
        const algo = this.getAlgorithm();
        algo.calculatePositions();
    }
}
