import PingCommand, { getData as getPingData } from './Ping';
import ServerCommand, { getData as getServerData } from './Server';
import SetWelcomeCommand, { getData as getSetWelcomeData } from './Set-Welcome';

export { PingCommand, ServerCommand, SetWelcomeCommand };

export default [getPingData, getServerData, getSetWelcomeData];
