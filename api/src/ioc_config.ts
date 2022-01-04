import { Container } from 'inversify';
import { App } from './app';
import {
    LndAuthService,
    LndGraphStateService,
    WebSocketService,
    LndChunkTrackerService,
} from './services';

let container = new Container();
container.bind<App>(App).toSelf().inSingletonScope();
container.bind<LndGraphStateService>(LndGraphStateService).toSelf().inSingletonScope();
container.bind<LndChunkTrackerService>(LndChunkTrackerService).toSelf().inSingletonScope();
container.bind<WebSocketService>(WebSocketService).toSelf().inSingletonScope();
container.bind<LndAuthService>(LndAuthService).toSelf().inSingletonScope();
export default container;
