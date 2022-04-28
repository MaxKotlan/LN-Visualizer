import { Container } from 'inversify';
import { App } from './app';
import {
    LndAuthService,
    LndGraphManagerService,
    WebSocketService,
    LndChunkTrackerService,
    InitialSyncService,
} from './services';
import { ChannelCloseService } from './services/channel-close.service';
import { ChannelUpdatedService } from './services/channel-updated.service';
import { GradientDescentPositionAlgorithm } from './position-algorithms/gradient-descent/gradient-descent-position.service';
import { GraphRegistryService } from './services/graph-registry.service';
import { FastPositionAlgorithm } from './position-algorithms/fast/position-calculator.service';
import { RandomPositionAlgorithm } from './position-algorithms/random/random-position.service';
import { PositionSelectorService } from './services/position-selector.service';
import { ConfigService } from './services/config.service';
import { ServerStatusService } from './services/server-status.service';

let container = new Container();
container.bind<App>(App).toSelf().inSingletonScope();
container.bind<LndGraphManagerService>(LndGraphManagerService).toSelf().inSingletonScope();
container.bind<LndChunkTrackerService>(LndChunkTrackerService).toSelf().inSingletonScope();
container.bind<WebSocketService>(WebSocketService).toSelf().inSingletonScope();
container.bind<LndAuthService>(LndAuthService).toSelf().inSingletonScope();
container.bind<InitialSyncService>(InitialSyncService).toSelf().inSingletonScope();
container.bind<ChannelCloseService>(ChannelCloseService).toSelf().inSingletonScope();
container.bind<ChannelUpdatedService>(ChannelUpdatedService).toSelf().inSingletonScope();
container.bind<FastPositionAlgorithm>(FastPositionAlgorithm).toSelf().inSingletonScope();
container.bind<RandomPositionAlgorithm>(RandomPositionAlgorithm).toSelf().inSingletonScope();
container.bind<GraphRegistryService>(GraphRegistryService).toSelf().inSingletonScope();
container
    .bind<GradientDescentPositionAlgorithm>(GradientDescentPositionAlgorithm)
    .toSelf()
    .inSingletonScope();
container.bind<PositionSelectorService>(PositionSelectorService).toSelf().inSingletonScope();
container.bind<ConfigService>(ConfigService).toSelf().inSingletonScope();
container.bind<ServerStatusService>(ServerStatusService).toSelf().inSingletonScope();
export default container;
