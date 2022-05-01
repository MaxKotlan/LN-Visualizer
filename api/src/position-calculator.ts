import positionContainer from './position-container';
import 'reflect-metadata';
import { PositionSelectorService } from './services/position-selector.service';

console.log('In worker thread');

const app = positionContainer.get<PositionSelectorService>(PositionSelectorService);
app.recalculatePositionUsingSelectedAlgorithm();
