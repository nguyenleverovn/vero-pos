import Image from "next/image";

export function StatusBar() {
  return (
    <div className="vp-status" aria-hidden="true">
      <span>9:41</span>
      <span className="vp-status-icons">
        <Image src="/icons/ios-signal.svg" alt="" width={17} height={11} unoptimized />
        <Image src="/icons/ios-wifi.svg" alt="" width={17} height={11} unoptimized />
        <Image src="/icons/ios-battery.svg" alt="" width={15} height={11} unoptimized />
      </span>
    </div>
  );
}
