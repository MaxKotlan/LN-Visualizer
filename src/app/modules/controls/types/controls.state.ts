import { ChannelControlState } from '../../controls-channel/reducers';
import { MiscControlState } from '../../controls-misc/reducers/misc-controls.reducer';
import { NodeControlState } from '../../controls-node/reducer';
import { RendererControlState } from '../../controls-renderer/reducer';
import { GenericControlsState } from '../reducers';

export interface ControlsState {
    genericControls: GenericControlsState;
    nodeControls: NodeControlState;
    channelControls: ChannelControlState;
    renderControls: RendererControlState;
    miscControls: MiscControlState;
}
