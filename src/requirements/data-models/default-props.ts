export interface RawDefaultProps {
  className?: string;
  children?: React.ReactNode;
}
export interface RawButtonProps extends RawDefaultProps {
  handleClick?: () => void;
}
