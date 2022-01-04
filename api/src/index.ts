import { App } from './app';
import container from './ioc_config';
import 'reflect-metadata';

const app = container.get<App>(App);
app.init();
