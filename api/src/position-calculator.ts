import positionContainer from './position-container';
import 'reflect-metadata';
import { PositionSelectorService } from './services/position-selector.service';
import { parentPort } from 'worker_threads';
import { GraphRegistryService } from './services/graph-registry.service';

const app = positionContainer.get<PositionSelectorService>(PositionSelectorService);
app.recalculatePositionUsingSelectedAlgorithm();
parentPort?.postMessage(positionContainer.get<GraphRegistryService>(GraphRegistryService));
