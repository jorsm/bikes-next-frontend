export default function WarningBanner(props) {
  if (!props.warn) {
    return null; //does not render component if !props.warn
  }

  return <div className="warning">Warning!</div>;
}
