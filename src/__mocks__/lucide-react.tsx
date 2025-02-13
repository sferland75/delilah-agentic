/** @jsx jsx */
/** @jsxRuntime classic */
import { jsx } from 'react/jsx-runtime';

const IconMock = ({ color, size, className, ...props }: any) => (
  <div data-testid="icon-mock" className={className} {...props} />
);

export const X = IconMock;
export const Lock = IconMock;
export const Unlock = IconMock;
export const History = IconMock;
export const Edit = IconMock;
export const Edit2 = IconMock;
export const Loader = IconMock;
export const Loader2 = IconMock;
export const Check = IconMock;
export const CheckCircle = IconMock;
export const Download = IconMock;
export const AlertCircle = IconMock;
export const Circle = IconMock;
export const FileText = IconMock;
export const RefreshCw = IconMock;

export default IconMock;