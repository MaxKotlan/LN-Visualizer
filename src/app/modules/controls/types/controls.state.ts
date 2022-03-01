import { ChannelControlState } from '../../controls-channel/reducers';
import { NodeControlState } from '../../controls-node/reducer';
import { GenericControlsState } from '../reducers';

export interface ControlsState {
    genericControls: GenericControlsState;
    nodeControls: NodeControlState;
    channelControls: ChannelControlState;
}