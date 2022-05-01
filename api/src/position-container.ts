import { Container } from 'inversify';
import { FastPositionAlgorithm } from './position-algorithms/fast/position-calculator.service';
import { GradientDescentPositionAlgorithm } from './position-algorithms/gradient-descent/gradient-descent-position.service';
import { RandomPositionAlgorithm } from './position-algorithms/random/random-position.service';
import { ConfigService } from './services/config.service';
import { GraphRegistryService } from './services/graph-registry.service';
import { PositionSelectorService } from './services/position-selector.service';

let positionContainer = new Container();
positionContainer
    .bind<GradientDescentPositionAlgorithm>(GradientDescentPositionAlgorithm)
    .toSelf()
    .inSingletonScope();
positionContainer
    .bind<PositionSelectorService>(PositionSelectorService)
    .toSelf()
    .inSingletonScope();
positionContainer.bind<ConfigService>(ConfigService).toSelf().inSingletonScope();
positionContainer.bind<FastPositionAlgorithm>(FastPositionAlgorithm).toSelf().inSingletonScope();
positionContainer
    .bind<RandomPositionAlgorithm>(RandomPositionAlgorithm)
    .toSelf()
    .inSingletonScope();
positionContainer.bind<GraphRegistryService>(GraphRegistryService).toSelf().inSingletonScope();
export default positionContainer;
