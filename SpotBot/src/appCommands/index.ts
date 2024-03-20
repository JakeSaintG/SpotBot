import PingCommand, { getData as getPingData } from './ping';
import ServerCommand, { getData as getServerData } from './server';

export { PingCommand, ServerCommand };

export default [getPingData, getServerData];
