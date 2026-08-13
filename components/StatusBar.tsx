export function StatusBar() {
  return (
    <div className="vp-status" aria-hidden="true">
      <span>9:41</span>
      <span className="vp-status-icons">
        <img src="/icons/ios-signal.svg" alt="" />
        <img src="/icons/ios-wifi.svg" alt="" />
        <img src="/icons/ios-battery.svg" alt="" />
      </span>
    </div>
  );
}
