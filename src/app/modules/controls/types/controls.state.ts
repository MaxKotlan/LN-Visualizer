import { ChannelControlState } from '../../controls-channel/reducers';
import { NodeControlState } from '../../controls-node/reducer';
import { GenericControlsState } from '../reducers';

export interface ControlsState
    extends GenericControlsState,
        NodeControlState,
        ChannelControlState {}
