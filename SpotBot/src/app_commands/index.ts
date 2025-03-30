import PingCommand, { getData as getPingData } from './Ping';
import ReactionCommand, {getData as getReactionData} from './Reaction';
import ServerCommand, { getData as getServerData } from './Server';
import SetWelcomeCommand, { getData as getSetWelcomeData } from './Set-Welcome';

export { PingCommand, ServerCommand, SetWelcomeCommand, ReactionCommand };

export default [getPingData, getServerData, getSetWelcomeData, getReactionData];
