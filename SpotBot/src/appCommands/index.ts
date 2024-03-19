import PingCommand, { getData as getPingData } from './Ping';
import ServerCommand, { getData as getServerData } from './Server';

export { PingCommand, ServerCommand };

export default [getPingData, getServerData];
