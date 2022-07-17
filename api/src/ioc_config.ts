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
import { GraphRegistryService } from './services/graph-registry.service';
import { ConfigService } from './services/config.service';
import { ServerStatusService } from './services/server-status.service';
import { HealthCheckServerService } from './services/health-check-server';
import { BinaryModelConverter } from './services/binary-model-converter.service';
import { BenchmarkDataGeneratorService } from './services/benchmark-data-generator.service';

let container = new Container();
container.bind<App>(App).toSelf().inSingletonScope();
container.bind<LndGraphManagerService>(LndGraphManagerService).toSelf().inSingletonScope();
container.bind<LndChunkTrackerService>(LndChunkTrackerService).toSelf().inSingletonScope();
container.bind<WebSocketService>(WebSocketService).toSelf().inSingletonScope();
container.bind<LndAuthService>(LndAuthService).toSelf().inSingletonScope();
container.bind<InitialSyncService>(InitialSyncService).toSelf().inSingletonScope();
container.bind<ChannelCloseService>(ChannelCloseService).toSelf().inSingletonScope();
container.bind<ChannelUpdatedService>(ChannelUpdatedService).toSelf().inSingletonScope();
container.bind<GraphRegistryService>(GraphRegistryService).toSelf().inSingletonScope();
container.bind<ConfigService>(ConfigService).toSelf().inSingletonScope();
container.bind<ServerStatusService>(ServerStatusService).toSelf().inSingletonScope();
container.bind<HealthCheckServerService>(HealthCheckServerService).toSelf().inSingletonScope();
container.bind<BinaryModelConverter>(BinaryModelConverter).toSelf().inSingletonScope();
container
    .bind<BenchmarkDataGeneratorService>(BenchmarkDataGeneratorService)
    .toSelf()
    .inSingletonScope();
export default container;
