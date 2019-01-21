import { MessagePort } from './message-channel.js';
import { Loader } from './loader.js';
export declare function FakePecFactory(loader: Loader): (id: string) => MessagePort;
