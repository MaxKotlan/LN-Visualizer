import { Container } from 'inversify';
import { App } from './app';
import {
    LndAuthService,
    LndGraphStateService,
    WebSocketService,
    LndChunkTrackerService,
    InitialSyncService,
} from './services';
import { ChannelCloseService } from './services/channel-close.service';
import { ChannelUpdatedService } from './services/channel-updated.service';
import { GraphRegistryService } from './services/graph-registry.service';
import { PositionCalculatorService } from './services/position-calculator.service';

let container = new Container();
container.bind<App>(App).toSelf().inSingletonScope();
container.bind<LndGraphStateService>(LndGraphStateService).toSelf().inSingletonScope();
container.bind<LndChunkTrackerService>(LndChunkTrackerService).toSelf().inSingletonScope();
container.bind<WebSocketService>(WebSocketService).toSelf().inSingletonScope();
container.bind<LndAuthService>(LndAuthService).toSelf().inSingletonScope();
container.bind<InitialSyncService>(InitialSyncService).toSelf().inSingletonScope();
container.bind<ChannelCloseService>(ChannelCloseService).toSelf().inSingletonScope();
container.bind<ChannelUpdatedService>(ChannelUpdatedService).toSelf().inSingletonScope();
container.bind<PositionCalculatorService>(PositionCalculatorService).toSelf().inSingletonScope();
container.bind<GraphRegistryService>(GraphRegistryService).toSelf().inSingletonScope();
export default container;
