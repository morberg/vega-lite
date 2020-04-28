import {Axis as VgAxis, SignalRef, Text} from 'vega';
import {
  Axis,
  AxisPart,
  AxisPropsWithConditionAndSignal,
  COMMON_AXIS_PROPERTIES_INDEX,
  ConditionalAxisProp,
  SignalAxisProp
} from '../../axis';
import {FieldDefBase} from '../../channeldef';
import {duplicate, Flag, keys} from '../../util';
import {Split} from '../split';
import {isSignalRef} from '../../vega.schema';

function isFalseOrNull(v: any) {
  return v === false || v === null;
}

export type AxisComponentProps = Omit<VgAxis, 'title' | ConditionalAxisProp | SignalAxisProp> &
  Omit<AxisPropsWithConditionAndSignal, 'title'> & {
    title: Text | FieldDefBase<string>[] | SignalRef;
    labelExpr: string;
    disable: boolean;
  };

const AXIS_COMPONENT_PROPERTIES_INDEX: Flag<keyof AxisComponentProps> = {
  disable: 1,
  gridScale: 1,
  scale: 1,
  ...COMMON_AXIS_PROPERTIES_INDEX,
  labelExpr: 1,
  encode: 1
};

export const AXIS_COMPONENT_PROPERTIES = keys(AXIS_COMPONENT_PROPERTIES_INDEX);

export class AxisComponent extends Split<AxisComponentProps> {
  constructor(
    public readonly explicit: Partial<AxisComponentProps> = {},
    public readonly implicit: Partial<AxisComponentProps> = {},
    public mainExtracted = false
  ) {
    super();
  }

  public clone() {
    return new AxisComponent(duplicate(this.explicit), duplicate(this.implicit), this.mainExtracted);
  }

  public hasAxisPart(part: AxisPart) {
    // FIXME(https://github.com/vega/vega-lite/issues/2552) this method can be wrong if users use a Vega theme.

    if (part === 'axis') {
      // always has the axis container part
      return true;
    }

    if (part === 'grid' || part === 'title') {
      return !!this.get(part);
    }
    // Other parts are enabled by default, so they should not be false or null.
    return !isFalseOrNull(this.get(part));
  }

  public hasOrientSignalRef() {
    return isSignalRef(this.explicit.orient);
  }
}

export interface AxisComponentIndex {
  x?: AxisComponent[];
  y?: AxisComponent[];
}

export interface AxisIndex {
  x?: Axis;
  y?: Axis;
}
